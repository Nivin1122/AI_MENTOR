from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserProfileSerializer  # We'll create this next


User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'detail': 'User created'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': 'User already exists or invalid data'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    data = request.data
    user = authenticate(username=data['username'], password=data['password'])

    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response(tokens)
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home_page(request):
    return Response({"message": f"Welcome back, {request.user.username}!"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in get_user_profile: {str(e)}")  # Add this for debugging
        return Response(
            {'detail': 'Error fetching user profile'}, 
            status=status.HTTP_400_BAD_REQUEST
        )