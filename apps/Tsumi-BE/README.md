# Tsumi-BE

Django REST API for Tsumi. Layout mirrors ScrubiMail-BE:

```
backend/        settings, urls, celery, error envelope, test_settings
apps/
  Basemodel/    abstract model: UUID id, created_at, updated_at
  User/         User (customer | agent | admin), AgentProfile (KYC), /agents/ endpoints
  Authentication/  register, login, refresh, logout, me, change password (JWT)
  wallet/       Wallet, LedgerEntry, Deposit (Paystack), Withdrawal (manual MoMo payout)
  errand/       Errand, ErrandEvent, EscrowHold, Rating, pricing rule, lifecycle service
  dispute/      Dispute open/resolve
  trust/        TrustBadge, UserBadge, `seed_badges` command
  notification/ in-app notifications
  admin/        staff-only API used by apps/Tsumi-Admin-FE (label custom_admin)
  ApiConnectionStatus/  `/` liveness and `/health/` readiness
```

## Run locally

```bash
cd apps/Tsumi-BE
cp .env.example .env
python -m venv .venv && source .venv/Scripts/activate   # Windows Git Bash; bin/activate elsewhere
pip install -r requirements.txt
python manage.py makemigrations User wallet errand trust dispute notification
python manage.py migrate
python manage.py seed_badges
python manage.py createsuperuser
python manage.py runserver
```

Tests (SQLite in memory, no Redis or Postgres needed; migrations must exist):

```bash
python manage.py test --settings=backend.test_settings
```

## Money

Every amount is an integer number of pesewas, named `*_pesewas`. The commission
rate is in basis points (`TSUMI_COMMISSION_BPS`, 1500 = 15%) and is frozen on each
errand when it is created. Commission is floored to the pesewa and the agent gets
the remainder (`apps/errand/pricing.py`).

Balances only change in `apps/wallet/services.py`. Each change writes a ledger
line in the same transaction, so `wallet.balance_pesewas == SUM(entries.amount_pesewas)`
always holds. System wallets: `escrow`, `platform`, `payout_clearing`.

Flow: create errand (customer wallet -> escrow) -> accept -> start -> deliver ->
confirm (escrow -> agent payout + platform commission). Cancel or a dispute
refund returns the full price from escrow to the customer.

## API

Prefix `/tsumi/api/v1/`. Errors always use
`{"success": false, "error": {"code", "message", "details", "meta"}}`.
Codes: `validation_error`, `authentication_required`, `invalid_credentials`,
`permission_denied`, `not_found`, `conflict` (someone else acted first or an
illegal status change), `insufficient_funds` (meta has `shortfall_pesewas`),
`payment_provider_error`, `payments_not_configured`, `rate_limit_exceeded`.

Public endpoints (everything else requires a JWT):
`POST auth/register/`, `POST auth/login/`, `POST auth/refresh_token/`,
`POST wallet/paystack/webhook/` (HMAC signature), `GET /`, `GET /health/`.

| Area | Endpoints |
|---|---|
| Auth | `auth/register/`, `auth/login/`, `auth/refresh_token/`, `auth/logout/`, `auth/user/` (GET/PATCH), `auth/change-password/` |
| Agents | `agents/me/` (GET/PATCH availability, vehicle), `agents/me/kyc/` (POST multipart) |
| Errands | `errands/` (GET, POST), `errands/<id>/`, `errands/<id>/accept|release|start|deliver|confirm|cancel|rate/` |
| Wallet | `wallet/`, `wallet/ledger/`, `wallet/deposits/`, `wallet/deposits/<reference>/`, `wallet/withdrawals/` |
| Disputes | `disputes/` (GET, POST) |
| Notifications | `notifications/`, `notifications/<id>/read/`, `notifications/read-all/` |
| Trust | `trust/badges/`, `trust/users/<id>/badges/` |
| Admin (staff) | `admin/stats/`, `admin/users/...`, `admin/errands/...`, `admin/disputes/...`, `admin/withdrawals/...`, `admin/ledger/`, `admin/badges/` |

Background: `celery -A backend worker` and one `celery -A backend beat`
(reconciles Paystack deposits whose webhook never arrived, every 10 minutes).
