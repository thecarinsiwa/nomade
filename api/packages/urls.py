from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PackageTypeViewSet, PackageViewSet, PackageComponentViewSet
)

router = DefaultRouter()
router.register(r'package-types', PackageTypeViewSet, basename='package-type')
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'components', PackageComponentViewSet, basename='package-component')

urlpatterns = [
    path('', include(router.urls)),
]

