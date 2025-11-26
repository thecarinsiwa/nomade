from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyTypeViewSet, PropertyCategoryViewSet, PropertyAddressViewSet,
    PropertyViewSet, PropertyAmenityViewSet, PropertyAmenityLinkViewSet,
    PropertyImageViewSet, PropertyDescriptionViewSet,
    RoomTypeViewSet, RoomViewSet, RoomAmenityViewSet, RoomAmenityLinkViewSet,
    RoomAvailabilityViewSet, RoomPricingViewSet
)

router = DefaultRouter()
router.register(r'property-types', PropertyTypeViewSet, basename='property-type')
router.register(r'property-categories', PropertyCategoryViewSet, basename='property-category')
router.register(r'property-addresses', PropertyAddressViewSet, basename='property-address')
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'property-amenities', PropertyAmenityViewSet, basename='property-amenity')
router.register(r'property-amenity-links', PropertyAmenityLinkViewSet, basename='property-amenity-link')
router.register(r'property-images', PropertyImageViewSet, basename='property-image')
router.register(r'property-descriptions', PropertyDescriptionViewSet, basename='property-description')
router.register(r'room-types', RoomTypeViewSet, basename='room-type')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'room-amenities', RoomAmenityViewSet, basename='room-amenity')
router.register(r'room-amenity-links', RoomAmenityLinkViewSet, basename='room-amenity-link')
router.register(r'room-availability', RoomAvailabilityViewSet, basename='room-availability')
router.register(r'room-pricing', RoomPricingViewSet, basename='room-pricing')

urlpatterns = [
    path('', include(router.urls)),
]

