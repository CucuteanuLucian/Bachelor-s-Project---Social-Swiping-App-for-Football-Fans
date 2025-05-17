from django.db import models
from django.contrib.auth.models import User

# model ce extinde User-ul din Django pentru a salva mai multe detalii despre utilizator
class MyUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    max_distance = models.IntegerField(default=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.TextField(max_length=10, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    theme = models.CharField(max_length=5, default='light')

    def __str__(self):
        return self.user.username
