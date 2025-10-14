from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path("register/", views.RegisterAPIView.as_view(), name="register"),
    path("login/", views.LoginAPIView.as_view(), name="login"),
    path("logout/", views.LogoutAPIView.as_view(), name="logout"),
    # Password management
    path(
        "password-recovery/",
        views.PasswordRecoveryAPIView.as_view(),
        name="password-recovery",
    ),
    path(
        "password-reset-confirm/<str:uidb64>/<str:token>/",
        views.PasswordResetConfirmAPIView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "password-change/",
        views.PasswordChangeAPIView.as_view(),
        name="password-change",
    ),
    # OTP functionality
    path("otp/send/", views.SendOTPView.as_view(), name="send-otp"),
    path("otp/verify/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("login/otp/", views.LoginWithOTPView.as_view(), name="login-with-otp"),
]
