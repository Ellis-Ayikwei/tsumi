from django.contrib import admin
from .models import Wallet, Transaction, EscrowHold


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ["user", "balance", "currency", "is_active", "created_at"]
    list_filter = ["is_active", "currency", "created_at"]
    search_fields = ["user__email", "user__phone"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "reference",
        "wallet",
        "transaction_type",
        "amount",
        "status",
        "created_at",
    ]
    list_filter = ["transaction_type", "status", "provider", "created_at"]
    search_fields = ["reference", "provider_reference", "wallet__user__email"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(EscrowHold)
class EscrowHoldAdmin(admin.ModelAdmin):
    list_display = ["errand", "amount", "is_released", "created_at"]
    list_filter = ["is_released", "created_at"]
    readonly_fields = ["id", "created_at"]


