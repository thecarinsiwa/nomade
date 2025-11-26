from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ActivityCategoryViewSet, ActivityViewSet, ActivityScheduleViewSet
)

router = DefaultRouter()
router.register(r'categories', ActivityCategoryViewSet, basename='activity-category')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'schedules', ActivityScheduleViewSet, basename='activity-schedule')

urlpatterns = [
    path('', include(router.urls)),
]

