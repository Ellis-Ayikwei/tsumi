"""
Cleaned and structured service hierarchy data
This replaces the messy requestflow.py data with a proper object structure
"""

SERVICE_HIERARCHY = {
    "Removals & Storage": {
        "description": "Complete removal and storage services including home, office, student, and international relocations with secure storage solutions.",
        "icon": "IconHome2",
        "color": "bg-blue-100 text-blue-800",
        "tab_color": "bg-blue-500 text-blue-100",
        "services": {
            "Home Removals": {
                "description": "Complete home relocations with professional moving teams",
                "icon": "IconHome2",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "rooms": {
                    "Living Room": {
                        "description": "Living room furniture and items",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": {
                            "Sofas & Seating": {
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
                                "specific_items": [
                                    {"name": "2-Seater Sofa", "weight": 45.0, "dimensions": {"length": "180", "width": "90", "height": "80", "unit": "cm"}},
                                    {"name": "3-Seater Sofa", "weight": 65.0, "dimensions": {"length": "220", "width": "90", "height": "80", "unit": "cm"}},
                                    {"name": "Armchair", "weight": 25.0, "dimensions": {"length": "90", "width": "90", "height": "80", "unit": "cm"}},
                                    {"name": "Recliner", "weight": 35.0, "dimensions": {"length": "100", "width": "90", "height": "80", "unit": "cm"}},
                                    {"name": "Sectional Sofa", "weight": 80.0, "dimensions": {"length": "300", "width": "90", "height": "80", "unit": "cm"}},
                                ]
                            },
                            "TV & Entertainment": {
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
                                "specific_items": [
                                    {"name": "55\" TV", "weight": 20.0, "dimensions": {"length": "125", "width": "75", "height": "15", "unit": "cm"}, "fragile": True},
                                    {"name": "65\" TV", "weight": 30.0, "dimensions": {"length": "145", "width": "85", "height": "15", "unit": "cm"}, "fragile": True},
                                    {"name": "Sound System", "weight": 15.0, "dimensions": {"length": "60", "width": "40", "height": "20", "unit": "cm"}, "fragile": True},
                                    {"name": "Gaming Console", "weight": 3.0, "dimensions": {"length": "30", "width": "20", "height": "10", "unit": "cm"}, "fragile": True},
                                ]
                            },
                            "Coffee Tables": {
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
                                "specific_items": [
                                    {"name": "Coffee Table", "weight": 15.0, "dimensions": {"length": "120", "width": "60", "height": "40", "unit": "cm"}},
                                    {"name": "Side Table", "weight": 8.0, "dimensions": {"length": "60", "width": "40", "height": "50", "unit": "cm"}},
                                    {"name": "Nesting Tables", "weight": 12.0, "dimensions": {"length": "80", "width": "50", "height": "45", "unit": "cm"}},
                                ]
                            },
                            "Bookshelves": {
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
                                "specific_items": [
                                    {"name": "Bookcase", "weight": 25.0, "dimensions": {"length": "80", "width": "30", "height": "180", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Display Unit", "weight": 20.0, "dimensions": {"length": "100", "width": "40", "height": "200", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Floating Shelf", "weight": 5.0, "dimensions": {"length": "120", "width": "20", "height": "15", "unit": "cm"}},
                                ]
                            }
                        }
                    },
                    "Bedroom": {
                        "description": "Bedroom furniture and items",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": {
                            "Beds & Mattresses": {
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
                                "specific_items": [
                                    {"name": "Single Bed", "weight": 40.0, "dimensions": {"length": "200", "width": "90", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Double Bed", "weight": 50.0, "dimensions": {"length": "200", "width": "135", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "King Size Bed", "weight": 60.0, "dimensions": {"length": "200", "width": "150", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Mattress", "weight": 25.0, "dimensions": {"length": "200", "width": "135", "height": "20", "unit": "cm"}},
                                ]
                            },
                            "Wardrobes & Storage": {
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
                                "specific_items": [
                                    {"name": "Double Wardrobe", "weight": 50.0, "dimensions": {"length": "120", "width": "60", "height": "200", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Single Wardrobe", "weight": 30.0, "dimensions": {"length": "60", "width": "60", "height": "200", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Triple Wardrobe", "weight": 70.0, "dimensions": {"length": "180", "width": "60", "height": "200", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Chest Of Drawers", "weight": 25.0, "dimensions": {"length": "100", "width": "50", "height": "80", "unit": "cm"}, "needs_disassembly": True},
                                ]
                            }
                        }
                    },
                    "Kitchen": {
                        "description": "Kitchen items and appliances",
                        "icon": "IconChefHat",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": {
                            "Kitchen Appliances": {
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
                                "specific_items": [
                                    {"name": "Refrigerator", "weight": 60.0, "dimensions": {"length": "60", "width": "60", "height": "180", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Washing Machine", "weight": 45.0, "dimensions": {"length": "60", "width": "60", "height": "85", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Dishwasher", "weight": 35.0, "dimensions": {"length": "60", "width": "60", "height": "85", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Oven", "weight": 25.0, "dimensions": {"length": "60", "width": "60", "height": "60", "unit": "cm"}, "needs_disassembly": True},
                                ]
                            },
                            "Dining Tables": {
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
                                "specific_items": [
                                    {"name": "4 Seater Dining Table", "weight": 25.0, "dimensions": {"length": "120", "width": "80", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "6 Seater Dining Table", "weight": 35.0, "dimensions": {"length": "180", "width": "90", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Dining Chairs", "weight": 8.0, "dimensions": {"length": "45", "width": "45", "height": "85", "unit": "cm"}},
                                ]
                            }
                        }
                    },
                    "Bathroom": {
                        "description": "Bathroom items and fixtures",
                        "icon": "IconBath",
                        "color": "bg-cyan-100 text-cyan-800",
                        "tab_color": "bg-cyan-500 text-cyan-100",
                        "items": {
                            "Bathroom Vanities": {
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
                                "specific_items": [
                                    {"name": "Bathroom Vanity", "weight": 25.0, "dimensions": {"length": "80", "width": "50", "height": "85", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Medicine Cabinet", "weight": 5.0, "dimensions": {"length": "60", "width": "15", "height": "80", "unit": "cm"}},
                                ]
                            },
                            "Mirrors": {
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
                                "specific_items": [
                                    {"name": "Bathroom Mirror", "weight": 5.0, "dimensions": {"length": "60", "width": "5", "height": "80", "unit": "cm"}, "fragile": True},
                                    {"name": "Full Length Mirror", "weight": 8.0, "dimensions": {"length": "50", "width": "5", "height": "180", "unit": "cm"}, "fragile": True},
                                ]
                            }
                        }
                    },
                    "Study/Office": {
                        "description": "Home office furniture and equipment",
                        "icon": "IconDesk",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": {
                            "Office Furniture": {
                                "description": "Desks, chairs, and office equipment",
                                "icon": "IconDesk",
                                "color": "bg-indigo-100 text-indigo-800",
                                "tab_color": "bg-indigo-500 text-indigo-100",
                                "typical_weight": 20.0,
                                "typical_dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"},
                                "requires_disassembly": True,
                                "fragile": False,
                                "vehicle_type_required": "van",
                                "priority": 1,
                                "specific_items": [
                                    {"name": "Office Desk", "weight": 25.0, "dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "Office Chair", "weight": 15.0, "dimensions": {"length": "60", "width": "60", "height": "120", "unit": "cm"}},
                                    {"name": "Small Desk", "weight": 15.0, "dimensions": {"length": "80", "width": "50", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                                ]
                            }
                        }
                    },
                    "Garden/Outdoor": {
                        "description": "Outdoor furniture and garden items",
                        "icon": "IconTrees",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": {
                            "Outdoor Furniture": {
                                "description": "Patio sets, BBQs, and outdoor equipment",
                                "icon": "IconTrees",
                                "color": "bg-green-100 text-green-800",
                                "tab_color": "bg-green-500 text-green-100",
                                "typical_weight": 20.0,
                                "typical_dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"},
                                "requires_disassembly": False,
                                "fragile": False,
                                "vehicle_type_required": "van",
                                "priority": 1,
                                "specific_items": [
                                    {"name": "Garden Table", "weight": 20.0, "dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"}},
                                    {"name": "Garden Chair", "weight": 5.0, "dimensions": {"length": "50", "width": "50", "height": "85", "unit": "cm"}},
                                    {"name": "BBQ", "weight": 30.0, "dimensions": {"length": "80", "width": "60", "height": "100", "unit": "cm"}},
                                ]
                            }
                        }
                    },
                    "Garage/Storage": {
                        "description": "Garage and storage items",
                        "icon": "IconTool",
                        "color": "bg-gray-100 text-gray-800",
                        "tab_color": "bg-gray-500 text-gray-100",
                        "items": {
                            "Tools & Equipment": {
                                "description": "Tools, equipment, and workshop items",
                                "icon": "IconTool",
                                "color": "bg-gray-100 text-gray-800",
                                "tab_color": "bg-gray-500 text-gray-100",
                                "typical_weight": 15.0,
                                "typical_dimensions": {"length": "100", "width": "50", "height": "30", "unit": "cm"},
                                "requires_disassembly": False,
                                "fragile": False,
                                "vehicle_type_required": "van",
                                "priority": 1,
                                "specific_items": [
                                    {"name": "Tool Box", "weight": 10.0, "dimensions": {"length": "60", "width": "40", "height": "25", "unit": "cm"}},
                                    {"name": "Workbench", "weight": 40.0, "dimensions": {"length": "150", "width": "60", "height": "90", "unit": "cm"}, "needs_disassembly": True},
                                ]
                            }
                        }
                    }
                }
            },
            "International Removals": {
                "description": "Cross-border and international moving services with customs handling",
                "icon": "IconWorld",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "rooms": {
                    "Living Room": {
                        "description": "Living room items for international moves",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": {
                            "Sofas & Seating": {
                                "description": "International shipping for sofas and seating",
                                "icon": "IconSofa",
                                "color": "bg-blue-100 text-blue-800",
                                "tab_color": "bg-blue-500 text-blue-100",
                                "typical_weight": 50.0,
                                "typical_dimensions": {"length": "200", "width": "90", "height": "80", "unit": "cm"},
                                "requires_disassembly": True,
                                "fragile": False,
                                "vehicle_type_required": "container",
                                "insurance_required": True,
                                "documentation_required": True,
                                "priority": 1,
                                "specific_items": [
                                    {"name": "2-Seater Sofa", "weight": 45.0, "dimensions": {"length": "180", "width": "90", "height": "80", "unit": "cm"}, "needs_disassembly": True},
                                    {"name": "3-Seater Sofa", "weight": 65.0, "dimensions": {"length": "220", "width": "90", "height": "80", "unit": "cm"}, "needs_disassembly": True},
                                ]
                            }
                        }
                    }
                }
            },
            "Office Removals": {
                "description": "Business and commercial moving services including office furniture and equipment",
                "icon": "IconBuilding",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {
                    "Office Furniture": {
                        "description": "Desks, chairs, and office equipment",
                        "icon": "IconDesk",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "typical_weight": 25.0,
                        "typical_dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Office Desk", "weight": 25.0, "dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                            {"name": "Office Chair", "weight": 15.0, "dimensions": {"length": "60", "width": "60", "height": "120", "unit": "cm"}},
                        ]
                    },
                    "Office Equipment": {
                        "description": "Computers, printers, and office equipment",
                        "icon": "IconDeviceDesktop",
                        "color": "bg-gray-100 text-gray-800",
                        "tab_color": "bg-gray-500 text-gray-100",
                        "typical_weight": 15.0,
                        "typical_dimensions": {"length": "60", "width": "40", "height": "20", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": True,
                        "vehicle_type_required": "van",
                        "priority": 2,
                        "specific_items": [
                            {"name": "Desktop Computer", "weight": 10.0, "dimensions": {"length": "50", "width": "40", "height": "15", "unit": "cm"}, "fragile": True},
                            {"name": "Printer", "weight": 8.0, "dimensions": {"length": "40", "width": "30", "height": "20", "unit": "cm"}, "fragile": True},
                        ]
                    }
                }
            },
            "Student Removals": {
                "description": "Specialized moving services for university students",
                "icon": "IconSchool",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {
                    "Furniture": {
                        "description": "Student furniture and items",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "typical_weight": 20.0,
                        "typical_dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Student Desk", "weight": 15.0, "dimensions": {"length": "100", "width": "50", "height": "75", "unit": "cm"}, "needs_disassembly": True},
                            {"name": "Student Chair", "weight": 8.0, "dimensions": {"length": "45", "width": "45", "height": "85", "unit": "cm"}},
                            {"name": "Single Bed", "weight": 40.0, "dimensions": {"length": "200", "width": "90", "height": "30", "unit": "cm"}, "needs_disassembly": True},
                        ]
                    },
                    "Boxes & Packaging": {
                        "description": "Moving boxes and packaging materials",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "typical_weight": 5.0,
                        "typical_dimensions": {"length": "50", "width": "50", "height": "50", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 2,
                        "specific_items": [
                            {"name": "Large Box", "weight": 5.0, "dimensions": {"length": "50", "width": "50", "height": "50", "unit": "cm"}},
                            {"name": "Medium Box", "weight": 3.0, "dimensions": {"length": "45", "width": "45", "height": "35", "unit": "cm"}},
                            {"name": "Small Box", "weight": 2.0, "dimensions": {"length": "40", "width": "30", "height": "30", "unit": "cm"}},
                        ]
                    }
                }
            },
            "Storage Services": {
                "description": "Secure storage solutions with collection and delivery services",
                "icon": "IconBox",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {
                    "Storage Items": {
                        "description": "Items suitable for storage",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "typical_weight": 10.0,
                        "typical_dimensions": {"length": "60", "width": "40", "height": "30", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Storage Box", "weight": 5.0, "dimensions": {"length": "60", "width": "40", "height": "30", "unit": "cm"}},
                            {"name": "Furniture", "weight": 20.0, "dimensions": {"length": "120", "width": "60", "height": "75", "unit": "cm"}},
                        ]
                    }
                }
            }
        }
    },
    "Man & Van Services": {
        "description": "Affordable delivery and moving services for furniture, appliances, pianos, parcels, and specialized items.",
        "icon": "IconTruck",
        "color": "bg-green-100 text-green-800",
        "tab_color": "bg-green-500 text-green-100",
        "services": {
            "Furniture & Appliance Delivery": {
                "description": "Delivery and moving services for furniture and appliances",
                "icon": "IconSofa",
                "color": "bg-green-100 text-green-800",
                "tab_color": "bg-green-500 text-green-100",
                "items": {
                    "Furniture": {
                        "description": "Furniture delivery services",
                        "icon": "IconSofa",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "typical_weight": 30.0,
                        "typical_dimensions": {"length": "150", "width": "80", "height": "75", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Sofa", "weight": 50.0, "dimensions": {"length": "200", "width": "90", "height": "80", "unit": "cm"}},
                            {"name": "Dining Table", "weight": 25.0, "dimensions": {"length": "150", "width": "90", "height": "75", "unit": "cm"}},
                        ]
                    }
                }
            },
            "Piano Delivery": {
                "description": "Specialist piano transport services with expert handling",
                "icon": "IconMusic",
                "color": "bg-red-100 text-red-800",
                "tab_color": "bg-red-500 text-red-100",
                "items": {
                    "Pianos": {
                        "description": "Piano transport services",
                        "icon": "IconMusic",
                        "color": "bg-red-100 text-red-800",
                        "tab_color": "bg-red-500 text-red-100",
                        "typical_weight": 200.0,
                        "typical_dimensions": {"length": "150", "width": "60", "height": "100", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": True,
                        "vehicle_type_required": "specialist",
                        "requires_special_handling": True,
                        "insurance_required": True,
                        "priority": 1,
                        "specific_items": [
                            {"name": "Upright Piano", "weight": 200.0, "dimensions": {"length": "150", "width": "60", "height": "100", "unit": "cm"}, "fragile": True, "requires_special_handling": True},
                            {"name": "Grand Piano", "weight": 300.0, "dimensions": {"length": "200", "width": "150", "height": "100", "unit": "cm"}, "fragile": True, "requires_special_handling": True},
                        ]
                    }
                }
            },
            "Parcel Delivery": {
                "description": "Same-day and next-day parcel delivery services",
                "icon": "IconPackage",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {
                    "Parcels": {
                        "description": "Parcel delivery services",
                        "icon": "IconPackage",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "typical_weight": 2.0,
                        "typical_dimensions": {"length": "30", "width": "20", "height": "10", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Small Parcel", "weight": 1.0, "dimensions": {"length": "20", "width": "15", "height": "5", "unit": "cm"}},
                            {"name": "Medium Parcel", "weight": 2.0, "dimensions": {"length": "30", "width": "20", "height": "10", "unit": "cm"}},
                            {"name": "Large Parcel", "weight": 5.0, "dimensions": {"length": "50", "width": "30", "height": "20", "unit": "cm"}},
                        ]
                    }
                }
            },
            "eBay Delivery": {
                "description": "Specialized delivery services for eBay purchases and sales",
                "icon": "IconPackageImport",
                "color": "bg-purple-100 text-purple-800",
                "tab_color": "bg-purple-500 text-purple-100",
                "items": {
                    "eBay Items": {
                        "description": "eBay item delivery services",
                        "icon": "IconPackageImport",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "typical_weight": 3.0,
                        "typical_dimensions": {"length": "40", "width": "25", "height": "15", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "eBay Purchase", "weight": 3.0, "dimensions": {"length": "40", "width": "25", "height": "15", "unit": "cm"}},
                        ]
                    }
                }
            },
            "Gumtree Delivery": {
                "description": "Delivery services for Gumtree purchases and sales",
                "icon": "IconPackageImport",
                "color": "bg-green-100 text-green-800",
                "tab_color": "bg-green-500 text-green-100",
                "items": {
                    "Gumtree Items": {
                        "description": "Gumtree item delivery services",
                        "icon": "IconPackageImport",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "typical_weight": 5.0,
                        "typical_dimensions": {"length": "50", "width": "30", "height": "20", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": False,
                        "vehicle_type_required": "van",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Gumtree Purchase", "weight": 5.0, "dimensions": {"length": "50", "width": "30", "height": "20", "unit": "cm"}},
                        ]
                    }
                }
            },
            "Heavy & Large Item Delivery": {
                "description": "Specialized transport for oversized items, appliances, and bulky goods",
                "icon": "IconArrowsMaximize",
                "color": "bg-orange-100 text-orange-800",
                "tab_color": "bg-orange-500 text-orange-100",
                "items": {
                    "Heavy Items": {
                        "description": "Heavy and large item delivery",
                        "icon": "IconArrowsMaximize",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "typical_weight": 100.0,
                        "typical_dimensions": {"length": "200", "width": "100", "height": "100", "unit": "cm"},
                        "requires_disassembly": True,
                        "fragile": False,
                        "vehicle_type_required": "truck",
                        "priority": 1,
                        "specific_items": [
                            {"name": "Heavy Appliance", "weight": 100.0, "dimensions": {"length": "200", "width": "100", "height": "100", "unit": "cm"}, "needs_disassembly": True},
                        ]
                    }
                }
            },
            "Specialist & Antiques Delivery": {
                "description": "Expert handling and transport of delicate, valuable, or antique items",
                "icon": "IconGlass",
                "color": "bg-purple-100 text-purple-800",
                "tab_color": "bg-purple-500 text-purple-100",
                "items": {
                    "Antiques": {
                        "description": "Antique and specialist item delivery",
                        "icon": "IconGlass",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "typical_weight": 20.0,
                        "typical_dimensions": {"length": "100", "width": "50", "height": "50", "unit": "cm"},
                        "requires_disassembly": False,
                        "fragile": True,
                        "vehicle_type_required": "specialist",
                        "requires_special_handling": True,
                        "insurance_required": True,
                        "priority": 1,
                        "specific_items": [
                            {"name": "Antique Furniture", "weight": 20.0, "dimensions": {"length": "100", "width": "50", "height": "50", "unit": "cm"}, "fragile": True, "requires_special_handling": True},
                        ]
                    }
                }
            }
        }
    },
    "Vehicle Delivery": {
        "description": "Safe and reliable car and motorcycle transport services across the country and internationally.",
        "icon": "IconCar",
        "color": "bg-slate-100 text-slate-800",
        "tab_color": "bg-slate-500 text-slate-100",
        "services": {
            "Car Transport": {
                "description": "Safe and reliable car delivery services across the country",
                "icon": "IconCar",
                "color": "bg-slate-100 text-slate-800",
                "tab_color": "bg-slate-500 text-slate-100",
                "items": {
                    "Cars": {
                        "description": "Car transport services",
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
                        "specific_items": [
                            {"name": "Sedan", "weight": 1500.0, "dimensions": {"length": "450", "width": "180", "height": "150", "unit": "cm"}},
                            {"name": "SUV", "weight": 1800.0, "dimensions": {"length": "480", "width": "190", "height": "170", "unit": "cm"}},
                            {"name": "Hatchback", "weight": 1200.0, "dimensions": {"length": "420", "width": "175", "height": "145", "unit": "cm"}},
                            {"name": "Convertible", "weight": 1400.0, "dimensions": {"length": "440", "width": "180", "height": "140", "unit": "cm"}},
                        ]
                    }
                }
            },
            "Motorcycle Transport": {
                "description": "Specialized motorcycle transport with proper securing",
                "icon": "IconMotorbike",
                "color": "bg-red-100 text-red-800",
                "tab_color": "bg-red-500 text-red-100",
                "items": {
                    "Motorcycles": {
                        "description": "Motorcycle transport services",
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
                        "specific_items": [
                            {"name": "Sport Bike", "weight": 180.0, "dimensions": {"length": "200", "width": "70", "height": "110", "unit": "cm"}},
                            {"name": "Cruiser", "weight": 250.0, "dimensions": {"length": "220", "width": "80", "height": "120", "unit": "cm"}},
                            {"name": "Scooter", "weight": 120.0, "dimensions": {"length": "180", "width": "70", "height": "100", "unit": "cm"}},
                            {"name": "Dirt Bike", "weight": 100.0, "dimensions": {"length": "200", "width": "80", "height": "130", "unit": "cm"}},
                        ]
                    }
                }
            }
        }
    }
}

