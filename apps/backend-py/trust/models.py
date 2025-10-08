from django.db import models
from django.conf import settings
import uuid


class TrustBadge(models.Model):
    """Represents trust badges that can be earned by users"""

    CATEGORY_CHOICES = (
        ("verification", "Verification"),
        ("experience", "Experience"),
        ("performance", "Performance"),
        ("elite", "Elite"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=10)  # Emoji or icon code
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    # Requirements
    min_errands = models.IntegerField(default=0)
    min_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    requires_kyc = models.BooleanField(default=False)
    requires_admin_approval = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "trust_badges"

    def __str__(self):
        return f"{self.icon} {self.name}"


class UserBadge(models.Model):
    """Links users to their earned badges"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="badges"
    )
    badge = models.ForeignKey(TrustBadge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_badges",
    )

    class Meta:
        db_table = "user_badges"
        unique_together = ["user", "badge"]

    def __str__(self):
        return f"{self.user.full_name} - {self.badge.name}"


