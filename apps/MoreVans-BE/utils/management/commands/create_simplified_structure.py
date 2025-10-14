from django.core.management.base import BaseCommand
from django.db import transaction
from apps.Services.models import ServiceCategory, Services
from apps.CommonItems.models_simplified import SimplifiedItemCategory, SimplifiedCommonItem


class Command(BaseCommand):
    help = "Creates the new simplified item and service structure"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing simplified data before creating new structure",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing simplified data...")
            SimplifiedCommonItem.objects.all().delete()
            SimplifiedItemCategory.objects.all().delete()
            self.stdout.write("Cleared existing data.")

        self._create_service_structure()
        self._create_item_categories()
        self._create_common_items()

    def _create_service_structure(self):
        """Create the service categories and services"""
        with transaction.atomic():
            # Create service categories
            service_categories = [
                {
                    "name": "Removals & Storage",
                    "description": "Complete removal and storage services including home, office, student, and international relocations with secure storage solutions.",
                    "icon": "IconHome2",
                },
                {
                    "name": "Man & Van Services", 
                    "description": "Affordable delivery and moving services for furniture, appliances, pianos, parcels, and specialized items.",
                    "icon": "IconTruck",
                },
                {
                    "name": "Vehicle Delivery",
                    "description": "Safe and reliable car and motorcycle transport services across the country and internationally.",
                    "icon": "IconCar",
                },
            ]

            for cat_data in service_categories:
                category, created = ServiceCategory.objects.get_or_create(
                    name=cat_data["name"],
                    defaults=cat_data
                )
                if created:
                    self.stdout.write(f"Created service category: {cat_data['name']}")

            # Create services
            services_data = [
                # Removals & Storage - Home Removals with Room Categories
                {
                    "name": "Home Removals - Living Room",
                    "description": "Living room furniture and items including sofas, TV stands, coffee tables, and entertainment systems.",
                    "category": "Removals & Storage",
                    "icon": "IconSofa",
                },
                {
                    "name": "Home Removals - Bedroom",
                    "description": "Bedroom furniture and items including beds, wardrobes, dressers, and bedroom accessories.",
                    "category": "Removals & Storage",
                    "icon": "IconBed",
                },
                {
                    "name": "Home Removals - Kitchen",
                    "description": "Kitchen items including appliances, cabinets, dining tables, and kitchen accessories.",
                    "category": "Removals & Storage",
                    "icon": "IconChefHat",
                },
                {
                    "name": "Home Removals - Bathroom",
                    "description": "Bathroom items including vanities, mirrors, shower units, and bathroom accessories.",
                    "category": "Removals & Storage",
                    "icon": "IconBath",
                },
                {
                    "name": "Home Removals - Dining Room",
                    "description": "Dining room furniture including dining tables, chairs, sideboards, and dining accessories.",
                    "category": "Removals & Storage",
                    "icon": "IconTable",
                },
                {
                    "name": "Home Removals - Study/Office",
                    "description": "Home office furniture including desks, chairs, bookcases, and office equipment.",
                    "category": "Removals & Storage",
                    "icon": "IconDesk",
                },
                {
                    "name": "Home Removals - Garden/Outdoor",
                    "description": "Outdoor furniture and garden items including patio sets, BBQs, garden tools, and outdoor equipment.",
                    "category": "Removals & Storage",
                    "icon": "IconTrees",
                },
                {
                    "name": "Home Removals - Garage/Storage",
                    "description": "Garage and storage items including tools, equipment, storage boxes, and workshop items.",
                    "category": "Removals & Storage",
                    "icon": "IconTool",
                },
                # Other Removals & Storage Services
                {
                    "name": "International Removals",
                    "description": "Cross-border and international moving services with customs handling.",
                    "category": "Removals & Storage",
                    "icon": "IconWorld",
                },
                {
                    "name": "Office Removals",
                    "description": "Business and commercial moving services including office furniture and equipment.",
                    "category": "Removals & Storage",
                    "icon": "IconBuilding",
                },
                {
                    "name": "Student Removals",
                    "description": "Specialized moving services for university students, including dormitory and shared accommodation moves.",
                    "category": "Removals & Storage",
                    "icon": "IconSchool",
                },
                {
                    "name": "Storage Services",
                    "description": "Secure storage solutions with collection and delivery services for short-term or long-term needs.",
                    "category": "Removals & Storage",
                    "icon": "IconBox",
                },
                # Man & Van Services
                {
                    "name": "Furniture & Appliance Delivery",
                    "description": "Delivery and moving services for furniture and appliances.",
                    "category": "Man & Van Services",
                    "icon": "IconSofa",
                },
                {
                    "name": "Piano Delivery",
                    "description": "Specialist piano transport services with expert handling.",
                    "category": "Man & Van Services",
                    "icon": "IconMusic",
                },
                {
                    "name": "Parcel Delivery",
                    "description": "Same-day and next-day parcel delivery services.",
                    "category": "Man & Van Services",
                    "icon": "IconPackage",
                },
                {
                    "name": "eBay Delivery",
                    "description": "Specialized delivery services for eBay purchases and sales.",
                    "category": "Man & Van Services",
                    "icon": "IconPackageImport",
                },
                {
                    "name": "Gumtree Delivery",
                    "description": "Delivery services for Gumtree purchases and sales.",
                    "category": "Man & Van Services",
                    "icon": "IconPackageImport",
                },
                {
                    "name": "Heavy & Large Item Delivery",
                    "description": "Specialized transport for oversized items, appliances, and bulky goods.",
                    "category": "Man & Van Services",
                    "icon": "IconArrowsMaximize",
                },
                {
                    "name": "Specialist & Antiques Delivery",
                    "description": "Expert handling and transport of delicate, valuable, or antique items.",
                    "category": "Man & Van Services",
                    "icon": "IconGlass",
                },
                # Vehicle Delivery
                {
                    "name": "Car Transport",
                    "description": "Safe and reliable car delivery services across the country.",
                    "category": "Vehicle Delivery",
                    "icon": "IconCar",
                },
                {
                    "name": "Motorcycle Transport",
                    "description": "Specialized motorcycle transport with proper securing.",
                    "category": "Vehicle Delivery",
                    "icon": "IconMotorbike",
                },
            ]

            for service_data in services_data:
                category = ServiceCategory.objects.get(name=service_data["category"])
                service, created = Services.objects.get_or_create(
                    name=service_data["name"],
                    defaults={
                        "description": service_data["description"],
                        "service_category": category,
                        "icon": service_data["icon"],
                    }
                )
                if created:
                    self.stdout.write(f"Created service: {service_data['name']}")

    def _create_item_categories(self):
        """Create item categories for each service type"""
        with transaction.atomic():
            # Get all services
            services = Services.objects.all()
            
            # Define item categories for each service type
            item_categories_data = {
                "Home Removals - Living Room": [
                    {
                        "name": "Sofas & Seating",
                        "description": "Sofas, armchairs, and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "typical_weight": 50.0,
                        "typical_dimensions": {"length": "200", "width": "90", "height": "80", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                    },
                    {
                        "name": "TV & Entertainment",
                        "description": "Televisions, sound systems, and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "typical_weight": 25.0,
                        "typical_dimensions": {"length": "120", "width": "70", "height": "15", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": True,
                        "vehicle_type_required": "van",
                        "priority": 2,
                    },
                    {
                        "name": "Coffee Tables",
                        "description": "Coffee tables, side tables, and living room tables",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "typical_weight": 15.0,
                        "typical_dimensions": {"length": "120", "width": "60", "height": "40", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 3,
                    },
                    {
                        "name": "Bookshelves",
                        "description": "Bookshelves, display units, and storage furniture",
                        "icon": "IconBooks",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "typical_weight": 30.0,
                        "typical_dimensions": {"length": "80", "width": "30", "height": "180", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 4,
                    },
                ],
                "Home Removals - Bedroom": [
                    {
                        "name": "Beds & Mattresses",
                        "description": "Beds, mattresses, and bedroom furniture",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "typical_weight": 60.0,
                        "typical_dimensions": {"length": "200", "width": "150", "height": "30", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                    },
                    {
                        "name": "Wardrobes & Storage",
                        "description": "Wardrobes, chests of drawers, and bedroom storage",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "typical_weight": 40.0,
                        "typical_dimensions": {"length": "120", "width": "60", "height": "200", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 2,
                    },
                ],
                "Home Removals - Kitchen": [
                    {
                        "name": "Kitchen Appliances",
                        "description": "Refrigerators, ovens, dishwashers, and kitchen appliances",
                        "icon": "IconBlender",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "typical_weight": 50.0,
                        "typical_dimensions": {"length": "60", "width": "60", "height": "85", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                    },
                    {
                        "name": "Dining Tables",
                        "description": "Dining tables, chairs, and dining room furniture",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "typical_weight": 30.0,
                        "typical_dimensions": {"length": "150", "width": "90", "height": "75", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 2,
                    },
                ],
                "Home Removals - Bathroom": [
                    {
                        "name": "Bathroom Vanities",
                        "description": "Bathroom vanities, cabinets, and storage units",
                        "icon": "IconBath",
                        "color": "bg-cyan-100 text-cyan-800",
                        "tab_color": "bg-cyan-500 text-cyan-100",
                        "typical_weight": 25.0,
                        "typical_dimensions": {"length": "80", "width": "50", "height": "85", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                    },
                    {
                        "name": "Mirrors",
                        "description": "Bathroom mirrors and decorative mirrors",
                        "icon": "IconMirror",
                        "color": "bg-slate-100 text-slate-800",
                        "tab_color": "bg-slate-500 text-slate-100",
                        "typical_weight": 5.0,
                        "typical_dimensions": {"length": "60", "width": "5", "height": "80", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": True,
                        "vehicle_type_required": "van",
                        "priority": 2,
                    },
                ],
                "Car Transport": [
                    {
                        "name": "Cars",
                        "description": "Cars, sedans, SUVs, and passenger vehicles",
                        "icon": "IconCar",
                        "color": "bg-slate-100 text-slate-800",
                        "tab_color": "bg-slate-500 text-slate-100",
                        "typical_weight": 1500.0,
                        "typical_dimensions": {"length": "450", "width": "180", "height": "150", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "car_transporter",
                        "insurance_required": True,
                        "documentation_required": True,
                        "priority": 1,
                    },
                ],
                "Motorcycle Transport": [
                    {
                        "name": "Motorcycles",
                        "description": "Motorcycles, scooters, and two-wheeled vehicles",
                        "icon": "IconMotorbike",
                        "color": "bg-red-100 text-red-800",
                        "tab_color": "bg-red-500 text-red-100",
                        "typical_weight": 200.0,
                        "typical_dimensions": {"length": "200", "width": "80", "height": "120", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "insurance_required": True,
                        "documentation_required": True,
                        "priority": 1,
                    },
                ],
            }

            for service in services:
                if service.name in item_categories_data:
                    for cat_data in item_categories_data[service.name]:
                        category, created = SimplifiedItemCategory.objects.get_or_create(
                            name=cat_data["name"],
                            service_type=service,
                            defaults=cat_data
                        )
                        if created:
                            self.stdout.write(f"Created item category: {cat_data['name']} for {service.name}")

    def _create_common_items(self):
        """Create common items for each category"""
        with transaction.atomic():
            # Define common items for each category
            common_items_data = {
                "Sofas & Seating": [
                    {"name": "2-Seater Sofa", "weight": 45.0, "dimensions": {"length": "180", "width": "90", "height": "80", "unit": "cm"}},
                    {"name": "3-Seater Sofa", "weight": 65.0, "dimensions": {"length": "220", "width": "90", "height": "80", "unit": "cm"}},
                    {"name": "Armchair", "weight": 25.0, "dimensions": {"length": "90", "width": "90", "height": "80", "unit": "cm"}},
                    {"name": "Recliner", "weight": 35.0, "dimensions": {"length": "100", "width": "90", "height": "80", "unit": "cm"}},
                    {"name": "Sectional Sofa", "weight": 80.0, "dimensions": {"length": "300", "width": "90", "height": "80", "unit": "cm"}},
                ],
                "TV & Entertainment": [
                    {"name": "55\" TV", "weight": 20.0, "dimensions": {"length": "125", "width": "75", "height": "15", "unit": "cm"}, "fragile": True},
                    {"name": "65\" TV", "weight": 30.0, "dimensions": {"length": "145", "width": "85", "height": "15", "unit": "cm"}, "fragile": True},
                    {"name": "Sound System", "weight": 15.0, "dimensions": {"length": "60", "width": "40", "height": "20", "unit": "cm"}, "fragile": True},
                    {"name": "Gaming Console", "weight": 3.0, "dimensions": {"length": "30", "width": "20", "height": "10", "unit": "cm"}, "fragile": True},
                ],
                "Beds & Mattresses": [
                    {"name": "Single Bed", "weight": 40.0, "dimensions": {"length": "200", "width": "90", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "Double Bed", "weight": 50.0, "dimensions": {"length": "200", "width": "135", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "King Size Bed", "weight": 60.0, "dimensions": {"length": "200", "width": "150", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "Mattress", "weight": 25.0, "dimensions": {"length": "200", "width": "135", "height": "20", "unit": "cm"}},
                ],
                "Kitchen Appliances": [
                    {"name": "Refrigerator", "weight": 60.0, "dimensions": {"length": "60", "width": "60", "height": "180", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "Washing Machine", "weight": 45.0, "dimensions": {"length": "60", "width": "60", "height": "85", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "Dishwasher", "weight": 35.0, "dimensions": {"length": "60", "width": "60", "height": "85", "unit": "cm"}, "needs_disassembly": True},
                    {"name": "Oven", "weight": 25.0, "dimensions": {"length": "60", "width": "60", "height": "60", "unit": "cm"}, "needs_disassembly": True},
                ],
                "Cars": [
                    {"name": "Sedan", "weight": 1500.0, "dimensions": {"length": "450", "width": "180", "height": "150", "unit": "cm"}},
                    {"name": "SUV", "weight": 1800.0, "dimensions": {"length": "480", "width": "190", "height": "170", "unit": "cm"}},
                    {"name": "Hatchback", "weight": 1200.0, "dimensions": {"length": "420", "width": "175", "height": "145", "unit": "cm"}},
                    {"name": "Convertible", "weight": 1400.0, "dimensions": {"length": "440", "width": "180", "height": "140", "unit": "cm"}},
                ],
                "Motorcycles": [
                    {"name": "Sport Bike", "weight": 180.0, "dimensions": {"length": "200", "width": "70", "height": "110", "unit": "cm"}},
                    {"name": "Cruiser", "weight": 250.0, "dimensions": {"length": "220", "width": "80", "height": "120", "unit": "cm"}},
                    {"name": "Scooter", "weight": 120.0, "dimensions": {"length": "180", "width": "70", "height": "100", "unit": "cm"}},
                    {"name": "Dirt Bike", "weight": 100.0, "dimensions": {"length": "200", "width": "80", "height": "130", "unit": "cm"}},
                ],
            }

            for category in SimplifiedItemCategory.objects.all():
                if category.name in common_items_data:
                    for item_data in common_items_data[category.name]:
                        item, created = SimplifiedCommonItem.objects.get_or_create(
                            name=item_data["name"],
                            category=category,
                            defaults=item_data
                        )
                        if created:
                            self.stdout.write(f"Created item: {item_data['name']} in {category.name}")

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully created simplified item and service structure!"
            )
        )

