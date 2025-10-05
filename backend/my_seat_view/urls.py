from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("seats.urls")),  # 메인화면 seats 앱
    path("api/users/", include("users.urls")),  
    path("accounts/", include("allauth.urls")), 
    path("payments/", include("payments.urls")),
]
