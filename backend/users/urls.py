from django.urls import path, include
from . import views
from .views import CustomRegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # 기본 회원가입/로그인
    path("", include("dj_rest_auth.urls")),
    path("register/", CustomRegisterView.as_view(), name="custom_register"),
    path("activate/<uidb64>/<token>/", views.activate, name="account_activate"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),

    # 소셜 로그인 (allauth에서 제공하는 URL)
    path("social/", include("allauth.socialaccount.urls")),

    # 직접 만든 콜백 엔드포인트
    path("naver/callback/", views.naver_callback, name="naver_callback"),
    path("google/callback/", views.google_callback, name="google_callback"),
]
