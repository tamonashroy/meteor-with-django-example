from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=80)

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=450)
    author = models.ForeignKey(User)
    publication_date = models.DateTimeField(auto_now_add=True)
    category = models.ManyToManyField(Category)
    hero_image = models.ImageField()
    additional_image = models.ImageField(null=True, blank=True)
    body_text = models.TextField()
