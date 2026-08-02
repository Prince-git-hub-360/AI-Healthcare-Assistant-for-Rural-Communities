from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema

from .views import (
    AuthRootView,
    LoginView,
    LogoutView,
    RegisterView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

DecoratedTokenRefreshView = extend_schema(tags=['01. Authentication & User Profile'])(TokenRefreshView)

urlpatterns = [
    path('', AuthRootView.as_view(), name='auth-root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # JWT refresh (refresh token endpoint)
    path('token/refresh/', DecoratedTokenRefreshView.as_view(), name='token_refresh'),

    # Password reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
