from django.urls import path

from .views import MarkReadView, NotificationListView

urlpatterns = [
    path("", NotificationListView.as_view(), name="notifications"),
    path("read-all/", MarkReadView.as_view(), name="notifications-read-all"),
    path("<uuid:pk>/read/", MarkReadView.as_view(), name="notification-read"),
]
