from django.urls import path
from . import views
from . views import CategoryListCreateAPIView


urlpatterns = [
    path('add/', views.add_course, name='add-course'),
    path('list/', views.list_courses, name='list_courses'),
    path('courses/<int:pk>/', views.get_course_detail, name='course-detail'),
    path('categories/', CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('list/category',views.list_category,name='list_category'),
    path('add/syllabus/',views.add_Syllabus, name='add_syllabus'),
    path('list/syllabus/',views.list_syllabus, name='list_syllabus'),
    path('course/<int:course_id>/syllabus/', views.get_syllabus_by_course, name='syllabus-by-course'),
]