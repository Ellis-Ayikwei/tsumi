"""Admin API. Every view requires is_staff (DRF IsAdminUser)."""

from datetime import timedelta

from django.db import transaction
from django.db.models import BigIntegerField, Count, IntegerField, OuterRef, Q, Subquery, Sum
from django.db.models.functions import Coalesce
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response

from apps.dispute import services as dispute_services
from apps.dispute.models import Dispute
from apps.dispute.serializers import DisputeResolveSerializer
from apps.errand import services as errand_services
from apps.errand.models import Errand, EscrowHold, Rating
from apps.errand.serializers import CancelSerializer
from apps.notification.services import notify
from apps.trust.models import TrustBadge, UserBadge
from apps.trust.serializers import TrustBadgeSerializer
from apps.trust.services import agent_stats, evaluate_badges
from apps.User.models import AgentProfile, User
from apps.wallet import services as wallet_services
from apps.wallet.models import Deposit, LedgerEntry, Wallet, Withdrawal

from .serializers import (
    AdjustmentSerializer,
    AdminDisputeSerializer,
    AdminErrandSerializer,
    AdminEventSerializer,
    AdminLedgerEntrySerializer,
    AdminUserSerializer,
    AdminWithdrawalSerializer,
    EscrowHoldSerializer,
    KycDecisionSerializer,
    WithdrawalDecisionSerializer,
)

IsAdmin = permissions.IsAdminUser


def _annotated_users():
    """Users with wallet balance, completed errand count and average rating
    (hundredths of a star) as subqueries, so list pages stay one query."""
    completed = (
        Errand.objects.filter(agent=OuterRef("pk"), status=Errand.Status.COMPLETED)
        .values("agent")
        .annotate(n=Count("id"))
        .values("n")
    )
    rating = (
        Rating.objects.filter(ratee=OuterRef("pk"))
        .values("ratee")
        .annotate(centi=Sum("stars") * 100 / Count("id"))
        .values("centi")
    )
    return User.objects.select_related("agent_profile", "wallet").annotate(
        balance_pesewas=Coalesce("wallet__balance_pesewas", 0, output_field=BigIntegerField()),
        completed_errands=Coalesce(Subquery(completed, output_field=IntegerField()), 0),
        avg_rating_centi=Subquery(rating, output_field=IntegerField()),
    )


# Dashboard ------------------------------------------------------------------


@api_view(["GET"])
@permission_classes([IsAdmin])
def stats(request):
    since = timezone.now() - timedelta(days=30)
    users = User.objects.aggregate(
        customers=Count("id", filter=Q(user_type=User.UserType.CUSTOMER)),
        agents=Count("id", filter=Q(user_type=User.UserType.AGENT)),
        suspended=Count("id", filter=Q(is_active=False)),
        new_last_30d=Count("id", filter=Q(date_joined__gte=since)),
    )
    errands_by_status = dict(
        Errand.objects.values_list("status").annotate(n=Count("id")).values_list("status", "n")
    )
    completed_30d = Errand.objects.filter(
        status=Errand.Status.COMPLETED, completed_at__gte=since
    ).aggregate(
        count=Count("id"),
        gmv=Coalesce(Sum("price_pesewas"), 0, output_field=BigIntegerField()),
        commission=Coalesce(Sum("commission_pesewas"), 0, output_field=BigIntegerField()),
    )
    system_balances = dict(
        Wallet.objects.exclude(kind=Wallet.Kind.USER).values_list("kind", "balance_pesewas")
    )
    return Response(
        {
            "users": users,
            "agents_pending_kyc": AgentProfile.objects.filter(
                kyc_status=AgentProfile.KycStatus.PENDING
            ).count(),
            "errands_by_status": errands_by_status,
            "last_30_days": {
                "completed_errands": completed_30d["count"],
                "gmv_pesewas": completed_30d["gmv"],
                "commission_pesewas": completed_30d["commission"],
            },
            "escrow_held_pesewas": system_balances.get(Wallet.Kind.ESCROW, 0),
            "platform_balance_pesewas": system_balances.get(Wallet.Kind.PLATFORM, 0),
            "payout_clearing_pesewas": system_balances.get(Wallet.Kind.PAYOUT_CLEARING, 0),
            "open_disputes": Dispute.objects.filter(status=Dispute.Status.OPEN).count(),
            "pending_withdrawals": Withdrawal.objects.filter(
                status=Withdrawal.Status.PENDING
            ).aggregate(count=Count("id"), total_pesewas=Coalesce(Sum("amount_pesewas"), 0, output_field=BigIntegerField())),
            "pending_deposits": Deposit.objects.filter(status=Deposit.Status.PENDING).count(),
        }
    )


# Users and agents -------------------------------------------------------------


class UserListView(generics.ListAPIView):
    """GET /admin/users/?q=&user_type=&is_active=&kyc_status="""

    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = _annotated_users()
        params = self.request.query_params
        if q := params.get("q", "").strip():
            qs = qs.filter(
                Q(email__icontains=q)
                | Q(first_name__icontains=q)
                | Q(last_name__icontains=q)
                | Q(phone_number__icontains=q)
            )
        if user_type := params.get("user_type"):
            qs = qs.filter(user_type=user_type)
        if params.get("is_active") in ("true", "false"):
            qs = qs.filter(is_active=params["is_active"] == "true")
        if kyc_status := params.get("kyc_status"):
            qs = qs.filter(agent_profile__kyc_status=kyc_status)
            # Oldest submissions first so the review queue is first-come, first-served.
            if kyc_status == AgentProfile.KycStatus.PENDING:
                qs = qs.order_by("agent_profile__kyc_submitted_at")
        return qs


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return _annotated_users()

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        data = self.get_serializer(user).data
        data["badges"] = list(
            UserBadge.objects.filter(user=user).values_list("badge__code", flat=True)
        )
        if user.is_agent:
            data["stats"] = agent_stats(user.id)
        return Response(data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def set_user_active(request, pk, active):
    user = get_object_or_404(User, pk=pk)
    if user.pk == request.user.pk:
        raise PermissionDenied("You cannot suspend your own account.")
    if user.is_staff and not request.user.is_superuser:
        raise PermissionDenied("Only a superuser can suspend another admin.")
    user.is_active = active
    user.save(update_fields=["is_active"])
    return Response(AdminUserSerializer(_annotated_users().get(pk=pk)).data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def kyc_decision(request, pk):
    serializer = KycDecisionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    approve = serializer.validated_data["decision"] == "approve"
    with transaction.atomic():
        profile = get_object_or_404(AgentProfile.objects.select_for_update(), user_id=pk)
        if profile.kyc_status != AgentProfile.KycStatus.PENDING:
            raise ValidationError({"decision": f"This runner's KYC is {profile.kyc_status}, not pending."})
        profile.kyc_status = (
            AgentProfile.KycStatus.APPROVED if approve else AgentProfile.KycStatus.REJECTED
        )
        profile.kyc_rejection_reason = "" if approve else serializer.validated_data["reason"]
        profile.kyc_reviewed_at = timezone.now()
        profile.kyc_reviewed_by = request.user
        profile.save()
        if approve:
            notify(pk, "kyc_approved", "You're verified", "You can now accept errands on Tsumi.")
        else:
            notify(
                pk, "kyc_rejected", "Verification needs another look",
                profile.kyc_rejection_reason,
            )
    if approve:
        evaluate_badges(profile.user)
    return Response(AdminUserSerializer(_annotated_users().get(pk=pk)).data)


@api_view(["GET"])
@permission_classes([IsAdmin])
def kyc_document(request, pk, which):
    """Streams a KYC file to an admin. KYC files are never served from public media URLs."""
    if which not in ("id_document", "selfie"):
        raise NotFound()
    profile = get_object_or_404(AgentProfile, user_id=pk)
    document = getattr(profile, which)
    if not document:
        raise NotFound("No file uploaded.")
    return FileResponse(document.open("rb"))


# Errands ---------------------------------------------------------------------


class ErrandListView(generics.ListAPIView):
    """GET /admin/errands/?status=&q=&user="""

    serializer_class = AdminErrandSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = Errand.objects.select_related("customer", "agent", "escrow").prefetch_related("stops")
        params = self.request.query_params
        if status_filter := params.get("status"):
            qs = qs.filter(status__in=status_filter.split(","))
        if user_id := params.get("user"):
            qs = qs.filter(Q(customer_id=user_id) | Q(agent_id=user_id))
        if q := params.get("q", "").strip():
            qs = qs.filter(
                Q(title__icontains=q) | Q(customer__email__icontains=q) | Q(agent__email__icontains=q)
            )
        return qs


def _errand_detail(pk):
    errand = get_object_or_404(Errand.objects.select_related("customer", "agent", "escrow").prefetch_related("stops"), pk=pk)
    data = AdminErrandSerializer(errand).data
    data["description"] = errand.description
    data["events"] = AdminEventSerializer(errand.events.select_related("actor"), many=True).data
    hold = EscrowHold.objects.filter(errand=errand).first()
    data["escrow"] = EscrowHoldSerializer(hold).data if hold else None
    data["ledger"] = AdminLedgerEntrySerializer(
        LedgerEntry.objects.filter(errand=errand).select_related("wallet__user"), many=True
    ).data
    dispute = Dispute.objects.filter(errand=errand).first()
    data["dispute_id"] = dispute.id if dispute else None
    return data


@api_view(["GET"])
@permission_classes([IsAdmin])
def errand_detail(request, pk):
    return Response(_errand_detail(pk))


@api_view(["POST"])
@permission_classes([IsAdmin])
def errand_cancel(request, pk):
    serializer = CancelSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if not serializer.validated_data["reason"].strip():
        raise ValidationError({"reason": "Give a reason; the customer and runner will see it."})
    get_object_or_404(Errand, pk=pk)
    errand_services.cancel(pk, request.user, serializer.validated_data["reason"])
    return Response(_errand_detail(pk))


# Disputes --------------------------------------------------------------------


class DisputeListView(generics.ListAPIView):
    """GET /admin/disputes/?status=open"""

    serializer_class = AdminDisputeSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = Dispute.objects.select_related(
            "errand__customer", "errand__agent", "errand__escrow", "opened_by"
        ).prefetch_related("errand__stops")
        if status_filter := self.request.query_params.get("status"):
            qs = qs.filter(status=status_filter)
        # Open disputes: oldest first. Resolved: newest first.
        return qs.order_by("created_at" if status_filter == Dispute.Status.OPEN else "-created_at")


@api_view(["POST"])
@permission_classes([IsAdmin])
def dispute_resolve(request, pk):
    serializer = DisputeResolveSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    get_object_or_404(Dispute, pk=pk)
    dispute = dispute_services.resolve_dispute(
        pk, request.user, serializer.validated_data["resolution"], serializer.validated_data["note"]
    )
    dispute = Dispute.objects.select_related(
        "errand__customer", "errand__agent", "errand__escrow", "opened_by"
    ).prefetch_related("errand__stops").get(pk=dispute.pk)
    return Response(AdminDisputeSerializer(dispute).data)


# Money -----------------------------------------------------------------------


class WithdrawalListView(generics.ListAPIView):
    """GET /admin/withdrawals/?status=pending"""

    serializer_class = AdminWithdrawalSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = Withdrawal.objects.select_related("wallet__user")
        if status_filter := self.request.query_params.get("status"):
            qs = qs.filter(status=status_filter)
        return qs.order_by("created_at" if status_filter == Withdrawal.Status.PENDING else "-created_at")


@api_view(["POST"])
@permission_classes([IsAdmin])
def withdrawal_decision(request, pk, approve):
    serializer = WithdrawalDecisionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    if approve and not data["payout_reference"].strip():
        raise ValidationError({"payout_reference": "Enter the MoMo transaction ID you paid out with."})
    if not approve and not data["reason"].strip():
        raise ValidationError({"reason": "Tell the user why, e.g. 'MoMo name does not match account'."})
    get_object_or_404(Withdrawal, pk=pk)
    withdrawal = wallet_services.settle_withdrawal(
        pk, request.user, approve=approve, payout_reference=data["payout_reference"], reason=data["reason"]
    )
    return Response(
        AdminWithdrawalSerializer(Withdrawal.objects.select_related("wallet__user").get(pk=withdrawal.pk)).data
    )


class LedgerListView(generics.ListAPIView):
    """GET /admin/ledger/?wallet_kind=&user=&errand=&entry_type="""

    serializer_class = AdminLedgerEntrySerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = LedgerEntry.objects.select_related("wallet__user")
        params = self.request.query_params
        if kind := params.get("wallet_kind"):
            qs = qs.filter(wallet__kind=kind)
        if user_id := params.get("user"):
            qs = qs.filter(wallet__user_id=user_id)
        if errand_id := params.get("errand"):
            qs = qs.filter(errand_id=errand_id)
        if entry_type := params.get("entry_type"):
            qs = qs.filter(entry_type=entry_type)
        return qs


@api_view(["POST"])
@permission_classes([IsAdmin])
def wallet_adjust(request, pk):
    """Credit (positive) or debit (negative) a user's wallet with an audit memo."""
    serializer = AdjustmentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = get_object_or_404(User, pk=pk)
    wallet = wallet_services.user_wallet(user.id)
    entry = wallet_services.post_external(
        wallet.id,
        serializer.validated_data["amount_pesewas"],
        LedgerEntry.EntryType.ADJUSTMENT,
        memo=serializer.validated_data["memo"],
        actor=request.user,
    )
    return Response(AdminLedgerEntrySerializer(entry).data, status=status.HTTP_201_CREATED)


# Trust badges ----------------------------------------------------------------


class BadgeListView(generics.ListAPIView):
    serializer_class = TrustBadgeSerializer
    permission_classes = [IsAdmin]
    pagination_class = None
    queryset = TrustBadge.objects.all()


@api_view(["POST", "DELETE"])
@permission_classes([IsAdmin])
def user_badge(request, pk, code):
    """POST awards a badge to a user; DELETE takes it away."""
    user = get_object_or_404(User, pk=pk)
    badge = get_object_or_404(TrustBadge, code=code)
    if request.method == "DELETE":
        UserBadge.objects.filter(user=user, badge=badge).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    UserBadge.objects.get_or_create(user=user, badge=badge, defaults={"awarded_by": request.user})
    notify(user.id, "badge_awarded", f"You earned the {badge.name} badge", badge.description)
    return Response(status=status.HTTP_201_CREATED)
