from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CountryViewSet, RegionViewSet, CityViewSet, DestinationViewSet
)

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'cities', CityViewSet, basename='city')
router.register(r'destinations', DestinationViewSet, basename='destination')

urlpatterns = [
    path('', include(router.urls)),
]

