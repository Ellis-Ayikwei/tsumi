from django.conf import settings
from rest_framework import serializers

from .models import AgentProfile, User
from .validators import normalize_gh_phone


class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = [
            "kyc_status",
            "kyc_rejection_reason",
            "kyc_submitted_at",
            "kyc_reviewed_at",
            "id_type",
            "vehicle_type",
            "is_available",
        ]
        read_only_fields = [
            "kyc_status",
            "kyc_rejection_reason",
            "kyc_submitted_at",
            "kyc_reviewed_at",
            "id_type",
        ]


class UserSerializer(serializers.ModelSerializer):
    agent_profile = AgentProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "user_type",
            "is_staff",
            "is_active",
            "date_joined",
            "agent_profile",
        ]
        read_only_fields = ["id", "email", "user_type", "is_staff", "is_active", "date_joined"]

    def validate_phone_number(self, value):
        if not value:
            return None
        phone = normalize_gh_phone(value)
        taken = User.objects.filter(phone_number=phone)
        if self.instance:
            taken = taken.exclude(pk=self.instance.pk)
        if taken.exists():
            raise serializers.ValidationError("This phone number is already registered.")
        return phone


class PublicUserSerializer(serializers.ModelSerializer):
    """What other parties to an errand may see: first name and last initial only."""

    display_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "display_name"]

    def get_display_name(self, obj):
        initial = f" {obj.last_name[:1]}." if obj.last_name else ""
        return f"{obj.first_name}{initial}".strip() or "Tsumi user"


class KycSubmitSerializer(serializers.ModelSerializer):
    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}

    id_document = serializers.FileField(required=True)
    selfie = serializers.FileField(required=True)

    class Meta:
        model = AgentProfile
        fields = ["id_type", "id_number", "id_document", "selfie", "vehicle_type"]
        extra_kwargs = {"id_type": {"required": True}, "id_number": {"required": True}}

    def _check_file(self, f):
        if f.size > settings.KYC_MAX_UPLOAD_BYTES:
            raise serializers.ValidationError("File is larger than 5 MB.")
        if getattr(f, "content_type", None) not in self.ALLOWED_TYPES:
            raise serializers.ValidationError("Upload a JPG, PNG, WEBP or PDF file.")
        return f

    def validate_id_document(self, f):
        return self._check_file(f)

    def validate_selfie(self, f):
        return self._check_file(f)
