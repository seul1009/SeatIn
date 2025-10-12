from django.db import models

class Match(models.Model):
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    poster1 = models.CharField(max_length=500, blank=True, null=True, default="posters/default.png")
    poster2 = models.CharField(max_length=500, blank=True, null=True, default="posters/default.png")
    date = models.DateTimeField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.title

