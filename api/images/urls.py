from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RoomImageViewSet, DestinationImageViewSet, ActivityImageViewSet,
    AirlineImageViewSet, FlightImageViewSet, CarImageViewSet,
    CruiseShipImageViewSet, CruiseCabinImageViewSet, CruiseImageViewSet,
    UserImageViewSet, PromotionImageViewSet, PackageImageViewSet,
    AirportImageViewSet, GenericImageViewSet, ImageMetadataViewSet
)

router = DefaultRouter()
router.register(r'room-images', RoomImageViewSet, basename='room-image')
router.register(r'destination-images', DestinationImageViewSet, basename='destination-image')
router.register(r'activity-images', ActivityImageViewSet, basename='activity-image')
router.register(r'airline-images', AirlineImageViewSet, basename='airline-image')
router.register(r'flight-images', FlightImageViewSet, basename='flight-image')
router.register(r'car-images', CarImageViewSet, basename='car-image')
router.register(r'cruise-ship-images', CruiseShipImageViewSet, basename='cruise-ship-image')
router.register(r'cruise-cabin-images', CruiseCabinImageViewSet, basename='cruise-cabin-image')
router.register(r'cruise-images', CruiseImageViewSet, basename='cruise-image')
router.register(r'user-images', UserImageViewSet, basename='user-image')
router.register(r'promotion-images', PromotionImageViewSet, basename='promotion-image')
router.register(r'package-images', PackageImageViewSet, basename='package-image')
router.register(r'airport-images', AirportImageViewSet, basename='airport-image')
router.register(r'generic-images', GenericImageViewSet, basename='generic-image')
router.register(r'image-metadata', ImageMetadataViewSet, basename='image-metadata')

urlpatterns = [
    path('', include(router.urls)),
]

