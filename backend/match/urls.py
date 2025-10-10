from django.urls import path
from . import views

urlpatterns = [
    path('', views.match_list, name='match-list'),
    path('<int:pk>/', views.match_detail, name='match-detail'),
]
