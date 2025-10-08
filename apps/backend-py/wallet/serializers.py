from rest_framework import serializers
from .models import Wallet, Transaction, EscrowHold


class WalletSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Wallet
        fields = ["id", "user", "user_name", "balance", "currency", "is_active", "created_at"]
        read_only_fields = ["id", "balance", "created_at"]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"
        read_only_fields = [
            "id",
            "wallet",
            "status",
            "provider_reference",
            "created_at",
            "updated_at",
        ]


class DepositSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    provider = serializers.ChoiceField(choices=["paystack", "momo"])
    phone = serializers.CharField(required=False)  # For MoMo


class WithdrawalSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    account_number = serializers.CharField()
    bank_code = serializers.CharField(required=False)


class EscrowHoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowHold
        fields = "__all__"
        read_only_fields = ["id", "is_released", "released_at", "created_at"]


