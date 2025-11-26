from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, UserProfileViewSet, UserAddressViewSet,
    UserPaymentMethodViewSet, UserSessionViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'addresses', UserAddressViewSet, basename='address')
router.register(r'payment-methods', UserPaymentMethodViewSet, basename='payment-method')
router.register(r'sessions', UserSessionViewSet, basename='session')

urlpatterns = [
    path('', include(router.urls)),
]

