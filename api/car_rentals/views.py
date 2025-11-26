from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    CarRentalCompany, CarRentalLocation, CarCategory, Car, CarAvailability
)
from .serializers import (
    CarRentalCompanySerializer, CarRentalLocationSerializer,
    CarCategorySerializer, CarSerializer, CarListSerializer, CarDetailSerializer,
    CarAvailabilitySerializer
)


# ============================================================================
# CAR RENTAL COMPANIES
# ============================================================================

class CarRentalCompanyViewSet(viewsets.ModelViewSet):
    """ViewSet pour CarRentalCompany"""
    queryset = CarRentalCompany.objects.all().annotate(
        locations_count=Count('locations'),
        cars_count=Count('cars')
    )
    serializer_class = CarRentalCompanySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']


# ============================================================================
# CAR RENTAL LOCATIONS
# ============================================================================

class CarRentalLocationViewSet(viewsets.ModelViewSet):
    """ViewSet pour CarRentalLocation"""
    queryset = CarRentalLocation.objects.select_related('company').annotate(
        availabilities_count=Count('car_availabilities')
    )
    serializer_class = CarRentalLocationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'city', 'country']
    ordering_fields = ['name', 'city', 'country', 'created_at']
    ordering = ['company', 'city', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        company_id = self.request.query_params.get('company_id')
        city = self.request.query_params.get('city')
        country = self.request.query_params.get('country')
        location_type = self.request.query_params.get('location_type')
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if country:
            queryset = queryset.filter(country__icontains=country)
        if location_type:
            queryset = queryset.filter(location_type=location_type)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Rechercher des points de location proches d'un point GPS"""
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
# CAR CATEGORIES
# ============================================================================

class CarCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour CarCategory"""
    queryset = CarCategory.objects.all().annotate(
        cars_count=Count('cars')
    )
    serializer_class = CarCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# CAR AVAILABILITY
# ============================================================================

class CarAvailabilityViewSet(viewsets.ModelViewSet):
    """ViewSet pour CarAvailability"""
    queryset = CarAvailability.objects.select_related(
        'car', 'car__company', 'car__category', 'location'
    ).all()
    serializer_class = CarAvailabilitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date', 'end_date', 'price_per_day', 'created_at']
    ordering = ['start_date', 'end_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        car_id = self.request.query_params.get('car_id')
        location_id = self.request.query_params.get('location_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        available = self.request.query_params.get('available')
        max_price = self.request.query_params.get('max_price')
        
        if car_id:
            queryset = queryset.filter(car_id=car_id)
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        if date_from:
            queryset = queryset.filter(end_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_date__lte=date_to)
        if available is not None:
            queryset = queryset.filter(available=available.lower() == 'true')
        if max_price:
            queryset = queryset.filter(price_per_day__lte=float(max_price))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """Vérifier la disponibilité d'une voiture pour une période"""
        car_id = request.query_params.get('car_id')
        location_id = request.query_params.get('location_id')
        pickup_date = request.query_params.get('pickup_date')
        return_date = request.query_params.get('return_date')
        
        if not all([car_id, location_id, pickup_date, return_date]):
            return Response(
                {'error': 'car_id, location_id, pickup_date et return_date sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            pickup = datetime.strptime(pickup_date, '%Y-%m-%d').date()
            return_d = datetime.strptime(return_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Format de date invalide. Utilisez YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if pickup >= return_d:
            return Response(
                {'error': 'return_date doit être après pickup_date'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier s'il existe une disponibilité qui couvre cette période
        availability = CarAvailability.objects.filter(
            car_id=car_id,
            location_id=location_id,
            start_date__lte=pickup,
            end_date__gte=return_d,
            available=True
        ).first()
        
        is_available = availability is not None
        
        return Response({
            'available': is_available,
            'pickup_date': pickup_date,
            'return_date': return_date,
            'price_per_day': float(availability.price_per_day) if availability else None,
            'currency': availability.currency if availability else None,
            'total_days': (return_d - pickup).days,
            'total_price': float(availability.price_per_day * (return_d - pickup).days) if availability else None
        })


# ============================================================================
# CARS
# ============================================================================

class CarViewSet(viewsets.ModelViewSet):
    """ViewSet pour Car"""
    queryset = Car.objects.select_related(
        'company', 'category'
    ).prefetch_related('availabilities').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['make', 'model']
    ordering_fields = ['make', 'model', 'year', 'created_at']
    ordering = ['company', 'make', 'model']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CarListSerializer
        elif self.action == 'retrieve':
            return CarDetailSerializer
        return CarSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        company_id = self.request.query_params.get('company_id')
        category_id = self.request.query_params.get('category_id')
        make = self.request.query_params.get('make')
        model = self.request.query_params.get('model')
        transmission = self.request.query_params.get('transmission')
        fuel_type = self.request.query_params.get('fuel_type')
        status_filter = self.request.query_params.get('status')
        min_seats = self.request.query_params.get('min_seats')
        min_year = self.request.query_params.get('min_year')
        max_year = self.request.query_params.get('max_year')
        
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if make:
            queryset = queryset.filter(make__icontains=make)
        if model:
            queryset = queryset.filter(model__icontains=model)
        if transmission:
            queryset = queryset.filter(transmission=transmission)
        if fuel_type:
            queryset = queryset.filter(fuel_type=fuel_type)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if min_seats:
            queryset = queryset.filter(seats__gte=int(min_seats))
        if min_year:
            queryset = queryset.filter(year__gte=int(min_year))
        if max_year:
            queryset = queryset.filter(year__lte=int(max_year))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de voitures"""
        pickup_location_id = request.query_params.get('pickup_location_id')
        return_location_id = request.query_params.get('return_location_id')
        pickup_city = request.query_params.get('pickup_city')
        return_city = request.query_params.get('return_city')
        pickup_date = request.query_params.get('pickup_date')
        return_date = request.query_params.get('return_date')
        category_id = request.query_params.get('category_id')
        min_seats = request.query_params.get('min_seats')
        transmission = request.query_params.get('transmission')
        fuel_type = request.query_params.get('fuel_type')
        max_price_per_day = request.query_params.get('max_price_per_day')
        company_id = request.query_params.get('company_id')
        
        queryset = self.get_queryset().filter(status='available')
        
        # Filtres de base
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if min_seats:
            queryset = queryset.filter(seats__gte=int(min_seats))
        if transmission:
            queryset = queryset.filter(transmission=transmission)
        if fuel_type:
            queryset = queryset.filter(fuel_type=fuel_type)
        
        # Filtre par disponibilité et dates
        if pickup_date and return_date:
            try:
                pickup = datetime.strptime(pickup_date, '%Y-%m-%d').date()
                return_d = datetime.strptime(return_date, '%Y-%m-%d').date()
                
                # Filtrer les voitures disponibles pour cette période
                if pickup_location_id:
                    available_cars = CarAvailability.objects.filter(
                        start_date__lte=pickup,
                        end_date__gte=return_d,
                        available=True,
                        location_id=pickup_location_id
                    )
                elif pickup_city:
                    available_cars = CarAvailability.objects.filter(
                        start_date__lte=pickup,
                        end_date__gte=return_d,
                        available=True,
                        location__city__icontains=pickup_city
                    )
                else:
                    available_cars = CarAvailability.objects.filter(
                        start_date__lte=pickup,
                        end_date__gte=return_d,
                        available=True
                    )
                
                if max_price_per_day:
                    available_cars = available_cars.filter(price_per_day__lte=float(max_price_per_day))
                
                car_ids = available_cars.values_list('car_id', flat=True).distinct()
                queryset = queryset.filter(id__in=car_ids)
            except ValueError:
                pass
        
        # Trier par marque et modèle
        queryset = queryset.order_by('make', 'model', 'year')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Récupérer la disponibilité d'une voiture pour une période"""
        car_obj = self.get_object()
        location_id = request.query_params.get('location_id')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        availabilities = car_obj.availabilities.select_related('location').all()
        
        if location_id:
            availabilities = availabilities.filter(location_id=location_id)
        if date_from:
            availabilities = availabilities.filter(end_date__gte=date_from)
        if date_to:
            availabilities = availabilities.filter(start_date__lte=date_to)
        
        serializer = CarAvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)

