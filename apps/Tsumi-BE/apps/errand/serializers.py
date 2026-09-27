from django.conf import settings
from rest_framework import serializers

from apps.geo.services import coverage, refusal_message
from apps.User.serializer import PublicUserSerializer

from .models import Errand, ErrandEvent, ErrandStop


class ErrandEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrandEvent
        fields = ["from_status", "to_status", "note", "created_at"]


class ErrandStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrandStop
        fields = ["position", "kind", "address", "lat", "lng", "note"]


class ErrandSerializer(serializers.ModelSerializer):
    customer = PublicUserSerializer(read_only=True)
    agent = PublicUserSerializer(read_only=True)
    stops = ErrandStopSerializer(many=True, read_only=True)
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
            "stops",
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


FLAT_STOP_FIELDS = ("pickup_address", "pickup_lat", "pickup_lng", "dropoff_address", "dropoff_lat", "dropoff_lng")


class StopInputSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=ErrandStop.Kind.choices)
    address = serializers.CharField(max_length=500)
    lat = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-90, max_value=90, required=False, allow_null=True, default=None
    )
    lng = serializers.DecimalField(
        max_digits=9, decimal_places=6, min_value=-180, max_value=180, required=False, allow_null=True, default=None
    )
    note = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")

    def validate(self, attrs):
        # A pin is a lat/lng pair; half a pin cannot be navigated to.
        if (attrs["lat"] is None) != (attrs["lng"] is None):
            raise serializers.ValidationError({"lat": "Send latitude and longitude together. Drop the pin again."})
        return attrs


class ErrandCreateSerializer(serializers.ModelSerializer):
    stops = StopInputSerializer(many=True, required=False)
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
            "stops",
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
        stops = attrs.pop("stops", None)
        legacy = stops is None
        if legacy:
            stops = self._stops_from_flat_fields(attrs)
        else:
            if any(attrs.get(f) not in (None, "") for f in FLAT_STOP_FIELDS):
                raise serializers.ValidationError(
                    {"stops": "Send stops, or pickup and drop-off fields, not both."}
                )
            limit = settings.TSUMI_MAX_ERRAND_STOPS
            if not 1 <= len(stops) <= limit:
                raise serializers.ValidationError({"stops": f"Add between 1 and {limit} stops."})

        # Typed addresses have no pin, so only pinned stops can be checked against coverage.
        for i, stop in enumerate(stops):
            if stop.get("lat") is None:
                continue
            served, blocking = coverage(stop["lat"], stop["lng"])
            if not served:
                field = f"{stop['kind']}_lat" if legacy else f"stops.{i}.lat"
                raise serializers.ValidationError({field: refusal_message(blocking)})

        # Readers that predate stops see the first pickup and the last drop-off.
        # Stops can't change after posting, so these copies never drift.
        first_pickup = next((st for st in stops if st["kind"] == ErrandStop.Kind.PICKUP), None)
        last_dropoff = next((st for st in reversed(stops) if st["kind"] == ErrandStop.Kind.DROPOFF), None)
        for prefix, stop in (("pickup", first_pickup), ("dropoff", last_dropoff)):
            attrs[f"{prefix}_address"] = stop["address"] if stop else ""
            attrs[f"{prefix}_lat"] = stop.get("lat") if stop else None
            attrs[f"{prefix}_lng"] = stop.get("lng") if stop else None
        attrs["stops"] = stops
        return attrs

    def _stops_from_flat_fields(self, attrs):
        """Older clients send one pickup and one drop-off as flat fields."""
        if not attrs.get("pickup_address") and not attrs.get("dropoff_address"):
            raise serializers.ValidationError(
                {"pickup_address": "Add a pickup or drop-off address so the runner knows where to go."}
            )
        stops = []
        for kind in (ErrandStop.Kind.PICKUP, ErrandStop.Kind.DROPOFF):
            lat, lng = attrs.get(f"{kind}_lat"), attrs.get(f"{kind}_lng")
            # A pin is a lat/lng pair with a readable address; half a pin cannot be navigated to.
            if (lat is None) != (lng is None):
                raise serializers.ValidationError(
                    {f"{kind}_lat": "Send latitude and longitude together. Drop the pin again."}
                )
            if lat is not None and not attrs.get(f"{kind}_address"):
                raise serializers.ValidationError({f"{kind}_address": "Add an address for the pinned location."})
            if attrs.get(f"{kind}_address"):
                stops.append({"kind": kind, "address": attrs[f"{kind}_address"], "lat": lat, "lng": lng, "note": ""})
        return stops


class CancelSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")


class RateSerializer(serializers.Serializer):
    stars = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
