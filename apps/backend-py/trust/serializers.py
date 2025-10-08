from rest_framework import serializers
from .models import TrustBadge, UserBadge


class TrustBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustBadge
        fields = [
            "id",
            "name",
            "description",
            "icon",
            "category",
            "min_errands",
            "min_rating",
            "requires_kyc",
        ]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge_detail = TrustBadgeSerializer(source="badge", read_only=True)

    class Meta:
        model = UserBadge
        fields = ["id", "user", "badge", "badge_detail", "earned_at"]
        read_only_fields = ["id", "earned_at"]


