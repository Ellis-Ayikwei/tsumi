"""Errand lifecycle. Every status change goes through _move() under a row lock,
so two actors racing on one errand get one winner and one 409.

    open --accept--> accepted --start--> in_progress --deliver--> delivered --confirm--> completed
      |                 |  \--release--> open              |                  |
      +--cancel---------+--cancel--> cancelled (refund)    +--dispute---------+--> disputed
                                                                     disputed --resolve--> completed | refunded

Money: creating an errand moves price_pesewas from the customer's wallet into
escrow in the same transaction. completed releases agent_payout_pesewas to the
agent and commission_pesewas to the platform; cancelled and refunded return the
full price to the customer. Each hold settles exactly once.
"""

from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied

from apps.notification.services import notify
from apps.trust.services import evaluate_badges
from apps.User.models import AgentProfile
from apps.wallet.models import LedgerEntry, Wallet
from apps.wallet.services import system_wallet, transfer, user_wallet
from backend.api_exceptions import Conflict

from .models import Errand, ErrandEvent, ErrandStop, EscrowHold, Rating
from .pricing import split_commission

S = Errand.Status
Entry = LedgerEntry.EntryType

LEGAL_TRANSITIONS = {
    S.OPEN: {S.ACCEPTED, S.CANCELLED},
    S.ACCEPTED: {S.OPEN, S.IN_PROGRESS, S.CANCELLED},
    S.IN_PROGRESS: {S.DELIVERED, S.DISPUTED, S.CANCELLED},
    S.DELIVERED: {S.COMPLETED, S.DISPUTED},
    S.DISPUTED: {S.COMPLETED, S.REFUNDED},
}

_TIMESTAMP_FIELD = {
    S.ACCEPTED: "accepted_at",
    S.IN_PROGRESS: "started_at",
    S.DELIVERED: "delivered_at",
    S.COMPLETED: "completed_at",
    S.CANCELLED: "cancelled_at",
    S.REFUNDED: "cancelled_at",
}

ACTIVE_AGENT_STATUSES = (S.ACCEPTED, S.IN_PROGRESS, S.DELIVERED)


def visible_errands(user):
    """Errands this user may read: admins all; customers their own; agents
    their assigned errands plus open ones once KYC is approved."""
    qs = Errand.objects.select_related("customer", "agent").prefetch_related("stops")
    if user.is_staff:
        return qs
    if user.is_agent:
        approved = AgentProfile.objects.filter(
            user=user, kyc_status=AgentProfile.KycStatus.APPROVED
        ).exists()
        return qs.filter(Q(agent=user) | (Q(status=S.OPEN) if approved else Q(pk__in=[])))
    return qs.filter(customer=user)


def _move(errand, to_status, actor, note=""):
    """Caller holds a select_for_update lock on errand."""
    if to_status not in LEGAL_TRANSITIONS.get(errand.status, set()):
        raise Conflict(f"An errand that is {errand.status} cannot become {to_status}.")
    from_status = errand.status
    errand.status = to_status
    update_fields = ["status", "updated_at"]
    if to_status in _TIMESTAMP_FIELD:
        setattr(errand, _TIMESTAMP_FIELD[to_status], timezone.now())
        update_fields.append(_TIMESTAMP_FIELD[to_status])
    errand.save(update_fields=update_fields)
    ErrandEvent.objects.create(
        errand=errand, from_status=from_status, to_status=to_status, actor=actor, note=note
    )


def _settle_escrow(errand, release_to_agent, actor):
    hold = EscrowHold.objects.select_for_update().get(errand=errand)
    if hold.status != EscrowHold.Status.HELD:
        raise Conflict("Escrow for this errand is already settled.")
    escrow_id = system_wallet(Wallet.Kind.ESCROW).id
    if release_to_agent:
        transfer(
            escrow_id, user_wallet(errand.agent_id).id, errand.agent_payout_pesewas,
            Entry.ESCROW_RELEASE, errand=errand, actor=actor,
        )
        if errand.commission_pesewas:
            transfer(
                escrow_id, system_wallet(Wallet.Kind.PLATFORM).id, errand.commission_pesewas,
                Entry.COMMISSION, errand=errand, actor=actor,
            )
        hold.status = EscrowHold.Status.RELEASED
    else:
        transfer(
            escrow_id, user_wallet(errand.customer_id).id, hold.amount_pesewas,
            Entry.ESCROW_REFUND, errand=errand, actor=actor,
        )
        hold.status = EscrowHold.Status.REFUNDED
    hold.settled_at = timezone.now()
    hold.save(update_fields=["status", "settled_at", "updated_at"])


def _locked(errand_id):
    return Errand.objects.select_for_update().get(pk=errand_id)


def create_errand(customer, data):
    """Create an errand and hold its price in escrow. Returns (errand, created).

    Idempotent on client_request_id: a retry returns the first errand and
    charges nothing. InsufficientFunds (402) rolls back the errand too.
    """
    data = dict(data)
    stops = data.pop("stops", [])
    client_request_id = data.get("client_request_id")
    if client_request_id:
        existing = Errand.objects.filter(customer=customer, client_request_id=client_request_id).first()
        if existing:
            return existing, False

    price = data["price_pesewas"]
    commission_bps = settings.TSUMI_COMMISSION_BPS
    commission, payout = split_commission(price, commission_bps)
    try:
        with transaction.atomic():
            errand = Errand.objects.create(
                customer=customer,
                commission_bps=commission_bps,
                commission_pesewas=commission,
                agent_payout_pesewas=payout,
                **data,
            )
            transfer(
                user_wallet(customer.id).id, system_wallet(Wallet.Kind.ESCROW).id, price,
                Entry.ESCROW_HOLD, errand=errand, actor=customer,
            )
            EscrowHold.objects.create(errand=errand, amount_pesewas=price)
            ErrandStop.objects.bulk_create(ErrandStop(errand=errand, position=i, **stop) for i, stop in enumerate(stops))
            ErrandEvent.objects.create(errand=errand, to_status=S.OPEN, actor=customer)
    except IntegrityError:
        if client_request_id:
            existing = Errand.objects.filter(customer=customer, client_request_id=client_request_id).first()
            if existing:
                return existing, False
        raise
    return errand, True


@transaction.atomic
def accept(errand_id, agent):
    # Locking the profile serializes one agent's concurrent accepts, so the
    # capacity check below cannot be raced past.
    profile = AgentProfile.objects.select_for_update().filter(user=agent).first()
    if not agent.is_agent or profile is None or not profile.can_take_work:
        raise PermissionDenied("Only KYC-approved runners can accept errands.")
    active = Errand.objects.filter(agent=agent, status__in=ACTIVE_AGENT_STATUSES).count()
    if active >= settings.TSUMI_MAX_ACTIVE_ERRANDS_PER_AGENT:
        raise Conflict(
            f"You already have {active} active errands. Finish one before accepting another."
        )
    errand = _locked(errand_id)
    if errand.status != S.OPEN:
        raise Conflict("Another runner already accepted this errand.")
    errand.agent = agent
    errand.save(update_fields=["agent", "updated_at"])
    _move(errand, S.ACCEPTED, agent)
    notify(errand.customer_id, "errand_accepted", "A runner accepted your errand", errand.title, errand)
    return errand


def _require_assigned_agent(errand, user):
    if errand.agent_id != user.id:
        raise PermissionDenied("Only the assigned runner can do this.")


@transaction.atomic
def release(errand_id, agent):
    errand = _locked(errand_id)
    _require_assigned_agent(errand, agent)
    _move(errand, S.OPEN, agent, note="Runner released the errand")
    errand.agent = None
    errand.accepted_at = None
    errand.save(update_fields=["agent", "accepted_at", "updated_at"])
    notify(errand.customer_id, "errand_released", "Your errand is looking for a new runner", errand.title, errand)
    return errand


@transaction.atomic
def start(errand_id, agent):
    errand = _locked(errand_id)
    _require_assigned_agent(errand, agent)
    _move(errand, S.IN_PROGRESS, agent)
    notify(errand.customer_id, "errand_started", "Your errand is in progress", errand.title, errand)
    return errand


@transaction.atomic
def deliver(errand_id, agent):
    errand = _locked(errand_id)
    _require_assigned_agent(errand, agent)
    _move(errand, S.DELIVERED, agent)
    notify(
        errand.customer_id, "errand_delivered",
        "Your errand is done. Confirm to pay the runner.", errand.title, errand,
    )
    return errand


@transaction.atomic
def confirm(errand_id, user):
    errand = _locked(errand_id)
    if errand.customer_id != user.id and not user.is_staff:
        raise PermissionDenied("Only the customer can confirm this errand.")
    _move(errand, S.COMPLETED, user)
    _settle_escrow(errand, release_to_agent=True, actor=user)
    notify(
        errand.agent_id, "errand_paid", "Payment released",
        f"GHS {errand.agent_payout_pesewas / 100:.2f} was added to your wallet.", errand,
    )
    return errand


@transaction.atomic
def cancel(errand_id, user, reason=""):
    errand = _locked(errand_id)
    if user.is_staff:
        pass
    elif errand.customer_id == user.id:
        if errand.status not in (S.OPEN, S.ACCEPTED):
            raise Conflict("Work has started. Open a dispute instead of cancelling.")
    else:
        raise PermissionDenied("Only the customer can cancel this errand.")
    _move(errand, S.CANCELLED, user, note=reason)
    errand.cancel_reason = reason
    errand.save(update_fields=["cancel_reason", "updated_at"])
    _settle_escrow(errand, release_to_agent=False, actor=user)
    notify(errand.customer_id, "errand_cancelled", "Errand cancelled and refunded", errand.title, errand)
    if errand.agent_id:
        notify(errand.agent_id, "errand_cancelled", "An errand you accepted was cancelled", errand.title, errand)
    return errand


def open_dispute_on(errand, user):
    """Called by apps.dispute with the errand already locked."""
    if user.id not in (errand.customer_id, errand.agent_id):
        raise PermissionDenied("Only the customer or the assigned runner can open a dispute.")
    _move(errand, S.DISPUTED, user)


def resolve_dispute_on(errand, admin, release_to_agent, note):
    """Called by apps.dispute with the errand already locked."""
    _move(errand, S.COMPLETED if release_to_agent else S.REFUNDED, admin, note=note)
    _settle_escrow(errand, release_to_agent=release_to_agent, actor=admin)


def rate(errand_id, customer, stars, comment=""):
    errand = Errand.objects.select_related("agent").get(pk=errand_id)
    if errand.customer_id != customer.id:
        raise PermissionDenied("Only the customer can rate this errand.")
    if errand.status != S.COMPLETED or errand.agent_id is None:
        raise Conflict("You can rate an errand once it is completed.")
    try:
        with transaction.atomic():
            rating = Rating.objects.create(
                errand=errand, rater=customer, ratee_id=errand.agent_id, stars=stars, comment=comment
            )
    except IntegrityError:
        raise Conflict("You already rated this errand.")
    evaluate_badges(errand.agent)
    return rating
