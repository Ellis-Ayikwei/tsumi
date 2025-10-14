import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordRecoverySerializer,
    PasswordResetConfirmSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer,
    LoginWithOTPSerializer,
    UserAuthSerializer,
)
from .utils import (
    mask_email,
    get_client_ip,
    increment_failed_logins,
    is_account_locked,
    reset_failed_logins,
    send_otp_utility,
    verify_otp_utility,
)
from .models import OTP, UserVerification

User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()

                # Generate and send OTP for email verification
                otp_result = send_otp_utility(user, "signup", user.email)

                if otp_result["success"]:
                    return Response(
                        {
                            "success": True,
                            "message": "User created successfully. Please check your email for verification code.",
                            "email": otp_result.get("masked_email"),
                            "user_id": str(user.id),
                            "otp_sent": True,
                            "validity_minutes": otp_result.get("validity_minutes"),
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {
                            "message": "User created but failed to send verification email. Please request a new OTP.",
                            "user_id": str(user.id),
                            "otp_sent": False,
                            "error_code": otp_result.get(
                                "error_code", "OTP_SEND_FAILED"
                            ),
                        },
                        status=status.HTTP_201_CREATED,
                    )
            else:
                return Response(
                    {
                        "message": "Registration failed due to validation errors.",
                        "error_code": "VALIDATION_ERROR",
                        "errors": serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"User registration error: {str(e)}")
            return Response(
                {
                    "message": "Registration failed due to a server error. Please try again later.",
                    "error_code": "INTERNAL_SERVER_ERROR",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})

        try:
            if not serializer.is_valid():
                # Log failed login attempt
                ip = get_client_ip(request)
                email = request.data.get("email", "unknown")
                logger.warning(f"Failed login attempt for {email} from IP {ip}")
                increment_failed_logins(email, ip)
                return Response(
                    {"detail": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            user = serializer.validated_data["user"]

            # Check if account is locked
            if is_account_locked(user.email):
                return Response(
                    {
                        "detail": "Account temporarily locked. Try again later or reset your password."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Record successful login
            ip = get_client_ip(request)
            logger.info(f"Successful login for user {user.id} from IP {ip}")
            reset_failed_logins(user.email)

            # Update last login timestamp
            user.last_login = timezone.now()
            user.save()

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Create response with user data
            response = Response({"user": UserAuthSerializer(user).data})

            # Add tokens to response headers
            response["Authorization"] = f"Bearer {access_token}"
            response["X-Refresh-Token"] = refresh_token
            response["Access-Control-Expose-Headers"] = "Authorization, X-Refresh-Token"

            return response

        except Exception as e:
            logger.exception(f"Login error: {str(e)}")
            return Response(
                {"detail": "Authentication failed. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Get the authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(
                {"detail": "No valid token provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Extract the token
            token = auth_header.split(" ")[1]

            # Use JWT's built-in blacklisting mechanism
            from rest_framework_simplejwt.tokens import AccessToken
            from rest_framework_simplejwt.token_blacklist.models import (
                BlacklistedToken,
                OutstandingToken,
            )

            # Decode the token to get user info
            from rest_framework_simplejwt.backends import TokenBackend
            from rest_framework_simplejwt.settings import api_settings

            token_backend = TokenBackend(algorithm=api_settings.ALGORITHM)
            token_data = token_backend.decode(token, verify=False)

            # Find the outstanding token and blacklist it
            try:
                outstanding_token = OutstandingToken.objects.get(
                    jti=token_data.get("jti"), user_id=token_data.get("user_id")
                )
                BlacklistedToken.objects.create(token=outstanding_token)
            except OutstandingToken.DoesNotExist:
                pass

            return Response(
                {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response(
                {"detail": "Logout failed. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordRecoveryAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # For security, don't reveal if user exists or not
            return Response(
                {
                    "detail": "If an account exists, a password reset email has been sent."
                },
                status=status.HTTP_200_OK,
            )

        # Generate password reset token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        frontend_base_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
        frontend_url = f"{frontend_base_url}/reset-password/{uidb64}/{token}"

        # Send password reset email
        try:
            send_mail(
                subject="Tsumi Password Reset Request",
                message=f"Click the following link to reset your password: {frontend_url}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response(
                {"detail": "Password reset email sent successfully."},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            return Response(
                {"detail": "Failed to send password reset email. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PasswordResetConfirmAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uidb64, token):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get uidb64 and token from the validated data
        uidb64 = serializer.validated_data["uidb64"]
        token = serializer.validated_data["token"]

        try:
            # Decode user ID
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)

            # Verify token
            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                return Response(
                    {"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(serializer.validated_data["password"])
            user.save()

            return Response(
                {"detail": "Password reset successfully."}, status=status.HTTP_200_OK
            )

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST
            )


class PasswordChangeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        # Check old password
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Set new password
        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"detail": "Password updated successfully."}, status=status.HTTP_200_OK
        )


class SendOTPView(APIView):
    """Send OTP to user's email"""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get("email")
        phone_number = serializer.validated_data.get("phone_number")
        otp_type = serializer.validated_data["otp_type"]

        try:
            # Get user based on email or phone
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response(
                        {
                            "message": "User not found with this email address.",
                            "error_code": "USER_NOT_FOUND",
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            elif phone_number:
                try:
                    user = User.objects.get(phone=phone_number)
                except User.DoesNotExist:
                    return Response(
                        {
                            "message": "User not found with this phone number.",
                            "error_code": "USER_NOT_FOUND",
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                return Response(
                    {
                        "message": "Either email or phone number is required.",
                        "error_code": "MISSING_CONTACT",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Send OTP
            result = send_otp_utility(user, otp_type, user.email)

            if result["success"]:
                return Response(
                    {
                        "message": result["message"],
                        "masked_email": result.get("masked_email"),
                        "validity_minutes": result.get("validity_minutes"),
                        "otp_type": otp_type,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {
                        "message": result["message"],
                        "error_code": result.get("error_code", "UNKNOWN_ERROR"),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"Error in SendOTPView: {str(e)}")
            return Response(
                {
                    "message": "Failed to send OTP. Please try again.",
                    "error_code": "SEND_FAILED",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyOTPView(APIView):
    """Verify OTP and perform action based on type"""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get("email")
        phone_number = serializer.validated_data.get("phone_number")
        otp_code = serializer.validated_data["otp_code"]
        otp_type = serializer.validated_data["otp_type"]

        try:
            # Get user based on email or phone
            if email:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response(
                        {
                            "message": "User not found with this email address.",
                            "error_code": "USER_NOT_FOUND",
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            elif phone_number:
                try:
                    user = User.objects.get(phone=phone_number)
                except User.DoesNotExist:
                    return Response(
                        {
                            "message": "User not found with this phone number.",
                            "error_code": "USER_NOT_FOUND",
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                return Response(
                    {
                        "message": "Either email or phone number is required.",
                        "error_code": "MISSING_CONTACT",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Verify OTP
            result = verify_otp_utility(user, otp_code, otp_type)

            if result["success"]:
                response_data = {
                    "message": result["message"],
                    "action": result.get("action"),
                    "user_id": str(user.id),
                }

                # Handle different OTP types
                if otp_type == "signup":
                    # Activate user account
                    user.is_active = True
                    user.email_verified = True
                    user.save()

                    # Update verification status
                    verification, created = UserVerification.objects.get_or_create(
                        user=user,
                        defaults={
                            "email_verified": True,
                            "email_verified_at": timezone.now(),
                        },
                    )
                    if not created:
                        verification.email_verified = True
                        verification.email_verified_at = timezone.now()
                        verification.save()

                    response_data["message"] = (
                        "Email verified successfully. Your account is now active."
                    )

                elif otp_type == "login":
                    # Generate JWT tokens for login
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    refresh_token = str(refresh)

                    response_data.update({"user": UserAuthSerializer(user).data})

                    # Create response with user data
                    response = Response(response_data, status=status.HTTP_200_OK)

                    # Add tokens to response headers
                    response["Authorization"] = f"Bearer {access_token}"
                    response["X-Refresh-Token"] = refresh_token
                    response["Access-Control-Expose-Headers"] = (
                        "Authorization, X-Refresh-Token"
                    )

                    return response

                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {
                        "message": result["message"],
                        "error_code": result.get("error_code", "UNKNOWN_ERROR"),
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            logger.error(f"Error in VerifyOTPView: {str(e)}")
            return Response(
                {
                    "message": "Failed to verify OTP. Please try again.",
                    "error_code": "VERIFICATION_FAILED",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LoginWithOTPView(APIView):
    """Login with OTP (passwordless login)"""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = LoginWithOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data.get("otp_code")
        request_otp = serializer.validated_data.get("request_otp", False)

        try:
            # Get user
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {
                        "message": "User not found with this email address.",
                        "error_code": "USER_NOT_FOUND",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            # If requesting OTP
            if request_otp or not otp_code:
                result = send_otp_utility(user, "login", user.email)

                if result["success"]:
                    return Response(
                        {
                            "message": result["message"],
                            "masked_email": result.get("masked_email"),
                            "validity_minutes": result.get("validity_minutes"),
                            "next_step": "verify_otp",
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {
                            "message": result["message"],
                            "error_code": result.get("error_code", "UNKNOWN_ERROR"),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # If verifying OTP
            if otp_code:
                result = verify_otp_utility(user, otp_code, "login")

                if result["success"]:
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    refresh_token = str(refresh)

                    # Create response with user data
                    response = Response(
                        {
                            "message": "Login successful.",
                            "user": UserAuthSerializer(user).data,
                        },
                        status=status.HTTP_200_OK,
                    )

                    # Add tokens to response headers
                    response["Authorization"] = f"Bearer {access_token}"
                    response["X-Refresh-Token"] = refresh_token
                    response["Access-Control-Expose-Headers"] = (
                        "Authorization, X-Refresh-Token"
                    )

                    return response
                else:
                    return Response(
                        {
                            "message": result["message"],
                            "error_code": result.get("error_code", "UNKNOWN_ERROR"),
                            "remaining_attempts": result.get("remaining_attempts"),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        except Exception as e:
            logger.error(f"Error in LoginWithOTPView: {str(e)}")
            return Response(
                {
                    "message": "Failed to process login request. Please try again.",
                    "error_code": "LOGIN_FAILED",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
