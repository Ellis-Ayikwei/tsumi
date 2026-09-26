"""TsumiSafe wallet ledger.

All amounts are integer pesewas (GHS minor units). A wallet's balance only
changes through apps.wallet.services, which writes the balance update and its
LedgerEntry in the same transaction, so for every wallet:

    balance_pesewas == SUM(ledger_entries.amount_pesewas)
"""

from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.Basemodel.models import Basemodel


class Wallet(Basemodel):
    class Kind(models.TextChoices):
        USER = "user", "User"
        # System wallets, exactly one of each:
        ESCROW = "escrow", "Escrow (held for errands)"
        PLATFORM = "platform", "Platform commission"
        PAYOUT_CLEARING = "payout_clearing", "Withdrawals awaiting payout"

    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.USER)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="wallet",
    )
    balance_pesewas = models.BigIntegerField(default=0)
    currency = models.CharField(max_length=3, default="GHS")

    class Meta:
        db_table = "wallets"
        constraints = [
            models.CheckConstraint(
                condition=Q(balance_pesewas__gte=0), name="wallet_balance_non_negative"
            ),
            models.UniqueConstraint(
                fields=["kind"], condition=~Q(kind="user"), name="one_wallet_per_system_kind"
            ),
            models.CheckConstraint(
                condition=(Q(kind="user") & Q(user__isnull=False))
                | (~Q(kind="user") & Q(user__isnull=True)),
                name="user_wallets_have_owner_system_wallets_do_not",
            ),
        ]

    def __str__(self):
        return f"Wallet {self.kind} {self.id}"


class LedgerEntry(Basemodel):
    """One immutable line on one wallet. Transfers write two lines sharing transfer_id."""

    class EntryType(models.TextChoices):
        DEPOSIT = "deposit", "Deposit"
        ESCROW_HOLD = "escrow_hold", "Escrow hold"
        ESCROW_RELEASE = "escrow_release", "Escrow release to agent"
        COMMISSION = "commission", "Platform commission"
        ESCROW_REFUND = "escrow_refund", "Escrow refund"
        WITHDRAWAL_HOLD = "withdrawal_hold", "Withdrawal requested"
        WITHDRAWAL_REVERSAL = "withdrawal_reversal", "Withdrawal rejected"
        PAYOUT = "payout", "Withdrawal paid out"
        ADJUSTMENT = "adjustment", "Admin adjustment"

    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT, related_name="entries")
    transfer_id = models.UUIDField(db_index=True)
    entry_type = models.CharField(max_length=30, choices=EntryType.choices)
    amount_pesewas = models.BigIntegerField()  # signed: credit > 0, debit < 0
    balance_after_pesewas = models.BigIntegerField()
    errand = models.ForeignKey(
        "errand.Errand",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="ledger_entries",
    )
    memo = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )

    class Meta:
        db_table = "ledger_entries"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["wallet", "-created_at"])]
        constraints = [
            models.CheckConstraint(
                condition=~Q(amount_pesewas=0), name="ledger_amount_non_zero"
            ),
        ]


class Deposit(Basemodel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCEEDED = "succeeded", "Succeeded"
        FAILED = "failed", "Failed"

    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT, related_name="deposits")
    amount_pesewas = models.BigIntegerField()
    reference = models.CharField(max_length=64, unique=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    authorization_url = models.URLField(max_length=500, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "deposits"
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(amount_pesewas__gt=0), name="deposit_amount_positive"
            ),
        ]


class Withdrawal(Basemodel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        REJECTED = "rejected", "Rejected"

    class Network(models.TextChoices):
        MTN = "mtn", "MTN MoMo"
        TELECEL = "telecel", "Telecel Cash"
        AIRTELTIGO = "airteltigo", "AirtelTigo Money"

    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT, related_name="withdrawals")
    amount_pesewas = models.BigIntegerField()
    network = models.CharField(max_length=20, choices=Network.choices)
    momo_number = models.CharField(max_length=15)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    payout_reference = models.CharField(max_length=100, blank=True)
    rejection_reason = models.CharField(max_length=255, blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "withdrawals"
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=Q(amount_pesewas__gt=0), name="withdrawal_amount_positive"
            ),
        ]
