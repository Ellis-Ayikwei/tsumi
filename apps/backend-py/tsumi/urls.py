"""
URL configuration for Tsumi project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# from drf_spectacular.views import (
#     SpectacularAPIView,
#     SpectacularRedocView,
#     SpectacularSwaggerView,
# )

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Documentation (temporarily disabled)
    # path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # path(
    #     "api/docs/",
    #     SpectacularSwaggerView.as_view(url_name="schema"),
    #     name="swagger-ui",
    # ),
    # path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # JWT Authentication
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Authentication & OTP
    path("api/auth/", include("authentication.urls")),
    # Notifications
    path("api/notifications/", include("notifications.urls")),
    # App URLs
    path("api/users/", include("users.urls")),
    path("api/errands/", include("errands.urls")),
    path("api/wallet/", include("wallet.urls")),
    path("api/trust/", include("trust.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
