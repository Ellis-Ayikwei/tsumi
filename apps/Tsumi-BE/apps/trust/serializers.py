from rest_framework import serializers

from .models import TrustBadge, UserBadge


class TrustBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustBadge
        fields = [
            "id",
            "code",
            "name",
            "description",
            "icon",
            "min_completed_errands",
            "min_avg_rating_centi",
            "requires_kyc",
            "is_manual",
        ]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = TrustBadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ["badge", "created_at"]
