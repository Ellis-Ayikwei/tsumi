from rest_framework import serializers
from .models import Errand, ErrandRating
from users.serializers import UserSerializer


class ErrandSerializer(serializers.ModelSerializer):
    customer_detail = UserSerializer(source="customer", read_only=True)
    agent_detail = UserSerializer(source="agent", read_only=True)

    class Meta:
        model = Errand
        fields = "__all__"
        read_only_fields = [
            "id",
            "customer",
            "commission",
            "agent_payout",
            "payment_status",
            "created_at",
            "updated_at",
            "assigned_at",
            "started_at",
            "completed_at",
        ]

    def create(self, validated_data):
        errand = super().create(validated_data)
        errand.calculate_commission()
        return errand


class ErrandCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Errand
        fields = [
            "title",
            "description",
            "errand_type",
            "pickup_address",
            "pickup_latitude",
            "pickup_longitude",
            "pickup_notes",
            "delivery_address",
            "delivery_latitude",
            "delivery_longitude",
            "delivery_notes",
            "amount",
        ]


class ErrandRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrandRating
        fields = "__all__"
        read_only_fields = ["id", "errand", "rated_by", "rated_user", "created_at"]


