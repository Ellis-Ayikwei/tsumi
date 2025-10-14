# Update your serializer in apps/User/serializer.py

from apps.User.models import User, Address, UserActivity
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer for Django permissions"""

    class Meta:
        model = Permission
        fields = ["id", "name", "codename", "content_type"]
        read_only_fields = ["id", "content_type"]


class GroupSerializer(serializers.ModelSerializer):
    """Basic serializer for groups"""

    user_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ["id", "name", "user_count"]

    def get_user_count(self, obj):
        return (
            obj.custom_user_set.count()
        )  # Fixed: changed from user_set to custom_user_set


class GroupDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for groups with users and permissions"""

    users = serializers.SerializerMethodField()
    permissions = PermissionSerializer(many=True, read_only=True)
    user_count = serializers.SerializerMethodField()
    permission_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "id",
            "name",
            "users",
            "permissions",
            "user_count",
            "permission_count",
        ]

    def get_users(self, obj):
        return [
            {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_type": user.user_type,
                "account_status": user.account_status,
            }
            for user in obj.custom_user_set.all()  # Fixed: changed from user_set to custom_user_set
        ]

    def get_user_count(self, obj):
        return (
            obj.custom_user_set.count()
        )  # Fixed: changed from user_set to custom_user_set

    def get_permission_count(self, obj):
        return obj.permissions.count()


class UserWithGroupsSerializer(serializers.ModelSerializer):
    """User serializer that includes group information"""

    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "rating",
            "user_type",
            "account_status",
            "last_active",
            "date_joined",
            "groups",
            "user_permissions",
            "is_staff",
            "is_superuser",
        )
        read_only_fields = ("rating", "last_active", "date_joined")


class UserAuthSerializer(serializers.ModelSerializer):
    """Simplified user serializer for authentication state - excludes groups, permissions, and activities"""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "rating",
            "user_type",
            "account_status",
            "last_active",
            "date_joined",
            "groups",
        )
        read_only_fields = (
            "rating",
            "last_active",
            "date_joined",
        )


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = serializers.SerializerMethodField(read_only=True)
    roles = serializers.SerializerMethodField(read_only=True)
    user_activities = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "is_staff",
            "rating",
            "user_type",
            "account_status",
            "last_active",
            "date_joined",
            "groups",
            "user_permissions",
            "roles",
            "user_activities",
        )
        read_only_fields = (
            "rating",
            "last_active",
            "date_joined",
            "groups",
            "user_permissions",
            "roles",
            "user_activities",
        )

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_user_permissions(self, obj):
        # Get all effective permissions (direct + group)
        perms = obj.get_user_permissions() | obj.get_group_permissions()
        # Get Permission objects for all these codenames
        from django.contrib.auth.models import Permission

        permissions = Permission.objects.filter(
            codename__in=[p.split(".")[-1] for p in perms]
        )
        return PermissionSerializer(permissions, many=True).data

    def get_user_activities(self, obj):
        from .serializer import UserActivitySerializer

        activities = obj.activities.order_by("-created_at")[:10]
        return UserActivitySerializer(activities, many=True).data


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user serializer that includes a unified profile for customer or provider.

    The "profile" field will contain either the customer's profile data or the
    provider's profile data when available. If none is present, it returns null.
    """

    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(
        many=True, read_only=True, source="user_permissions.all"
    )
    customer_profile = serializers.SerializerMethodField(read_only=True)
    provider_profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "rating",
            "user_type",
            "account_status",
            "last_active",
            "is_staff",
            "date_joined",
            "groups",
            "user_permissions",
            "customer_profile",
            "provider_profile",
            "is_active",
        )
        read_only_fields = (
            "rating",
            "last_active",
            "date_joined",
            "groups",
            "user_permissions",
            "customer_profile",
            "provider_profile",
        )

    def get_customer_profile(self, obj):
        """Get customer profile if user is a customer"""
        print("trying to get customer profile for user", obj.user_type)
        if obj.user_type == "customer":
            try:
                from apps.Customer.models import CustomerProfile
                from apps.Customer.serializers import CustomerProfileSerializer

                customer_profile = CustomerProfile.objects.filter(user=obj).first()
                if customer_profile:
                    return CustomerProfileSerializer(customer_profile).data
                return None
            except ImportError:
                # Fallback if Customer app is not available
                return None
        return None

    def get_provider_profile(self, obj):
        """Get provider profile if user is a provider"""
        if obj.user_type == "provider":
            print("trying to get provider profile for user", obj.user_type)
            try:
                from apps.Provider.models import ServiceProvider
                from apps.Provider.serializer import ServiceProviderSerializer

                provider_profile = ServiceProvider.objects.filter(user=obj).first()
                if provider_profile:
                    return ServiceProviderSerializer(provider_profile).data
            except ImportError:
                # Fallback if Provider app is not available
                return None
        return None


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "address_user",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "address_type",
        ]


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ["id", "user", "activity_type", "request", "created_at", "details"]
        read_only_fields = ["created_at"]


class BulkUserGroupSerializer(serializers.Serializer):
    """Serializer for bulk user-group operations"""

    user_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)
    group_ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, required=False
    )

    def validate_user_ids(self, value):
        """Ensure all user IDs exist"""
        existing_ids = set(
            User.objects.filter(id__in=value).values_list("id", flat=True)
        )
        provided_ids = set(value)

        if existing_ids != provided_ids:
            missing_ids = provided_ids - existing_ids
            raise serializers.ValidationError(f"Users not found: {missing_ids}")

        return value

    def validate_group_ids(self, value):
        """Ensure all group IDs exist"""
        if value:
            existing_ids = set(
                Group.objects.filter(id__in=value).values_list("id", flat=True)
            )
            provided_ids = set(value)

            if existing_ids != provided_ids:
                missing_ids = provided_ids - existing_ids
                raise serializers.ValidationError(f"Groups not found: {missing_ids}")

        return value
