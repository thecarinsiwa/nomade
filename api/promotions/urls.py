from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PromotionTypeViewSet, PromotionViewSet, PromotionCodeViewSet
)

router = DefaultRouter()
router.register(r'promotion-types', PromotionTypeViewSet, basename='promotion-type')
router.register(r'promotions', PromotionViewSet, basename='promotion')
router.register(r'codes', PromotionCodeViewSet, basename='promotion-code')

urlpatterns = [
    path('', include(router.urls)),
]

