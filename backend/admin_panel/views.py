from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView

from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import CustomUser
from .serializers import UserListSerializer


# Generate tokens for admin
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class AdminLoginView(APIView):
    def post(self, request):
        # Get username and password from the request data
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Print debugging info (remove in production)
        print(f"Login attempt: username={username}")
        
        # Authenticate the user
        user = authenticate(username=username, password=password)
        
        if user is None:
            print("Authentication failed: Invalid credentials")
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not user.is_staff:
            print(f"User {username} is not staff")
            return Response({'message': 'User is not an admin'}, status=status.HTTP_403_FORBIDDEN)
        
        # If we get here, authentication was successful
        print(f"Authentication successful for {username}")
        
        # Generate JWT refresh and access tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
        })
    

@api_view(['GET'])
@permission_classes([IsAdminUser])  # Restrict to admin users only
def admin_dashboard(request):
    return Response({"message": "Welcome to the Admin Dashboard!"})


class AdminUserListView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        users = CustomUser.objects.all().order_by('-date_joined')  # Most recent first
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)