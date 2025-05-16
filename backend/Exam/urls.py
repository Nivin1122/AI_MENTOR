from django.urls import path
from .views import generate_test_questions, evaluate_test

urlpatterns = [
    
    path('api/generate-test-questions/', generate_test_questions, name='generate_test_questions'),
    path('api/evaluate-test/', evaluate_test, name='evaluate_test'),
]