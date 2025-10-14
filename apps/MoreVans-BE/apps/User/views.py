from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
import logging

from .models import User, Address, UserActivity
from .serializer import UserSerializer, AddressSerializer, UserActivitySerializer
from apps.Request.models import Request
from django.core.exceptions import PermissionDenied

logger = logging.getLogger(__name__)


class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type in ["admin"]


class IsSuperAdminUser(permissions.BasePermission):
    """
    Permission to only allow super admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsProviderUser(permissions.BasePermission):
    """
    Permission to only allow provider users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "provider"


class IsCustomerUser(permissions.BasePermission):
    """
    Permission to only allow customer users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "customer"


class IsSelfOrAdmin(permissions.BasePermission):
    """
    Allow users to edit their own profiles, and admins to edit any profile.
    """

    def has_object_permission(self, request, view, obj):
        # Allow admins to edit any user
        if request.user.user_type in ["admin"] or request.user.is_superuser:
            return True

        # Allow users to edit themselves
        return obj.id == request.user.id


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing all types of users.
    Provides CRUD operations and additional actions for user management.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        """
        Use the detailed serializer for single-user reads.
        """
        if self.action in ["retrieve", "me"]:
            from apps.User.serializer import UserDetailSerializer

            return UserDetailSerializer
        return UserSerializer

    def get_permissions(self):
        """
        Custom permissions based on action:
        - List/retrieve: Any authenticated user
        - Create: Admin users only (except for create_customer action)
        - Update/delete: Admin or self
        """
        if self.action == "create":
            permission_classes = [IsAdminUser | IsSuperAdminUser]
        elif self.action in ["update", "partial_update"]:
            # Auth required; object-level check enforced in get_object/update
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ["destroy"]:
            permission_classes = [IsSelfOrAdmin]
        elif self.action in ["create_customer", "create_provider", "create_admin"]:
            if self.action == "create_customer":
                permission_classes = [permissions.AllowAny]
            else:
                permission_classes = [IsAdminUser | IsSuperAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_object(self):
        """
        Restrict non-admin access to their own user object.
        """
        obj = super().get_object()
        if obj.id != self.request.user.id and not (
            getattr(self.request.user, "user_type", None) in ["admin"]
            or getattr(self.request.user, "is_superuser", False)
        ):
            raise PermissionDenied("You can only access your own user data.")
        return obj

    def update(self, request, *args, **kwargs):
        """
        Allow non-admins to update only basic profile fields; admins can update all.
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        is_admin = (
            getattr(request.user, "is_staff", False)
            or getattr(request.user, "is_superuser", False)
            or getattr(request.user, "user_type", None) == "admin"
        )

        if is_admin:
            serializer = self.get_serializer(
                instance, data=request.data, partial=partial
            )
        else:
            if "user_type" in request.data:
                return Response(
                    {"detail": "You cannot change your user type."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            allowed_fields = {
                "first_name",
                "last_name",
                "phone_number",
                "profile_picture",
                "date_of_birth",
                "gender",
                "address_line1",
                "address_line2",
                "city",
                "state",
                "postal_code",
                "country",
                "timezone",
                "language_preference",
                "notification_preferences",
            }
            filtered_data = {
                k: v for k, v in request.data.items() if k in allowed_fields
            }
            if not filtered_data:
                return Response(
                    {"detail": "No valid fields to update."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            serializer = self.get_serializer(instance, data=filtered_data, partial=True)

        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def get_queryset(self):
        """
        Customizes the queryset based on user type and query parameters.
        - Admins can see all users
        - Regular users can only see themselves
        """
        queryset = User.objects.all()

        # Filter by user type if specified
        user_type = self.request.query_params.get("type")
        if user_type:
            queryset = queryset.filter(user_type=user_type)

        # Filter by status if specified
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(account_status=status_param)

        # Search by name or email if specified
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
                | Q(phone_number__icontains=search)
            )

        # Regular users can only see themselves, admins can see all
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(id=self.request.user.id)

        return queryset

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.AllowAny],
        authentication_classes=[],
    )
    def create_customer(self, request):
        """
        Creates a new customer user or returns existing user if email already exists.
        This endpoint is publicly accessible to allow customer registration.
        """
        print("the create customer endpoint was called")
        data = request.data.copy()
        data["user_type"] = "customer"

        # Check if user with this email already exists
        email = data.get("email")
        if email:
            email = email.strip().lower()
            try:
                existing_user = User.objects.get(email__iexact=email)
                logger.info(
                    f"User with email {email} already exists, returning existing user: {existing_user.id}"
                )

                # Return existing user data
                return Response(
                    self.get_serializer(existing_user).data, status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                # User doesn't exist, proceed with creation
                pass

        # Create new user
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()
            logger.info(f"New customer user created: {user.id}")
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_profile(self, request, pk=None):
        """
        Allow a user to update a subset of basic profile fields on their own account.
        """
        instance = self.get_object()
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only update your own profile."},
                status=status.HTTP_403_FORBIDDEN,
            )
        allowed_fields = {
            "first_name",
            "last_name",
            "phone_number",
            "profile_picture",
            "date_of_birth",
            "gender",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "timezone",
            "language_preference",
            "notification_preferences",
        }
        filtered_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        if not filtered_data:
            return Response(
                {"detail": "No valid profile fields to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = self.get_serializer(instance, data=filtered_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Profile updated successfully", "user": serializer.data}
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(self, request, pk=None):
        """
        Let a user change their own password with current/new/confirm validation.
        """
        instance = self.get_object()
        if instance.id != request.user.id:
            return Response(
                {"detail": "You can only change your own password."},
                status=status.HTTP_403_FORBIDDEN,
            )
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        if not all([current_password, new_password, confirm_password]):
            return Response(
                {
                    "detail": "current_password, new_password, and confirm_password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not instance.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_password != confirm_password:
            return Response(
                {"detail": "New password and confirm password do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if current_password == new_password:
            return Response(
                {"detail": "New password must be different from current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance.set_password(new_password)
        instance.save()
        return Response(
            {"detail": "Password changed successfully."}, status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def create_provider(self, request):
        """
        Creates a new service provider user.
        Only accessible to admin users.
        """
        data = request.data.copy()
        data["user_type"] = "provider"

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()
            logger.info(f"Provider user created by admin {request.user.id}: {user.id}")
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[IsSuperAdminUser])
    def create_admin(self, request):
        """
        Creates a new admin user.
        Only accessible to super admin users.
        """
        data = request.data.copy()
        data["user_type"] = "admin"

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Hash the password
            if "password" in data:
                serializer.validated_data["password"] = make_password(data["password"])

            user = serializer.save()
            logger.info(
                f"Admin user created by super admin {request.user.id}: {user.id}"
            )
            return Response(
                self.get_serializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def activate(self, request, pk=None):
        """
        Activates a user account.
        Only accessible to admin users.
        """
        user = self.get_object()
        user.account_status = "active"
        user.save()

        logger.info(f"User {user.id} activated by admin {request.user.id}")
        return Response({"status": "User activated successfully"})

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def deactivate(self, request, pk=None):
        """
        Deactivates a user account.
        Only accessible to admin users.
        """
        user = self.get_object()
        user.account_status = "inactive"
        user.save()

        logger.info(f"User {user.id} deactivated by admin {request.user.id}")
        return Response({"status": "User deactivated successfully"})

    @action(detail=True, methods=["post"], permission_classes=[IsSuperAdminUser])
    def promote_to_admin(self, request, pk=None):
        """
        Promotes a user to admin role.
        Only accessible to super admin users.
        """
        user = self.get_object()
        user.user_type = "admin"
        user.save()

        logger.info(
            f"User {user.id} promoted to admin by super admin {request.user.id}"
        )
        return Response({"status": "User promoted to admin successfully"})

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def verify(self, request, pk=None):
        """
        Manually verify a user account.
        Only accessible to admin users.
        """
        user = self.get_object()
        user.is_active = True

        # Update verification status
        from apps.Authentication.models import UserVerification

        verification, created = UserVerification.objects.get_or_create(
            user=user, defaults={"email_verified": True}
        )
        if not created:
            verification.email_verified = True
            verification.email_verified_at = timezone.now()
            verification.save()

        user.save()

        logger.info(f"User {user.id} verified by admin {request.user.id}")
        return Response({"status": "User verified successfully"})

    @action(detail=False, methods=["get"])
    def me(self, request):
        """
        Returns the current user's profile.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def activity(self, request, pk=None):
        """
        Returns a user's activity history.
        Regular users can only see their own activity.
        """
        user = self.get_object()
        activities = UserActivity.objects.filter(user=user).order_by("-timestamp")

        page = self.paginate_queryset(activities)
        if page is not None:
            serializer = UserActivitySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = UserActivitySerializer(activities, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def requests(self, request, pk=None):
        """
        Returns a user's requests.
        Filtered by status if specified.
        """
        user = self.get_object()

        # Check if user is requesting their own data or is an admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {"detail": "You do not have permission to view this user's requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        status_filter = request.query_params.get("status")
        requests = Request.objects.filter(user=user)

        if status_filter:
            requests = requests.filter(status=status_filter)

        from Request.serializer import RequestSerializer

        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def stats(self, request):
        """
        Returns user statistics.
        Only accessible to admin users.
        """
        total_users = User.objects.count()
        total_customers = User.objects.filter(user_type="customer").count()
        total_providers = User.objects.filter(user_type="provider").count()
        total_admins = User.objects.filter(user_type="admin").count()

        active_users = User.objects.filter(account_status="active").count()
        inactive_users = User.objects.filter(account_status="inactive").count()

        # New users in the last 30 days
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        new_users_30d = User.objects.filter(date_joined__gte=thirty_days_ago).count()

        # Request statistics by user type
        customer_requests = Request.objects.filter(user__user_type="customer").count()

        stats = {
            "total_users": total_users,
            "by_type": {
                "customers": total_customers,
                "providers": total_providers,
                "admins": total_admins,
            },
            "by_status": {
                "active": active_users,
                "inactive": inactive_users,
            },
            "new_users_30d": new_users_30d,
            "requests": {
                "total_customer_requests": customer_requests,
            },
        }

        return Response(stats)

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def get_user_by_email(self, request):
        """
        Gets a user by their email address.
        Returns basic user information including user_id.
        This endpoint is publicly accessible for guest user flows.
        """
        email = request.query_params.get("email")

        if not email:
            return Response(
                {"detail": "Email parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email__iexact=email.strip().lower())

            # Return minimal user data for security
            user_data = {
                "user_id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_type": user.user_type,
                "account_status": user.account_status,
            }

            logger.info(f"User lookup by email successful: {user.id}")
            return Response(user_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response(
                {"detail": "User not found with this email address."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            logger.error(f"Error in get_user_by_email: {str(e)}")
            return Response(
                {"detail": "An error occurred while fetching user data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def update_groups(self, request, pk=None):
        """
        Update user's group memberships.
        Replaces all existing groups with the provided ones.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.set(groups)

        logger.info(f"Updated groups for user {user.id} by admin {request.user.id}")
        return Response(
            {
                "status": f"Updated groups for user {user.email}",
                "groups": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def add_to_groups(self, request, pk=None):
        """
        Add user to additional groups without removing existing ones.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.add(*groups)

        logger.info(
            f"Added user {user.id} to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added user to {groups.count()} groups",
                "groups_added": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def remove_from_groups(self, request, pk=None):
        """
        Remove user from specified groups.
        """
        user = self.get_object()
        group_ids = request.data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        groups = Group.objects.filter(id__in=group_ids, user=user)
        user.groups.remove(*groups)

        logger.info(
            f"Removed user {user.id} from {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed user from {groups.count()} groups",
                "groups_removed": [group.name for group in groups],
            }
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def update_permissions(self, request, pk=None):
        """
        Update user's individual permissions.
        """
        user = self.get_object()
        permission_ids = request.data.get("permission_ids", [])

        permissions = Permission.objects.filter(id__in=permission_ids)
        user.user_permissions.set(permissions)

        logger.info(
            f"Updated permissions for user {user.id} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Updated permissions for user {user.email}",
                "permission_count": permissions.count(),
            }
        )

    @action(detail=True, methods=["get"])
    def groups_and_permissions(self, request, pk=None):
        """
        Get user's groups and permissions in detail.
        """
        user = self.get_object()

        # Check if user is requesting their own data or is an admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {
                    "detail": "You do not have permission to view this user's groups and permissions."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        data = {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "user_type": user.user_type,
            },
            "groups": [
                {
                    "id": group.id,
                    "name": group.name,
                    "permissions": [
                        {"id": perm.id, "name": perm.name, "codename": perm.codename}
                        for perm in group.permissions.all()
                    ],
                }
                for group in user.groups.all()
            ],
            "individual_permissions": [
                {"id": perm.id, "name": perm.name, "codename": perm.codename}
                for perm in user.user_permissions.all()
            ],
            "all_permissions": [
                {
                    "id": perm.id,
                    "name": perm.name,
                    "codename": perm.codename,
                    "source": (
                        "group"
                        if perm in user.get_group_permissions()
                        else "individual"
                    ),
                }
                for perm in user.get_all_permissions()
            ],
        }

        return Response(data)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated, permissions.IsAdminUser],
    )
    def admin_change_password(self, request, pk=None):
        """
        Change user's password.
        Users can only change their own password unless they are admin.
        """
        user = self.get_object()

        # Check if user is changing their own password or is admin
        if user.id != request.user.id and not (
            request.user.user_type in ["admin"] or request.user.is_superuser
        ):
            return Response(
                {"detail": "You can only change your own password."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Import the serializer from Authentication app
        from apps.Authentication.serializer import PasswordChangeSerializer

        serializer = PasswordChangeSerializer(data=request.data, context={"user": user})
        if serializer.is_valid():
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response(
                {"detail": "Password updated successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def admin_update(self, request, pk=None):
        """
        Admin-only update method that can modify any field including sensitive ones.
        This is separate from the regular update to maintain clear separation of concerns.
        """
        from apps.Provider.models import ServiceProvider

        instance = self.get_object()
        partial = request.data.get("partial", True)
        import json

        print("the admin upd ate data", json.dumps(request.data, indent=4))

        # Check if user type is being changed to provider
        user_type_changed = False
        if "user_type" in request.data and request.data["user_type"] == "provider":
            users = User.objects.filter(id=instance.id)
            if users.exists() and users.first().user_type != request.data["user_type"]:
                user_type_changed = True

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        service_providers = ServiceProvider.objects.filter(user=user)

        # If user type was changed to provider, create ServiceProvider profile
        if user_type_changed and user.user_type == "provider":
            try:
                from apps.Provider.models import ServiceProvider
                from django.contrib.gis.geos import Point

                service_providers = ServiceProvider.objects.filter(user=user)

                # Check if ServiceProvider profile already exists
                if not service_providers.exists():
                    print("no service provider profile found for user", user.id)

                    # Default location (Accra coordinates)
                    default_location = Point(-0.1869644, 5.5600149, srid=4326)

                    # Create ServiceProvider profile with default values
                    provider_data = {
                        "user": user,
                        "business_name": f"{user.first_name}'s Service",
                        "business_type": "sole_trader",
                        "verification_status": "unverified",
                        "base_location": default_location,
                        "phone_number": user.phone_number or "N/A",
                        "email": user.email,
                        "address_line1": "Address to be updated",
                        "city": "City to be updated",
                        "county": "County to be updated",
                        "postcode": "00233",  # Accra postcode
                        "country": "Ghana",
                    }

                    # Create ServiceProvider
                    service_provider = ServiceProvider.objects.create(**provider_data)
                    logger.info(
                        f"ServiceProvider profile created for user {user.id} after admin update"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider creation: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error creating ServiceProvider profile for user {user.id}: {e}"
                )

        # If user is already a provider, update their ServiceProvider profile
        elif user.user_type == "provider" and service_providers.exists():
            try:

                # Get the existing ServiceProvider profile
                service_providers = ServiceProvider.objects.filter(user=user)
                if service_providers.exists():
                    service_provider = service_providers.first()
                else:
                    print("no service provider profile found for user", user.id)
                    return

                # Fields that should update the ServiceProvider profile
                provider_update_fields = {}

                # Update phone if changed
                if (
                    "phone_number" in request.data
                    and request.data["phone_number"] != service_provider.phone_number
                ):
                    provider_update_fields["phone"] = request.data["phone_number"]

                # Update email if changed
                if (
                    "email" in request.data
                    and request.data["email"] != service_provider.email
                ):
                    provider_update_fields["email"] = request.data["email"]

                # Update address fields if changed
                address_fields = [
                    "address_line1",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                ]
                for field in address_fields:
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        if field == "state":
                            provider_update_fields["county"] = request.data[field]
                        else:
                            provider_update_fields[field] = request.data[field]

                # Update business-specific fields if changed
                business_fields = [
                    "vat_number",
                    "registration_number",
                    "business_name",
                    "business_type",
                ]
                for field in business_fields:
                    print(
                        f"DEBUG: Checking business field '{field}' - request: {request.data.get(field)}, current: {getattr(service_provider, field, None)}"
                    )
                    if field in request.data and request.data[field] != getattr(
                        service_provider, field, None
                    ):
                        provider_update_fields[field] = request.data[field]
                        print(
                            f"DEBUG: {field} will be updated to: {request.data[field]}"
                        )

                # Update the ServiceProvider profile if there are changes
                if provider_update_fields:
                    for field, value in provider_update_fields.items():
                        setattr(service_provider, field, value)
                    service_provider.save()
                    logger.info(
                        f"ServiceProvider profile updated for user {user.id} after admin update: {provider_update_fields}"
                    )

            except ImportError as e:
                logger.warning(
                    f"Provider app not available, skipping ServiceProvider update: {e}"
                )
            except Exception as e:
                logger.error(
                    f"Error updating ServiceProvider profile for user {user.id}: {e}"
                )

        logger.info(f"User {instance.id} updated by admin {request.user.id}")
        return Response(
            {"detail": "User updated successfully by admin", "user": serializer.data}
        )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated, permissions.IsAdminUser],
    )
    def send_reset_password_link(self, request, pk=None):
        """
        Admin action to send a password reset link to the user with the given pk.
        """
        import os
        from django.contrib.auth.tokens import PasswordResetTokenGenerator
        from django.core.mail import send_mail
        from django.conf import settings
        from django.utils.encoding import force_bytes
        from django.utils.http import urlsafe_base64_encode
        from django.urls import reverse

        user = self.get_object()
        email_sent = False

        if user:
            token_generator = PasswordResetTokenGenerator()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)

            frontend_base_url = os.getenv("FRONTEND_URL")
            frontend_url = f"{frontend_base_url}/reset-password/{uid}/{token}"
            absolute_url = frontend_url
            try:
                send_mail(
                    "Password Reset Request",
                    f"Use this link to reset your password: {absolute_url}",
                    getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"),
                    [user.email],
                    fail_silently=False,
                )
                email_sent = True
            except Exception as e:
                import logging

                logger = logging.getLogger(__name__)
                logger.error(f"Email Error in admin-triggered password reset: {str(e)}")
                email_sent = False

        if email_sent:
            return Response(
                {"detail": "Password reset link sent successfully"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "detail": "Password reset link could not be sent. Please try again later."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[IsAdminUser | IsSuperAdminUser],
    )
    def advanced_stats(self, request):
        """
        Enhanced statistics including group and permission data.
        """
        basic_stats = self.stats(request).data

        # Group statistics
        total_groups = Group.objects.count()
        groups_with_users = (
            Group.objects.annotate(user_count=Count("user"))
            .filter(user_count__gt=0)
            .count()
        )

        # Users by group
        group_stats = []
        for group in Group.objects.annotate(user_count=Count("user")):
            group_stats.append(
                {"group_name": group.name, "user_count": group.user_count}
            )

        # Permission usage
        permissions_in_use = (
            Permission.objects.filter(Q(group__isnull=False) | Q(user__isnull=False))
            .distinct()
            .count()
        )

        total_permissions = Permission.objects.count()

        enhanced_stats = {
            **basic_stats,
            "groups": {
                "total_groups": total_groups,
                "groups_with_users": groups_with_users,
                "empty_groups": total_groups - groups_with_users,
                "group_breakdown": group_stats,
            },
            "permissions": {
                "total_permissions": total_permissions,
                "permissions_in_use": permissions_in_use,
                "unused_permissions": total_permissions - permissions_in_use,
            },
        }

        return Response(enhanced_stats)

    @action(
        detail=True,
        methods=["get"],
        url_path="profile",
        permission_classes=[permissions.IsAuthenticated],
    )
    def profile_view(self, request, pk=None):
        """Return the requested user's profile with groups and permissions (detail action). Non-admins can only view their own profile."""
        target_user = self.get_object()
        # Non-admins can only view their own profile
        if not (
            request.user.is_superuser
            or getattr(request.user, "user_type", None) == "admin"
        ):
            if str(target_user.pk) != str(request.user.pk):
                return Response(
                    {"detail": "You can only view your own profile."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        target_user = (
            User.objects.prefetch_related("groups", "user_permissions")
            .only("id", "email", "first_name", "last_name", "user_type")
            .get(pk=target_user.pk)
        )
        serializer = UserWithGroupsSerializer(target_user)
        return Response(serializer.data)


class AddressViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user addresses.
    """

    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Regular users can only see their own addresses.
        Admins can see all addresses.
        """
        queryset = Address.objects.all()

        # Regular users can only see their own addresses
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(address_user=self.request.user)

        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create a new address for a user.
        Regular users can only create addresses for themselves.
        """
        # If user_id not specified, use the current user
        if "address_user" not in request.data:
            request.data["address_user"] = request.user.id

        # Regular users can only create addresses for themselves
        if not (request.user.user_type in ["admin"] or request.user.is_superuser):
            if str(request.data.get("address_user")) != str(request.user.id):
                return Response(
                    {"detail": "You can only create addresses for yourself."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def my_addresses(self, request):
        """
        Returns the current user's addresses.
        """
        addresses = Address.objects.filter(address_user=request.user)
        serializer = self.get_serializer(addresses, many=True)
        return Response(serializer.data)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing user activity.
    Users can only see their own activity.
    Admins can see all activity.
    """

    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        """
        queryset = UserActivity.objects.all()

        # Regular users can only see their own activity
        if not (
            self.request.user.user_type in ["admin"] or self.request.user.is_superuser
        ):
            queryset = queryset.filter(user=self.request.user)

        return queryset.order_by("-timestamp")


# Add these imports to your existing views.py
from django.contrib.auth.models import Group, Permission
from .serializer import (
    GroupSerializer,
    GroupDetailSerializer,
    PermissionSerializer,
    UserWithGroupsSerializer,
    BulkUserGroupSerializer,
)
from django.db import transaction

# Add these ViewSets to your views.py after your existing ViewSets


class GroupManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing groups (roles).
    Provides CRUD operations and user assignment functionality.
    """

    queryset = Group.objects.all()
    # permission_classes = [IsAdminUser | IsSuperAdminUser]
    # permission_classes = [A]

    def get_serializer_class(self):
        if self.action in ["retrieve", "list"]:
            return GroupDetailSerializer
        return GroupSerializer

    def get_queryset(self):
        """Add search and filtering capabilities"""
        queryset = Group.objects.all()

        # Search by group name
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset.order_by("name")

    def destroy(self, request, *args, **kwargs):
        """Remove members from group before deletion"""
        group = self.get_object()
        if group.custom_user_set.exists():
            # Remove all users from this group before deleting it
            group.custom_user_set.clear()
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def add_users(self, request, pk=None):
        """Add users to a group"""
        group = self.get_object()
        user_ids = request.data.get("user_ids", [])

        if not user_ids:
            return Response(
                {"detail": "user_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        added_count = users.count()

        if added_count == 0:
            return Response(
                {"detail": "No valid users found"}, status=status.HTTP_400_BAD_REQUEST
            )

        group.custom_user_set.add(*users)

        logger.info(
            f"Added {added_count} users to group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added {added_count} users to group '{group.name}'",
                "added_users": [str(user.id) for user in users],
            }
        )

    @action(detail=True, methods=["post"])
    def remove_users(self, request, pk=None):
        """Remove users from a group"""
        group = self.get_object()
        user_ids = request.data.get("user_ids", [])

        if not user_ids:
            return Response(
                {"detail": "user_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids, groups=group)
        removed_count = users.count()

        if removed_count == 0:
            return Response(
                {"detail": "No users found in this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group.custom_user_set.remove(*users)

        logger.info(
            f"Removed {removed_count} users from group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed {removed_count} users from group '{group.name}'",
                "removed_users": [str(user.id) for user in users],
            }
        )

    @action(detail=True, methods=["post"])
    def update_permissions(self, request, pk=None):
        """Update group permissions"""
        group = self.get_object()
        permission_ids = request.data.get("permission_ids", [])

        permissions = Permission.objects.filter(id__in=permission_ids)
        group.permissions.set(permissions)

        logger.info(
            f"Updated permissions for group {group.name} by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Updated permissions for group '{group.name}'",
                "permission_count": permissions.count(),
            }
        )

    @action(detail=True, methods=["get"])
    def available_users(self, request, pk=None):
        """Get users not in this group"""
        group = self.get_object()
        users_not_in_group = User.objects.exclude(groups=group)

        # Apply search filter if provided
        search = request.query_params.get("search")
        if search:
            users_not_in_group = users_not_in_group.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        serializer = UserSerializer(users_not_in_group, many=True)
        return Response(serializer.data)


class PermissionManagementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing available permissions.
    Read-only as permissions are typically defined in code.
    """

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    # permission_classes = [IsAdminUser | IsSuperAdminUser]

    def get_queryset(self):
        """Filter and search permissions"""
        queryset = Permission.objects.all()

        # Filter by content type if specified
        content_type = self.request.query_params.get("content_type")
        if content_type:
            queryset = queryset.filter(content_type__model=content_type)

        # Search by permission name or codename
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(codename__icontains=search)
            )

        return queryset.order_by("content_type__model", "codename")

    @action(detail=False, methods=["get"])
    def by_content_type(self, request):
        """Get permissions grouped by content type"""
        permissions = Permission.objects.select_related("content_type").all()

        grouped = {}
        for perm in permissions:
            content_type = perm.content_type.model
            if content_type not in grouped:
                grouped[content_type] = []
            grouped[content_type].append(
                {"id": perm.id, "name": perm.name, "codename": perm.codename}
            )

        return Response(grouped)


class UserGroupManagementViewSet(viewsets.ViewSet):
    """
    ViewSet for bulk user-group operations and advanced user management.
    """

    # permission_classes = [IsAdminUser | IsSuperAdminUser]

    @action(detail=False, methods=["post"])
    def bulk_add_to_groups(self, request):
        """Add multiple users to multiple groups"""
        serializer = BulkUserGroupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_ids = serializer.validated_data["user_ids"]
        group_ids = serializer.validated_data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        groups = Group.objects.filter(id__in=group_ids)

        with transaction.atomic():
            for group in groups:
                group.custom_user_set.add(*users)

        logger.info(
            f"Bulk added {users.count()} users to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Added {users.count()} users to {groups.count()} groups",
                "users_affected": len(user_ids),
                "groups_affected": len(group_ids),
            }
        )

    @action(detail=False, methods=["post"])
    def bulk_remove_from_groups(self, request):
        """Remove multiple users from multiple groups"""
        serializer = BulkUserGroupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_ids = serializer.validated_data["user_ids"]
        group_ids = serializer.validated_data.get("group_ids", [])

        if not group_ids:
            return Response(
                {"detail": "group_ids field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(id__in=user_ids)
        groups = Group.objects.filter(id__in=group_ids)

        with transaction.atomic():
            for group in groups:
                group.custom_user_set.remove(*users)

        logger.info(
            f"Bulk removed {users.count()} users from {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Removed {users.count()} users from {groups.count()} groups",
                "users_affected": len(user_ids),
                "groups_affected": len(group_ids),
            }
        )

    @action(detail=False, methods=["post"])
    def assign_user_to_groups(self, request):
        """Assign a single user to multiple groups (replace existing groups)"""
        user_id = request.data.get("user_id")
        group_ids = request.data.get("group_ids", [])

        if not user_id:
            return Response(
                {"detail": "user_id field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        groups = Group.objects.filter(id__in=group_ids)
        user.groups.set(groups)

        logger.info(
            f"Assigned user {user.id} to {groups.count()} groups by admin {request.user.id}"
        )
        return Response(
            {
                "status": f"Assigned user to {groups.count()} groups",
                "user_id": str(user.id),
                "groups": [group.name for group in groups],
            }
        )

    @action(detail=False, methods=["get"])
    def users_with_groups(self, request):
        """Get all users with their group information"""
        users = User.objects.prefetch_related("groups", "user_permissions").all()

        # Apply filters
        user_type = request.query_params.get("type")
        if user_type:
            users = users.filter(user_type=user_type)

        search = request.query_params.get("search")
        if search:
            users = users.filter(
                Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        serializer = UserWithGroupsSerializer(users, many=True)
        return Response(serializer.data)
