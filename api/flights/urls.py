from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AirlineViewSet, AirportViewSet, FlightClassViewSet,
    FlightViewSet, FlightAvailabilityViewSet
)

router = DefaultRouter()
router.register(r'airlines', AirlineViewSet, basename='airline')
router.register(r'airports', AirportViewSet, basename='airport')
router.register(r'flight-classes', FlightClassViewSet, basename='flight-class')
router.register(r'flights', FlightViewSet, basename='flight')
router.register(r'flight-availability', FlightAvailabilityViewSet, basename='flight-availability')

urlpatterns = [
    path('', include(router.urls)),
]

