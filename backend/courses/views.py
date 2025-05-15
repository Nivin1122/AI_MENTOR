from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import CourseSerializer
from .models import Course
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework import generics, permissions
from .models import Category,Syllabus
from .serializers import CategorySerializer,CategoryListSerializer, SyllabusSerializer, SyllabusListSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course(request):
    
    print("Add course request received")
    print(f"Authenticated user: {request.user}")
    print(f"Request data: {request.data}")
    
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        
        course = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def list_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_course_detail(request, pk):
    try:
        course = Course.objects.get(id=pk)
        serializer = CourseSerializer(course, many=False)
        return Response(serializer.data)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=404)
    

class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [permissions.AllowAny()]


@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def add_Syllabus(request):
    
    serializer = SyllabusSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def list_syllabus(request):
    syllabus = Syllabus.objects.all().order_by('session_index')
    serializer = SyllabusListSerializer(syllabus, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_syllabus_by_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

    syllabus = Syllabus.objects.filter(course=course).order_by('session_index')
    serializer = SyllabusListSerializer(syllabus, many=True)
    return Response(serializer.data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def list_category(request):
    category = Category.objects.all()
    serializer = CategoryListSerializer(category, many=True)
    return Response(serializer.data)