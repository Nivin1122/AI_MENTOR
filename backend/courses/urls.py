from django.urls import path
from . import views
from . views import CategoryListCreateAPIView


urlpatterns = [
    path('add/', views.add_course, name='add-course'),
    path('list/', views.list_courses, name='list_courses'),
    path('courses/<int:pk>/', views.get_course_detail, name='course-detail'),
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
]