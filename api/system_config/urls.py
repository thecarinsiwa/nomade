from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CurrencyViewSet, LanguageViewSet, SettingViewSet
)

router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet, basename='currency')
router.register(r'languages', LanguageViewSet, basename='language')
router.register(r'settings', SettingViewSet, basename='setting')

urlpatterns = [
    path('', include(router.urls)),
]

