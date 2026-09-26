"""The only code that changes wallet balances.

Two primitives:
- transfer(): moves money between two wallets (two ledger lines, one transfer_id).
- post_external(): money entering or leaving the platform (deposit, payout,
  admin adjustment), one ledger line.

Both run in a transaction, update the balance with a conditional UPDATE so a
debit can never take a wallet below zero, and write the ledger line in the
same transaction.
"""

import logging
import uuid

from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.notification.services import notify
from backend.api_exceptions import Conflict, InsufficientFunds

from . import paystack
from .models import Deposit, LedgerEntry, Wallet, Withdrawal

logger = logging.getLogger(__name__)

Entry = LedgerEntry.EntryType


def user_wallet(user_id) -> Wallet:
    wallet, _ = Wallet.objects.get_or_create(user_id=user_id, defaults={"kind": Wallet.Kind.USER})
    return wallet


def system_wallet(kind) -> Wallet:
    wallet, _ = Wallet.objects.get_or_create(kind=kind, user=None)
    return wallet


def _apply(wallet_id, amount_pesewas, entry_type, transfer_id, *, errand=None, memo="", actor=None):
    rows = Wallet.objects.filter(pk=wallet_id)
    if amount_pesewas < 0:
        rows = rows.filter(balance_pesewas__gte=-amount_pesewas)
    updated = rows.update(
        balance_pesewas=F("balance_pesewas") + amount_pesewas, updated_at=timezone.now()
    )
    balance_after = Wallet.objects.values_list("balance_pesewas", flat=True).get(pk=wallet_id)
    if not updated:
        raise InsufficientFunds(required_pesewas=-amount_pesewas, balance_pesewas=balance_after)
    return LedgerEntry.objects.create(
        wallet_id=wallet_id,
        transfer_id=transfer_id,
        entry_type=entry_type,
        amount_pesewas=amount_pesewas,
        balance_after_pesewas=balance_after,
        errand=errand,
        memo=memo,
        created_by=actor,
    )


@transaction.atomic
def transfer(from_wallet_id, to_wallet_id, amount_pesewas, entry_type, *, errand=None, memo="", actor=None):
    if amount_pesewas <= 0:
        raise ValueError("transfer amount must be positive")
    # Lock both rows in a fixed order so two opposite transfers cannot deadlock.
    list(
        Wallet.objects.select_for_update()
        .filter(pk__in=[from_wallet_id, to_wallet_id])
        .order_by("pk")
        .values_list("pk", flat=True)
    )
    transfer_id = uuid.uuid4()
    _apply(from_wallet_id, -amount_pesewas, entry_type, transfer_id, errand=errand, memo=memo, actor=actor)
    _apply(to_wallet_id, amount_pesewas, entry_type, transfer_id, errand=errand, memo=memo, actor=actor)
    return transfer_id


@transaction.atomic
def post_external(wallet_id, amount_pesewas, entry_type, *, memo="", actor=None):
    if amount_pesewas == 0:
        raise ValueError("amount must be non-zero")
    return _apply(wallet_id, amount_pesewas, entry_type, uuid.uuid4(), memo=memo, actor=actor)


# Deposits (Paystack) ----------------------------------------------------------


def start_deposit(user, amount_pesewas) -> Deposit:
    """Create a pending deposit and get a Paystack checkout URL.

    The Paystack call happens outside any transaction so no row locks are held
    while waiting on the network. If Paystack fails the deposit is marked failed
    and PaymentProviderError propagates; nothing is credited.
    """
    wallet = user_wallet(user.id)
    deposit = Deposit.objects.create(
        wallet=wallet,
        amount_pesewas=amount_pesewas,
        reference=f"TSD-{uuid.uuid4().hex[:20].upper()}",
    )
    try:
        deposit.authorization_url = paystack.initialize_transaction(
            email=user.email,
            amount_pesewas=amount_pesewas,
            reference=deposit.reference,
            callback_url=f"{settings.FRONTEND_URL}/wallet/topup?reference={deposit.reference}",
        )
    except Exception:
        deposit.status = Deposit.Status.FAILED
        deposit.failure_reason = "initialize_failed"
        deposit.save(update_fields=["status", "failure_reason", "updated_at"])
        raise
    deposit.save(update_fields=["authorization_url", "updated_at"])
    return deposit


def mark_deposit_succeeded(reference, amount_pesewas, currency):
    """Credit a deposit once. Safe to call any number of times for the same
    reference (webhook retries, reconciliation): only the first call credits."""
    with transaction.atomic():
        deposit = Deposit.objects.select_for_update().filter(reference=reference).first()
        if deposit is None:
            logger.warning("Paystack success for unknown deposit reference %s", reference)
            return None
        if deposit.status == Deposit.Status.SUCCEEDED:
            return deposit
        if amount_pesewas != deposit.amount_pesewas or currency != settings.TSUMI_CURRENCY:
            deposit.status = Deposit.Status.FAILED
            deposit.failure_reason = "amount_or_currency_mismatch"
            deposit.save(update_fields=["status", "failure_reason", "updated_at"])
            logger.error("Deposit %s amount/currency mismatch; not credited", deposit.id)
            return deposit
        deposit.status = Deposit.Status.SUCCEEDED
        deposit.paid_at = timezone.now()
        deposit.failure_reason = ""
        deposit.save(update_fields=["status", "paid_at", "failure_reason", "updated_at"])
        post_external(deposit.wallet_id, deposit.amount_pesewas, Entry.DEPOSIT, memo=reference)
        notify(
            deposit.wallet.user_id,
            "deposit_succeeded",
            "Wallet topped up",
            f"GHS {deposit.amount_pesewas / 100:.2f} was added to your wallet.",
        )
        return deposit


# Withdrawals (manual MoMo payout by an admin) ---------------------------------


@transaction.atomic
def request_withdrawal(user, amount_pesewas, network, momo_number) -> Withdrawal:
    if amount_pesewas < settings.TSUMI_MIN_WITHDRAWAL_PESEWAS:
        raise ValidationError(
            {"amount_pesewas": f"Minimum withdrawal is {settings.TSUMI_MIN_WITHDRAWAL_PESEWAS} pesewas."}
        )
    wallet = user_wallet(user.id)
    withdrawal = Withdrawal.objects.create(
        wallet=wallet, amount_pesewas=amount_pesewas, network=network, momo_number=momo_number
    )
    transfer(
        wallet.id,
        system_wallet(Wallet.Kind.PAYOUT_CLEARING).id,
        amount_pesewas,
        Entry.WITHDRAWAL_HOLD,
        memo=f"Withdrawal {withdrawal.id}",
        actor=user,
    )
    return withdrawal


@transaction.atomic
def settle_withdrawal(withdrawal_id, admin, *, approve, payout_reference="", reason=""):
    """PENDING -> PAID (money left the platform) or PENDING -> REJECTED (money
    returned to the user's wallet). Exactly once, under a row lock."""
    withdrawal = Withdrawal.objects.select_for_update().select_related("wallet").get(pk=withdrawal_id)
    if withdrawal.status != Withdrawal.Status.PENDING:
        raise Conflict(f"Withdrawal is already {withdrawal.status}.")
    clearing = system_wallet(Wallet.Kind.PAYOUT_CLEARING)
    if approve:
        post_external(
            clearing.id, -withdrawal.amount_pesewas, Entry.PAYOUT,
            memo=f"Withdrawal {withdrawal.id} {payout_reference}".strip(), actor=admin,
        )
        withdrawal.status = Withdrawal.Status.PAID
        withdrawal.payout_reference = payout_reference
        title, body = "Withdrawal paid", "Your withdrawal has been sent to your mobile money wallet."
    else:
        transfer(
            clearing.id, withdrawal.wallet_id, withdrawal.amount_pesewas,
            Entry.WITHDRAWAL_REVERSAL, memo=f"Withdrawal {withdrawal.id} rejected", actor=admin,
        )
        withdrawal.status = Withdrawal.Status.REJECTED
        withdrawal.rejection_reason = reason
        title, body = "Withdrawal rejected", f"The money is back in your wallet. Reason: {reason}"
    withdrawal.reviewed_by = admin
    withdrawal.reviewed_at = timezone.now()
    withdrawal.save()
    notify(withdrawal.wallet.user_id, "withdrawal_" + withdrawal.status, title, body)
    return withdrawal
