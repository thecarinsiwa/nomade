from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import date

from .models import (
    RoomImage, DestinationImage, ActivityImage, AirlineImage, FlightImage,
    CarImage, CruiseShipImage, CruiseCabinImage, CruiseImage, UserImage,
    PromotionImage, PackageImage, AirportImage, GenericImage, ImageMetadata
)
from .serializers import (
    RoomImageSerializer, DestinationImageSerializer, ActivityImageSerializer,
    AirlineImageSerializer, FlightImageSerializer, CarImageSerializer,
    CruiseShipImageSerializer, CruiseCabinImageSerializer, CruiseImageSerializer,
    UserImageSerializer, PromotionImageSerializer, PackageImageSerializer,
    AirportImageSerializer, GenericImageSerializer, ImageMetadataSerializer
)


# ============================================================================
# 1. ROOM IMAGES
# ============================================================================

class RoomImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomImage"""
    queryset = RoomImage.objects.select_related('room').all()
    serializer_class = RoomImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 2. DESTINATION IMAGES
# ============================================================================

class DestinationImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour DestinationImage"""
    queryset = DestinationImage.objects.select_related('destination').all()
    serializer_class = DestinationImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        destination_id = self.request.query_params.get('destination_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if destination_id:
            queryset = queryset.filter(destination_id=destination_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 3. ACTIVITY IMAGES
# ============================================================================

class ActivityImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour ActivityImage"""
    queryset = ActivityImage.objects.select_related('activity').all()
    serializer_class = ActivityImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        activity_id = self.request.query_params.get('activity_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if activity_id:
            queryset = queryset.filter(activity_id=activity_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 4. AIRLINE IMAGES
# ============================================================================

class AirlineImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour AirlineImage"""
    queryset = AirlineImage.objects.select_related('airline').all()
    serializer_class = AirlineImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        airline_id = self.request.query_params.get('airline_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if airline_id:
            queryset = queryset.filter(airline_id=airline_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 5. FLIGHT IMAGES
# ============================================================================

class FlightImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour FlightImage"""
    queryset = FlightImage.objects.select_related('flight').all()
    serializer_class = FlightImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        flight_id = self.request.query_params.get('flight_id')
        image_type = self.request.query_params.get('image_type')
        
        if flight_id:
            queryset = queryset.filter(flight_id=flight_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        
        return queryset


# ============================================================================
# 6. CAR IMAGES
# ============================================================================

class CarImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour CarImage"""
    queryset = CarImage.objects.select_related('car').all()
    serializer_class = CarImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        car_id = self.request.query_params.get('car_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if car_id:
            queryset = queryset.filter(car_id=car_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 7. CRUISE SHIP IMAGES
# ============================================================================

class CruiseShipImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseShipImage"""
    queryset = CruiseShipImage.objects.select_related('cruise_ship').all()
    serializer_class = CruiseShipImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        cruise_ship_id = self.request.query_params.get('cruise_ship_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if cruise_ship_id:
            queryset = queryset.filter(cruise_ship_id=cruise_ship_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 8. CRUISE CABIN IMAGES
# ============================================================================

class CruiseCabinImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseCabinImage"""
    queryset = CruiseCabinImage.objects.select_related('cruise_cabin').all()
    serializer_class = CruiseCabinImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        cruise_cabin_id = self.request.query_params.get('cruise_cabin_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if cruise_cabin_id:
            queryset = queryset.filter(cruise_cabin_id=cruise_cabin_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 9. CRUISE IMAGES
# ============================================================================

class CruiseImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseImage"""
    queryset = CruiseImage.objects.select_related('cruise').all()
    serializer_class = CruiseImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        cruise_id = self.request.query_params.get('cruise_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if cruise_id:
            queryset = queryset.filter(cruise_id=cruise_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 10. USER IMAGES
# ============================================================================

class UserImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour UserImage"""
    queryset = UserImage.objects.select_related('user').all()
    serializer_class = UserImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        is_verified = self.request.query_params.get('is_verified')
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
        
        return queryset


# ============================================================================
# 11. PROMOTION IMAGES
# ============================================================================

class PromotionImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour PromotionImage"""
    queryset = PromotionImage.objects.select_related('promotion').all()
    serializer_class = PromotionImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        promotion_id = self.request.query_params.get('promotion_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        is_active = self.request.query_params.get('is_active')
        
        if promotion_id:
            queryset = queryset.filter(promotion_id=promotion_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer les images promotionnelles actives"""
        today = date.today()
        queryset = self.get_queryset().filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ============================================================================
# 12. PACKAGE IMAGES
# ============================================================================

class PackageImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour PackageImage"""
    queryset = PackageImage.objects.select_related('package').all()
    serializer_class = PackageImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        package_id = self.request.query_params.get('package_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if package_id:
            queryset = queryset.filter(package_id=package_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 13. AIRPORT IMAGES
# ============================================================================

class AirportImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour AirportImage"""
    queryset = AirportImage.objects.select_related('airport').all()
    serializer_class = AirportImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at', 'is_primary']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        airport_id = self.request.query_params.get('airport_id')
        image_type = self.request.query_params.get('image_type')
        is_primary = self.request.query_params.get('is_primary')
        
        if airport_id:
            queryset = queryset.filter(airport_id=airport_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary.lower() == 'true')
        
        return queryset


# ============================================================================
# 14. GENERIC IMAGES
# ============================================================================

class GenericImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour GenericImage"""
    queryset = GenericImage.objects.all()
    serializer_class = GenericImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['display_name', 'category', 'alt_text']
    ordering_fields = ['display_order', 'created_at', 'image_type']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        image_type = self.request.query_params.get('image_type')
        category = self.request.query_params.get('category')
        is_active = self.request.query_params.get('is_active')
        
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        if category:
            queryset = queryset.filter(category=category)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


# ============================================================================
# 15. IMAGE METADATA
# ============================================================================

class ImageMetadataViewSet(viewsets.ModelViewSet):
    """ViewSet pour ImageMetadata"""
    queryset = ImageMetadata.objects.all()
    serializer_class = ImageMetadataSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['image_url', 'entity_type', 'entity_id']
    ordering_fields = ['created_at', 'file_size', 'format']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        entity_type = self.request.query_params.get('entity_type')
        entity_id = self.request.query_params.get('entity_id')
        format_filter = self.request.query_params.get('format')
        is_optimized = self.request.query_params.get('is_optimized')
        
        if entity_type:
            queryset = queryset.filter(entity_type=entity_type)
        if entity_id:
            queryset = queryset.filter(entity_id=entity_id)
        if format_filter:
            queryset = queryset.filter(format=format_filter)
        if is_optimized is not None:
            queryset = queryset.filter(is_optimized=is_optimized.lower() == 'true')
        
        return queryset

