from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""

    delivery_status = serializers.ReadOnlyField()
    is_urgent = serializers.ReadOnlyField()
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "data",
            "read",
            "read_at",
            "priority",
            "delivery_channels",
            "delivery_status",
            "is_urgent",
            "is_expired",
            "action_url",
            "action_text",
            "expires_at",
            "related_object_type",
            "related_object_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "delivery_status",
            "is_urgent",
        ]

    def get_is_expired(self, obj):
        return obj.is_expired()


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for NotificationPreference model"""

    class Meta:
        model = NotificationPreference
        fields = [
            "email_notifications",
            "sms_notifications",
            "push_notifications",
            "in_app_notifications",
            "errand_updates",
            "payment_updates",
            "agent_updates",
            "trust_updates",
            "messages",
            "system_updates",
            "marketing",
            "digest_frequency",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class NotificationCreateSerializer(serializers.Serializer):
    """Serializer for creating notifications (admin/staff use)"""

    user_id = serializers.UUIDField()
    notification_type = serializers.ChoiceField(choices=Notification.NOTIFICATION_TYPES)
    title = serializers.CharField(max_length=200)
    message = serializers.CharField()
    data = serializers.JSONField(required=False, allow_null=True)
    priority = serializers.ChoiceField(
        choices=Notification.PRIORITY_LEVELS, default="normal"
    )
    channels = serializers.ListField(
        child=serializers.ChoiceField(choices=Notification.DELIVERY_CHANNELS),
        required=False,
    )
    action_url = serializers.URLField(required=False, allow_null=True)
    action_text = serializers.CharField(max_length=100, required=False, allow_null=True)
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    related_object_type = serializers.CharField(
        max_length=50, required=False, allow_null=True
    )
    related_object_id = serializers.CharField(
        max_length=100, required=False, allow_null=True
    )
