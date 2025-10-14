"""
Cleaned and structured service hierarchy data
Based on the exact hierarchy from requestflow.py
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
                        "items": [
                            "2 seater sofa",
                            "3 seater sofa",
                            "Armchair",
                            "Coffee table",
                            "TV",
                            "TV Unit",
                            "Side Tables",
                            "Book Case",
                            "Rug",
                            "Artwork",
                            "Lamps & Shades"
                        ]
                    },
                    "Bedroom": {
                        "description": "Bedroom furniture and items",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Kingsize Bed",
                            "Double Bed",
                            "Single Bed",
                            "Bedside Tables",
                            "Chest of Drawers",
                            "Wardrobe",
                            "Dressing Table",
                            "Mirror",
                            "Lamps & Shades",
                            "Suitcase",
                            "Wardrobe Boxes"
                        ]
                    },
                    "Dining Room": {
                        "description": "Dining room furniture and items",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Dining Table - 6 person",
                            "Dining Table - 8/10 person",
                            "Dining Chairs",
                            "Cabinet Dresser",
                            "Display Unit",
                            "Side Board",
                            "Rug"
                        ]
                    },
                    "Kitchen": {
                        "description": "Kitchen items and appliances",
                        "icon": "IconChefHat",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Kitchen Table",
                            "Chairs",
                            "Fridge",
                            "Fridge Freezer",
                            "Tumble Dryer",
                            "Washing Machine",
                            "Oven",
                            "Microwave",
                            "Shelving Unit",
                            "Bin",
                            "Vacuum Cleaner"
                        ]
                    },
                    "Bathroom": {
                        "description": "Bathroom items and fixtures",
                        "icon": "IconBath",
                        "color": "bg-cyan-100 text-cyan-800",
                        "tab_color": "bg-cyan-500 text-cyan-100",
                        "items": [
                            "Bathroom Cabinet",
                            "Storage units",
                            "Mirror",
                            "Bath",
                            "Sink",
                            "Rug"
                        ]
                    },
                    "Office": {
                        "description": "Home office furniture and equipment",
                        "icon": "IconDesk",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Desk",
                            "Office Chair",
                            "Pedestal",
                            "Filing Cabinet",
                            "Desktop computer",
                            "Printer"
                        ]
                    },
                    "Garden": {
                        "description": "Outdoor furniture and garden items",
                        "icon": "IconTrees",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Garden table",
                            "Chairs",
                            "Bench",
                            "Parasol",
                            "Lawn mower",
                            "Barbecue",
                            "Bicycle"
                        ]
                    },
                    "Boxes and Packaging": {
                        "description": "Moving boxes and packaging materials",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Extra Large Boxes",
                            "Large Boxes",
                            "Medium Boxes",
                            "Small Boxes",
                            "Artwork",
                            "Bicycle",
                            "Suitcase",
                            "Pool Table",
                            "Treadmill",
                            "Fish Tank"
                        ]
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
                        "items": [
                            "2 seater sofa",
                            "3 seater sofa",
                            "Armchair",
                            "Coffee table",
                            "TV",
                            "TV Unit",
                            "Side Tables",
                            "Book Case",
                            "Rug",
                            "Artwork",
                            "Lamps & Shades"
                        ]
                    },
                    "Bedroom": {
                        "description": "Bedroom items for international moves",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Kingsize Bed",
                            "Double Bed",
                            "Single Bed",
                            "Bedside Tables",
                            "Chest of Drawers",
                            "Wardrobe",
                            "Dressing Table",
                            "Mirror",
                            "Lamps & Shades",
                            "Suitcase",
                            "Wardrobe Boxes"
                        ]
                    },
                    "Dining Room": {
                        "description": "Dining room items for international moves",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Dining Table - 6 person",
                            "Dining Table - 8/10 person",
                            "Dining Chairs",
                            "Cabinet Dresser",
                            "Display Unit",
                            "Side Board",
                            "Rug"
                        ]
                    },
                    "Kitchen": {
                        "description": "Kitchen items for international moves",
                        "icon": "IconChefHat",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Kitchen Table",
                            "Chairs",
                            "Fridge",
                            "Fridge Freezer",
                            "Tumble Dryer",
                            "Washing Machine",
                            "Oven",
                            "Microwave",
                            "Shelving Unit",
                            "Bin",
                            "Vacuum Cleaner"
                        ]
                    },
                    "Bathroom": {
                        "description": "Bathroom items for international moves",
                        "icon": "IconBath",
                        "color": "bg-cyan-100 text-cyan-800",
                        "tab_color": "bg-cyan-500 text-cyan-100",
                        "items": [
                            "Bathroom Cabinet",
                            "Storage units",
                            "Mirror",
                            "Bath",
                            "Sink",
                            "Rug"
                        ]
                    },
                    "Office": {
                        "description": "Office items for international moves",
                        "icon": "IconDesk",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Desk",
                            "Office Chair",
                            "Pedestal",
                            "Filing Cabinet",
                            "Desktop computer",
                            "Printer"
                        ]
                    },
                    "Garden": {
                        "description": "Garden items for international moves",
                        "icon": "IconTrees",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Garden table",
                            "Chairs",
                            "Bench",
                            "Parasol",
                            "Lawn mower",
                            "Barbecue",
                            "Bicycle"
                        ]
                    },
                    "Boxes and Packaging": {
                        "description": "Packaging for international moves",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Extra Large Boxes",
                            "Large Boxes",
                            "Medium Boxes",
                            "Small Boxes",
                            "Artwork",
                            "Bicycle",
                            "Suitcase",
                            "Pool Table",
                            "Treadmill",
                            "Fish Tank"
                        ]
                    }
                }
            },
            "Office Removals": {
                "description": "Business and commercial moving services including office furniture and equipment",
                "icon": "IconBuilding",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {
                    "Furniture": {
                        "description": "Office furniture",
                        "icon": "IconDesk",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Office Desk",
                            "Office Chair",
                            "Pedestal Desk",
                            "Corner Desk",
                            "Corner desk with pedestal",
                            "Standing desk",
                            "Standing desk - electric",
                            "Stacking Chair",
                            "Coffee Table"
                        ]
                    },
                    "Storage": {
                        "description": "Office storage solutions",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Small Filing Cabinet",
                            "Large Filing cabinet",
                            "Pedestal",
                            "Cupboard",
                            "Bookcase",
                            "Storage Cabinet",
                            "Locker"
                        ]
                    },
                    "Office Equipment": {
                        "description": "Office equipment and electronics",
                        "icon": "IconDeviceDesktop",
                        "color": "bg-gray-100 text-gray-800",
                        "tab_color": "bg-gray-500 text-gray-100",
                        "items": [
                            "Computer",
                            "Computer Monitor",
                            "Printer",
                            "Photocopier",
                            "Tv",
                            "Drawing Board",
                            "Projector",
                            "Projector Screen",
                            "Mini Fridge",
                            "Paper Shredder",
                            "Display Board"
                        ]
                    },
                    "Kitchen": {
                        "description": "Office kitchen items",
                        "icon": "IconChefHat",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Kitchen Table",
                            "Chair",
                            "Stool",
                            "Water Cooler"
                        ]
                    },
                    "Boxes & Packaging": {
                        "description": "Office packaging materials",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Small Box (Approx. 40 x 30 x 30 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Crate",
                            "Bag"
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
                    "Television": {
                        "description": "TVs and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Large Television/TV (Greater than 40\")",
                            "Medium Television/TV (30\" to 40\")",
                            "Small Television/TV (Less than 30\")",
                            "TV Stand"
                        ]
                    },
                    "Sofas": {
                        "description": "Sofas and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": [
                            "Two Seater Sofa",
                            "Three Seater Sofa",
                            "Four Seater Sofa",
                            "L Shaped Sofa",
                            "Two Seater Reclining Sofa",
                            "Three Seater Reclining Sofa",
                            "Two Seater Sofa Bed",
                            "Three Seater Sofa Bed",
                            "Corner Sofa Bed"
                        ]
                    },
                    "Chairs": {
                        "description": "Various types of chairs",
                        "icon": "IconChair",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Armchair",
                            "Office Chair",
                            "Dining Chair",
                            "Garden Chair",
                            "Desk Chair",
                            "Folding Chair",
                            "Rocking Chair",
                            "Sofa Chair"
                        ]
                    },
                    "Tables": {
                        "description": "Tables and desks",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Coffee Table",
                            "4 Seater Dining Table & Chairs",
                            "6 Seater Dining Table & Chairs",
                            "4 Seater Dining Table",
                            "6 Seater Dining Table",
                            "Office Desk",
                            "Bedside Table",
                            "Garden Table",
                            "Dressing Table",
                            "Small Desk"
                        ]
                    },
                    "Beds & Mattresses": {
                        "description": "Beds and mattresses",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Double Bed & Mattress",
                            "Kingsize Bed & Mattress",
                            "Single Bed & Mattress",
                            "Double Bed Frame",
                            "Kingsize Bed Frame",
                            "Single Bed Frame",
                            "Bunk Bed",
                            "Sofa Bed",
                            "Double Mattress",
                            "Kingsize Mattress",
                            "Single Mattress"
                        ]
                    },
                    "Wardrobes": {
                        "description": "Wardrobes and storage furniture",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Double Wardrobe",
                            "Single Wardrobe",
                            "Triple Wardrobe",
                            "Chest Of Drawers",
                            "Bookcase",
                            "Shelf",
                            "Flat Packed Wardrobe"
                        ]
                    },
                    "Clothing": {
                        "description": "Clothing and personal items",
                        "icon": "IconShirt",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": []
                    },
                    "Boxes": {
                        "description": "Moving boxes and packaging",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Small Box (Approx. 40 x 30 x 30 cm)"
                        ]
                    }
                }
            },
            "Storage Services": {
                "description": "Secure storage solutions with collection and delivery services",
                "icon": "IconBox",
                "color": "bg-blue-100 text-blue-800",
                "tab_color": "bg-blue-500 text-blue-100",
                "items": {}
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
                    "Television": {
                        "description": "TVs and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Large Television/TV (Greater than 40\")",
                            "Medium Television/TV (30\" to 40\")",
                            "Small Television/TV (Less than 30\")",
                            "TV Stand"
                        ]
                    },
                    "Sofas": {
                        "description": "Sofas and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": [
                            "Two Seater Sofa",
                            "Three Seater Sofa",
                            "Four Seater Sofa",
                            "L Shaped Sofa",
                            "Two Seater Reclining Sofa",
                            "Three Seater Reclining Sofa",
                            "Two Seater Sofa Bed",
                            "Three Seater Sofa Bed",
                            "Corner Sofa Bed"
                        ]
                    },
                    "Chairs": {
                        "description": "Various types of chairs",
                        "icon": "IconChair",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Armchair",
                            "Office Chair",
                            "Dining Chair",
                            "Garden Chair",
                            "Desk Chair",
                            "Folding Chair",
                            "Rocking Chair",
                            "Sofa Chair"
                        ]
                    },
                    "Tables": {
                        "description": "Tables and desks",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Coffee Table",
                            "4 Seater Dining Table & Chairs",
                            "6 Seater Dining Table & Chairs",
                            "4 Seater Dining Table",
                            "6 Seater Dining Table",
                            "Office Desk",
                            "Bedside Table",
                            "Garden Table",
                            "Dressing Table",
                            "Small Desk"
                        ]
                    },
                    "Beds & Mattresses": {
                        "description": "Beds and mattresses",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Double Bed & Mattress",
                            "Kingsize Bed & Mattress",
                            "Single Bed & Mattress",
                            "Double Bed Frame",
                            "Kingsize Bed Frame",
                            "Single Bed Frame",
                            "Bunk Bed",
                            "Sofa Bed",
                            "Double Mattress",
                            "Kingsize Mattress",
                            "Single Mattress"
                        ]
                    },
                    "Wardrobes": {
                        "description": "Wardrobes and storage furniture",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Double Wardrobe",
                            "Single Wardrobe",
                            "Triple Wardrobe",
                            "Chest Of Drawers",
                            "Bookcase",
                            "Shelf",
                            "Flat Packed Wardrobe"
                        ]
                    },
                    "Clothing": {
                        "description": "Clothing and personal items",
                        "icon": "IconShirt",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": []
                    },
                    "Boxes": {
                        "description": "Moving boxes and packaging",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Small Box (Approx. 40 x 30 x 30 cm)"
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
                    "Piano Type": {
                        "description": "Different types of pianos",
                        "icon": "IconMusic",
                        "color": "bg-red-100 text-red-800",
                        "tab_color": "bg-red-500 text-red-100",
                        "items": [
                            "Digital Piano",
                            "Upright Piano",
                            "Grand Piano",
                            "Baby Grand Piano",
                            "Concert Grand Piano"
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
                    "Television": {
                        "description": "TVs and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Large Television/TV (Greater than 40\")",
                            "Medium Television/TV (30\" to 40\")",
                            "Small Television/TV (Less than 30\")",
                            "TV Stand"
                        ]
                    },
                    "Sofas": {
                        "description": "Sofas and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": [
                            "Two Seater Sofa",
                            "Three Seater Sofa",
                            "Four Seater Sofa",
                            "L Shaped Sofa",
                            "Two Seater Reclining Sofa",
                            "Three Seater Reclining Sofa",
                            "Two Seater Sofa Bed",
                            "Three Seater Sofa Bed",
                            "Corner Sofa Bed"
                        ]
                    },
                    "Chairs": {
                        "description": "Various types of chairs",
                        "icon": "IconChair",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Armchair",
                            "Office Chair",
                            "Dining Chair",
                            "Garden Chair",
                            "Desk Chair",
                            "Folding Chair",
                            "Rocking Chair",
                            "Sofa Chair"
                        ]
                    },
                    "Tables": {
                        "description": "Tables and desks",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Coffee Table",
                            "4 Seater Dining Table & Chairs",
                            "6 Seater Dining Table & Chairs",
                            "4 Seater Dining Table",
                            "6 Seater Dining Table",
                            "Office Desk",
                            "Bedside Table",
                            "Garden Table",
                            "Dressing Table",
                            "Small Desk"
                        ]
                    },
                    "Beds & Mattresses": {
                        "description": "Beds and mattresses",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Double Bed & Mattress",
                            "Kingsize Bed & Mattress",
                            "Single Bed & Mattress",
                            "Double Bed Frame",
                            "Kingsize Bed Frame",
                            "Single Bed Frame",
                            "Bunk Bed",
                            "Sofa Bed",
                            "Double Mattress",
                            "Kingsize Mattress",
                            "Single Mattress"
                        ]
                    },
                    "Wardrobes": {
                        "description": "Wardrobes and storage furniture",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Double Wardrobe",
                            "Single Wardrobe",
                            "Triple Wardrobe",
                            "Chest Of Drawers",
                            "Bookcase",
                            "Shelf",
                            "Flat Packed Wardrobe"
                        ]
                    },
                    "Clothing": {
                        "description": "Clothing and personal items",
                        "icon": "IconShirt",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": []
                    },
                    "Boxes": {
                        "description": "Moving boxes and packaging",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Small Box (Approx. 40 x 30 x 30 cm)"
                        ]
                    }
                }
            },
            "eBay Delivery": {
                "description": "Specialized delivery services for eBay purchases and sales",
                "icon": "IconPackageImport",
                "color": "bg-purple-100 text-purple-800",
                "tab_color": "bg-purple-500 text-purple-100",
                "items": {}
            },
            "Gumtree Delivery": {
                "description": "Delivery services for Gumtree purchases and sales",
                "icon": "IconPackageImport",
                "color": "bg-green-100 text-green-800",
                "tab_color": "bg-green-500 text-green-100",
                "items": {}
            },
            "Heavy & Large Item Delivery": {
                "description": "Specialized transport for oversized items, appliances, and bulky goods",
                "icon": "IconArrowsMaximize",
                "color": "bg-orange-100 text-orange-800",
                "tab_color": "bg-orange-500 text-orange-100",
                "items": {
                    "Television": {
                        "description": "TVs and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Large Television/TV (Greater than 40\")",
                            "Medium Television/TV (30\" to 40\")",
                            "Small Television/TV (Less than 30\")",
                            "TV Stand"
                        ]
                    },
                    "Sofas": {
                        "description": "Sofas and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": [
                            "Two Seater Sofa",
                            "Three Seater Sofa",
                            "Four Seater Sofa",
                            "L Shaped Sofa",
                            "Two Seater Reclining Sofa",
                            "Three Seater Reclining Sofa",
                            "Two Seater Sofa Bed",
                            "Three Seater Sofa Bed",
                            "Corner Sofa Bed"
                        ]
                    },
                    "Chairs": {
                        "description": "Various types of chairs",
                        "icon": "IconChair",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Armchair",
                            "Office Chair",
                            "Dining Chair",
                            "Garden Chair",
                            "Desk Chair",
                            "Folding Chair",
                            "Rocking Chair",
                            "Sofa Chair"
                        ]
                    },
                    "Tables": {
                        "description": "Tables and desks",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Coffee Table",
                            "4 Seater Dining Table & Chairs",
                            "6 Seater Dining Table & Chairs",
                            "4 Seater Dining Table",
                            "6 Seater Dining Table",
                            "Office Desk",
                            "Bedside Table",
                            "Garden Table",
                            "Dressing Table",
                            "Small Desk"
                        ]
                    },
                    "Beds & Mattresses": {
                        "description": "Beds and mattresses",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Double Bed & Mattress",
                            "Kingsize Bed & Mattress",
                            "Single Bed & Mattress",
                            "Double Bed Frame",
                            "Kingsize Bed Frame",
                            "Single Bed Frame",
                            "Bunk Bed",
                            "Sofa Bed",
                            "Double Mattress",
                            "Kingsize Mattress",
                            "Single Mattress"
                        ]
                    },
                    "Wardrobes": {
                        "description": "Wardrobes and storage furniture",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Double Wardrobe",
                            "Single Wardrobe",
                            "Triple Wardrobe",
                            "Chest Of Drawers",
                            "Bookcase",
                            "Shelf",
                            "Flat Packed Wardrobe"
                        ]
                    },
                    "Clothing": {
                        "description": "Clothing and personal items",
                        "icon": "IconShirt",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": []
                    },
                    "Boxes": {
                        "description": "Moving boxes and packaging",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Small Box (Approx. 40 x 30 x 30 cm)"
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
                    "Television": {
                        "description": "TVs and entertainment equipment",
                        "icon": "IconDeviceTv",
                        "color": "bg-green-100 text-green-800",
                        "tab_color": "bg-green-500 text-green-100",
                        "items": [
                            "Large Television/TV (Greater than 40\")",
                            "Medium Television/TV (30\" to 40\")",
                            "Small Television/TV (Less than 30\")",
                            "TV Stand"
                        ]
                    },
                    "Sofas": {
                        "description": "Sofas and seating furniture",
                        "icon": "IconSofa",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": [
                            "Two Seater Sofa",
                            "Three Seater Sofa",
                            "Four Seater Sofa",
                            "L Shaped Sofa",
                            "Two Seater Reclining Sofa",
                            "Three Seater Reclining Sofa",
                            "Two Seater Sofa Bed",
                            "Three Seater Sofa Bed",
                            "Corner Sofa Bed"
                        ]
                    },
                    "Chairs": {
                        "description": "Various types of chairs",
                        "icon": "IconChair",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Armchair",
                            "Office Chair",
                            "Dining Chair",
                            "Garden Chair",
                            "Desk Chair",
                            "Folding Chair",
                            "Rocking Chair",
                            "Sofa Chair"
                        ]
                    },
                    "Tables": {
                        "description": "Tables and desks",
                        "icon": "IconTable",
                        "color": "bg-amber-100 text-amber-800",
                        "tab_color": "bg-amber-500 text-amber-100",
                        "items": [
                            "Coffee Table",
                            "4 Seater Dining Table & Chairs",
                            "6 Seater Dining Table & Chairs",
                            "4 Seater Dining Table",
                            "6 Seater Dining Table",
                            "Office Desk",
                            "Bedside Table",
                            "Garden Table",
                            "Dressing Table",
                            "Small Desk"
                        ]
                    },
                    "Beds & Mattresses": {
                        "description": "Beds and mattresses",
                        "icon": "IconBed",
                        "color": "bg-purple-100 text-purple-800",
                        "tab_color": "bg-purple-500 text-purple-100",
                        "items": [
                            "Double Bed & Mattress",
                            "Kingsize Bed & Mattress",
                            "Single Bed & Mattress",
                            "Double Bed Frame",
                            "Kingsize Bed Frame",
                            "Single Bed Frame",
                            "Bunk Bed",
                            "Sofa Bed",
                            "Double Mattress",
                            "Kingsize Mattress",
                            "Single Mattress"
                        ]
                    },
                    "Wardrobes": {
                        "description": "Wardrobes and storage furniture",
                        "icon": "IconShirt",
                        "color": "bg-indigo-100 text-indigo-800",
                        "tab_color": "bg-indigo-500 text-indigo-100",
                        "items": [
                            "Double Wardrobe",
                            "Single Wardrobe",
                            "Triple Wardrobe",
                            "Chest Of Drawers",
                            "Bookcase",
                            "Shelf",
                            "Flat Packed Wardrobe"
                        ]
                    },
                    "Clothing": {
                        "description": "Clothing and personal items",
                        "icon": "IconShirt",
                        "color": "bg-blue-100 text-blue-800",
                        "tab_color": "bg-blue-500 text-blue-100",
                        "items": []
                    },
                    "Boxes": {
                        "description": "Moving boxes and packaging",
                        "icon": "IconBox",
                        "color": "bg-orange-100 text-orange-800",
                        "tab_color": "bg-orange-500 text-orange-100",
                        "items": [
                            "Large Box (Approx. 50 x 50 x 50 cm)",
                            "Medium Box (Approx. 45 x 45 x 35 cm)",
                            "Small Box (Approx. 40 x 30 x 30 cm)"
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
                    "Car Brands": {
                        "description": "Select car manufacturer - brands will be populated separately",
                        "icon": "IconCar",
                        "color": "bg-slate-100 text-slate-800",
                        "tab_color": "bg-slate-500 text-slate-100",
                        "typical_dimensions": {"length": "4.5", "width": "1.8", "height": "1.5", "unit": "m"},
                        "typical_weight": 1500,
                        "items": []
                    }
                }
            },
            "Motorcycle Transport": {
                "description": "Specialized motorcycle transport with proper securing",
                "icon": "IconMotorbike",
                "color": "bg-red-100 text-red-800",
                "tab_color": "bg-red-500 text-red-100",
                "items": {
                    "Motorcycle Types": {
                        "description": "Select motorcycle type",
                        "icon": "IconMotorbike",
                        "color": "bg-red-100 text-red-800",
                        "tab_color": "bg-red-500 text-red-100",
                        "items": [
                            "Standard",
                            "Sport",
                            "Scooter",
                            "Cruiser",
                            "Motocross",
                            "Tourer",
                            "Adventure",
                            "Quad Bike"
                        ]
                    }
                }
            }
        }
    }
}
