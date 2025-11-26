from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    CruiseLine, CruiseShip, CruisePort, Cruise, CruiseCabinType, CruiseCabin
)
from .serializers import (
    CruiseLineSerializer, CruiseShipSerializer, CruisePortSerializer,
    CruiseSerializer, CruiseListSerializer, CruiseDetailSerializer,
    CruiseCabinTypeSerializer, CruiseCabinSerializer
)


# ============================================================================
# CRUISE LINES
# ============================================================================

class CruiseLineViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseLine"""
    queryset = CruiseLine.objects.all().annotate(
        ships_count=Count('ships'),
        cruises_count=Count('cruises')
    )
    serializer_class = CruiseLineSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# CRUISE SHIPS
# ============================================================================

class CruiseShipViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseShip"""
    queryset = CruiseShip.objects.select_related('cruise_line').annotate(
        cruises_count=Count('cruises')
    )
    serializer_class = CruiseShipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'cruise_line__name']
    ordering_fields = ['name', 'capacity', 'year_built', 'created_at']
    ordering = ['cruise_line', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        cruise_line_id = self.request.query_params.get('cruise_line_id')
        
        if cruise_line_id:
            queryset = queryset.filter(cruise_line_id=cruise_line_id)
        
        return queryset


# ============================================================================
# CRUISE PORTS
# ============================================================================

class CruisePortViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruisePort"""
    queryset = CruisePort.objects.all().annotate(
        departure_cruises_count=Count('departure_cruises'),
        arrival_cruises_count=Count('arrival_cruises')
    )
    serializer_class = CruisePortSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'country']
    ordering_fields = ['name', 'city', 'country', 'created_at']
    ordering = ['country', 'city', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        country = self.request.query_params.get('country')
        
        if city:
            queryset = queryset.filter(city__icontains=city)
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Rechercher des ports proches d'un point GPS"""
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius_km = float(request.query_params.get('radius', 50))
        
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
# CRUISE CABIN TYPES
# ============================================================================

class CruiseCabinTypeViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseCabinType"""
    queryset = CruiseCabinType.objects.all().annotate(
        cabins_count=Count('cabins')
    )
    serializer_class = CruiseCabinTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# CRUISE CABINS
# ============================================================================

class CruiseCabinViewSet(viewsets.ModelViewSet):
    """ViewSet pour CruiseCabin"""
    queryset = CruiseCabin.objects.select_related(
        'cruise', 'cruise__cruise_line', 'cruise__ship', 'cabin_type'
    ).all()
    serializer_class = CruiseCabinSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['cabin_number', 'cruise__name']
    ordering_fields = ['cabin_number', 'price', 'max_guests', 'created_at']
    ordering = ['cruise', 'cabin_number']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        cruise_id = self.request.query_params.get('cruise_id')
        cabin_type_id = self.request.query_params.get('cabin_type_id')
        available = self.request.query_params.get('available')
        min_guests = self.request.query_params.get('min_guests')
        max_price = self.request.query_params.get('max_price')
        
        if cruise_id:
            queryset = queryset.filter(cruise_id=cruise_id)
        if cabin_type_id:
            queryset = queryset.filter(cabin_type_id=cabin_type_id)
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        if min_guests:
            queryset = queryset.filter(max_guests__gte=int(min_guests))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        return queryset


# ============================================================================
# CRUISES
# ============================================================================

class CruiseViewSet(viewsets.ModelViewSet):
    """ViewSet pour Cruise"""
    queryset = Cruise.objects.select_related(
        'cruise_line', 'ship', 'departure_port', 'arrival_port'
    ).prefetch_related('cabins').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'start_date', 'end_date', 'duration_days', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CruiseListSerializer
        elif self.action == 'retrieve':
            return CruiseDetailSerializer
        return CruiseSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        cruise_line_id = self.request.query_params.get('cruise_line_id')
        ship_id = self.request.query_params.get('ship_id')
        departure_port_id = self.request.query_params.get('departure_port_id')
        arrival_port_id = self.request.query_params.get('arrival_port_id')
        departure_city = self.request.query_params.get('departure_city')
        arrival_city = self.request.query_params.get('arrival_city')
        status_filter = self.request.query_params.get('status')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_duration = self.request.query_params.get('min_duration')
        max_duration = self.request.query_params.get('max_duration')
        
        if cruise_line_id:
            queryset = queryset.filter(cruise_line_id=cruise_line_id)
        if ship_id:
            queryset = queryset.filter(ship_id=ship_id)
        if departure_port_id:
            queryset = queryset.filter(departure_port_id=departure_port_id)
        if arrival_port_id:
            queryset = queryset.filter(arrival_port_id=arrival_port_id)
        if departure_city:
            queryset = queryset.filter(departure_port__city__icontains=departure_city)
        if arrival_city:
            queryset = queryset.filter(arrival_port__city__icontains=arrival_city)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if date_from:
            queryset = queryset.filter(end_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_date__lte=date_to)
        if min_duration:
            queryset = queryset.filter(duration_days__gte=int(min_duration))
        if max_duration:
            queryset = queryset.filter(duration_days__lte=int(max_duration))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de croisières"""
        departure_port_id = request.query_params.get('departure_port_id')
        arrival_port_id = request.query_params.get('arrival_port_id')
        departure_city = request.query_params.get('departure_city')
        arrival_city = request.query_params.get('arrival_city')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        cruise_line_id = request.query_params.get('cruise_line_id')
        cabin_type_id = request.query_params.get('cabin_type_id')
        min_guests = request.query_params.get('min_guests', 2)
        max_price = request.query_params.get('max_price')
        min_duration = request.query_params.get('min_duration')
        max_duration = request.query_params.get('max_duration')
        
        queryset = self.get_queryset().filter(status='scheduled')
        
        # Filtres géographiques
        if departure_port_id:
            queryset = queryset.filter(departure_port_id=departure_port_id)
        elif departure_city:
            queryset = queryset.filter(departure_port__city__icontains=departure_city)
        
        if arrival_port_id:
            queryset = queryset.filter(arrival_port_id=arrival_port_id)
        elif arrival_city:
            queryset = queryset.filter(arrival_port__city__icontains=arrival_city)
        
        # Filtre par compagnie
        if cruise_line_id:
            queryset = queryset.filter(cruise_line_id=cruise_line_id)
        
        # Filtre par dates
        if date_from:
            queryset = queryset.filter(end_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_date__lte=date_to)
        
        # Filtre par durée
        if min_duration:
            queryset = queryset.filter(duration_days__gte=int(min_duration))
        if max_duration:
            queryset = queryset.filter(duration_days__lte=int(max_duration))
        
        # Filtre par disponibilité de cabines
        if cabin_type_id or max_price or min_guests:
            available_cabins = CruiseCabin.objects.filter(available=True)
            
            if cabin_type_id:
                available_cabins = available_cabins.filter(cabin_type_id=cabin_type_id)
            if min_guests:
                available_cabins = available_cabins.filter(max_guests__gte=int(min_guests))
            if max_price:
                available_cabins = available_cabins.filter(price__lte=float(max_price))
            
            cruise_ids = available_cabins.values_list('cruise_id', flat=True).distinct()
            queryset = queryset.filter(id__in=cruise_ids)
        
        # Trier par date de départ
        queryset = queryset.order_by('start_date', 'name')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def cabins(self, request, pk=None):
        """Récupérer toutes les cabines d'une croisière"""
        cruise_obj = self.get_object()
        cabins = cruise_obj.cabins.select_related('cabin_type').all()
        
        cabin_type_id = request.query_params.get('cabin_type_id')
        available = request.query_params.get('available')
        min_guests = request.query_params.get('min_guests')
        max_price = request.query_params.get('max_price')
        
        if cabin_type_id:
            cabins = cabins.filter(cabin_type_id=cabin_type_id)
        if available is not None:
            cabins = cabins.filter(available=available.lower() == 'true')
        if min_guests:
            cabins = cabins.filter(max_guests__gte=int(min_guests))
        if max_price:
            cabins = cabins.filter(price__lte=float(max_price))
        
        serializer = CruiseCabinSerializer(cabins, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def available_cabins(self, request, pk=None):
        """Récupérer les cabines disponibles d'une croisière"""
        cruise_obj = self.get_object()
        cabins = cruise_obj.cabins.filter(available=True).select_related('cabin_type')
        
        cabin_type_id = request.query_params.get('cabin_type_id')
        min_guests = request.query_params.get('min_guests')
        max_price = request.query_params.get('max_price')
        
        if cabin_type_id:
            cabins = cabins.filter(cabin_type_id=cabin_type_id)
        if min_guests:
            cabins = cabins.filter(max_guests__gte=int(min_guests))
        if max_price:
            cabins = cabins.filter(price__lte=float(max_price))
        
        serializer = CruiseCabinSerializer(cabins, many=True)
        return Response(serializer.data)
