"""Errand lifecycle and escrow tests.

Run: python manage.py test --settings=backend.test_settings
"""

import uuid

from django.db.models import Sum
from django.test import SimpleTestCase
from rest_framework.test import APITestCase

from apps.errand.models import Errand, EscrowHold
from apps.errand.pricing import split_commission
from apps.User.models import AgentProfile, User
from apps.wallet.models import LedgerEntry, Wallet
from apps.wallet.services import post_external, system_wallet, user_wallet

API = "/tsumi/api/v1"


def make_user(email, user_type=User.UserType.CUSTOMER, balance_pesewas=0, kyc=None, **extra):
    user = User.objects.create_user(
        email=email, password="Str0ng-pass!", first_name="Test", last_name="User",
        user_type=user_type, **extra,
    )
    wallet = user_wallet(user.id)
    if balance_pesewas:
        post_external(wallet.id, balance_pesewas, LedgerEntry.EntryType.ADJUSTMENT, memo="test funding")
    if user_type == User.UserType.AGENT:
        AgentProfile.objects.create(user=user, kyc_status=kyc or AgentProfile.KycStatus.APPROVED)
    return user


def balance(user=None, kind=None):
    wallet = user_wallet(user.id) if user else system_wallet(kind)
    wallet.refresh_from_db()
    return wallet.balance_pesewas


def assert_ledger_consistent(test):
    """Every wallet's balance equals the sum of its ledger lines."""
    for wallet in Wallet.objects.all():
        total = wallet.entries.aggregate(t=Sum("amount_pesewas"))["t"] or 0
        test.assertEqual(wallet.balance_pesewas, total, f"wallet {wallet.kind} {wallet.id}")


class SplitCommissionTests(SimpleTestCase):
    def test_round_numbers(self):
        self.assertEqual(split_commission(10000, 1500), (1500, 8500))

    def test_fraction_goes_to_agent_and_parts_sum_to_price(self):
        # 999 * 15% = 149.85 pesewas: platform gets 149, agent 850.
        self.assertEqual(split_commission(999, 1500), (149, 850))
        for price in (1, 7, 333, 1001, 499999):
            commission, payout = split_commission(price, 1500)
            self.assertEqual(commission + payout, price)

    def test_bounds(self):
        self.assertEqual(split_commission(5000, 0), (0, 5000))
        self.assertEqual(split_commission(5000, 10000), (5000, 0))
        with self.assertRaises(ValueError):
            split_commission(0, 1500)
        with self.assertRaises(ValueError):
            split_commission(100, 10001)


class ErrandFlowTests(APITestCase):
    def setUp(self):
        self.customer = make_user("customer@example.test", balance_pesewas=10000)
        self.agent = make_user("agent@example.test", User.UserType.AGENT)
        self.admin = make_user("admin@example.test", is_staff=True)

    def create_errand(self, price=5000, as_user=None, **extra):
        self.client.force_authenticate(as_user or self.customer)
        payload = {
            "title": "Buy groceries",
            "errand_type": "shopping",
            "dropoff_address": "East Legon, Accra",
            "price_pesewas": price,
            **extra,
        }
        return self.client.post(f"{API}/errands/", payload, format="json")

    def act(self, user, errand_id, action, data=None):
        self.client.force_authenticate(user)
        return self.client.post(f"{API}/errands/{errand_id}/{action}/", data or {}, format="json")

    def test_create_moves_price_into_escrow(self):
        response = self.create_errand(5000)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["commission_pesewas"], 750)
        self.assertEqual(response.data["agent_payout_pesewas"], 4250)
        self.assertEqual(balance(self.customer), 5000)
        self.assertEqual(balance(kind=Wallet.Kind.ESCROW), 5000)
        self.assertEqual(EscrowHold.objects.get().status, EscrowHold.Status.HELD)
        assert_ledger_consistent(self)

    def test_insufficient_funds_writes_nothing(self):
        response = self.create_errand(20000)
        self.assertEqual(response.status_code, 402)
        self.assertEqual(response.data["error"]["code"], "insufficient_funds")
        self.assertEqual(response.data["error"]["meta"]["shortfall_pesewas"], 10000)
        self.assertEqual(Errand.objects.count(), 0)
        self.assertEqual(balance(self.customer), 10000)

    def test_price_below_minimum_rejected(self):
        response = self.create_errand(999)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["details"][0]["field"], "price_pesewas")

    def test_duplicate_submission_charges_once(self):
        request_id = str(uuid.uuid4())
        first = self.create_errand(5000, client_request_id=request_id)
        second = self.create_errand(5000, client_request_id=request_id)
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.data["id"], second.data["id"])
        self.assertEqual(Errand.objects.count(), 1)
        self.assertEqual(balance(self.customer), 5000)

    def test_agent_cannot_post_errands(self):
        self.assertEqual(self.create_errand(as_user=self.agent).status_code, 403)

    def test_happy_path_pays_agent_and_platform(self):
        errand_id = self.create_errand(5000).data["id"]
        self.assertEqual(self.act(self.agent, errand_id, "accept").status_code, 200)
        self.assertEqual(self.act(self.agent, errand_id, "start").status_code, 200)
        self.assertEqual(self.act(self.agent, errand_id, "deliver").status_code, 200)
        response = self.act(self.customer, errand_id, "confirm")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "completed")
        self.assertEqual(balance(self.agent), 4250)
        self.assertEqual(balance(kind=Wallet.Kind.PLATFORM), 750)
        self.assertEqual(balance(kind=Wallet.Kind.ESCROW), 0)
        self.assertEqual(EscrowHold.objects.get().status, EscrowHold.Status.RELEASED)
        self.assertEqual(
            [e["to_status"] for e in response.data["events"]],
            ["open", "accepted", "in_progress", "delivered", "completed"],
        )
        assert_ledger_consistent(self)

    def test_confirm_twice_does_not_pay_twice(self):
        errand_id = self.create_errand(5000).data["id"]
        for user, action in ((self.agent, "accept"), (self.agent, "start"), (self.agent, "deliver")):
            self.act(user, errand_id, action)
        self.assertEqual(self.act(self.customer, errand_id, "confirm").status_code, 200)
        self.assertEqual(self.act(self.customer, errand_id, "confirm").status_code, 409)
        self.assertEqual(balance(self.agent), 4250)

    def test_second_agent_gets_conflict(self):
        other = make_user("agent2@example.test", User.UserType.AGENT)
        errand_id = self.create_errand().data["id"]
        self.assertEqual(self.act(self.agent, errand_id, "accept").status_code, 200)
        response = self.act(other, errand_id, "accept")
        # The errand is no longer open, so it is invisible to the other agent.
        self.assertIn(response.status_code, (404, 409))
        self.assertEqual(Errand.objects.get(pk=errand_id).agent_id, self.agent.id)

    def test_unapproved_agent_cannot_see_or_accept(self):
        pending = make_user("pending@example.test", User.UserType.AGENT, kyc=AgentProfile.KycStatus.PENDING)
        errand_id = self.create_errand().data["id"]
        self.client.force_authenticate(pending)
        self.assertEqual(self.client.get(f"{API}/errands/?scope=available").data["count"], 0)
        self.assertEqual(self.act(pending, errand_id, "accept").status_code, 404)

    def test_agent_capacity_limit(self):
        with self.settings(TSUMI_MAX_ACTIVE_ERRANDS_PER_AGENT=1):
            first = self.create_errand(2000).data["id"]
            second = self.create_errand(2000).data["id"]
            self.assertEqual(self.act(self.agent, first, "accept").status_code, 200)
            self.assertEqual(self.act(self.agent, second, "accept").status_code, 409)

    def test_other_customer_cannot_see_errand(self):
        errand_id = self.create_errand().data["id"]
        stranger = make_user("stranger@example.test")
        self.client.force_authenticate(stranger)
        self.assertEqual(self.client.get(f"{API}/errands/{errand_id}/").status_code, 404)
        self.assertEqual(self.act(stranger, errand_id, "cancel").status_code, 404)

    def test_cancel_refunds_once(self):
        errand_id = self.create_errand(5000).data["id"]
        self.assertEqual(self.act(self.customer, errand_id, "cancel", {"reason": "changed my mind"}).status_code, 200)
        self.assertEqual(balance(self.customer), 10000)
        self.assertEqual(EscrowHold.objects.get().status, EscrowHold.Status.REFUNDED)
        self.assertEqual(self.act(self.customer, errand_id, "cancel").status_code, 409)
        self.assertEqual(balance(self.customer), 10000)
        assert_ledger_consistent(self)

    def test_customer_cannot_cancel_after_work_starts(self):
        errand_id = self.create_errand().data["id"]
        self.act(self.agent, errand_id, "accept")
        self.act(self.agent, errand_id, "start")
        response = self.act(self.customer, errand_id, "cancel")
        self.assertEqual(response.status_code, 409)
        self.assertEqual(balance(self.customer), 5000)

    def test_illegal_transition_is_conflict(self):
        errand_id = self.create_errand().data["id"]
        self.assertEqual(self.act(self.customer, errand_id, "confirm").status_code, 409)

    def test_release_reopens_for_other_agents(self):
        errand_id = self.create_errand().data["id"]
        self.act(self.agent, errand_id, "accept")
        self.assertEqual(self.act(self.agent, errand_id, "release").status_code, 204)
        errand = Errand.objects.get(pk=errand_id)
        self.assertEqual((errand.status, errand.agent_id), ("open", None))

    def test_rating_once_after_completion(self):
        errand_id = self.create_errand().data["id"]
        self.assertEqual(self.act(self.customer, errand_id, "rate", {"stars": 5}).status_code, 409)
        for user, action in ((self.agent, "accept"), (self.agent, "start"), (self.agent, "deliver"), (self.customer, "confirm")):
            self.act(user, errand_id, action)
        self.assertEqual(self.act(self.customer, errand_id, "rate", {"stars": 5}).status_code, 200)
        self.assertEqual(self.act(self.customer, errand_id, "rate", {"stars": 4}).status_code, 409)

    def test_dispute_resolved_as_refund(self):
        errand_id = self.create_errand(5000).data["id"]
        for action in ("accept", "start", "deliver"):
            self.act(self.agent, errand_id, action)
        self.client.force_authenticate(self.customer)
        response = self.client.post(
            f"{API}/disputes/",
            {"errand": errand_id, "reason": "not_delivered", "description": "Nothing arrived"},
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        dispute_id = response.data["id"]
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            f"{API}/admin/disputes/{dispute_id}/resolve/", {"resolution": "refund_customer"}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(Errand.objects.get(pk=errand_id).status, "refunded")
        self.assertEqual(balance(self.customer), 10000)
        self.assertEqual(balance(self.agent), 0)
        again = self.client.post(
            f"{API}/admin/disputes/{dispute_id}/resolve/", {"resolution": "release_agent"}, format="json"
        )
        self.assertEqual(again.status_code, 409)
        assert_ledger_consistent(self)
