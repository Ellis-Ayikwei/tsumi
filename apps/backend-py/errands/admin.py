from django.contrib import admin
from .models import Errand, ErrandRating


@admin.register(Errand)
class ErrandAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "customer",
        "agent",
        "errand_type",
        "status",
        "amount",
        "created_at",
    ]
    list_filter = ["status", "errand_type", "payment_status", "created_at"]
    search_fields = ["title", "customer__email", "agent__email"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(ErrandRating)
class ErrandRatingAdmin(admin.ModelAdmin):
    list_display = ["errand", "rated_by", "rated_user", "rating", "created_at"]
    list_filter = ["rating", "created_at"]
    readonly_fields = ["id", "created_at"]


