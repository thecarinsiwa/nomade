from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReviewViewSet, ReviewRatingViewSet, ReviewPhotoViewSet
)

router = DefaultRouter()
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'ratings', ReviewRatingViewSet, basename='review-rating')
router.register(r'photos', ReviewPhotoViewSet, basename='review-photo')

urlpatterns = [
    path('', include(router.urls)),
]

