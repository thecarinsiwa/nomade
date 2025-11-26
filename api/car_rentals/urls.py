from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CarRentalCompanyViewSet, CarRentalLocationViewSet, CarCategoryViewSet,
    CarViewSet, CarAvailabilityViewSet
)

router = DefaultRouter()
router.register(r'companies', CarRentalCompanyViewSet, basename='car-rental-company')
router.register(r'locations', CarRentalLocationViewSet, basename='car-rental-location')
router.register(r'categories', CarCategoryViewSet, basename='car-category')
router.register(r'cars', CarViewSet, basename='car')
router.register(r'availability', CarAvailabilityViewSet, basename='car-availability')

urlpatterns = [
    path('', include(router.urls)),
]

