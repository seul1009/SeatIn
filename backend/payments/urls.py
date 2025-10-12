from django.urls import path
from .views import confirm_payment

urlpatterns = [
    path("confirm/", confirm_payment, name="confirm_payment"),
]
