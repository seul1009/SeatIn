from django.db import models

class Home(models.Model):
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    poster = models.ImageField(upload_to='posters/', blank=True, null=True, default='posters/default.png')
    date = models.DateField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.title
