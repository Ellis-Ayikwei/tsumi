from django.core.management.base import BaseCommand
from apps.CommonItems.models import CommonItem
import random

class Command(BaseCommand):
    help = "Update existing items with default weight, dimensions, and other details"

    def handle(self, *args, **options):
        # Default weight ranges for different item types (in kg)
        weight_ranges = {
            'sofa': (30, 80),
            'bed': (20, 60),
            'table': (10, 40),
            'chair': (5, 15),
            'tv': (5, 25),
            'wardrobe': (40, 100),
            'dresser': (30, 70),
            'bookcase': (20, 50),
            'lamp': (1, 5),
            'rug': (2, 8),
            'artwork': (1, 10),
            'box': (1, 20),
            'package': (0.5, 10),
            'piano': (150, 300),
            'refrigerator': (50, 120),
            'washing machine': (40, 80),
            'dishwasher': (30, 60),
            'microwave': (10, 25),
            'oven': (20, 50),
            'car': (1000, 2000),
            'motorcycle': (150, 300),
        }

        # Default dimension ranges for different item types (in cm)
        dimension_ranges = {
            'sofa': {'length': (150, 250), 'width': (80, 120), 'height': (70, 100)},
            'bed': {'length': (190, 220), 'width': (90, 200), 'height': (30, 60)},
            'table': {'length': (80, 200), 'width': (60, 120), 'height': (70, 80)},
            'chair': {'length': (40, 60), 'width': (40, 60), 'height': (80, 100)},
            'tv': {'length': (50, 150), 'width': (30, 100), 'height': (30, 80)},
            'wardrobe': {'length': (100, 200), 'width': (50, 80), 'height': (180, 220)},
            'dresser': {'length': (80, 150), 'width': (40, 60), 'height': (70, 100)},
            'bookcase': {'length': (60, 120), 'width': (25, 40), 'height': (120, 200)},
            'lamp': {'length': (20, 40), 'width': (20, 40), 'height': (100, 180)},
            'rug': {'length': (100, 300), 'width': (100, 300), 'height': (1, 3)},
            'artwork': {'length': (30, 100), 'width': (20, 80), 'height': (2, 5)},
            'box': {'length': (20, 60), 'width': (20, 40), 'height': (10, 30)},
            'package': {'length': (10, 50), 'width': (10, 30), 'height': (5, 20)},
            'piano': {'length': (150, 200), 'width': (60, 80), 'height': (100, 120)},
            'refrigerator': {'length': (60, 80), 'width': (60, 80), 'height': (150, 180)},
            'washing machine': {'length': (60, 70), 'width': (60, 70), 'height': (80, 90)},
            'dishwasher': {'length': (60, 70), 'width': (60, 70), 'height': (80, 90)},
            'microwave': {'length': (30, 50), 'width': (30, 50), 'height': (25, 35)},
            'oven': {'length': (60, 80), 'width': (60, 80), 'height': (50, 70)},
            'car': {'length': (400, 500), 'width': (180, 200), 'height': (150, 180)},
            'motorcycle': {'length': (200, 250), 'width': (80, 100), 'height': (100, 120)},
        }

        # Fragile items
        fragile_items = [
            'tv', 'lamp', 'artwork', 'mirror', 'glass', 'crystal', 'ceramic', 'vase',
            'piano', 'guitar', 'violin', 'clock', 'chandelier', 'antique'
        ]

        # Items that need disassembly
        disassembly_items = [
            'bed', 'wardrobe', 'dresser', 'bookcase', 'table', 'desk', 'shelf',
            'piano', 'refrigerator', 'washing machine', 'dishwasher', 'treadmill'
        ]

        updated_count = 0
        
        for item in CommonItem.objects.all():
            item_name_lower = item.name.lower()
            
            # Find matching weight range
            weight_range = None
            for key, range_val in weight_ranges.items():
                if key in item_name_lower:
                    weight_range = range_val
                    break
            
            # Find matching dimension range
            dimension_range = None
            for key, range_val in dimension_ranges.items():
                if key in item_name_lower:
                    dimension_range = range_val
                    break
            
            # Set weight if not already set
            if not item.weight and weight_range:
                item.weight = round(random.uniform(weight_range[0], weight_range[1]), 1)
            
            # Set dimensions if not already set
            if not item.dimensions and dimension_range:
                item.dimensions = {
                    'length': round(random.uniform(dimension_range['length'][0], dimension_range['length'][1]), 1),
                    'width': round(random.uniform(dimension_range['width'][0], dimension_range['width'][1]), 1),
                    'height': round(random.uniform(dimension_range['height'][0], dimension_range['height'][1]), 1),
                    'unit': 'cm'
                }
            
            # Set fragile flag
            if any(fragile_item in item_name_lower for fragile_item in fragile_items):
                item.fragile = True
            
            # Set disassembly flag
            if any(disassembly_item in item_name_lower for disassembly_item in disassembly_items):
                item.needs_disassembly = True
            
            # Set description if not already set
            if not item.description:
                item.description = f"Standard {item.name} for moving and transport"
            
            item.save()
            updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f"Successfully updated {updated_count} items with weight, dimensions, and other details!")
        )


