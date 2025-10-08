from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrustBadgeViewSet, UserBadgeViewSet

router = DefaultRouter()
router.register(r"badges", TrustBadgeViewSet, basename="trust-badge")
router.register(r"user-badges", UserBadgeViewSet, basename="user-badge")

urlpatterns = [
    path("", include(router.urls)),
]


