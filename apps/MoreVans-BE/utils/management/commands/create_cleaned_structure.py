from django.core.management.base import BaseCommand
from django.db import transaction
from apps.Services.models import ServiceCategory, Services
from apps.CommonItems.models import (
    ItemCategory,
    ItemType,
    ItemBrand,
    ItemModel,
    CommonItem,
)
from .data.cleaned_service_structure_v2 import SERVICE_HIERARCHY


class Command(BaseCommand):
    help = "Creates the cleaned and structured item and service hierarchy"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before creating new structure",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            CommonItem.objects.all().delete()
            ItemModel.objects.all().delete()
            ItemBrand.objects.all().delete()
            ItemType.objects.all().delete()
            ItemCategory.objects.all().delete()
            Services.objects.all().delete()
            ServiceCategory.objects.all().delete()
            self.stdout.write("Cleared existing data.")

        self._create_service_categories()
        self._create_services()
        self._create_item_categories()
        self._create_common_items()

    def _create_service_categories(self):
        """Create service categories from the hierarchy"""
        with transaction.atomic():
            for category_name, category_data in SERVICE_HIERARCHY.items():
                # Create slug from name
                slug = category_name.lower().replace(" & ", "-").replace(" ", "-")
                category, created = ServiceCategory.objects.get_or_create(
                    name=category_name,
                    defaults={
                        "slug": slug,
                        "description": category_data["description"],
                        "icon": category_data["icon"],
                        "color": category_data["color"],
                        "tab_color": category_data["tab_color"],
                    },
                )
                if created:
                    self.stdout.write(f"Created service category: {category_name}")

    def _create_services(self):
        """Create services from the hierarchy"""
        with transaction.atomic():
            for category_name, category_data in SERVICE_HIERARCHY.items():
                service_category = ServiceCategory.objects.get(name=category_name)

                for service_name, service_data in category_data["services"].items():
                    service, created = Services.objects.get_or_create(
                        name=service_name,
                        defaults={
                            "description": service_data["description"],
                            "service_category": service_category,
                            "icon": service_data["icon"],
                            "color": service_data["color"],
                        },
                    )
                    if created:
                        self.stdout.write(f"Created service: {service_name}")

    def _create_item_categories(self):
        """Create item categories from the hierarchy"""
        with transaction.atomic():
            for category_name, category_data in SERVICE_HIERARCHY.items():
                for service_name, service_data in category_data["services"].items():
                    service = Services.objects.get(name=service_name)

                    # Handle different service structures
                    if "rooms" in service_data:
                        # Home removals with room structure
                        for room_name, room_data in service_data["rooms"].items():
                            # Create a category for each room
                            self._create_item_category(
                                service, room_name, room_data
                            )
                    elif "items" in service_data:
                        # Direct item structure
                        for item_category_name, item_category_data in service_data[
                            "items"
                        ].items():
                            self._create_item_category(
                                service, item_category_name, item_category_data
                            )

    def _create_item_category(self, service, item_category_name, item_category_data):
        """Create a single item category"""
        category, created = ItemCategory.objects.get_or_create(
            name=item_category_name,
            defaults={
                "description": item_category_data.get("description", ""),
                "icon": item_category_data.get("icon", ""),
                "color": item_category_data.get("color", ""),
                "tab_color": item_category_data.get("tab_color", ""),
                "requires_special_handling": item_category_data.get(
                    "requires_special_handling", False
                ),
                "insurance_required": item_category_data.get(
                    "insurance_required", False
                ),
            },
        )
        if created:
            self.stdout.write(
                f"Created item category: {item_category_name} for {service.name}"
            )

    def _create_common_items(self):
        """Create common items from the hierarchy"""
        with transaction.atomic():
            for category_name, category_data in SERVICE_HIERARCHY.items():
                for service_name, service_data in category_data["services"].items():
                    service = Services.objects.get(name=service_name)

                    # Handle different service structures
                    if "rooms" in service_data:
                        # Home removals with room structure
                        for room_name, room_data in service_data["rooms"].items():
                            # Create items for each room
                            if "items" in room_data:
                                self._create_common_items_for_category(
                                    service,
                                    room_name,
                                    room_data["items"],
                                )
                    elif "items" in service_data:
                        # Direct item structure
                        for item_category_name, item_category_data in service_data[
                            "items"
                        ].items():
                            if "items" in item_category_data:
                                self._create_common_items_for_category(
                                    service,
                                    item_category_name,
                                    item_category_data["items"],
                                )

    def _create_common_items_for_category(
        self, service, item_category_name, specific_items
    ):
        """Create common items for a specific category"""
        try:
            category = ItemCategory.objects.get(name=item_category_name)

            for item_data in specific_items:
                # Handle both string items and object items
                if isinstance(item_data, str):
                    item_name = item_data
                    item_weight = None
                    item_dimensions = None
                    item_description = f"Standard {item_name}"
                else:
                    item_name = item_data["name"]
                    item_weight = item_data.get("weight")
                    item_dimensions = item_data.get("dimensions")
                    item_description = item_data.get("description", f"Standard {item_name}")
                
                item, created = CommonItem.objects.get_or_create(
                    name=item_name,
                    category=category,
                    service=service,
                    defaults={
                        "description": item_description,
                        "weight": item_weight,
                        "dimensions": item_dimensions,
                    },
                )
                if created:
                    self.stdout.write(
                        f"Created item: {item_name} in {item_category_name}"
                    )

        except ItemCategory.DoesNotExist:
            self.stdout.write(
                f"WARNING: Category {item_category_name} not found for service {service.name}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully created cleaned and structured item and service hierarchy!"
            )
        )
