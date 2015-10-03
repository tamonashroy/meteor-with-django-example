from django.contrib import admin
from backendapp.models import *
# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    pass

class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_date')
    list_filter = ('category', 'publication_date')

admin.site.register(Category, CategoryAdmin)
admin.site.register(Article, ArticleAdmin)
