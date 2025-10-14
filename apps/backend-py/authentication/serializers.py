from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import OTP, UserVerification

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "email",
            "phone",
            "first_name",
            "last_name",
            "password",
            "confirm_password",
            "user_type",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "User with this phone number already exists"
            )
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid credentials")

            if not user.check_password(password):
                raise serializers.ValidationError("Invalid credentials")

            if not user.is_active:
                raise serializers.ValidationError("Account is inactive")

            attrs["user"] = user
            return attrs
        else:
            raise serializers.ValidationError("Must include email and password")


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect password")
        return value


class PasswordRecoverySerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(validators=[validate_password])
    uidb64 = serializers.CharField()
    token = serializers.CharField()


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    otp_type = serializers.ChoiceField(choices=OTP.OTP_TYPES)

    def validate(self, attrs):
        email = attrs.get("email")
        phone_number = attrs.get("phone_number")

        if not email and not phone_number:
            raise serializers.ValidationError(
                "Either email or phone number is required"
            )
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    otp_code = serializers.CharField(max_length=6, min_length=6)
    otp_type = serializers.ChoiceField(choices=OTP.OTP_TYPES)

    def validate_otp_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP code must contain only digits")
        return value

    def validate(self, attrs):
        email = attrs.get("email")
        phone_number = attrs.get("phone_number")

        if not email and not phone_number:
            raise serializers.ValidationError(
                "Either email or phone number is required"
            )
        return attrs


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(required=False)
    otp_type = serializers.ChoiceField(choices=OTP.OTP_TYPES)

    def validate(self, attrs):
        email = attrs.get("email")
        phone_number = attrs.get("phone_number")

        if not email and not phone_number:
            raise serializers.ValidationError(
                "Either email or phone number is required"
            )
        return attrs


class LoginWithOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, min_length=6, required=False)
    request_otp = serializers.BooleanField(default=False)

    def validate_otp_code(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("OTP code must contain only digits")
        return value


class UserAuthSerializer(serializers.ModelSerializer):
    """Serializer for user data in authentication responses"""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "user_type",
            "is_verified",
            "email_verified",
            "phone_verified",
            "kyc_verified",
            "trust_score",
            "total_errands",
            "completed_errands",
            "average_rating",
            "agent_status",
            "created_at",
        )
        read_only_fields = fields
