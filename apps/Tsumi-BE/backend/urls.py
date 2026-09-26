from django.urls import include, path

from apps.ApiConnectionStatus.views import ApiConnectionStatusView, HealthCheckView

urlpatterns = [
    path("", ApiConnectionStatusView.as_view()),
    path("health/", HealthCheckView.as_view()),
    path(
        "tsumi/api/v1/",
        include(
            [
                path("auth/", include("apps.Authentication.urls")),
                path("agents/", include("apps.User.urls")),
                path("errands/", include("apps.errand.urls")),
                path("wallet/", include("apps.wallet.urls")),
                path("disputes/", include("apps.dispute.urls")),
                path("notifications/", include("apps.notification.urls")),
                path("trust/", include("apps.trust.urls")),
                path("admin/", include("apps.admin.urls")),
            ]
        ),
    ),
]
