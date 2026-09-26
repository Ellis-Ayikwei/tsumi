"""Single API error envelope.

Every non-2xx response from the API is normalized to:

    {
      "success": false,
      "error": {
        "code": "<stable machine-readable code>",
        "message": "<human summary>",
        "details": [{"field": "<dotted.path>", "issue": "<message>"}, ...],
        "meta": { ... }          # optional extras, e.g. shortfall_pesewas
      }
    }

Clients branch on error.code. Raw DRF error dicts, Django exception text and
tracebacks are never exposed.
"""

import logging

from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    NotFound,
    PermissionDenied,
    Throttled,
    ValidationError,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)

_NON_FIELD = {"non_field_errors", "detail", "", None}

_CODE_BY_STATUS = {
    status.HTTP_400_BAD_REQUEST: "validation_error",
    status.HTTP_401_UNAUTHORIZED: "authentication_required",
    status.HTTP_402_PAYMENT_REQUIRED: "insufficient_funds",
    status.HTTP_403_FORBIDDEN: "permission_denied",
    status.HTTP_404_NOT_FOUND: "not_found",
    status.HTTP_409_CONFLICT: "conflict",
    status.HTTP_429_TOO_MANY_REQUESTS: "rate_limit_exceeded",
    status.HTTP_502_BAD_GATEWAY: "payment_provider_error",
    status.HTTP_503_SERVICE_UNAVAILABLE: "service_unavailable",
}


def _error_code(exc, status_code):
    explicit = getattr(exc, "error_code", None)
    if explicit:
        return explicit
    if isinstance(exc, Throttled):
        return "rate_limit_exceeded"
    if isinstance(exc, AuthenticationFailed):
        return "invalid_credentials"
    if isinstance(exc, NotAuthenticated):
        return "authentication_required"
    if isinstance(exc, PermissionDenied):
        return "permission_denied"
    if isinstance(exc, (NotFound, Http404)):
        return "not_found"
    if isinstance(exc, ValidationError):
        return "validation_error"
    return _CODE_BY_STATUS.get(status_code, "api_error")


def _flatten(detail, prefix=""):
    """Flatten DRF's nested error detail into [{field, issue}] with dotted paths."""
    out = []
    if isinstance(detail, dict):
        for key, value in detail.items():
            path = f"{prefix}.{key}" if prefix else str(key)
            out.extend(_flatten(value, path))
    elif isinstance(detail, (list, tuple)):
        for item in detail:
            out.extend(_flatten(item, prefix))
    else:
        out.append({"field": prefix or "non_field_errors", "issue": str(detail)})
    return out


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.exception("Unhandled API exception")
        return Response(
            {
                "success": False,
                "error": {
                    "code": "internal_error",
                    "message": "An unexpected server error occurred.",
                    "details": [],
                },
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    details = _flatten(getattr(exc, "detail", response.data))
    if details:
        first = details[0]
        message = (
            first["issue"]
            if first["field"] in _NON_FIELD
            else f"{first['field']}: {first['issue']}"
        )
    else:
        message = "Request could not be processed."

    error = {
        "code": _error_code(exc, response.status_code),
        "message": message,
        "details": details,
    }
    meta = dict(getattr(exc, "extra_meta", None) or {})
    if isinstance(exc, Throttled) and exc.wait:
        meta["retry_after"] = int(exc.wait)
    if meta:
        error["meta"] = meta

    response.data = {"success": False, "error": error}
    return response
