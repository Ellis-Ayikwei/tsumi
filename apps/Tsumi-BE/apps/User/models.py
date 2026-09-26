import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from apps.Basemodel.models import Basemodel


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        user = self.model(email=self.normalize_email(email).lower(), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("user_type", User.UserType.ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """A customer, an agent (runner) or an admin.

    Suspension is `is_active=False`: JWT authentication rejects inactive users,
    so a suspended account is locked out on its next request.
    """

    class UserType(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        AGENT = "agent", "Tsumi Agent"
        ADMIN = "admin", "Admin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    user_type = models.CharField(
        max_length=10, choices=UserType.choices, default=UserType.CUSTOMER, db_index=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return str(self.id)

    @property
    def is_agent(self):
        return self.user_type == self.UserType.AGENT


def kyc_upload_path(instance, filename):
    # Random name: the original filename can contain personal data.
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
    return f"kyc/{instance.user_id}/{uuid.uuid4().hex}.{ext}"


class AgentProfile(Basemodel):
    class KycStatus(models.TextChoices):
        NOT_SUBMITTED = "not_submitted", "Not submitted"
        PENDING = "pending", "Pending review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    class IdType(models.TextChoices):
        GHANA_CARD = "ghana_card", "Ghana Card"
        PASSPORT = "passport", "Passport"
        DRIVERS_LICENSE = "drivers_license", "Driver's License"
        VOTER_ID = "voter_id", "Voter ID"

    class VehicleType(models.TextChoices):
        WALKING = "walking", "On foot"
        BICYCLE = "bicycle", "Bicycle"
        MOTORBIKE = "motorbike", "Motorbike"
        CAR = "car", "Car"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="agent_profile"
    )
    kyc_status = models.CharField(
        max_length=20, choices=KycStatus.choices, default=KycStatus.NOT_SUBMITTED, db_index=True
    )
    kyc_rejection_reason = models.CharField(max_length=500, blank=True)
    kyc_submitted_at = models.DateTimeField(null=True, blank=True)
    kyc_reviewed_at = models.DateTimeField(null=True, blank=True)
    kyc_reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )
    id_type = models.CharField(max_length=20, choices=IdType.choices, blank=True)
    id_number = models.CharField(max_length=50, blank=True)
    id_document = models.FileField(upload_to=kyc_upload_path, null=True, blank=True)
    selfie = models.FileField(upload_to=kyc_upload_path, null=True, blank=True)
    vehicle_type = models.CharField(
        max_length=20, choices=VehicleType.choices, default=VehicleType.MOTORBIKE
    )
    is_available = models.BooleanField(default=False)

    class Meta:
        db_table = "agent_profiles"

    def __str__(self):
        return f"AgentProfile {self.user_id}"

    @property
    def can_take_work(self):
        return self.kyc_status == self.KycStatus.APPROVED and self.user.is_active
