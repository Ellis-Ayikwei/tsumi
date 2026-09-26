"""Thin Paystack client. Every call has a timeout; any failure raises
PaymentProviderError so callers never mistake an outage for a result."""

import hashlib
import hmac
import logging

import requests
from django.conf import settings

from backend.api_exceptions import PaymentProviderError, PaymentsNotConfigured

logger = logging.getLogger(__name__)


def _request(method, path, **kwargs):
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaymentsNotConfigured()
    try:
        response = requests.request(
            method,
            f"{settings.PAYSTACK_BASE_URL}{path}",
            headers={"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}"},
            timeout=settings.PAYSTACK_TIMEOUT_SECONDS,
            **kwargs,
        )
        body = response.json()
    except (requests.RequestException, ValueError):
        logger.warning("Paystack %s %s failed", method, path, exc_info=True)
        raise PaymentProviderError()
    if not response.ok or not body.get("status"):
        logger.warning("Paystack %s %s returned HTTP %s", method, path, response.status_code)
        raise PaymentProviderError()
    return body["data"]


def initialize_transaction(*, email, amount_pesewas, reference, callback_url):
    """Returns Paystack's authorization_url for the customer to complete payment."""
    data = _request(
        "POST",
        "/transaction/initialize",
        json={
            "email": email,
            "amount": amount_pesewas,  # Paystack takes GHS in pesewas
            "currency": settings.TSUMI_CURRENCY,
            "reference": reference,
            "callback_url": callback_url,
            "channels": ["mobile_money", "card"],
        },
    )
    return data["authorization_url"]


def verify_transaction(reference):
    """Returns Paystack's transaction data: status, amount (pesewas), currency."""
    return _request("GET", f"/transaction/verify/{reference}")


def signature_is_valid(raw_body: bytes, signature: str) -> bool:
    if not settings.PAYSTACK_SECRET_KEY or not signature:
        return False
    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode(), raw_body, hashlib.sha512
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
