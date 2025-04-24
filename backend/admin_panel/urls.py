from django.urls import path
from . import views

urlpatterns = [
    path('admin-login/', views.admin_login),
    path('dashboard/', views.admin_dashboard),
]
