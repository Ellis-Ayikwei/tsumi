from django.conf import settings
from django.db import models

from apps.Basemodel.models import Basemodel


class Dispute(Basemodel):
    class Reason(models.TextChoices):
        NOT_DELIVERED = "not_delivered", "Item not delivered"
        DAMAGED = "damaged", "Item damaged or wrong"
        AGENT_NO_SHOW = "agent_no_show", "Agent did not show up"
        OVERCHARGED = "overcharged", "Asked to pay extra"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        RESOLVED = "resolved", "Resolved"

    class Resolution(models.TextChoices):
        REFUND_CUSTOMER = "refund_customer", "Refund customer"
        RELEASE_AGENT = "release_agent", "Pay agent"

    errand = models.OneToOneField("errand.Errand", on_delete=models.PROTECT, related_name="dispute")
    opened_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="disputes_opened"
    )
    reason = models.CharField(max_length=30, choices=Reason.choices)
    description = models.TextField(max_length=2000)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True
    )
    resolution = models.CharField(max_length=30, choices=Resolution.choices, blank=True)
    resolution_note = models.CharField(max_length=1000, blank=True)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "disputes"
        ordering = ["-created_at"]
