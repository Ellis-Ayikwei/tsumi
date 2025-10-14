from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        # Errand Related
        ("errand_created", "Errand Created"),
        ("errand_assigned", "Errand Assigned"),
        ("errand_accepted", "Errand Accepted"),
        ("errand_started", "Errand Started"),
        ("errand_in_progress", "Errand In Progress"),
        ("errand_completed", "Errand Completed"),
        ("errand_cancelled", "Errand Cancelled"),
        ("errand_disputed", "Errand Disputed"),
        # Agent Related
        ("agent_verified", "Agent Verified"),
        ("agent_suspended", "Agent Suspended"),
        ("agent_reactivated", "Agent Reactivated"),
        ("agent_kyc_approved", "Agent KYC Approved"),
        ("agent_kyc_rejected", "Agent KYC Rejected"),
        ("agent_kyc_submitted", "Agent KYC Submitted"),
        # Payment Related
        ("payment_pending", "Payment Pending"),
        ("payment_confirmed", "Payment Confirmed"),
        ("payment_failed", "Payment Failed"),
        ("payment_refunded", "Payment Refunded"),
        ("wallet_credited", "Wallet Credited"),
        ("wallet_debited", "Wallet Debited"),
        # Trust & Rating Related
        ("rating_received", "Rating Received"),
        ("trust_score_updated", "Trust Score Updated"),
        ("rating_reminder", "Rating Reminder"),
        # Communication Related
        ("message_received", "Message Received"),
        ("support_ticket_created", "Support Ticket Created"),
        ("support_ticket_updated", "Support Ticket Updated"),
        # System/Admin Related
        ("system_maintenance", "System Maintenance"),
        ("policy_update", "Policy Update"),
        ("feature_announcement", "Feature Announcement"),
        ("account_warning", "Account Warning"),
        # Legacy types for backward compatibility
        ("payment", "Payment Notification"),
        ("message", "New Message"),
        ("system", "System Notification"),
    ]

    PRIORITY_LEVELS = [
        ("low", "Low"),
        ("normal", "Normal"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    DELIVERY_CHANNELS = [
        ("in_app", "In-App Notification"),
        ("email", "Email"),
        ("sms", "SMS"),
        ("push", "Push Notification"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(null=True, blank=True)  # Additional data
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Enhanced functionality fields
    priority = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )
    delivery_channels = models.JSONField(
        default=list, help_text="List of channels to deliver notification"
    )
    scheduled_for = models.DateTimeField(
        null=True, blank=True, help_text="Schedule notification for later"
    )
    delivered_at = models.DateTimeField(null=True, blank=True)
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)

    # Related object tracking
    related_object_type = models.CharField(max_length=50, null=True, blank=True)
    related_object_id = models.CharField(max_length=100, null=True, blank=True)

    # Action tracking
    action_url = models.URLField(
        null=True, blank=True, help_text="URL for notification action"
    )
    action_text = models.CharField(
        max_length=100, null=True, blank=True, help_text="Text for action button"
    )
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text="When notification expires"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = "notifications"
        managed = True
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "read"]),
            models.Index(fields=["notification_type"]),
            models.Index(fields=["created_at"]),
        ]

    def mark_as_read(self):
        from django.utils import timezone

        self.read = True
        self.read_at = timezone.now()
        self.save(update_fields=["read", "read_at"])

    def mark_as_delivered(self, channel=None):
        from django.utils import timezone

        self.delivered_at = timezone.now()
        if channel == "email":
            self.email_sent = True
        elif channel == "sms":
            self.sms_sent = True
        elif channel == "push":
            self.push_sent = True
        self.save()

    def is_expired(self):
        from django.utils import timezone

        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    @property
    def is_urgent(self):
        return self.priority in ["high", "urgent"]

    @property
    def delivery_status(self):
        """Get delivery status across all channels"""
        status = {}
        if "email" in self.delivery_channels:
            status["email"] = self.email_sent
        if "sms" in self.delivery_channels:
            status["sms"] = self.sms_sent
        if "push" in self.delivery_channels:
            status["push"] = self.push_sent
        status["in_app"] = True  # Always available in-app
        return status


class NotificationPreference(models.Model):
    """User notification preferences"""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="notification_preferences"
    )

    # Channel preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)

    # Category preferences
    errand_updates = models.BooleanField(default=True)
    payment_updates = models.BooleanField(default=True)
    agent_updates = models.BooleanField(default=True)
    trust_updates = models.BooleanField(default=True)
    messages = models.BooleanField(default=True)
    system_updates = models.BooleanField(default=True)
    marketing = models.BooleanField(default=False)

    # Frequency preferences
    digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ("immediate", "Immediate"),
            ("hourly", "Hourly"),
            ("daily", "Daily"),
            ("weekly", "Weekly"),
        ],
        default="immediate",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notification_preferences"

    def __str__(self):
        return f"Notification Preferences for {self.user.email}"
