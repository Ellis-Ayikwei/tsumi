from django.urls import path

from .views import (
    DepositDetailView,
    DepositListCreateView,
    LedgerView,
    WalletView,
    WithdrawalListCreateView,
    paystack_webhook,
)

urlpatterns = [
    path("", WalletView.as_view(), name="wallet"),
    path("ledger/", LedgerView.as_view(), name="wallet-ledger"),
    path("deposits/", DepositListCreateView.as_view(), name="wallet-deposits"),
    path("deposits/<str:reference>/", DepositDetailView.as_view(), name="wallet-deposit-detail"),
    path("withdrawals/", WithdrawalListCreateView.as_view(), name="wallet-withdrawals"),
    path("paystack/webhook/", paystack_webhook, name="paystack-webhook"),
]
