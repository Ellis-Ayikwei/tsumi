from django.conf import settings
from django.db import models

from apps.Basemodel.models import Basemodel


class TrustBadge(Basemodel):
    """A badge agents earn. Automatic badges are awarded when the criteria are met;
    manual badges (is_manual) are only awarded by an admin."""

    code = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    icon = models.CharField(max_length=50, blank=True)
    min_completed_errands = models.PositiveIntegerField(default=0)
    # Hundredths of a star: 450 means 4.50.
    min_avg_rating_centi = models.PositiveIntegerField(default=0)
    requires_kyc = models.BooleanField(default=False)
    is_manual = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "trust_badges"
        ordering = ["min_completed_errands", "name"]

    def __str__(self):
        return self.code


class UserBadge(Basemodel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="badges"
    )
    badge = models.ForeignKey(TrustBadge, on_delete=models.PROTECT, related_name="holders")
    awarded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    class Meta:
        db_table = "user_badges"
        constraints = [
            models.UniqueConstraint(fields=["user", "badge"], name="user_badge_unique")
        ]
