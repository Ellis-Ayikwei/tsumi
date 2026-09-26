from rest_framework import serializers

from .models import Dispute


class DisputeSerializer(serializers.ModelSerializer):
    errand_title = serializers.CharField(source="errand.title", read_only=True)

    class Meta:
        model = Dispute
        fields = [
            "id",
            "errand",
            "errand_title",
            "reason",
            "description",
            "status",
            "resolution",
            "resolution_note",
            "created_at",
            "resolved_at",
        ]
        read_only_fields = ["status", "resolution", "resolution_note", "created_at", "resolved_at"]


class DisputeResolveSerializer(serializers.Serializer):
    resolution = serializers.ChoiceField(choices=Dispute.Resolution.choices)
    note = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
