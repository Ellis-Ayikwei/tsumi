import hashlib
import hmac
import json
from unittest import mock

from rest_framework.test import APITestCase

from apps.errand.tests import API, assert_ledger_consistent, balance, make_user
from apps.wallet.models import Deposit, Wallet, Withdrawal
from apps.wallet.services import user_wallet


def signed(body, secret="sk_test_dummy"):
    raw = json.dumps(body).encode()
    return raw, hmac.new(secret.encode(), raw, hashlib.sha512).hexdigest()


class DepositTests(APITestCase):
    def setUp(self):
        self.user = make_user("payer@example.test")
        self.deposit = Deposit.objects.create(
            wallet=user_wallet(self.user.id), amount_pesewas=5000, reference="TSD-TEST1"
        )

    def post_webhook(self, body, signature=None):
        raw, good_signature = signed(body)
        return self.client.generic(
            "POST", f"{API}/wallet/paystack/webhook/", raw,
            content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE=signature if signature is not None else good_signature,
        )

    def charge(self, amount=5000, currency="GHS", reference="TSD-TEST1"):
        return {"event": "charge.success", "data": {"reference": reference, "amount": amount, "currency": currency}}

    def test_bad_signature_rejected(self):
        self.assertEqual(self.post_webhook(self.charge(), signature="bad").status_code, 401)
        self.assertEqual(balance(self.user), 0)

    def test_success_credits_once_even_when_replayed(self):
        self.assertEqual(self.post_webhook(self.charge()).status_code, 200)
        self.assertEqual(self.post_webhook(self.charge()).status_code, 200)
        self.assertEqual(balance(self.user), 5000)
        self.deposit.refresh_from_db()
        self.assertEqual(self.deposit.status, Deposit.Status.SUCCEEDED)
        assert_ledger_consistent(self)

    def test_amount_mismatch_not_credited(self):
        self.post_webhook(self.charge(amount=500000))
        self.assertEqual(balance(self.user), 0)
        self.deposit.refresh_from_db()
        self.assertEqual(self.deposit.status, Deposit.Status.FAILED)

    def test_unknown_reference_ignored(self):
        self.assertEqual(self.post_webhook(self.charge(reference="nope")).status_code, 200)

    def test_start_deposit_provider_down_marks_failed(self):
        from backend.api_exceptions import PaymentProviderError

        self.client.force_authenticate(self.user)
        with mock.patch(
            "apps.wallet.services.paystack.initialize_transaction", side_effect=PaymentProviderError()
        ):
            response = self.client.post(f"{API}/wallet/deposits/", {"amount_pesewas": 2000}, format="json")
        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.data["error"]["code"], "payment_provider_error")
        self.assertEqual(Deposit.objects.filter(status=Deposit.Status.FAILED).count(), 1)
        self.assertEqual(balance(self.user), 0)


class WithdrawalTests(APITestCase):
    def setUp(self):
        self.agent = make_user("earner@example.test", balance_pesewas=8000)
        self.admin = make_user("ops@example.test", is_staff=True)

    def request_withdrawal(self, amount):
        self.client.force_authenticate(self.agent)
        return self.client.post(
            f"{API}/wallet/withdrawals/",
            {"amount_pesewas": amount, "network": "mtn", "momo_number": "024 123 4567"},
            format="json",
        )

    def test_request_moves_money_to_clearing(self):
        response = self.request_withdrawal(5000)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["momo_number"], "+233241234567")
        self.assertEqual(balance(self.agent), 3000)
        self.assertEqual(balance(kind=Wallet.Kind.PAYOUT_CLEARING), 5000)

    def test_more_than_balance_is_402(self):
        response = self.request_withdrawal(9000)
        self.assertEqual(response.status_code, 402)
        self.assertEqual(Withdrawal.objects.count(), 0)
        self.assertEqual(balance(self.agent), 8000)

    def test_reject_returns_money_and_cannot_settle_twice(self):
        withdrawal_id = self.request_withdrawal(5000).data["id"]
        self.client.force_authenticate(self.admin)
        url = f"{API}/admin/withdrawals/{withdrawal_id}"
        self.assertEqual(self.client.post(f"{url}/reject/", {}, format="json").status_code, 400)
        self.assertEqual(
            self.client.post(f"{url}/reject/", {"reason": "Name mismatch"}, format="json").status_code, 200
        )
        self.assertEqual(balance(self.agent), 8000)
        self.assertEqual(
            self.client.post(f"{url}/approve/", {"payout_reference": "MP123"}, format="json").status_code, 409
        )
        assert_ledger_consistent(self)

    def test_approve_pays_out_of_clearing(self):
        withdrawal_id = self.request_withdrawal(5000).data["id"]
        self.client.force_authenticate(self.admin)
        response = self.client.post(
            f"{API}/admin/withdrawals/{withdrawal_id}/approve/", {"payout_reference": "MP123"}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(balance(kind=Wallet.Kind.PAYOUT_CLEARING), 0)
        self.assertEqual(balance(self.agent), 3000)
        assert_ledger_consistent(self)
