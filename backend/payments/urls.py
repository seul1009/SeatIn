from django.urls import path
from .views import confirm_payment

urlpatterns = [
    path("", views),
    path("confirm/", confirm_payment, name="confirm_payment"),
]
