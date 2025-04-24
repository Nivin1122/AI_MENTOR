from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)  # still required for login
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'  # or 'email' if you want email login
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
