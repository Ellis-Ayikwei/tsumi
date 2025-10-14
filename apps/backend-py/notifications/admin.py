from django.contrib import admin
from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "notification_type",
        "title",
        "priority",
        "read",
        "created_at",
    ]
    list_filter = [
        "notification_type",
        "priority",
        "read",
        "created_at",
    ]
    search_fields = [
        "user__email",
        "user__phone",
        "title",
        "message",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
        "delivery_status",
        "is_urgent",
    ]
    ordering = ["-created_at"]

    fieldsets = (
        (
            "Basic Information",
            {"fields": ("user", "notification_type", "title", "message")},
        ),
        (
            "Status & Priority",
            {"fields": ("read", "read_at", "priority", "delivery_channels")},
        ),
        (
            "Delivery",
            {
                "fields": (
                    "delivery_status",
                    "email_sent",
                    "sms_sent",
                    "push_sent",
                    "delivered_at",
                )
            },
        ),
        ("Actions & Links", {"fields": ("action_url", "action_text", "expires_at")}),
        (
            "Related Objects",
            {"fields": ("related_object_type", "related_object_id", "data")},
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    actions = ["mark_as_read", "mark_as_unread", "send_email_notifications"]

    def mark_as_read(self, request, queryset):
        updated = queryset.update(read=True)
        self.message_user(request, f"{updated} notifications marked as read.")

    mark_as_read.short_description = "Mark selected notifications as read"

    def mark_as_unread(self, request, queryset):
        updated = queryset.update(read=False, read_at=None)
        self.message_user(request, f"{updated} notifications marked as unread.")

    mark_as_unread.short_description = "Mark selected notifications as unread"

    def send_email_notifications(self, request, queryset):
        from .services import NotificationService

        sent_count = 0
        for notification in queryset.filter(email_sent=False):
            try:
                NotificationService._send_email_notification(notification)
                sent_count += 1
            except Exception as e:
                self.message_user(
                    request,
                    f"Failed to send email for notification {notification.id}: {str(e)}",
                    level="ERROR",
                )
        self.message_user(request, f"Sent {sent_count} email notifications.")

    send_email_notifications.short_description = (
        "Send email notifications for selected items"
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "email_notifications",
        "push_notifications",
        "sms_notifications",
        "digest_frequency",
        "updated_at",
    ]
    list_filter = [
        "email_notifications",
        "push_notifications",
        "sms_notifications",
        "digest_frequency",
        "created_at",
    ]
    search_fields = [
        "user__email",
        "user__phone",
    ]
    readonly_fields = [
        "created_at",
        "updated_at",
    ]
    ordering = ["-updated_at"]

    fieldsets = (
        ("User", {"fields": ("user",)}),
        (
            "Channel Preferences",
            {
                "fields": (
                    "email_notifications",
                    "push_notifications",
                    "sms_notifications",
                    "in_app_notifications",
                )
            },
        ),
        (
            "Category Preferences",
            {
                "fields": (
                    "errand_updates",
                    "payment_updates",
                    "agent_updates",
                    "trust_updates",
                    "messages",
                    "system_updates",
                    "marketing",
                )
            },
        ),
        ("Frequency", {"fields": ("digest_frequency",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")
