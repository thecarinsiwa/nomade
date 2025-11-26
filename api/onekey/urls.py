from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OneKeyAccountViewSet, OneKeyRewardViewSet, OneKeyTransactionViewSet
)

router = DefaultRouter()
router.register(r'accounts', OneKeyAccountViewSet, basename='onekey-account')
router.register(r'rewards', OneKeyRewardViewSet, basename='onekey-reward')
router.register(r'transactions', OneKeyTransactionViewSet, basename='onekey-transaction')

urlpatterns = [
    path('', include(router.urls)),
]

