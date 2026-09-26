import json
import logging

from django.db.models import Sum
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.errand.models import EscrowHold

from . import paystack, services
from .models import Deposit, Withdrawal
from .serializers import (
    DepositCreateSerializer,
    DepositSerializer,
    LedgerEntrySerializer,
    WithdrawalSerializer,
)

logger = logging.getLogger(__name__)


class WalletView(APIView):
    """GET /wallet/ - balance plus money that is committed but not yet settled."""

    def get(self, request):
        wallet = services.user_wallet(request.user.id)
        in_escrow = EscrowHold.objects.filter(
            errand__customer=request.user, status=EscrowHold.Status.HELD
        ).aggregate(total=Sum("amount_pesewas"))["total"]
        pending_withdrawals = Withdrawal.objects.filter(
            wallet=wallet, status=Withdrawal.Status.PENDING
        ).aggregate(total=Sum("amount_pesewas"))["total"]
        return Response(
            {
                "id": wallet.id,
                "currency": wallet.currency,
                "balance_pesewas": wallet.balance_pesewas,
                "held_in_escrow_pesewas": in_escrow or 0,
                "pending_withdrawals_pesewas": pending_withdrawals or 0,
            }
        )


class LedgerView(generics.ListAPIView):
    serializer_class = LedgerEntrySerializer

    def get_queryset(self):
        return services.user_wallet(self.request.user.id).entries.all()


class DepositListCreateView(generics.ListCreateAPIView):
    serializer_class = DepositSerializer

    def get_queryset(self):
        return Deposit.objects.filter(wallet__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = DepositCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        deposit = services.start_deposit(request.user, serializer.validated_data["amount_pesewas"])
        return Response(DepositSerializer(deposit).data, status=status.HTTP_201_CREATED)


class DepositDetailView(generics.RetrieveAPIView):
    """GET /wallet/deposits/<reference>/ - reads our DB only; the webhook and the
    reconciliation task are what move a deposit out of pending."""

    serializer_class = DepositSerializer
    lookup_field = "reference"

    def get_queryset(self):
        return Deposit.objects.filter(wallet__user=self.request.user)


class WithdrawalListCreateView(generics.ListCreateAPIView):
    serializer_class = WithdrawalSerializer

    def get_queryset(self):
        return Withdrawal.objects.filter(wallet__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = WithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        withdrawal = services.request_withdrawal(request.user, **serializer.validated_data)
        return Response(WithdrawalSerializer(withdrawal).data, status=status.HTTP_201_CREATED)


@csrf_exempt
@require_POST
def paystack_webhook(request):
    """Public endpoint. Authenticated by Paystack's HMAC-SHA512 signature over the
    raw body. Returns 200 for every correctly signed event so Paystack stops
    retrying; crediting is idempotent on the deposit reference."""
    if not paystack.signature_is_valid(request.body, request.headers.get("X-Paystack-Signature", "")):
        return HttpResponse(status=401)
    try:
        event = json.loads(request.body)
    except ValueError:
        return HttpResponse(status=400)
    if event.get("event") == "charge.success":
        data = event.get("data") or {}
        reference = data.get("reference")
        amount = data.get("amount")
        if isinstance(reference, str) and isinstance(amount, int):
            services.mark_deposit_succeeded(reference, amount, data.get("currency"))
    return HttpResponse(status=200)
