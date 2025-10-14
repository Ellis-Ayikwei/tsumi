from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from .models import Notification, NotificationPreference
from .services import NotificationService
from .serializers import NotificationSerializer, NotificationPreferenceSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class NotificationListView(APIView):
    """List user's notifications with filtering and pagination"""

    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination

    def get(self, request):
        # Get query parameters
        notification_type = request.query_params.get("type")
        read_status = request.query_params.get("read")
        priority = request.query_params.get("priority")
        unread_only = request.query_params.get("unread_only", "false").lower() == "true"
        urgent_only = request.query_params.get("urgent_only", "false").lower() == "true"

        # Build queryset
        queryset = Notification.objects.filter(user=request.user)

        # Apply filters
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)

        if read_status is not None:
            queryset = queryset.filter(read=read_status.lower() == "true")

        if priority:
            queryset = queryset.filter(priority=priority)

        if unread_only:
            queryset = queryset.filter(read=False)

        if urgent_only:
            queryset = queryset.filter(priority__in=["high", "urgent"])

        # Order by creation date (newest first)
        queryset = queryset.order_by("-created_at")

        # Paginate
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)

        if page is not None:
            serializer = NotificationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = NotificationSerializer(queryset, many=True)
        return Response(serializer.data)


class NotificationDetailView(APIView):
    """Get specific notification details"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, user=request.user
            )
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND
            )


class MarkNotificationReadView(APIView):
    """Mark a notification as read"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, user=request.user
            )
            notification.mark_as_read()
            return Response(
                {"detail": "Notification marked as read."}, status=status.HTTP_200_OK
            )
        except Notification.DoesNotExist:
            return Response(
                {"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND
            )


class MarkAllNotificationsReadView(APIView):
    """Mark all notifications as read for the current user"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated_count = NotificationService.mark_all_as_read(request.user)
        return Response(
            {
                "detail": f"Marked {updated_count} notifications as read.",
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK,
        )


class UnreadCountView(APIView):
    """Get unread notification count"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        unread_count = NotificationService.get_unread_count(request.user)
        return Response({"unread_count": unread_count}, status=status.HTTP_200_OK)


class NotificationSummaryView(APIView):
    """Get notification summary for the user"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get counts by type
        type_counts = {}
        for notification_type, _ in Notification.NOTIFICATION_TYPES:
            count = Notification.objects.filter(
                user=user, notification_type=notification_type, read=False
            ).count()
            if count > 0:
                type_counts[notification_type] = count

        # Get counts by priority
        priority_counts = {}
        for priority, _ in Notification.PRIORITY_LEVELS:
            count = Notification.objects.filter(
                user=user, priority=priority, read=False
            ).count()
            if count > 0:
                priority_counts[priority] = count

        # Get recent notifications
        recent_notifications = NotificationService.get_user_notifications(
            user, unread_only=True, limit=5
        )
        recent_serializer = NotificationSerializer(recent_notifications, many=True)

        return Response(
            {
                "unread_count": NotificationService.get_unread_count(user),
                "type_counts": type_counts,
                "priority_counts": priority_counts,
                "recent_notifications": recent_serializer.data,
            }
        )


class ClearReadNotificationsView(APIView):
    """Delete all read notifications"""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        deleted_count = Notification.objects.filter(
            user=request.user, read=True
        ).delete()[0]

        return Response(
            {
                "detail": f"Deleted {deleted_count} read notifications.",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )


class NotificationPreferencesView(APIView):
    """Get and update user notification preferences"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            preferences = NotificationPreference.objects.get(user=request.user)
            serializer = NotificationPreferenceSerializer(preferences)
            return Response(serializer.data)
        except NotificationPreference.DoesNotExist:
            # Create default preferences
            preferences = NotificationPreference.objects.create(user=request.user)
            serializer = NotificationPreferenceSerializer(preferences)
            return Response(serializer.data)

    def post(self, request):
        try:
            preferences = NotificationPreference.objects.get(user=request.user)
            serializer = NotificationPreferenceSerializer(
                preferences, data=request.data, partial=True
            )
        except NotificationPreference.DoesNotExist:
            serializer = NotificationPreferenceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TestNotificationView(APIView):
    """Send test notification (staff only)"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not request.user.is_staff:
            return Response(
                {"detail": "Only staff members can send test notifications."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notification_type = request.data.get("type", "system")
        title = request.data.get("title", "Test Notification")
        message = request.data.get("message", "This is a test notification.")

        notification = NotificationService.create_notification(
            user=request.user,
            notification_type=notification_type,
            title=title,
            message=message,
            priority="normal",
        )

        serializer = NotificationSerializer(notification)
        return Response(
            {
                "detail": "Test notification sent successfully.",
                "notification": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
