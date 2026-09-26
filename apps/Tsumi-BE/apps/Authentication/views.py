from django.contrib.auth import authenticate
from django.db import IntegrityError, transaction
from rest_framework import generics, permissions, status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.User.models import AgentProfile, User
from apps.User.serializer import UserSerializer
from apps.wallet.services import user_wallet

from .serializer import (
    LoginSerializer,
    LogoutSerializer,
    PasswordChangeSerializer,
    RegisterSerializer,
)


def token_response(user, status_code=status.HTTP_200_OK):
    refresh = RefreshToken.for_user(user)
    # Copied into every access token; apps/backend-node reads user_type.
    refresh["user_type"] = user.user_type
    return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        },
        status=status_code,
    )


class AuthThrottleMixin:
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


class RegisterView(AuthThrottleMixin, APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    email=data["email"],
                    password=data["password"],
                    first_name=data["first_name"],
                    last_name=data["last_name"],
                    phone_number=data.get("phone_number"),
                    user_type=data["user_type"],
                )
                user_wallet(user.id)
                if user.is_agent:
                    AgentProfile.objects.create(user=user)
        except IntegrityError:
            # Two sign-ups racing for the same email or phone.
            raise ValidationError({"email": "An account with this email or phone already exists."})
        return token_response(user, status.HTTP_201_CREATED)


class LoginView(AuthThrottleMixin, APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]
        user = authenticate(request, username=email, password=password)
        if user is None:
            suspended = User.objects.filter(email=email, is_active=False).first()
            if suspended and suspended.check_password(password):
                raise AuthenticationFailed("This account is suspended. Contact support@tsumi.app.")
            raise AuthenticationFailed("Email or password is incorrect.")
        return token_response(user)


class LogoutView(APIView):
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            if str(token["user_id"]) != str(request.user.id):
                raise ValidationError({"refresh": "This token belongs to another account."})
            token.blacklist()
        except TokenError:
            pass  # already expired or blacklisted: the session is over either way
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return User.objects.select_related("agent_profile").get(pk=self.request.user.pk)


class PasswordChangeView(APIView):
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response(status=status.HTTP_204_NO_CONTENT)
