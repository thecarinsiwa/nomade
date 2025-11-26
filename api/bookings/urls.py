from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BookingStatusViewSet, BookingViewSet, BookingItemViewSet, BookingGuestViewSet,
    BookingRoomViewSet, BookingFlightViewSet, BookingCarViewSet,
    BookingActivityViewSet, BookingCruiseViewSet
)

router = DefaultRouter()
router.register(r'statuses', BookingStatusViewSet, basename='booking-status')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'items', BookingItemViewSet, basename='booking-item')
router.register(r'guests', BookingGuestViewSet, basename='booking-guest')
router.register(r'rooms', BookingRoomViewSet, basename='booking-room')
router.register(r'flights', BookingFlightViewSet, basename='booking-flight')
router.register(r'cars', BookingCarViewSet, basename='booking-car')
router.register(r'activities', BookingActivityViewSet, basename='booking-activity')
router.register(r'cruises', BookingCruiseViewSet, basename='booking-cruise')

urlpatterns = [
    path('', include(router.urls)),
]

