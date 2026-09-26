from django.db.models import Count, Sum

from apps.errand.models import Errand, Rating
from apps.User.models import AgentProfile

from .models import TrustBadge, UserBadge


def agent_stats(user_id):
    """Completed errand count and average rating in hundredths of a star (integer)."""
    completed = Errand.objects.filter(agent_id=user_id, status=Errand.Status.COMPLETED).count()
    totals = Rating.objects.filter(ratee_id=user_id).aggregate(stars=Sum("stars"), n=Count("id"))
    avg_rating_centi = totals["stars"] * 100 // totals["n"] if totals["n"] else 0
    return {
        "completed_errands": completed,
        "ratings_count": totals["n"],
        "avg_rating_centi": avg_rating_centi,
    }


def evaluate_badges(user):
    """Award every automatic badge the agent now qualifies for. Idempotent:
    the (user, badge) unique constraint makes re-awards no-ops."""
    stats = agent_stats(user.id)
    kyc_approved = AgentProfile.objects.filter(
        user=user, kyc_status=AgentProfile.KycStatus.APPROVED
    ).exists()
    eligible = TrustBadge.objects.filter(
        is_active=True,
        is_manual=False,
        min_completed_errands__lte=stats["completed_errands"],
        min_avg_rating_centi__lte=stats["avg_rating_centi"],
    )
    if not kyc_approved:
        eligible = eligible.filter(requires_kyc=False)
    UserBadge.objects.bulk_create(
        [UserBadge(user=user, badge=badge) for badge in eligible], ignore_conflicts=True
    )
