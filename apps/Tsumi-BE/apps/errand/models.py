from django.conf import settings
from django.db import models
from django.db.models import F, Q

from apps.Basemodel.models import Basemodel


class Errand(Basemodel):
    class ErrandType(models.TextChoices):
        PICKUP = "pickup", "Pickup"
        DELIVERY = "delivery", "Delivery"
        SHOPPING = "shopping", "Shopping"
        CUSTOM = "custom", "Custom task"

    class Status(models.TextChoices):
        OPEN = "open", "Open"  # funded, waiting for an agent
        ACCEPTED = "accepted", "Accepted"
        IN_PROGRESS = "in_progress", "In progress"
        DELIVERED = "delivered", "Delivered"  # agent says done, customer to confirm
        COMPLETED = "completed", "Completed"  # escrow released to agent
        DISPUTED = "disputed", "Disputed"
        CANCELLED = "cancelled", "Cancelled"  # escrow refunded before work finished
        REFUNDED = "refunded", "Refunded"  # dispute resolved in customer's favour

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="customer_errands"
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="agent_errands",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    errand_type = models.CharField(max_length=20, choices=ErrandType.choices)
    pickup_address = models.CharField(max_length=500, blank=True)
    pickup_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    pickup_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    dropoff_address = models.CharField(max_length=500, blank=True)
    dropoff_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    dropoff_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)

    # Money in pesewas. Commission rate is frozen at creation time.
    price_pesewas = models.BigIntegerField()
    commission_bps = models.PositiveIntegerField()
    commission_pesewas = models.BigIntegerField()
    agent_payout_pesewas = models.BigIntegerField()

    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True
    )
    # Client-generated id that makes "create errand" idempotent per customer.
    client_request_id = models.UUIDField(null=True, blank=True)

    accepted_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=500, blank=True)

    class Meta:
        db_table = "errands"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["customer", "status"]),
            models.Index(fields=["agent", "status"]),
        ]
        constraints = [
            models.CheckConstraint(condition=Q(price_pesewas__gt=0), name="errand_price_positive"),
            models.CheckConstraint(
                condition=Q(commission_pesewas__gte=0)
                & Q(agent_payout_pesewas__gte=0)
                & Q(price_pesewas=F("commission_pesewas") + F("agent_payout_pesewas")),
                name="errand_split_sums_to_price",
            ),
            models.UniqueConstraint(
                fields=["customer", "client_request_id"],
                condition=Q(client_request_id__isnull=False),
                name="errand_client_request_id_unique_per_customer",
            ),
        ]

    def __str__(self):
        return f"Errand {self.id} ({self.status})"


class ErrandEvent(Basemodel):
    """Audit trail: one row per status change."""

    errand = models.ForeignKey(Errand, on_delete=models.CASCADE, related_name="events")
    from_status = models.CharField(max_length=20, blank=True)
    to_status = models.CharField(max_length=20)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    note = models.CharField(max_length=500, blank=True)

    class Meta:
        db_table = "errand_events"
        ordering = ["created_at"]


class EscrowHold(Basemodel):
    """Money held for one errand. Moves HELD -> RELEASED or HELD -> REFUNDED exactly once."""

    class Status(models.TextChoices):
        HELD = "held", "Held"
        RELEASED = "released", "Released to agent"
        REFUNDED = "refunded", "Refunded to customer"

    errand = models.OneToOneField(Errand, on_delete=models.PROTECT, related_name="escrow")
    amount_pesewas = models.BigIntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.HELD, db_index=True
    )
    settled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "escrow_holds"
        constraints = [
            models.CheckConstraint(condition=Q(amount_pesewas__gt=0), name="escrow_amount_positive"),
        ]


class Rating(Basemodel):
    errand = models.OneToOneField(Errand, on_delete=models.CASCADE, related_name="rating")
    rater = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ratings_given"
    )
    ratee = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ratings_received"
    )
    stars = models.PositiveSmallIntegerField()
    comment = models.CharField(max_length=1000, blank=True)

    class Meta:
        db_table = "ratings"
        constraints = [
            models.CheckConstraint(
                condition=Q(stars__gte=1) & Q(stars__lte=5), name="rating_stars_1_to_5"
            ),
        ]
