from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser


# Generate tokens for admin
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
def admin_login(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=401)

    if not user.is_staff:
        return Response({'detail': 'User is not admin'}, status=401)

    tokens = get_tokens_for_user(user)
    return Response(tokens, status=200)


@api_view(['GET'])
@permission_classes([IsAdminUser])  # Restrict to admin users only
def admin_dashboard(request):
    return Response({"message": "Welcome to the Admin Dashboard!"})