from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Course(models.Model):
    title = models.CharField(max_length=200)
    language = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    short_description = models.TextField()
    full_description = models.TextField()
    image = models.ImageField(upload_to='course_images/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    course_prompt = models.TextField()

    def __str__(self):
        return self.title
    
class Syllabus(models.Model):
    course = models.ForeignKey(Course, on_delete = models.CASCADE)
    session_index = models.IntegerField()
    topic = models.TextField()
    description = models.TextField()

    def __str__(self):
        return f"{self.course.category}"