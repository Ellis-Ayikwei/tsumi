"""
Car brands and their models with dimensions
"""

CAR_BRANDS_AND_MODELS = {
    "Audi": {
        "description": "German luxury car manufacturer",
        "icon": "IconCar",
        "color": "bg-red-100 text-red-800",
        "tab_color": "bg-red-500 text-red-100",
        "models": [
            {"name": "A3", "dimensions": {"length": "4.3", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1400},
            {"name": "A4", "dimensions": {"length": "4.7", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1500},
            {"name": "A6", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 1700},
            {"name": "A8", "dimensions": {"length": "5.2", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 2000},
            {"name": "Q3", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.6", "unit": "m"}, "weight": 1600},
            {"name": "Q5", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 1800},
            {"name": "Q7", "dimensions": {"length": "5.1", "width": "2.0", "height": "1.7", "unit": "m"}, "weight": 2200},
            {"name": "TT", "dimensions": {"length": "4.2", "width": "1.8", "height": "1.3", "unit": "m"}, "weight": 1300},
            {"name": "R8", "dimensions": {"length": "4.4", "width": "1.9", "height": "1.2", "unit": "m"}, "weight": 1600}
        ]
    },
    "BMW": {
        "description": "German luxury car manufacturer",
        "icon": "IconCar",
        "color": "bg-blue-100 text-blue-800",
        "tab_color": "bg-blue-500 text-blue-100",
        "models": [
            {"name": "1 Series", "dimensions": {"length": "4.3", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1400},
            {"name": "3 Series", "dimensions": {"length": "4.7", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1500},
            {"name": "5 Series", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 1700},
            {"name": "7 Series", "dimensions": {"length": "5.2", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 2000},
            {"name": "X1", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.6", "unit": "m"}, "weight": 1600},
            {"name": "X3", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 1800},
            {"name": "X5", "dimensions": {"length": "4.9", "width": "2.0", "height": "1.7", "unit": "m"}, "weight": 2200},
            {"name": "X7", "dimensions": {"length": "5.2", "width": "2.0", "height": "1.8", "unit": "m"}, "weight": 2500},
            {"name": "Z4", "dimensions": {"length": "4.3", "width": "1.8", "height": "1.3", "unit": "m"}, "weight": 1400},
            {"name": "i3", "dimensions": {"length": "4.0", "width": "1.8", "height": "1.6", "unit": "m"}, "weight": 1300},
            {"name": "i8", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.3", "unit": "m"}, "weight": 1500}
        ]
    },
    "Mercedes-Benz": {
        "description": "German luxury car manufacturer",
        "icon": "IconCar",
        "color": "bg-silver-100 text-silver-800",
        "tab_color": "bg-silver-500 text-silver-100",
        "models": [
            {"name": "A-Class", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1400},
            {"name": "C-Class", "dimensions": {"length": "4.7", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1500},
            {"name": "E-Class", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 1700},
            {"name": "S-Class", "dimensions": {"length": "5.2", "width": "1.9", "height": "1.5", "unit": "m"}, "weight": 2000},
            {"name": "GLA", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.6", "unit": "m"}, "weight": 1600},
            {"name": "GLC", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 1800},
            {"name": "GLE", "dimensions": {"length": "4.9", "width": "2.0", "height": "1.7", "unit": "m"}, "weight": 2200},
            {"name": "GLS", "dimensions": {"length": "5.2", "width": "2.0", "height": "1.8", "unit": "m"}, "weight": 2500},
            {"name": "SL", "dimensions": {"length": "4.6", "width": "1.9", "height": "1.3", "unit": "m"}, "weight": 1600},
            {"name": "AMG GT", "dimensions": {"length": "4.5", "width": "1.9", "height": "1.3", "unit": "m"}, "weight": 1500}
        ]
    },
    "Toyota": {
        "description": "Japanese car manufacturer",
        "icon": "IconCar",
        "color": "bg-red-100 text-red-800",
        "tab_color": "bg-red-500 text-red-100",
        "models": [
            {"name": "Corolla", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1400},
            {"name": "Camry", "dimensions": {"length": "4.9", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1600},
            {"name": "Prius", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1500},
            {"name": "RAV4", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.7", "unit": "m"}, "weight": 1600},
            {"name": "Highlander", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 2000},
            {"name": "Land Cruiser", "dimensions": {"length": "5.0", "width": "1.9", "height": "1.9", "unit": "m"}, "weight": 2500},
            {"name": "Tacoma", "dimensions": {"length": "5.4", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Tundra", "dimensions": {"length": "5.8", "width": "2.0", "height": "1.9", "unit": "m"}, "weight": 2500},
            {"name": "Sienna", "dimensions": {"length": "5.1", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Avalon", "dimensions": {"length": "5.0", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1700}
        ]
    },
    "Honda": {
        "description": "Japanese car manufacturer",
        "icon": "IconCar",
        "color": "bg-red-100 text-red-800",
        "tab_color": "bg-red-500 text-red-100",
        "models": [
            {"name": "Civic", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.4", "unit": "m"}, "weight": 1300},
            {"name": "Accord", "dimensions": {"length": "4.9", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1500},
            {"name": "CR-V", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.7", "unit": "m"}, "weight": 1600},
            {"name": "Pilot", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Passport", "dimensions": {"length": "4.8", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 1900},
            {"name": "Ridgeline", "dimensions": {"length": "5.3", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Odyssey", "dimensions": {"length": "5.1", "width": "1.9", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Insight", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1400},
            {"name": "Fit", "dimensions": {"length": "4.0", "width": "1.7", "height": "1.5", "unit": "m"}, "weight": 1100}
        ]
    },
    "Ford": {
        "description": "American car manufacturer",
        "icon": "IconCar",
        "color": "bg-blue-100 text-blue-800",
        "tab_color": "bg-blue-500 text-blue-100",
        "models": [
            {"name": "Focus", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1300},
            {"name": "Fusion", "dimensions": {"length": "4.9", "width": "1.8", "height": "1.5", "unit": "m"}, "weight": 1600},
            {"name": "Mustang", "dimensions": {"length": "4.8", "width": "1.9", "height": "1.4", "unit": "m"}, "weight": 1600},
            {"name": "Escape", "dimensions": {"length": "4.6", "width": "1.8", "height": "1.7", "unit": "m"}, "weight": 1600},
            {"name": "Explorer", "dimensions": {"length": "5.0", "width": "2.0", "height": "1.8", "unit": "m"}, "weight": 2000},
            {"name": "Expedition", "dimensions": {"length": "5.3", "width": "2.0", "height": "1.9", "unit": "m"}, "weight": 2500},
            {"name": "F-150", "dimensions": {"length": "5.8", "width": "2.0", "height": "1.9", "unit": "m"}, "weight": 2000},
            {"name": "F-250", "dimensions": {"length": "6.0", "width": "2.1", "height": "1.9", "unit": "m"}, "weight": 2500},
            {"name": "Transit", "dimensions": {"length": "5.3", "width": "2.0", "height": "2.0", "unit": "m"}, "weight": 2000},
            {"name": "Edge", "dimensions": {"length": "4.8", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 1800}
        ]
    },
    "Tesla": {
        "description": "American electric car manufacturer",
        "icon": "IconCar",
        "color": "bg-gray-100 text-gray-800",
        "tab_color": "bg-gray-500 text-gray-100",
        "models": [
            {"name": "Model 3", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.4", "unit": "m"}, "weight": 1800},
            {"name": "Model S", "dimensions": {"length": "5.0", "width": "1.9", "height": "1.4", "unit": "m"}, "weight": 2200},
            {"name": "Model X", "dimensions": {"length": "5.0", "width": "2.0", "height": "1.7", "unit": "m"}, "weight": 2500},
            {"name": "Model Y", "dimensions": {"length": "4.8", "width": "1.9", "height": "1.6", "unit": "m"}, "weight": 2000},
            {"name": "Cybertruck", "dimensions": {"length": "5.9", "width": "2.0", "height": "1.9", "unit": "m"}, "weight": 3000}
        ]
    },
    "Porsche": {
        "description": "German sports car manufacturer",
        "icon": "IconCar",
        "color": "bg-red-100 text-red-800",
        "tab_color": "bg-red-500 text-red-100",
        "models": [
            {"name": "911", "dimensions": {"length": "4.5", "width": "1.8", "height": "1.3", "unit": "m"}, "weight": 1500},
            {"name": "Cayenne", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.7", "unit": "m"}, "weight": 2000},
            {"name": "Macan", "dimensions": {"length": "4.7", "width": "1.9", "height": "1.6", "unit": "m"}, "weight": 1800},
            {"name": "Panamera", "dimensions": {"length": "5.0", "width": "1.9", "height": "1.4", "unit": "m"}, "weight": 1900},
            {"name": "Taycan", "dimensions": {"length": "4.9", "width": "1.9", "height": "1.4", "unit": "m"}, "weight": 2200},
            {"name": "Boxster", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.3", "unit": "m"}, "weight": 1400},
            {"name": "Cayman", "dimensions": {"length": "4.4", "width": "1.8", "height": "1.3", "unit": "m"}, "weight": 1400}
        ]
    }
}

