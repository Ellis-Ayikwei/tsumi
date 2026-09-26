import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from backend.api_exceptions import PaymentProviderError, PaymentsNotConfigured

from . import paystack, services
from .models import Deposit

logger = logging.getLogger(__name__)


@shared_task
def reconcile_pending_deposits(batch_size=100):
    """Catch deposits whose webhook never arrived. Idempotent: crediting goes
    through mark_deposit_succeeded, which credits a reference at most once."""
    now = timezone.now()
    pending = Deposit.objects.filter(
        status=Deposit.Status.PENDING,
        created_at__lte=now - timedelta(minutes=10),
        created_at__gte=now - timedelta(days=1),
    ).order_by("created_at")[:batch_size]
    for deposit in pending:
        try:
            data = paystack.verify_transaction(deposit.reference)
        except (PaymentProviderError, PaymentsNotConfigured):
            logger.warning("Could not verify deposit %s; will retry next run", deposit.id)
            continue
        if data.get("status") == "success":
            services.mark_deposit_succeeded(deposit.reference, data.get("amount"), data.get("currency"))
        elif data.get("status") in ("failed", "abandoned") and deposit.created_at <= now - timedelta(hours=1):
            Deposit.objects.filter(pk=deposit.pk, status=Deposit.Status.PENDING).update(
                status=Deposit.Status.FAILED, failure_reason=data.get("status"), updated_at=now
            )
