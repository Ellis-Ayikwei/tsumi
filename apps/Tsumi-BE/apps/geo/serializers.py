import json

from rest_framework import serializers

from .models import ServiceArea


class ServiceAreaSerializer(serializers.ModelSerializer):
    """Read shape for the admin map. `geojson` is annotated by the view (5dp, about 1 m)."""

    geometry = serializers.SerializerMethodField()

    class Meta:
        model = ServiceArea
        fields = ["id", "name", "kind", "status", "note", "geometry", "created_at", "updated_at"]

    def get_geometry(self, obj):
        raw = getattr(obj, "geojson", None)
        return json.loads(raw) if raw else None


class CircleSerializer(serializers.Serializer):
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)
    radius_km = serializers.FloatField(min_value=0.1, max_value=100)


class ServiceAreaWriteSerializer(serializers.Serializer):
    """Create needs a shape: a GeoJSON `boundary` or a `circle`. Update may change either or neither."""

    name = serializers.CharField(max_length=120)
    kind = serializers.ChoiceField(choices=ServiceArea.Kind.choices)
    status = serializers.ChoiceField(choices=ServiceArea.Status.choices, default=ServiceArea.Status.INACTIVE)
    note = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    boundary = serializers.JSONField(required=False)
    circle = CircleSerializer(required=False)

    def validate(self, attrs):
        shapes = [k for k in ("boundary", "circle") if k in attrs]
        if len(shapes) > 1:
            raise serializers.ValidationError({"boundary": "Send a boundary or a circle, not both."})
        if not shapes and not self.partial:
            raise serializers.ValidationError({"boundary": "Draw the area: send a GeoJSON boundary or a circle."})
        return attrs


class ImportSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=ServiceArea.Kind.choices)
    features = serializers.JSONField()


class PointQuerySerializer(serializers.Serializer):
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)
