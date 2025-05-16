from rest_framework import serializers
from .models import Category, Course, Syllabus,UserSyllabusProgress


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
    

class SyllabusListSerializer(serializers.ModelSerializer):

    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Syllabus
        fields = '__all__'
        depth=2

    def get_is_completed(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return UserSyllabusProgress.objects.filter(user=user, syllabus=obj, is_completed=True).exists()
        return False

class SyllabusSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all()) 
    class Meta:
        model = Syllabus
        fields = '__all__'