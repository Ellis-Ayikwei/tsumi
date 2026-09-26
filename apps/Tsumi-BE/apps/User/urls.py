from django.urls import path

from .views import KycSubmitView, MyAgentProfileView

urlpatterns = [
    path("me/", MyAgentProfileView.as_view(), name="agent-me"),
    path("me/kyc/", KycSubmitView.as_view(), name="agent-kyc"),
]
