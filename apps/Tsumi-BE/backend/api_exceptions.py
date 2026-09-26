"""Custom DRF API exceptions.

Views and services raise these instead of hand-building error responses, so
every error flows through custom_exception_handler and the single envelope.
"""

from rest_framework import status
from rest_framework.exceptions import APIException


class Conflict(APIException):
    """The record is not in a state that allows this action (someone else acted first)."""

    status_code = status.HTTP_409_CONFLICT
    default_detail = "This record changed. Refresh and try again."
    error_code = "conflict"


class InsufficientFunds(APIException):
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_detail = "Your wallet balance is too low for this action."
    error_code = "insufficient_funds"

    def __init__(self, required_pesewas, balance_pesewas):
        super().__init__()
        self.extra_meta = {
            "required_pesewas": required_pesewas,
            "balance_pesewas": balance_pesewas,
            "shortfall_pesewas": max(required_pesewas - balance_pesewas, 0),
        }


class PaymentProviderError(APIException):
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "The payment provider did not respond. No money was taken. Try again."
    error_code = "payment_provider_error"


class PaymentsNotConfigured(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Online payments are not configured on this server."
    error_code = "payments_not_configured"
