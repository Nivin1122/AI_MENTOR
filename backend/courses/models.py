from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    language = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    short_description = models.TextField()
    full_description = models.TextField()
    image = models.ImageField(upload_to='course_images/')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.title
    

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
