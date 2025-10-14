from django.contrib import admin
from .models import OTP, UserVerification


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "otp_type",
        "otp_code",
        "is_used",
        "expires_at",
        "attempts",
        "created_at",
    ]
    list_filter = ["otp_type", "is_used", "created_at"]
    search_fields = ["user__email", "user__phone", "otp_code"]
    readonly_fields = ["otp_code", "created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(UserVerification)
class UserVerificationAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "email_verified",
        "phone_verified",
        "email_verified_at",
        "phone_verified_at",
        "created_at",
    ]
    list_filter = ["email_verified", "phone_verified", "created_at"]
    search_fields = ["user__email", "user__phone"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")
