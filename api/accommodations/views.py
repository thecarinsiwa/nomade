from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    PropertyType, PropertyCategory, PropertyAddress, Property,
    PropertyAmenity, PropertyAmenityLink, PropertyImage, PropertyDescription,
    RoomType, Room, RoomAmenity, RoomAmenityLink,
    RoomAvailability, RoomPricing
)
from .serializers import (
    PropertyTypeSerializer, PropertyCategorySerializer, PropertyAddressSerializer,
    PropertySerializer, PropertyListSerializer, PropertyDetailSerializer,
    PropertyAmenitySerializer, PropertyAmenityLinkSerializer,
    PropertyImageSerializer, PropertyDescriptionSerializer,
    RoomTypeSerializer, RoomSerializer, RoomAmenitySerializer,
    RoomAmenityLinkSerializer, RoomAvailabilitySerializer, RoomPricingSerializer
)


# ============================================================================
# PROPERTY TYPES
# ============================================================================

class PropertyTypeViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyType"""
    queryset = PropertyType.objects.all().annotate(
        properties_count=Count('properties')
    )
    serializer_class = PropertyTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# PROPERTY CATEGORIES
# ============================================================================

class PropertyCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyCategory"""
    queryset = PropertyCategory.objects.all().annotate(
        properties_count=Count('properties')
    )
    serializer_class = PropertyCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# PROPERTY ADDRESSES
# ============================================================================

class PropertyAddressViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyAddress"""
    queryset = PropertyAddress.objects.all().annotate(
        properties_count=Count('properties')
    )
    serializer_class = PropertyAddressSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['street', 'city', 'country', 'postal_code', 'region']
    ordering_fields = ['city', 'country', 'created_at']
    ordering = ['country', 'city']
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Rechercher des adresses proches d'un point GPS"""
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius_km = float(request.query_params.get('radius', 10))
        
        if not latitude or not longitude:
            return Response(
                {'error': 'latitude et longitude sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Approximation simple (pour une vraie app, utiliser PostGIS)
        lat = float(latitude)
        lon = float(longitude)
        lat_range = radius_km / 111.0  # ~111 km par degré de latitude
        lon_range = radius_km / (111.0 * abs(lat))
        
        queryset = self.queryset.filter(
            latitude__range=(lat - lat_range, lat + lat_range),
            longitude__range=(lon - lon_range, lon + lon_range)
        )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ============================================================================
# PROPERTY AMENITIES
# ============================================================================

class PropertyAmenityViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyAmenity"""
    queryset = PropertyAmenity.objects.all().annotate(
        properties_count=Count('property_links')
    )
    serializer_class = PropertyAmenitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'category', 'created_at']
    ordering = ['name']


# ============================================================================
# PROPERTY AMENITIES LINK
# ============================================================================

class PropertyAmenityLinkViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyAmenityLink"""
    queryset = PropertyAmenityLink.objects.select_related('property', 'amenity').all()
    serializer_class = PropertyAmenityLinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property_id')
        amenity_id = self.request.query_params.get('amenity_id')
        
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if amenity_id:
            queryset = queryset.filter(amenity_id=amenity_id)
        
        return queryset


# ============================================================================
# PROPERTY IMAGES
# ============================================================================

class PropertyImageViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyImage"""
    queryset = PropertyImage.objects.select_related('property').all()
    serializer_class = PropertyImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['display_order', 'created_at']
    ordering = ['display_order', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property_id')
        image_type = self.request.query_params.get('image_type')
        
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if image_type:
            queryset = queryset.filter(image_type=image_type)
        
        return queryset


# ============================================================================
# PROPERTY DESCRIPTIONS
# ============================================================================

class PropertyDescriptionViewSet(viewsets.ModelViewSet):
    """ViewSet pour PropertyDescription"""
    queryset = PropertyDescription.objects.select_related('property').all()
    serializer_class = PropertyDescriptionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['language', 'created_at']
    ordering = ['language']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property_id')
        language = self.request.query_params.get('language')
        
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if language:
            queryset = queryset.filter(language=language)
        
        return queryset


# ============================================================================
# ROOM TYPES
# ============================================================================

class RoomTypeViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomType"""
    queryset = RoomType.objects.all().annotate(
        rooms_count=Count('rooms')
    )
    serializer_class = RoomTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# ROOM AMENITIES
# ============================================================================

class RoomAmenityViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomAmenity"""
    queryset = RoomAmenity.objects.all().annotate(
        rooms_count=Count('room_links')
    )
    serializer_class = RoomAmenitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# ROOM AMENITIES LINK
# ============================================================================

class RoomAmenityLinkViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomAmenityLink"""
    queryset = RoomAmenityLink.objects.select_related('room', 'amenity').all()
    serializer_class = RoomAmenityLinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id')
        amenity_id = self.request.query_params.get('amenity_id')
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if amenity_id:
            queryset = queryset.filter(amenity_id=amenity_id)
        
        return queryset


# ============================================================================
# ROOM AVAILABILITY
# ============================================================================

class RoomAvailabilityViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomAvailability"""
    queryset = RoomAvailability.objects.select_related('room', 'room__property').all()
    serializer_class = RoomAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'price', 'created_at']
    ordering = ['date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        available = self.request.query_params.get('available')
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """Vérifier la disponibilité d'une chambre pour une période"""
        room_id = request.query_params.get('room_id')
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')
        
        if not all([room_id, check_in, check_out]):
            return Response(
                {'error': 'room_id, check_in et check_out sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Format de date invalide. Utilisez YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if check_in_date >= check_out_date:
            return Response(
                {'error': 'check_out doit être après check_in'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier toutes les dates dans la période
        current_date = check_in_date
        unavailable_dates = []
        
        while current_date < check_out_date:
            availability = RoomAvailability.objects.filter(
                room_id=room_id,
                date=current_date,
                available=False
            ).first()
            
            if availability:
                unavailable_dates.append(str(current_date))
            
            current_date += timedelta(days=1)
        
        is_available = len(unavailable_dates) == 0
        
        return Response({
            'available': is_available,
            'unavailable_dates': unavailable_dates,
            'check_in': check_in,
            'check_out': check_out
        })


# ============================================================================
# ROOM PRICING
# ============================================================================

class RoomPricingViewSet(viewsets.ModelViewSet):
    """ViewSet pour RoomPricing"""
    queryset = RoomPricing.objects.select_related('room', 'room__property').all()
    serializer_class = RoomPricingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date', 'base_price', 'season_type']
    ordering = ['start_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id')
        season_type = self.request.query_params.get('season_type')
        date = self.request.query_params.get('date')
        
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if season_type:
            queryset = queryset.filter(season_type=season_type)
        if date:
            queryset = queryset.filter(
                start_date__lte=date,
                end_date__gte=date
            )
        
        return queryset


# ============================================================================
# ROOMS
# ============================================================================

class RoomViewSet(viewsets.ModelViewSet):
    """ViewSet pour Room"""
    queryset = Room.objects.select_related('property', 'room_type').prefetch_related(
        'amenity_links__amenity'
    ).all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'bed_type']
    ordering_fields = ['name', 'max_guests', 'created_at']
    ordering = ['property', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        property_id = self.request.query_params.get('property_id')
        room_type_id = self.request.query_params.get('room_type_id')
        status_filter = self.request.query_params.get('status')
        min_guests = self.request.query_params.get('min_guests')
        
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        if room_type_id:
            queryset = queryset.filter(room_type_id=room_type_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if min_guests:
            queryset = queryset.filter(max_guests__gte=min_guests)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RoomSerializer
        return RoomSerializer


# ============================================================================
# PROPERTIES
# ============================================================================

class PropertyViewSet(viewsets.ModelViewSet):
    """ViewSet pour Property"""
    queryset = Property.objects.select_related(
        'property_type', 'property_category', 'address'
    ).prefetch_related(
        'images', 'descriptions', 'amenity_links__amenity', 'rooms'
    ).all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'rating', 'created_at', 'total_reviews']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PropertyListSerializer
        elif self.action == 'retrieve':
            return PropertyDetailSerializer
        return PropertySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        property_type_id = self.request.query_params.get('property_type_id')
        property_category_id = self.request.query_params.get('property_category_id')
        city = self.request.query_params.get('city')
        country = self.request.query_params.get('country')
        status_filter = self.request.query_params.get('status')
        min_rating = self.request.query_params.get('min_rating')
        amenity_id = self.request.query_params.get('amenity_id')
        
        if property_type_id:
            queryset = queryset.filter(property_type_id=property_type_id)
        if property_category_id:
            queryset = queryset.filter(property_category_id=property_category_id)
        if city:
            queryset = queryset.filter(address__city__icontains=city)
        if country:
            queryset = queryset.filter(address__country__icontains=country)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        if amenity_id:
            queryset = queryset.filter(amenity_links__amenity_id=amenity_id).distinct()
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de propriétés"""
        check_in = request.query_params.get('check_in')
        check_out = request.query_params.get('check_out')
        guests = request.query_params.get('guests', 2)
        city = request.query_params.get('city')
        country = request.query_params.get('country')
        min_rating = request.query_params.get('min_rating')
        
        queryset = self.get_queryset().filter(status='active')
        
        # Filtres géographiques
        if city:
            queryset = queryset.filter(address__city__icontains=city)
        if country:
            queryset = queryset.filter(address__country__icontains=country)
        
        # Filtre par note
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        # Filtre par disponibilité et capacité
        if check_in and check_out:
            try:
                check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
                check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
                
                # Trouver les chambres disponibles pour cette période
                available_rooms = RoomAvailability.objects.filter(
                    date__gte=check_in_date,
                    date__lt=check_out_date,
                    available=True
                ).values_list('room_id', flat=True).distinct()
                
                # Filtrer les propriétés qui ont des chambres disponibles
                # avec la capacité requise
                rooms_with_capacity = Room.objects.filter(
                    id__in=available_rooms,
                    max_guests__gte=int(guests),
                    status='available'
                ).values_list('property_id', flat=True).distinct()
                
                queryset = queryset.filter(id__in=rooms_with_capacity)
            except ValueError:
                pass
        
        # Trier par note décroissante
        queryset = queryset.order_by('-rating', '-total_reviews')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def rooms(self, request, pk=None):
        """Récupérer toutes les chambres d'une propriété"""
        property_obj = self.get_object()
        rooms = property_obj.rooms.select_related('room_type').prefetch_related(
            'amenity_links__amenity'
        ).all()
        
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Récupérer la disponibilité de toutes les chambres d'une propriété"""
        property_obj = self.get_object()
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        rooms = property_obj.rooms.all()
        availability_data = []
        
        for room in rooms:
            availabilities = room.availabilities.all()
            
            if date_from:
                availabilities = availabilities.filter(date__gte=date_from)
            if date_to:
                availabilities = availabilities.filter(date__lte=date_to)
            
            availability_data.append({
                'room_id': str(room.id),
                'room_name': room.name,
                'availabilities': RoomAvailabilitySerializer(
                    availabilities,
                    many=True
                ).data
            })
        
        return Response(availability_data)
