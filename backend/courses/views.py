from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .serializers import CourseSerializer
from .models import Course
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny


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