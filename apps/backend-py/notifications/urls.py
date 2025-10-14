from django.urls import path
from . import views

urlpatterns = [
    # Core notification endpoints
    path("", views.NotificationListView.as_view(), name="notification-list"),
    path(
        "<uuid:notification_id>/",
        views.NotificationDetailView.as_view(),
        name="notification-detail",
    ),
    path(
        "<uuid:notification_id>/mark-as-read/",
        views.MarkNotificationReadView.as_view(),
        name="mark-notification-read",
    ),
    # Bulk operations
    path(
        "mark-all-as-read/",
        views.MarkAllNotificationsReadView.as_view(),
        name="mark-all-read",
    ),
    path("clear-read/", views.ClearReadNotificationsView.as_view(), name="clear-read"),
    # Utility endpoints
    path("unread-count/", views.UnreadCountView.as_view(), name="unread-count"),
    path(
        "summary/", views.NotificationSummaryView.as_view(), name="notification-summary"
    ),
    # Preferences
    path(
        "preferences/",
        views.NotificationPreferencesView.as_view(),
        name="notification-preferences",
    ),
    # Admin/Testing
    path("test/", views.TestNotificationView.as_view(), name="test-notification"),
]
