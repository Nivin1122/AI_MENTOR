from django.urls import path
from . import views
from .views import AdminLoginView,AdminUserListView

urlpatterns = [
    path('admin-login/', AdminLoginView.as_view(), name='admin-login'),
    path('dashboard/', views.admin_dashboard),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
]
