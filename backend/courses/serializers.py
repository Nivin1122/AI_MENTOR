from rest_framework import serializers
from .models import Category, Course, Syllabus


class CourseSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    class Meta:
        model = Course
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CategoryListSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = '__all__'
        # depth=2

class SyllabusListSerializer(serializers.ModelSerializer):
    # course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all()) 
    class Meta:
        model = Syllabus
        fields = '__all__'
        depth=2

class SyllabusSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all()) 
    class Meta:
        model = Syllabus
        fields = '__all__'