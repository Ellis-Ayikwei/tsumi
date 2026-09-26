import re

from rest_framework.exceptions import ValidationError

_GH_PHONE = re.compile(r"^(?:\+?233|0)(\d{9})$")


def normalize_gh_phone(value: str) -> str:
    """Accept 0241234567, 233241234567 or +233241234567; return +233241234567."""
    match = _GH_PHONE.match(re.sub(r"[\s-]", "", value or ""))
    if not match:
        raise ValidationError("Enter a Ghana phone number like 0241234567.")
    return f"+233{match.group(1)}"
