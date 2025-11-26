from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserSearchViewSet, AnalyticsEventViewSet
)

router = DefaultRouter()
router.register(r'searches', UserSearchViewSet, basename='user-search')
router.register(r'events', AnalyticsEventViewSet, basename='analytics-event')

urlpatterns = [
    path('', include(router.urls)),
]

