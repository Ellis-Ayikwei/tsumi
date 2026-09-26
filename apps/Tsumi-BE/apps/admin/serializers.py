from rest_framework import serializers

from apps.dispute.models import Dispute
from apps.errand.models import Errand, ErrandEvent, EscrowHold
from apps.User.models import AgentProfile, User
from apps.wallet.models import LedgerEntry, Withdrawal


class AdminUserRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "phone_number", "user_type"]


class AdminAgentProfileSerializer(serializers.ModelSerializer):
    has_id_document = serializers.SerializerMethodField()
    has_selfie = serializers.SerializerMethodField()

    class Meta:
        model = AgentProfile
        fields = [
            "kyc_status",
            "kyc_rejection_reason",
            "kyc_submitted_at",
            "kyc_reviewed_at",
            "id_type",
            "id_number",
            "vehicle_type",
            "is_available",
            "has_id_document",
            "has_selfie",
        ]

    def get_has_id_document(self, obj):
        return bool(obj.id_document)

    def get_has_selfie(self, obj):
        return bool(obj.selfie)


class AdminUserSerializer(serializers.ModelSerializer):
    agent_profile = AdminAgentProfileSerializer(read_only=True)
    balance_pesewas = serializers.IntegerField(read_only=True, allow_null=True)
    completed_errands = serializers.IntegerField(read_only=True, required=False)
    avg_rating_centi = serializers.IntegerField(read_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
            "is_active",
            "is_staff",
            "date_joined",
            "last_login",
            "agent_profile",
            "balance_pesewas",
            "completed_errands",
            "avg_rating_centi",
        ]


class AdminEventSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = ErrandEvent
        fields = ["from_status", "to_status", "note", "actor_email", "created_at"]


class AdminErrandSerializer(serializers.ModelSerializer):
    customer = AdminUserRefSerializer(read_only=True)
    agent = AdminUserRefSerializer(read_only=True)
    escrow_status = serializers.CharField(source="escrow.status", read_only=True, default=None)

    class Meta:
        model = Errand
        fields = [
            "id",
            "title",
            "errand_type",
            "status",
            "price_pesewas",
            "commission_pesewas",
            "agent_payout_pesewas",
            "commission_bps",
            "customer",
            "agent",
            "escrow_status",
            "pickup_address",
            "dropoff_address",
            "created_at",
            "completed_at",
            "cancelled_at",
        ]


class AdminLedgerEntrySerializer(serializers.ModelSerializer):
    wallet_kind = serializers.CharField(source="wallet.kind", read_only=True)
    wallet_owner_email = serializers.EmailField(source="wallet.user.email", read_only=True, default=None)

    class Meta:
        model = LedgerEntry
        fields = [
            "id",
            "transfer_id",
            "entry_type",
            "amount_pesewas",
            "balance_after_pesewas",
            "wallet_kind",
            "wallet_owner_email",
            "errand",
            "memo",
            "created_at",
        ]


class AdminDisputeSerializer(serializers.ModelSerializer):
    errand = AdminErrandSerializer(read_only=True)
    opened_by = AdminUserRefSerializer(read_only=True)

    class Meta:
        model = Dispute
        fields = [
            "id",
            "errand",
            "opened_by",
            "reason",
            "description",
            "status",
            "resolution",
            "resolution_note",
            "created_at",
            "resolved_at",
        ]


class AdminWithdrawalSerializer(serializers.ModelSerializer):
    user = AdminUserRefSerializer(source="wallet.user", read_only=True)
    balance_pesewas = serializers.IntegerField(source="wallet.balance_pesewas", read_only=True)

    class Meta:
        model = Withdrawal
        fields = [
            "id",
            "user",
            "balance_pesewas",
            "amount_pesewas",
            "network",
            "momo_number",
            "status",
            "payout_reference",
            "rejection_reason",
            "created_at",
            "reviewed_at",
        ]


class KycDecisionSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=["approve", "reject"])
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")

    def validate(self, attrs):
        if attrs["decision"] == "reject" and not attrs["reason"].strip():
            raise serializers.ValidationError(
                {"reason": "Tell the agent what to fix, e.g. 'ID photo is blurry'."}
            )
        return attrs


class WithdrawalDecisionSerializer(serializers.Serializer):
    payout_reference = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")


class AdjustmentSerializer(serializers.Serializer):
    amount_pesewas = serializers.IntegerField()
    memo = serializers.CharField(max_length=255)

    def validate_amount_pesewas(self, value):
        if value == 0:
            raise serializers.ValidationError("Enter a non-zero amount. Negative values debit the wallet.")
        return value


class EscrowHoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowHold
        fields = ["amount_pesewas", "status", "settled_at"]
