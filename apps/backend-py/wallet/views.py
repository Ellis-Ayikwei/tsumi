from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Wallet, Transaction, EscrowHold
from .serializers import (
    WalletSerializer,
    TransactionSerializer,
    DepositSerializer,
    WithdrawalSerializer,
    EscrowHoldSerializer,
)
from .services import PaymentService


class WalletViewSet(viewsets.ModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def my_wallet(self, request):
        """Get current user's wallet"""
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(wallet)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def deposit(self, request):
        """Initiate a deposit to wallet"""
        serializer = DepositSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        payment_service = PaymentService()

        try:
            result = payment_service.initiate_deposit(
                wallet=wallet,
                amount=serializer.validated_data["amount"],
                provider=serializer.validated_data["provider"],
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def withdraw(self, request):
        """Withdraw from wallet"""
        serializer = WithdrawalSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        wallet = get_object_or_404(Wallet, user=request.user)
        amount = serializer.validated_data["amount"]

        if wallet.balance < amount:
            return Response(
                {"error": "Insufficient balance"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_service = PaymentService()
        try:
            result = payment_service.initiate_withdrawal(
                wallet=wallet,
                amount=amount,
                account_number=serializer.validated_data["account_number"],
                bank_code=serializer.validated_data.get("bank_code"),
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def transactions(self, request):
        """Get user's transaction history"""
        wallet = get_object_or_404(Wallet, user=request.user)
        transactions = Transaction.objects.filter(wallet=wallet)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(wallet__user=request.user)


