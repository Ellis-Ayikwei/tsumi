from django.conf import settings
from rest_framework import serializers

from apps.User.serializer import PublicUserSerializer

from .models import Errand, ErrandEvent


class ErrandEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrandEvent
        fields = ["from_status", "to_status", "note", "created_at"]


class ErrandSerializer(serializers.ModelSerializer):
    customer = PublicUserSerializer(read_only=True)
    agent = PublicUserSerializer(read_only=True)
    contact_phone = serializers.SerializerMethodField()
    is_rated = serializers.SerializerMethodField()

    class Meta:
        model = Errand
        fields = [
            "id",
            "title",
            "description",
            "errand_type",
            "pickup_address",
            "pickup_lat",
            "pickup_lng",
            "dropoff_address",
            "dropoff_lat",
            "dropoff_lng",
            "scheduled_for",
            "price_pesewas",
            "commission_pesewas",
            "agent_payout_pesewas",
            "status",
            "customer",
            "agent",
            "contact_phone",
            "is_rated",
            "created_at",
            "accepted_at",
            "started_at",
            "delivered_at",
            "completed_at",
            "cancelled_at",
            "cancel_reason",
        ]

    def get_contact_phone(self, obj):
        """The other party's phone, only while both are working on the errand."""
        user = self.context["request"].user
        if obj.status not in (Errand.Status.ACCEPTED, Errand.Status.IN_PROGRESS, Errand.Status.DELIVERED):
            return None
        if user.id == obj.customer_id and obj.agent_id:
            return obj.agent.phone_number
        if user.id == obj.agent_id:
            return obj.customer.phone_number
        return None

    def get_is_rated(self, obj):
        return hasattr(obj, "rating")


class ErrandDetailSerializer(ErrandSerializer):
    events = ErrandEventSerializer(many=True, read_only=True)

    class Meta(ErrandSerializer.Meta):
        fields = ErrandSerializer.Meta.fields + ["events"]


class ErrandCreateSerializer(serializers.ModelSerializer):
    price_pesewas = serializers.IntegerField()
    client_request_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Errand
        fields = [
            "title",
            "description",
            "errand_type",
            "pickup_address",
            "pickup_lat",
            "pickup_lng",
            "dropoff_address",
            "dropoff_lat",
            "dropoff_lng",
            "scheduled_for",
            "price_pesewas",
            "client_request_id",
        ]
        extra_kwargs = {
            "pickup_lat": {"min_value": -90, "max_value": 90},
            "dropoff_lat": {"min_value": -90, "max_value": 90},
            "pickup_lng": {"min_value": -180, "max_value": 180},
            "dropoff_lng": {"min_value": -180, "max_value": 180},
        }

    def validate_price_pesewas(self, value):
        low, high = settings.TSUMI_MIN_ERRAND_PRICE_PESEWAS, settings.TSUMI_MAX_ERRAND_PRICE_PESEWAS
        if not low <= value <= high:
            raise serializers.ValidationError(
                f"Price must be between GHS {low / 100:.2f} and GHS {high / 100:.2f}."
            )
        return value

    def validate(self, attrs):
        if not attrs.get("pickup_address") and not attrs.get("dropoff_address"):
            raise serializers.ValidationError(
                {"pickup_address": "Add a pickup or drop-off address so the agent knows where to go."}
            )
        # A pin is a lat/lng pair with a readable address; half a pin cannot be navigated to.
        for stop in ("pickup", "dropoff"):
            lat, lng = attrs.get(f"{stop}_lat"), attrs.get(f"{stop}_lng")
            if (lat is None) != (lng is None):
                raise serializers.ValidationError(
                    {f"{stop}_lat": "Send latitude and longitude together. Drop the pin again."}
                )
            if lat is not None and not attrs.get(f"{stop}_address"):
                raise serializers.ValidationError(
                    {f"{stop}_address": "Add an address for the pinned location."}
                )
        return attrs


class CancelSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")


class RateSerializer(serializers.Serializer):
    stars = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
