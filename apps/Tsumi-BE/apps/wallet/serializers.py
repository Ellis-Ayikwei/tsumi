from django.conf import settings
from rest_framework import serializers

from apps.User.validators import normalize_gh_phone

from .models import Deposit, LedgerEntry, Withdrawal


class LedgerEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerEntry
        fields = [
            "id",
            "transfer_id",
            "entry_type",
            "amount_pesewas",
            "balance_after_pesewas",
            "errand",
            "memo",
            "created_at",
        ]


class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = ["id", "reference", "amount_pesewas", "status", "authorization_url", "paid_at", "created_at"]


class DepositCreateSerializer(serializers.Serializer):
    amount_pesewas = serializers.IntegerField()

    def validate_amount_pesewas(self, value):
        low, high = settings.TSUMI_MIN_DEPOSIT_PESEWAS, settings.TSUMI_MAX_DEPOSIT_PESEWAS
        if not low <= value <= high:
            raise serializers.ValidationError(
                f"Top up between GHS {low / 100:.2f} and GHS {high / 100:.2f}."
            )
        return value


class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = [
            "id",
            "amount_pesewas",
            "network",
            "momo_number",
            "status",
            "rejection_reason",
            "created_at",
            "reviewed_at",
        ]
        read_only_fields = ["id", "status", "rejection_reason", "created_at", "reviewed_at"]

    def validate_momo_number(self, value):
        return normalize_gh_phone(value)
