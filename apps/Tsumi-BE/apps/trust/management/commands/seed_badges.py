from django.core.management.base import BaseCommand

from apps.trust.models import TrustBadge

BADGES = [
    dict(code="verified-id", name="Verified ID", icon="id-card",
         description="Identity document and selfie checked by Tsumi.", requires_kyc=True),
    dict(code="reliable-runner", name="Reliable Runner", icon="bike",
         description="10+ completed errands with a 4.5+ rating.",
         min_completed_errands=10, min_avg_rating_centi=450, requires_kyc=True),
    dict(code="elite-agent", name="Elite Tsumi Runner", icon="crown",
         description="100+ completed errands with a 4.8+ rating.",
         min_completed_errands=100, min_avg_rating_centi=480, requires_kyc=True),
    dict(code="great-communicator", name="Great Communicator", icon="message-circle",
         description="Customers consistently praise their communication.", is_manual=True),
    dict(code="pro-runner", name="Pro Runner", icon="shield-check",
         description="Trained and verified in person by Tsumi.", is_manual=True),
    dict(code="community-favorite", name="Community Favorite", icon="heart",
         description="Chosen again and again by returning customers.", is_manual=True),
]


class Command(BaseCommand):
    help = "Create or update the standard trust badges. Safe to run repeatedly."

    def handle(self, *args, **options):
        for badge in BADGES:
            code = badge.pop("code")
            _, created = TrustBadge.objects.update_or_create(code=code, defaults=badge)
            badge["code"] = code
            self.stdout.write(f"{'created' if created else 'updated'} {code}")
