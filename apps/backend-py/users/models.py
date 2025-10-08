from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("user_type", "admin")
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ("customer", "Customer"),
        ("agent", "Tsumi Agent"),
        ("admin", "Admin"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default="customer")
    
    # Verification
    is_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    kyc_verified = models.BooleanField(default=False)
    
    # Profile
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    
    # Trust & Rating
    trust_score = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    total_errands = models.IntegerField(default=0)
    completed_errands = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    
    # Agent-specific
    agent_status = models.CharField(
        max_length=20,
        choices=(
            ("pending", "Pending"),
            ("active", "Active"),
            ("suspended", "Suspended"),
            ("deactivated", "Deactivated"),
        ),
        null=True,
        blank=True,
    )
    id_number = models.CharField(max_length=50, blank=True)
    id_photo = models.ImageField(upload_to="ids/", null=True, blank=True)
    
    # System fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone", "first_name", "last_name"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["phone"]),
            models.Index(fields=["user_type"]),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def update_trust_score(self):
        """Calculate and update trust score based on completion rate and ratings"""
        if self.total_errands > 0:
            completion_rate = self.completed_errands / self.total_errands
            # Trust score = (completion_rate * 0.6) + (average_rating/5 * 0.4)
            self.trust_score = (completion_rate * 0.6) + (float(self.average_rating) / 5.0 * 0.4)
            self.save()


