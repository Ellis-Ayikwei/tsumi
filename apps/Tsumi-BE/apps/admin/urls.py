from django.urls import path

from apps.geo import views as geo_views

from . import views

urlpatterns = [
    path("stats/", views.stats, name="admin-stats"),
    # Users and agents
    path("users/", views.UserListView.as_view(), name="admin-users"),
    path("users/<uuid:pk>/", views.UserDetailView.as_view(), name="admin-user-detail"),
    path("users/<uuid:pk>/suspend/", views.set_user_active, {"active": False}, name="admin-user-suspend"),
    path("users/<uuid:pk>/reactivate/", views.set_user_active, {"active": True}, name="admin-user-reactivate"),
    path("users/<uuid:pk>/kyc/", views.kyc_decision, name="admin-kyc-decision"),
    path("users/<uuid:pk>/kyc/<str:which>/", views.kyc_document, name="admin-kyc-document"),
    path("users/<uuid:pk>/wallet/adjust/", views.wallet_adjust, name="admin-wallet-adjust"),
    path("users/<uuid:pk>/badges/<slug:code>/", views.user_badge, name="admin-user-badge"),
    # Errands and disputes
    path("errands/", views.ErrandListView.as_view(), name="admin-errands"),
    path("errands/<uuid:pk>/", views.errand_detail, name="admin-errand-detail"),
    path("errands/<uuid:pk>/cancel/", views.errand_cancel, name="admin-errand-cancel"),
    path("disputes/", views.DisputeListView.as_view(), name="admin-disputes"),
    path("disputes/<uuid:pk>/resolve/", views.dispute_resolve, name="admin-dispute-resolve"),
    # Money
    path("withdrawals/", views.WithdrawalListView.as_view(), name="admin-withdrawals"),
    path("withdrawals/<uuid:pk>/approve/", views.withdrawal_decision, {"approve": True}, name="admin-withdrawal-approve"),
    path("withdrawals/<uuid:pk>/reject/", views.withdrawal_decision, {"approve": False}, name="admin-withdrawal-reject"),
    path("ledger/", views.LedgerListView.as_view(), name="admin-ledger"),
    # Trust
    path("badges/", views.BadgeListView.as_view(), name="admin-badges"),
    path("service-areas/", geo_views.service_areas, name="admin-service-areas"),
    path("service-areas/import/", geo_views.service_area_import, name="admin-service-area-import"),
    path("service-areas/check/", geo_views.service_area_check, name="admin-service-area-check"),
    path("service-areas/<uuid:pk>/", geo_views.service_area_detail, name="admin-service-area-detail"),
]
