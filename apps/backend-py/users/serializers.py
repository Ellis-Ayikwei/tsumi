from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "full_name",
            "user_type",
            "is_verified",
            "email_verified",
            "phone_verified",
            "kyc_verified",
            "profile_photo",
            "trust_score",
            "total_errands",
            "completed_errands",
            "average_rating",
            "agent_status",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "trust_score",
            "total_errands",
            "completed_errands",
            "average_rating",
            "created_at",
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "email",
            "phone",
            "first_name",
            "last_name",
            "user_type",
            "password",
            "password_confirm",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AgentKYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id_number", "id_photo", "date_of_birth", "address"]


