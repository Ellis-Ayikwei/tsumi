from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer, AgentKYCSerializer
from authentication.utils import send_otp_utility
from notifications.services import NotificationService


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ["create", "register"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint with OTP verification"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send OTP for email verification
            otp_result = send_otp_utility(user, "signup", user.email)

            if otp_result["success"]:
                # Send welcome notification
                NotificationService.create_notification(
                    user=user,
                    notification_type="account_verified",
                    title="Welcome to Tsumi!",
                    message="Your account has been created successfully. Please verify your email to get started.",
                    priority="normal",
                )

                return Response(
                    {
                        "message": "User registered successfully. Please check your email for verification code.",
                        "user": UserSerializer(user).data,
                        "otp_sent": True,
                        "masked_email": otp_result.get("masked_email"),
                        "validity_minutes": otp_result.get("validity_minutes"),
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {
                        "message": "User registered but failed to send verification email. Please request a new OTP.",
                        "user": UserSerializer(user).data,
                        "otp_sent": False,
                        "error_code": otp_result.get("error_code", "OTP_SEND_FAILED"),
                    },
                    status=status.HTTP_201_CREATED,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def submit_kyc(self, request, pk=None):
        """Submit KYC documents for agent verification"""
        user = self.get_object()
        if user.user_type != "agent":
            return Response(
                {"error": "Only agents can submit KYC"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AgentKYCSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Send notification to admin about KYC submission
            # Note: In a real app, you'd get admin users and notify them
            NotificationService.create_notification(
                user=user,
                notification_type="agent_kyc_submitted",
                title="KYC Documents Submitted",
                message="Your KYC documents have been submitted and are under review.",
                priority="normal",
            )

            return Response(
                {"message": "KYC submitted successfully. Awaiting admin verification."}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def resend_verification(self, request):
        """Resend email verification OTP"""
        user = request.user
        if user.email_verified:
            return Response(
                {"error": "Email is already verified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp_result = send_otp_utility(user, "signup", user.email)

        if otp_result["success"]:
            return Response(
                {
                    "message": "Verification email sent successfully",
                    "masked_email": otp_result.get("masked_email"),
                    "validity_minutes": otp_result.get("validity_minutes"),
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "message": "Failed to send verification email",
                    "error_code": otp_result.get("error_code", "OTP_SEND_FAILED"),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def notifications(self, request):
        """Get user's notifications"""
        from notifications.services import NotificationService

        unread_only = request.query_params.get("unread_only", "false").lower() == "true"
        limit = int(request.query_params.get("limit", 20))

        notifications = NotificationService.get_user_notifications(
            request.user, unread_only=unread_only, limit=limit
        )

        from notifications.serializers import NotificationSerializer

        serializer = NotificationSerializer(notifications, many=True)

        return Response(
            {
                "notifications": serializer.data,
                "unread_count": NotificationService.get_unread_count(request.user),
            }
        )
