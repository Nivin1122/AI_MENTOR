from django.urls import path
from . import views
from .views import AdminLoginView

urlpatterns = [
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('dashboard/', views.admin_dashboard),
]
