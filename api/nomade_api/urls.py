"""
URL configuration for nomade_api project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/onekey/', include('onekey.urls')),
    path('api/accommodations/', include('accommodations.urls')),
]

