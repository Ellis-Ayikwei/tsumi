from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.errand import services as errand_services
from apps.errand.models import Errand
from apps.notification.services import notify
from backend.api_exceptions import Conflict

from .models import Dispute


def open_dispute(errand_id, user, reason, description):
    try:
        with transaction.atomic():
            errand = Errand.objects.select_for_update().get(pk=errand_id)
            errand_services.open_dispute_on(errand, user)
            dispute = Dispute.objects.create(
                errand=errand, opened_by=user, reason=reason, description=description
            )
            other = errand.agent_id if user.id == errand.customer_id else errand.customer_id
            notify(other, "dispute_opened", "A dispute was opened on your errand", errand.title, errand)
    except IntegrityError:
        raise Conflict("This errand already has a dispute.")
    return dispute


@transaction.atomic
def resolve_dispute(dispute_id, admin, resolution, note):
    dispute = Dispute.objects.select_for_update().get(pk=dispute_id)
    if dispute.status != Dispute.Status.OPEN:
        raise Conflict("This dispute is already resolved.")
    errand = Errand.objects.select_for_update().get(pk=dispute.errand_id)
    release = resolution == Dispute.Resolution.RELEASE_AGENT
    errand_services.resolve_dispute_on(errand, admin, release_to_agent=release, note=note)
    dispute.status = Dispute.Status.RESOLVED
    dispute.resolution = resolution
    dispute.resolution_note = note
    dispute.resolved_by = admin
    dispute.resolved_at = timezone.now()
    dispute.save()
    outcome = "The agent was paid." if release else "The customer was refunded."
    for user_id in (errand.customer_id, errand.agent_id):
        notify(user_id, "dispute_resolved", "Dispute resolved", f"{outcome} {note}".strip(), errand)
    return dispute
