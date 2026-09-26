from django.conf import settings
from django.db import models

from apps.Basemodel.models import Basemodel


class Notification(Basemodel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    kind = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=1000, blank=True)
    errand = models.ForeignKey(
        "errand.Errand", on_delete=models.CASCADE, null=True, blank=True, related_name="+"
    )
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "read_at"])]
