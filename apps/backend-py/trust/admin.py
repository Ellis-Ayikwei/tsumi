from django.contrib import admin
from .models import TrustBadge, UserBadge


@admin.register(TrustBadge)
class TrustBadgeAdmin(admin.ModelAdmin):
    list_display = ["icon", "name", "category", "min_errands", "min_rating", "is_active"]
    list_filter = ["category", "is_active", "requires_kyc", "requires_admin_approval"]
    search_fields = ["name", "description"]


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ["user", "badge", "earned_at", "verified_by"]
    list_filter = ["badge__category", "earned_at"]
    search_fields = ["user__email", "badge__name"]
    readonly_fields = ["earned_at"]


