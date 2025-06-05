from django.urls import path
from .views import register_user, login_user, home_page, get_user_profile

urlpatterns = [
    path('register/', register_user),
    path('login/', login_user),
    path('home/', home_page, name='home_page'),
    path('profile/', get_user_profile, name='user_profile'),
]