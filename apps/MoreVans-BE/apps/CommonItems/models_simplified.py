from django.db import models
from apps.Basemodel.models import Basemodel


class SimplifiedItemCategory(Basemodel):
    """Simplified item categories that are context-aware and service-specific"""

    name = models.CharField(max_length=100)
    service_type = models.ForeignKey(
        "Services.Services",
        on_delete=models.CASCADE,
        related_name="item_categories",
        help_text="Service type this category belongs to",
    )
    description = models.TextField(blank=True)

    # Physical properties (typical for this category)
    typical_weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Typical weight in kg",
    )
    typical_dimensions = models.JSONField(
        null=True, blank=True, help_text="Typical dimensions as JSON object"
    )

    # Handling requirements
    requires_disassembly = models.BooleanField(
        default=False, help_text="Items in this category typically need disassembly"
    )
    fragile = models.BooleanField(
        default=False, help_text="Items in this category are typically fragile"
    )
    vehicle_type_required = models.CharField(
        max_length=50,
        blank=True,
        help_text="Required vehicle type (e.g., 'van', 'truck', 'specialist')",
    )
    requires_special_handling = models.BooleanField(
        default=False, help_text="Items require special handling procedures"
    )
    insurance_required = models.BooleanField(
        default=False, help_text="Items require additional insurance"
    )
    documentation_required = models.BooleanField(
        default=False, help_text="Items require special documentation"
    )

    # Visual properties
    icon = models.CharField(
        max_length=100, blank=True, help_text="FontAwesome icon name"
    )
    color = models.CharField(max_length=255, blank=True, help_text="CSS color classes")
    tab_color = models.CharField(
        max_length=255, blank=True, help_text="CSS color classes for tabs"
    )

    # Pricing
    base_price_multiplier = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.0,
        help_text="Price multiplier for this category",
    )

    # Display order
    priority = models.IntegerField(default=0, help_text="Display priority order")
    is_active = models.BooleanField(
        default=True, help_text="Category is active and available"
    )

    def __str__(self):
        return f"{self.name} ({self.service_type.name})"

    class Meta:
        db_table = "simplified_item_category"
        managed = True
        verbose_name = "Simplified Item Category"
        verbose_name_plural = "Simplified Item Categories"
        ordering = ["service_type__name", "priority", "name"]
        unique_together = ["name", "service_type"]


class SimplifiedCommonItem(Basemodel):
    """Simplified common items with context-aware categorization"""

    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        SimplifiedItemCategory,
        on_delete=models.CASCADE,
        related_name="items",
        help_text="Category this item belongs to",
    )

    # Physical properties (can override category defaults)
    weight = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Weight in kg (overrides category default)",
    )
    dimensions = models.JSONField(
        null=True,
        blank=True,
        help_text="Dimensions as JSON object (overrides category default)",
    )

    # Handling requirements (can override category defaults)
    needs_disassembly = models.BooleanField(
        default=False, help_text="Item needs disassembly (overrides category default)"
    )
    fragile = models.BooleanField(
        default=False, help_text="Item is fragile (overrides category default)"
    )
    requires_special_handling = models.BooleanField(
        default=False,
        help_text="Item requires special handling (overrides category default)",
    )

    # Additional information
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True, help_text="Additional notes about this item")

    # Visual properties
    icon = models.CharField(
        max_length=100, blank=True, help_text="FontAwesome icon name"
    )
    image = models.URLField(blank=True, help_text="URL to item image")

    # Display order
    priority = models.IntegerField(
        default=0, help_text="Display priority order within category"
    )
    is_active = models.BooleanField(
        default=True, help_text="Item is active and available"
    )

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    class Meta:
        db_table = "simplified_common_item"
        managed = True
        verbose_name = "Simplified Common Item"
        verbose_name_plural = "Simplified Common Items"
        ordering = [
            "category__service_type__name",
            "category__name",
            "priority",
            "name",
        ]
        unique_together = ["name", "category"]

    @property
    def effective_weight(self):
        """Returns the effective weight (item weight or category default)"""
        return self.weight or self.category.typical_weight

    @property
    def effective_dimensions(self):
        """Returns the effective dimensions (item dimensions or category default)"""
        return self.dimensions or self.category.typical_dimensions

    @property
    def effective_needs_disassembly(self):
        """Returns the effective disassembly requirement"""
        return self.needs_disassembly or self.category.requires_disassembly

    @property
    def effective_fragile(self):
        """Returns the effective fragile status"""
        return self.fragile or self.category.fragile

    @property
    def effective_requires_special_handling(self):
        """Returns the effective special handling requirement"""
        return self.requires_special_handling or self.category.requires_special_handling

    def get_dimensions_display(self):
        """Returns formatted dimensions string"""
        dims = self.effective_dimensions
        if not dims:
            return ""
        try:
            if isinstance(dims, dict):
                parts = []
                if dims.get("length"):
                    parts.append(f"L: {dims['length']}")
                if dims.get("width"):
                    parts.append(f"W: {dims['width']}")
                if dims.get("height"):
                    parts.append(f"H: {dims['height']}")
                return " × ".join(parts) if parts else ""
            return str(dims)
        except:
            return str(dims)

    def get_weight_display(self):
        """Returns formatted weight string"""
        weight = self.effective_weight
        if weight:
            return weight
        return ""

    def get_handling_requirements(self):
        """Returns list of handling requirements"""
        requirements = []
        if self.effective_fragile:
            requirements.append("Fragile")
        if self.effective_needs_disassembly:
            requirements.append("Disassembly Required")
        if self.effective_requires_special_handling:
            requirements.append("Special Handling")
        if self.category.insurance_required:
            requirements.append("Insurance Required")
        if self.category.documentation_required:
            requirements.append("Documentation Required")
        return requirements


# Keep existing models for now (will be removed after migration)
# This allows for gradual migration
