from django.db import models
from django.conf import settings
import uuid


class Wallet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet"
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    currency = models.CharField(max_length=3, default="GHS")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "wallets"

    def __str__(self):
        return f"{self.user.full_name} - {self.currency} {self.balance}"


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ("deposit", "Deposit"),
        ("withdrawal", "Withdrawal"),
        ("hold", "Hold (Escrow)"),
        ("release", "Release from Escrow"),
        ("commission", "Platform Commission"),
        ("refund", "Refund"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("reversed", "Reversed"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # External payment reference
    reference = models.CharField(max_length=100, unique=True)
    provider = models.CharField(max_length=50, blank=True)  # e.g., "paystack", "momo"
    provider_reference = models.CharField(max_length=100, blank=True)

    # Metadata
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    # Related errand (if applicable)
    errand = models.ForeignKey(
        "errands.Errand",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "transactions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["wallet", "status"]),
            models.Index(fields=["reference"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} - {self.status}"


class EscrowHold(models.Model):
    """Represents money held in escrow for an errand"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="escrow_holds")
    errand = models.OneToOneField(
        "errands.Errand", on_delete=models.CASCADE, related_name="escrow"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_released = models.BooleanField(default=False)
    released_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "escrow_holds"

    def __str__(self):
        return f"Escrow {self.amount} for {self.errand.title}"


