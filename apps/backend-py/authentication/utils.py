import logging
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import OTP, UserVerification

logger = logging.getLogger(__name__)


def mask_email(email):
    """Mask email for privacy (e.g., j***@example.com)"""
    if not email or "@" not in email:
        return email

    local, domain = email.split("@", 1)
    if len(local) <= 2:
        masked_local = local[0] + "*" * (len(local) - 1)
    else:
        masked_local = local[0] + "*" * (len(local) - 2) + local[-1]

    return f"{masked_local}@{domain}"


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


def increment_failed_logins(email, ip):
    """Increment failed login counter"""
    cache_key = f"failed_logins:{email}:{ip}"
    current_count = cache.get(cache_key, 0)
    cache.set(cache_key, current_count + 1, timeout=3600)  # 1 hour


def is_account_locked(email):
    """Check if account is locked due to too many failed attempts"""
    cache_key = f"failed_logins:{email}:*"
    # This is a simplified check - in production, you'd want more sophisticated logic
    return False


def reset_failed_logins(email):
    """Reset failed login counter"""
    # In production, you'd want to clear all failed login keys for this email
    pass


class OTPValidator:
    """OTP validation and rate limiting utilities"""

    @staticmethod
    def get_rate_limit_key(user, otp_type):
        """Get cache key for rate limiting"""
        return f"otp_rate_limit:{user.id}:{otp_type}"

    @staticmethod
    def get_resend_cooldown_key(user, otp_type):
        """Get cache key for resend cooldown"""
        return f"otp_cooldown:{user.id}:{otp_type}"

    @staticmethod
    def get_hourly_verification_key(user, otp_type):
        """Get cache key for hourly verification limit"""
        return f"otp_hourly_verify:{user.id}:{otp_type}"

    @staticmethod
    def get_otp_verification_key(user, otp_type, otp_id):
        """Get cache key for OTP verification attempts"""
        return f"otp_verify_attempts:{user.id}:{otp_type}:{otp_id}"

    @staticmethod
    def get_global_email_stats():
        """Get global email sending statistics"""
        return {"current_count": 0, "limit": 1000, "reset_time": timezone.now()}

    @staticmethod
    def reset_global_email_limit():
        """Reset global email sending limit"""
        pass


def send_otp_utility(user, otp_type, email, admin_override=False, admin_user=None):
    """Send OTP to user's email"""
    try:
        # Check rate limiting (unless admin override)
        if not admin_override:
            rate_limit_key = OTPValidator.get_rate_limit_key(user, otp_type)
            current_count = cache.get(rate_limit_key, 0)
            if current_count >= 5:  # Max 5 OTPs per hour
                return {
                    "success": False,
                    "message": "Rate limit exceeded. Please wait before requesting another OTP.",
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "status_code": 429,
                }

        # Generate OTP
        otp = OTP.generate_otp(user, otp_type, validity_minutes=10)

        # Send email
        subject = f"Tsumi Verification Code - {otp.otp_code}"
        message = f"""
        Your Tsumi verification code is: {otp.otp_code}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        The Tsumi Team
        """

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            # Update rate limiting
            if not admin_override:
                cache.set(rate_limit_key, current_count + 1, timeout=3600)

            logger.info(
                f"OTP sent successfully to {mask_email(email)} for user {user.id}"
            )

            return {
                "success": True,
                "message": "OTP sent successfully",
                "masked_email": mask_email(email),
                "validity_minutes": 10,
            }

        except Exception as e:
            logger.error(f"Failed to send OTP email: {str(e)}")
            return {
                "success": False,
                "message": "Failed to send verification email. Please try again.",
                "error_code": "EMAIL_SEND_FAILED",
                "status_code": 503,
            }

    except Exception as e:
        logger.error(f"Error in send_otp_utility: {str(e)}")
        return {
            "success": False,
            "message": "Failed to send OTP. Please try again.",
            "error_code": "SEND_FAILED",
        }


def verify_otp_utility(user, otp_code, otp_type, admin_override=False, admin_user=None):
    """Verify OTP code"""
    try:
        # Validate OTP format
        if not otp_code or not otp_code.isdigit() or len(otp_code) != 6:
            return {
                "success": False,
                "message": "Invalid OTP format. Please enter a 6-digit code.",
                "error_code": "INVALID_FORMAT",
            }

        # Find valid OTP
        current_time = timezone.now()
        otp = OTP.objects.filter(
            user=user,
            otp_type=otp_type,
            otp_code=otp_code,
            is_used=False,
            expires_at__gt=current_time,
        ).first()

        if not otp:
            return {
                "success": False,
                "message": "Invalid or expired OTP code.",
                "error_code": "OTP_NOT_FOUND",
            }

        # Check if OTP is expired
        if otp.expires_at <= current_time:
            return {
                "success": False,
                "message": "OTP code has expired. Please request a new one.",
                "error_code": "OTP_EXPIRED",
            }

        # Check attempts (unless admin override)
        if not admin_override and otp.attempts >= otp.max_attempts:
            return {
                "success": False,
                "message": "Maximum verification attempts exceeded. Please request a new OTP.",
                "error_code": "MAX_ATTEMPTS_EXCEEDED",
            }

        # Verify OTP
        if otp.otp_code == otp_code:
            otp.is_used = True
            otp.save()

            logger.info(f"OTP verified successfully for user {user.id}")

            return {
                "success": True,
                "message": "OTP verified successfully",
                "action": "verified",
            }
        else:
            # Increment attempts
            otp.attempts += 1
            otp.save()

            remaining_attempts = otp.max_attempts - otp.attempts

            return {
                "success": False,
                "message": f"Invalid OTP code. {remaining_attempts} attempts remaining.",
                "error_code": "INVALID_OTP",
                "remaining_attempts": remaining_attempts,
            }

    except Exception as e:
        logger.error(f"Error in verify_otp_utility: {str(e)}")
        return {
            "success": False,
            "message": "Failed to verify OTP. Please try again.",
            "error_code": "VERIFICATION_FAILED",
        }
