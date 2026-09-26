from django.apps import AppConfig


class AdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.admin"
    label = "custom_admin"  # "admin" is taken by django.contrib.admin
