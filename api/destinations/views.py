from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from decimal import Decimal

from .models import Country, Region, City, Destination
from .serializers import (
    CountrySerializer, RegionSerializer,
    CitySerializer, CityListSerializer, CityDetailSerializer,
    DestinationSerializer, DestinationListSerializer, DestinationDetailSerializer
)


# ============================================================================
# COUNTRIES
# ============================================================================

class CountryViewSet(viewsets.ModelViewSet):
    """ViewSet pour Country"""
    queryset = Country.objects.all().annotate(
        regions_count=Count('regions'),
        cities_count=Count('cities')
    )
    serializer_class = CountrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'code_iso3']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


# ============================================================================
# REGIONS
# ============================================================================

class RegionViewSet(viewsets.ModelViewSet):
    """ViewSet pour Region"""
    queryset = Region.objects.select_related('country').all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'country__name']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['country', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        country_id = self.request.query_params.get('country_id')
        
        if country_id:
            queryset = queryset.filter(country_id=country_id)
        
        return queryset


# ============================================================================
# CITIES
# ============================================================================

class CityViewSet(viewsets.ModelViewSet):
    """ViewSet pour City"""
    queryset = City.objects.select_related('country', 'region').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country__name', 'region__name']
    ordering_fields = ['name', 'created_at']
    ordering = ['country', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CityListSerializer
        elif self.action == 'retrieve':
            return CityDetailSerializer
        return CitySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        country_id = self.request.query_params.get('country_id')
        region_id = self.request.query_params.get('region_id')
        has_coordinates = self.request.query_params.get('has_coordinates')
        latitude = self.request.query_params.get('latitude')
        longitude = self.request.query_params.get('longitude')
        radius = self.request.query_params.get('radius')  # en km
        
        if country_id:
            queryset = queryset.filter(country_id=country_id)
        if region_id:
            queryset = queryset.filter(region_id=region_id)
        if has_coordinates and has_coordinates.lower() == 'true':
            queryset = queryset.exclude(latitude__isnull=True, longitude__isnull=True)
        
        # Recherche par proximité GPS
        if latitude and longitude:
            try:
                lat = Decimal(latitude)
                lon = Decimal(longitude)
                # Filtrer les villes dans un rayon approximatif
                # Approximation simple : 1 degré ≈ 111 km
                if radius:
                    radius_deg = Decimal(radius) / Decimal('111')
                    queryset = queryset.filter(
                        latitude__gte=lat - radius_deg,
                        latitude__lte=lat + radius_deg,
                        longitude__gte=lon - radius_deg,
                        longitude__lte=lon + radius_deg
                    )
            except (ValueError, TypeError):
                pass
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Trouver les villes proches d'un point GPS"""
        latitude = request.query_params.get('latitude')
        longitude = request.query_params.get('longitude')
        radius = request.query_params.get('radius', '50')  # 50 km par défaut
        
        if not latitude or not longitude:
            return Response(
                {'error': 'Les paramètres latitude et longitude sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            lat = Decimal(latitude)
            lon = Decimal(longitude)
            radius_km = Decimal(radius)
            radius_deg = radius_km / Decimal('111')
            
            cities = self.get_queryset().filter(
                latitude__isnull=False,
                longitude__isnull=False,
                latitude__gte=lat - radius_deg,
                latitude__lte=lat + radius_deg,
                longitude__gte=lon - radius_deg,
                longitude__lte=lon + radius_deg
            )
            
            # Calculer la distance approximative (formule de Haversine simplifiée)
            cities_with_distance = []
            for city in cities:
                # Distance approximative en km
                lat_diff = abs(float(city.latitude) - float(lat))
                lon_diff = abs(float(city.longitude) - float(lon))
                distance = ((lat_diff ** 2 + lon_diff ** 2) ** 0.5) * 111
                
                if distance <= float(radius_km):
                    cities_with_distance.append({
                        'city': CityListSerializer(city).data,
                        'distance_km': round(distance, 2)
                    })
            
            # Trier par distance
            cities_with_distance.sort(key=lambda x: x['distance_km'])
            
            page = self.paginate_queryset(cities_with_distance)
            if page is not None:
                return self.get_paginated_response(page)
            
            return Response(cities_with_distance)
        except (ValueError, TypeError) as e:
            return Response(
                {'error': f'Paramètres invalides: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================================
# DESTINATIONS
# ============================================================================

class DestinationViewSet(viewsets.ModelViewSet):
    """ViewSet pour Destination"""
    queryset = Destination.objects.select_related('city', 'city__country', 'city__region').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'city__name', 'city__country__name']
    ordering_fields = ['name', 'is_popular', 'created_at']
    ordering = ['-is_popular', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DestinationListSerializer
        elif self.action == 'retrieve':
            return DestinationDetailSerializer
        return DestinationSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        city_id = self.request.query_params.get('city_id')
        country_id = self.request.query_params.get('country_id')
        popular_only = self.request.query_params.get('popular_only')
        
        if city_id:
            queryset = queryset.filter(city_id=city_id)
        if country_id:
            queryset = queryset.filter(city__country_id=country_id)
        if popular_only and popular_only.lower() == 'true':
            queryset = queryset.filter(is_popular=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Récupérer toutes les destinations populaires"""
        destinations = self.get_queryset().filter(is_popular=True)
        
        page = self.paginate_queryset(destinations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(destinations, many=True)
        return Response(serializer.data)
