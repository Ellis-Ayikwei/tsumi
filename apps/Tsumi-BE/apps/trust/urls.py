from django.urls import path

from .views import BadgeListView, UserBadgeListView

urlpatterns = [
    path("badges/", BadgeListView.as_view(), name="badges"),
    path("users/<uuid:user_id>/badges/", UserBadgeListView.as_view(), name="user-badges"),
]
