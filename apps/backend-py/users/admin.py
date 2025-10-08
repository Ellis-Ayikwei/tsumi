from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = [
        "email",
        "full_name",
        "user_type",
        "is_verified",
        "trust_score",
        "created_at",
    ]
    list_filter = ["user_type", "is_verified", "agent_status", "created_at"]
    search_fields = ["email", "phone", "first_name", "last_name"]
    ordering = ["-created_at"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone", "date_of_birth", "address", "profile_photo")}),
        ("User Type", {"fields": ("user_type",)}),
        ("Verification", {"fields": ("is_verified", "email_verified", "phone_verified", "kyc_verified")}),
        ("Trust & Rating", {"fields": ("trust_score", "total_errands", "completed_errands", "average_rating")}),
        ("Agent Info", {"fields": ("agent_status", "id_number", "id_photo")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    readonly_fields = ["created_at", "updated_at", "last_login"]

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "phone", "first_name", "last_name", "user_type", "password1", "password2"),
            },
        ),
    )


