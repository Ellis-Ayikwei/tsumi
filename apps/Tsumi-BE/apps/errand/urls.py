from rest_framework.routers import SimpleRouter

from .views import ErrandViewSet

router = SimpleRouter()
router.register("", ErrandViewSet, basename="errand")

urlpatterns = router.urls
