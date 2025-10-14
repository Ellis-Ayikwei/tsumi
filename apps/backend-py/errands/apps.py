from django.apps import AppConfig


class ErrandsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "errands"
    verbose_name = "Errands & Tasks"

    def ready(self):
        import errands.signals
