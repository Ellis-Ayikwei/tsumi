from rest_framework.test import APITestCase

from apps.errand.tests import API, make_user
from apps.trust.models import TrustBadge, UserBadge
from apps.User.models import AgentProfile, User


class AdminPermissionTests(APITestCase):
    def test_non_staff_forbidden(self):
        self.client.force_authenticate(make_user("plain@example.test"))
        for path in ("stats/", "users/", "errands/", "disputes/", "withdrawals/", "ledger/"):
            self.assertEqual(self.client.get(f"{API}/admin/{path}").status_code, 403, path)

    def test_anonymous_unauthenticated(self):
        response = self.client.get(f"{API}/admin/stats/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["error"]["code"], "authentication_required")


class AdminKycAndSuspensionTests(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@example.test", is_staff=True)
        self.agent = make_user("runner@example.test", User.UserType.AGENT, kyc=AgentProfile.KycStatus.PENDING)
        TrustBadge.objects.create(code="verified-id", name="Verified ID", description="x", requires_kyc=True)
        self.client.force_authenticate(self.admin)

    def test_reject_requires_reason(self):
        response = self.client.post(f"{API}/admin/users/{self.agent.id}/kyc/", {"decision": "reject"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["details"][0]["field"], "reason")

    def test_approve_awards_verified_badge_and_only_once(self):
        url = f"{API}/admin/users/{self.agent.id}/kyc/"
        response = self.client.post(url, {"decision": "approve"}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["agent_profile"]["kyc_status"], "approved")
        self.assertTrue(UserBadge.objects.filter(user=self.agent, badge__code="verified-id").exists())
        self.assertEqual(self.client.post(url, {"decision": "approve"}, format="json").status_code, 400)

    def test_suspended_user_cannot_log_in(self):
        self.assertEqual(self.client.post(f"{API}/admin/users/{self.agent.id}/suspend/").status_code, 200)
        self.client.force_authenticate(None)
        response = self.client.post(
            f"{API}/auth/login/", {"email": "runner@example.test", "password": "Str0ng-pass!"}, format="json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("suspended", response.data["error"]["message"])

    def test_admin_cannot_suspend_self(self):
        self.assertEqual(self.client.post(f"{API}/admin/users/{self.admin.id}/suspend/").status_code, 403)

    def test_stats_shape(self):
        response = self.client.get(f"{API}/admin/stats/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["agents_pending_kyc"], 1)


class AuthTests(APITestCase):
    def test_register_login_and_me(self):
        response = self.client.post(
            f"{API}/auth/register/",
            {
                "email": "New@Example.test",
                "password": "Str0ng-pass!",
                "first_name": "Ama",
                "last_name": "Mensah",
                "phone_number": "0241234567",
                "user_type": "agent",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["user"]["email"], "new@example.test")
        self.assertEqual(response.data["user"]["phone_number"], "+233241234567")
        self.assertEqual(response.data["user"]["agent_profile"]["kyc_status"], "not_submitted")
        login = self.client.post(
            f"{API}/auth/login/", {"email": "new@example.test", "password": "Str0ng-pass!"}, format="json"
        )
        self.assertEqual(login.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(self.client.get(f"{API}/auth/user/").data["first_name"], "Ama")

    def test_duplicate_email_rejected(self):
        make_user("taken@example.test")
        response = self.client.post(
            f"{API}/auth/register/",
            {"email": "taken@example.test", "password": "Str0ng-pass!", "first_name": "A", "last_name": "B"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"]["details"][0]["field"], "email")

    def test_wrong_password(self):
        make_user("who@example.test")
        response = self.client.post(
            f"{API}/auth/login/", {"email": "who@example.test", "password": "nope"}, format="json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["error"]["code"], "invalid_credentials")
