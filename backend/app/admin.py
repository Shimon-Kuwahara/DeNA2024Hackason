from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.User)
admin.site.register(models.Capsule)
admin.site.register(models.Timeline)
