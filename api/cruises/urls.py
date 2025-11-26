from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CruiseLineViewSet, CruiseShipViewSet, CruisePortViewSet,
    CruiseViewSet, CruiseCabinTypeViewSet, CruiseCabinViewSet
)

router = DefaultRouter()
router.register(r'cruise-lines', CruiseLineViewSet, basename='cruise-line')
router.register(r'ships', CruiseShipViewSet, basename='cruise-ship')
router.register(r'ports', CruisePortViewSet, basename='cruise-port')
router.register(r'cruises', CruiseViewSet, basename='cruise')
router.register(r'cabin-types', CruiseCabinTypeViewSet, basename='cruise-cabin-type')
router.register(r'cabins', CruiseCabinViewSet, basename='cruise-cabin')

urlpatterns = [
    path('', include(router.urls)),
]

