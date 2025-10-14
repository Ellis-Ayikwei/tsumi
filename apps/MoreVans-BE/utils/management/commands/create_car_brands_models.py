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
from .data.car_brands_models import CAR_BRANDS_AND_MODELS


class Command(BaseCommand):
    help = "Creates car brands and their models with dimensions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing car data before creating new structure",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing car data...")
            # Clear only car-related data
            CommonItem.objects.filter(
                service__name="Car Transport"
            ).delete()
            ItemModel.objects.filter(
                brand__category__name="Car Brands"
            ).delete()
            ItemBrand.objects.filter(
                category__name="Car Brands"
            ).delete()
            self.stdout.write("Cleared existing car data.")

        self._create_car_brands_and_models()

    def _create_car_brands_and_models(self):
        """Create car brands and their models"""
        with transaction.atomic():
            try:
                # Get the Car Transport service
                car_service = Services.objects.get(name="Car Transport")
                
                # Get or create the "Car Brands" category
                car_brands_category, created = ItemCategory.objects.get_or_create(
                    name="Car Brands",
                    defaults={
                        "description": "Car manufacturers and their models",
                        "icon": "IconCar",
                        "color": "bg-slate-100 text-slate-800",
                        "tab_color": "bg-slate-500 text-slate-100",
                    }
                )
                
                if created:
                    self.stdout.write("Created Car Brands category")
                
                for brand_name, brand_data in CAR_BRANDS_AND_MODELS.items():
                    # Create brand
                    brand, created = ItemBrand.objects.get_or_create(
                        name=brand_name,
                        category=car_brands_category,
                        defaults={
                            "description": brand_data["description"],
                            "icon": brand_data["icon"],
                            "color": brand_data["color"],
                            "tab_color": brand_data["tab_color"],
                        },
                    )
                    
                    if created:
                        self.stdout.write(f"Created brand: {brand_name}")
                    
                    # Create models for this brand
                    for model_data in brand_data["models"]:
                        model_name = model_data["name"]
                        model_dimensions = model_data.get("dimensions")
                        model_weight = model_data.get("weight")
                        
                        model, created = ItemModel.objects.get_or_create(
                            name=model_name,
                            brand=brand,
                            defaults={
                                "description": f"{brand_name} {model_name}",
                                "weight": model_weight,
                                "dimensions": model_dimensions,
                                "icon": brand_data["icon"],
                                "color": brand_data["color"],
                                "tab_color": brand_data["tab_color"],
                            },
                        )
                        
                        if created:
                            self.stdout.write(
                                f"Created model: {model_name} for {brand_name}"
                            )
                            
            except Services.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        "Car Transport service not found. Please run create_cleaned_structure first."
                    )
                )
                return

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully created car brands and models with dimensions!"
            )
        )

