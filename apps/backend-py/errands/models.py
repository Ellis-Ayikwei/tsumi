from django.db import models
from django.conf import settings
import uuid


class Errand(models.Model):
    ERRAND_TYPE_CHOICES = (
        ("pickup", "Pickup"),
        ("delivery", "Delivery"),
        ("custom", "Custom Task"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("assigned", "Assigned"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    PAYMENT_STATUS_CHOICES = (
        ("pending", "Pending"),
        ("held", "Held in Escrow"),
        ("released", "Released to Agent"),
        ("refunded", "Refunded"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="customer_errands"
    )
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="agent_errands",
    )

    # Errand Details
    title = models.CharField(max_length=200)
    description = models.TextField()
    errand_type = models.CharField(max_length=20, choices=ERRAND_TYPE_CHOICES)

    # Locations (JSON fields for simplicity, or use PostgreSQL JSONField)
    pickup_address = models.TextField(blank=True)
    pickup_latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    pickup_longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    pickup_notes = models.TextField(blank=True)

    delivery_address = models.TextField(blank=True)
    delivery_latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    delivery_longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    delivery_notes = models.TextField(blank=True)

    # Financial
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    agent_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "errands"
        indexes = [
            models.Index(fields=["customer", "status"]),
            models.Index(fields=["agent", "status"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.status}"

    def calculate_commission(self):
        """Calculate platform commission based on settings"""
        from django.conf import settings

        rate = settings.TSUMI_PLATFORM_COMMISSION_RATE
        self.commission = self.amount * rate
        self.agent_payout = self.amount - self.commission
        self.save()


class ErrandRating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    errand = models.OneToOneField(Errand, on_delete=models.CASCADE, related_name="rating")
    rated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rated_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_ratings"
    )

    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "errand_ratings"

    def __str__(self):
        return f"{self.errand.title} - {self.rating} stars"


