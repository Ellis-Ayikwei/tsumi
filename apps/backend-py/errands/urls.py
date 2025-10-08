from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ErrandViewSet

router = DefaultRouter()
router.register(r"", ErrandViewSet, basename="errand")

urlpatterns = [
    path("", include(router.urls)),
]


