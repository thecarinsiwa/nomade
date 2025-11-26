from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Min, Max
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Airline, Airport, FlightClass, Flight, FlightAvailability
from .serializers import (
    AirlineSerializer, AirportSerializer, FlightClassSerializer,
    FlightSerializer, FlightListSerializer, FlightDetailSerializer,
    FlightAvailabilitySerializer
)


# ============================================================================
# AIRLINES
# ============================================================================

class AirlineViewSet(viewsets.ModelViewSet):
    """ViewSet pour Airline"""
    queryset = Airline.objects.all().annotate(
        flights_count=Count('flights')
    )
    serializer_class = AirlineSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'country']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


# ============================================================================
# AIRPORTS
# ============================================================================

class AirportViewSet(viewsets.ModelViewSet):
    """ViewSet pour Airport"""
    queryset = Airport.objects.all().annotate(
        departure_flights_count=Count('departure_flights'),
        arrival_flights_count=Count('arrival_flights')
    )
    serializer_class = AirportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['iata_code', 'icao_code', 'name', 'city', 'country']
    ordering_fields = ['name', 'city', 'country', 'iata_code', 'created_at']
    ordering = ['country', 'city', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get('city')
        country = self.request.query_params.get('country')
        iata_code = self.request.query_params.get('iata_code')
        
        if city:
            queryset = queryset.filter(city__icontains=city)
        if country:
            queryset = queryset.filter(country__icontains=country)
        if iata_code:
            queryset = queryset.filter(iata_code__iexact=iata_code)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Rechercher des aéroports proches d'un point GPS"""
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
# FLIGHT CLASSES
# ============================================================================

class FlightClassViewSet(viewsets.ModelViewSet):
    """ViewSet pour FlightClass"""
    queryset = FlightClass.objects.all().annotate(
        availabilities_count=Count('flight_availabilities')
    )
    serializer_class = FlightClassSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# FLIGHT AVAILABILITY
# ============================================================================

class FlightAvailabilityViewSet(viewsets.ModelViewSet):
    """ViewSet pour FlightAvailability"""
    queryset = FlightAvailability.objects.select_related(
        'flight', 'flight__airline', 'flight__departure_airport', 'flight__arrival_airport', 'flight_class'
    ).all()
    serializer_class = FlightAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date', 'price', 'available_seats', 'created_at']
    ordering = ['date', 'flight_class']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        flight_id = self.request.query_params.get('flight_id')
        flight_class_id = self.request.query_params.get('flight_class_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_seats = self.request.query_params.get('min_seats')
        max_price = self.request.query_params.get('max_price')
        
        if flight_id:
            queryset = queryset.filter(flight_id=flight_id)
        if flight_class_id:
            queryset = queryset.filter(flight_class_id=flight_class_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if min_seats:
            queryset = queryset.filter(available_seats__gte=int(min_seats))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        return queryset


# ============================================================================
# FLIGHTS
# ============================================================================

class FlightViewSet(viewsets.ModelViewSet):
    """ViewSet pour Flight"""
    queryset = Flight.objects.select_related(
        'airline', 'departure_airport', 'arrival_airport'
    ).prefetch_related('availabilities').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['flight_number', 'aircraft_type']
    ordering_fields = ['flight_number', 'duration_minutes', 'status', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FlightListSerializer
        elif self.action == 'retrieve':
            return FlightDetailSerializer
        return FlightSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        airline_id = self.request.query_params.get('airline_id')
        departure_airport_id = self.request.query_params.get('departure_airport_id')
        arrival_airport_id = self.request.query_params.get('arrival_airport_id')
        departure_iata = self.request.query_params.get('departure_iata')
        arrival_iata = self.request.query_params.get('arrival_iata')
        status_filter = self.request.query_params.get('status')
        flight_number = self.request.query_params.get('flight_number')
        
        if airline_id:
            queryset = queryset.filter(airline_id=airline_id)
        if departure_airport_id:
            queryset = queryset.filter(departure_airport_id=departure_airport_id)
        if arrival_airport_id:
            queryset = queryset.filter(arrival_airport_id=arrival_airport_id)
        if departure_iata:
            queryset = queryset.filter(departure_airport__iata_code__iexact=departure_iata)
        if arrival_iata:
            queryset = queryset.filter(arrival_airport__iata_code__iexact=arrival_iata)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if flight_number:
            queryset = queryset.filter(flight_number__icontains=flight_number)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de vols"""
        departure_iata = request.query_params.get('departure_iata')
        arrival_iata = request.query_params.get('arrival_iata')
        departure_city = request.query_params.get('departure_city')
        arrival_city = request.query_params.get('arrival_city')
        date = request.query_params.get('date')
        flight_class_id = request.query_params.get('flight_class_id')
        min_seats = request.query_params.get('min_seats', 1)
        max_price = request.query_params.get('max_price')
        airline_id = request.query_params.get('airline_id')
        
        queryset = self.get_queryset().filter(status__in=['scheduled', 'delayed'])
        
        # Filtres géographiques
        if departure_iata:
            queryset = queryset.filter(departure_airport__iata_code__iexact=departure_iata)
        elif departure_city:
            queryset = queryset.filter(departure_airport__city__icontains=departure_city)
        
        if arrival_iata:
            queryset = queryset.filter(arrival_airport__iata_code__iexact=arrival_iata)
        elif arrival_city:
            queryset = queryset.filter(arrival_airport__city__icontains=arrival_city)
        
        # Filtre par compagnie
        if airline_id:
            queryset = queryset.filter(airline_id=airline_id)
        
        # Filtre par disponibilité et date
        if date:
            try:
                search_date = datetime.strptime(date, '%Y-%m-%d').date()
                
                # Filtrer les vols qui ont des disponibilités pour cette date
                if flight_class_id:
                    available_flights = FlightAvailability.objects.filter(
                        date=search_date,
                        flight_class_id=flight_class_id,
                        available_seats__gte=int(min_seats)
                    )
                else:
                    available_flights = FlightAvailability.objects.filter(
                        date=search_date,
                        available_seats__gte=int(min_seats)
                    )
                
                if max_price:
                    available_flights = available_flights.filter(price__lte=float(max_price))
                
                flight_ids = available_flights.values_list('flight_id', flat=True).distinct()
                queryset = queryset.filter(id__in=flight_ids)
            except ValueError:
                pass
        
        # Trier par durée croissante
        queryset = queryset.order_by('duration_minutes', 'flight_number')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Récupérer la disponibilité d'un vol pour une période"""
        flight_obj = self.get_object()
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        flight_class_id = request.query_params.get('flight_class_id')
        
        availabilities = flight_obj.availabilities.select_related('flight_class').all()
        
        if date_from:
            availabilities = availabilities.filter(date__gte=date_from)
        if date_to:
            availabilities = availabilities.filter(date__lte=date_to)
        if flight_class_id:
            availabilities = availabilities.filter(flight_class_id=flight_class_id)
        
        serializer = FlightAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def prices(self, request, pk=None):
        """Récupérer les prix d'un vol par classe pour une date"""
        flight_obj = self.get_object()
        date = request.query_params.get('date')
        
        if not date:
            return Response(
                {'error': 'Le paramètre date est requis (format: YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            search_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Format de date invalide. Utilisez YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        availabilities = flight_obj.availabilities.filter(
            date=search_date
        ).select_related('flight_class').order_by('flight_class__name')
        
        prices_data = []
        for avail in availabilities:
            prices_data.append({
                'flight_class_id': str(avail.flight_class.id),
                'flight_class_name': avail.flight_class.name,
                'available_seats': avail.available_seats,
                'price': float(avail.price),
                'currency': avail.currency
            })
        
        return Response({
            'flight': f"{flight_obj.airline.code}{flight_obj.flight_number}",
            'date': date,
            'prices': prices_data
        })

