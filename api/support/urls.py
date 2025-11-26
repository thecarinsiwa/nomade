from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SupportCategoryViewSet, SupportTicketViewSet, SupportMessageViewSet
)

router = DefaultRouter()
router.register(r'categories', SupportCategoryViewSet, basename='support-category')
router.register(r'tickets', SupportTicketViewSet, basename='support-ticket')
router.register(r'messages', SupportMessageViewSet, basename='support-message')

urlpatterns = [
    path('', include(router.urls)),
]

