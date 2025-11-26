from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Review, ReviewRating, ReviewPhoto
from .serializers import (
    ReviewSerializer, ReviewListSerializer, ReviewDetailSerializer,
    ReviewRatingSerializer, ReviewPhotoSerializer
)


# ============================================================================
# REVIEW PHOTOS
# ============================================================================

class ReviewPhotoViewSet(viewsets.ModelViewSet):
    """ViewSet pour ReviewPhoto"""
    queryset = ReviewPhoto.objects.select_related('review').all()
    serializer_class = ReviewPhotoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        review_id = self.request.query_params.get('review_id')
        
        if review_id:
            queryset = queryset.filter(review_id=review_id)
        
        return queryset


# ============================================================================
# REVIEW RATINGS
# ============================================================================

class ReviewRatingViewSet(viewsets.ModelViewSet):
    """ViewSet pour ReviewRating"""
    queryset = ReviewRating.objects.select_related('review').all()
    serializer_class = ReviewRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['category', 'rating', 'created_at']
    ordering = ['review', 'category']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        review_id = self.request.query_params.get('review_id')
        category = self.request.query_params.get('category')
        
        if review_id:
            queryset = queryset.filter(review_id=review_id)
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset


# ============================================================================
# REVIEWS
# ============================================================================

class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet pour Review"""
    queryset = Review.objects.select_related(
        'user', 'property', 'activity', 'booking'
    ).prefetch_related('detailed_ratings', 'photos').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'comment']
    ordering_fields = ['rating', 'helpful_count', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ReviewListSerializer
        elif self.action == 'retrieve':
            return ReviewDetailSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        property_id = self.request.query_params.get('property_id')
        activity_id = self.request.query_params.get('activity_id')
        booking_id = self.request.query_params.get('booking_id')
        min_rating = self.request.query_params.get('min_rating')
        max_rating = self.request.query_params.get('max_rating')
        verified_only = self.request.query_params.get('verified_only')
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if activity_id:
            queryset = queryset.filter(activity_id=activity_id)
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        if max_rating:
            queryset = queryset.filter(rating__lte=float(max_rating))
        if verified_only and verified_only.lower() == 'true':
            queryset = queryset.filter(is_verified=True)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un avis pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def by_property(self, request):
        """Récupérer tous les avis d'une propriété"""
        property_id = request.query_params.get('property_id')
        
        if not property_id:
            return Response(
                {'error': 'property_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = self.get_queryset().filter(property_id=property_id)
        
        # Calculer les statistiques
        stats = reviews.aggregate(
            total_reviews=Count('id'),
            average_rating=Avg('rating'),
            verified_reviews=Count('id', filter=Q(is_verified=True))
        )
        
        # Calculer la répartition des notes
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[i] = reviews.filter(
                rating__gte=i-0.5,
                rating__lt=i+0.5
            ).count()
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response({
                'results': serializer.data,
                'statistics': {
                    'total_reviews': stats['total_reviews'] or 0,
                    'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0.0,
                    'verified_reviews': stats['verified_reviews'] or 0,
                    'rating_distribution': rating_distribution
                }
            })
        
        serializer = self.get_serializer(reviews, many=True)
        return Response({
            'results': serializer.data,
            'statistics': {
                'total_reviews': stats['total_reviews'] or 0,
                'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0.0,
                'verified_reviews': stats['verified_reviews'] or 0,
                'rating_distribution': rating_distribution
            }
        })
    
    @action(detail=False, methods=['get'])
    def by_activity(self, request):
        """Récupérer tous les avis d'une activité"""
        activity_id = request.query_params.get('activity_id')
        
        if not activity_id:
            return Response(
                {'error': 'activity_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = self.get_queryset().filter(activity_id=activity_id)
        
        # Calculer les statistiques
        stats = reviews.aggregate(
            total_reviews=Count('id'),
            average_rating=Avg('rating'),
            verified_reviews=Count('id', filter=Q(is_verified=True))
        )
        
        # Calculer la répartition des notes
        rating_distribution = {}
        for i in range(1, 6):
            rating_distribution[i] = reviews.filter(
                rating__gte=i-0.5,
                rating__lt=i+0.5
            ).count()
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return Response({
                'results': serializer.data,
                'statistics': {
                    'total_reviews': stats['total_reviews'] or 0,
                    'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0.0,
                    'verified_reviews': stats['verified_reviews'] or 0,
                    'rating_distribution': rating_distribution
                }
            })
        
        serializer = self.get_serializer(reviews, many=True)
        return Response({
            'results': serializer.data,
            'statistics': {
                'total_reviews': stats['total_reviews'] or 0,
                'average_rating': float(stats['average_rating']) if stats['average_rating'] else 0.0,
                'verified_reviews': stats['verified_reviews'] or 0,
                'rating_distribution': rating_distribution
            }
        })
    
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """Marquer un avis comme utile"""
        review_obj = self.get_object()
        review_obj.helpful_count += 1
        review_obj.save()
        
        serializer = self.get_serializer(review_obj)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Vérifier un avis (nécessite les permissions staff)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent vérifier un avis'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        review_obj = self.get_object()
        review_obj.is_verified = True
        review_obj.save()
        
        serializer = self.get_serializer(review_obj)
        return Response(serializer.data)
