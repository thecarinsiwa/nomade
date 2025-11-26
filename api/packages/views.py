from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import PackageType, Package, PackageComponent
from .serializers import (
    PackageTypeSerializer, PackageSerializer, PackageListSerializer,
    PackageDetailSerializer, PackageComponentSerializer
)


# ============================================================================
# PACKAGE TYPES
# ============================================================================

class PackageTypeViewSet(viewsets.ModelViewSet):
    """ViewSet pour PackageType"""
    queryset = PackageType.objects.all().annotate(
        packages_count=Count('packages')
    )
    serializer_class = PackageTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# PACKAGE COMPONENTS
# ============================================================================

class PackageComponentViewSet(viewsets.ModelViewSet):
    """ViewSet pour PackageComponent"""
    queryset = PackageComponent.objects.select_related('package').all()
    serializer_class = PackageComponentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['component_type', 'created_at']
    ordering = ['package', 'component_type']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        package_id = self.request.query_params.get('package_id')
        component_type = self.request.query_params.get('component_type')
        component_id = self.request.query_params.get('component_id')
        
        if package_id:
            queryset = queryset.filter(package_id=package_id)
        if component_type:
            queryset = queryset.filter(component_type=component_type)
        if component_id:
            queryset = queryset.filter(component_id=component_id)
        
        return queryset


# ============================================================================
# PACKAGES
# ============================================================================

class PackageViewSet(viewsets.ModelViewSet):
    """ViewSet pour Package"""
    queryset = Package.objects.select_related('package_type').prefetch_related('components').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'discount_percent', 'start_date', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PackageListSerializer
        elif self.action == 'retrieve':
            return PackageDetailSerializer
        return PackageSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        package_type_id = self.request.query_params.get('package_type_id')
        status_filter = self.request.query_params.get('status')
        active_only = self.request.query_params.get('active_only')
        date = self.request.query_params.get('date')
        min_discount = self.request.query_params.get('min_discount')
        component_type = self.request.query_params.get('component_type')
        component_id = self.request.query_params.get('component_id')
        
        if package_type_id:
            queryset = queryset.filter(package_type_id=package_type_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if active_only and active_only.lower() == 'true':
            # Filtrer les forfaits actifs et dans leur période de validité
            today = timezone.now().date()
            queryset = queryset.filter(
                status='active',
                start_date__lte=today,
                end_date__gte=today
            )
        if date:
            try:
                search_date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    start_date__lte=search_date,
                    end_date__gte=search_date
                )
            except ValueError:
                pass
        if min_discount:
            queryset = queryset.filter(discount_percent__gte=float(min_discount))
        if component_type:
            queryset = queryset.filter(components__component_type=component_type).distinct()
        if component_id:
            queryset = queryset.filter(components__component_id=component_id).distinct()
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de forfaits"""
        package_type_id = request.query_params.get('package_type_id')
        component_type = request.query_params.get('component_type')
        component_id = request.query_params.get('component_id')
        date = request.query_params.get('date')
        min_discount = request.query_params.get('min_discount')
        active_only = request.query_params.get('active_only', 'true')
        
        queryset = self.get_queryset()
        
        # Filtrer uniquement les forfaits actifs par défaut
        if active_only.lower() == 'true':
            today = timezone.now().date()
            queryset = queryset.filter(
                status='active',
                start_date__lte=today,
                end_date__gte=today
            )
        
        # Filtre par type de forfait
        if package_type_id:
            queryset = queryset.filter(package_type_id=package_type_id)
        
        # Filtre par composant
        if component_type:
            queryset = queryset.filter(components__component_type=component_type).distinct()
        if component_id:
            queryset = queryset.filter(components__component_id=component_id).distinct()
        
        # Filtre par date
        if date:
            try:
                search_date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    start_date__lte=search_date,
                    end_date__gte=search_date
                )
            except ValueError:
                pass
        
        # Filtre par réduction minimale
        if min_discount:
            queryset = queryset.filter(discount_percent__gte=float(min_discount))
        
        # Trier par réduction décroissante
        queryset = queryset.order_by('-discount_percent', 'name')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def components(self, request, pk=None):
        """Récupérer tous les composants d'un forfait"""
        package_obj = self.get_object()
        components = package_obj.components.all()
        
        component_type = request.query_params.get('component_type')
        
        if component_type:
            components = components.filter(component_type=component_type)
        
        serializer = PackageComponentSerializer(components, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def calculate_price(self, request, pk=None):
        """Calculer le prix total d'un forfait avec réduction"""
        package_obj = self.get_object()
        
        if not package_obj.is_active:
            return Response(
                {'error': 'Ce forfait n\'est pas actif ou n\'est plus valide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_price = 0.0
        currency = 'EUR'
        components_details = []
        
        for component in package_obj.components.all():
            component_obj = component.get_component_object()
            component_price = 0.0
            
            if component_obj:
                # Récupérer le prix selon le type de composant
                if component.component_type == 'hotel':
                    # Pour les hôtels, on pourrait utiliser room_pricing ou room_availability
                    # Pour l'instant, on retourne juste l'info
                    component_price = 0.0
                elif component.component_type == 'flight':
                    # Pour les vols, utiliser flight_availability
                    from flights.models import FlightAvailability
                    availability = FlightAvailability.objects.filter(
                        flight=component_obj
                    ).first()
                    if availability:
                        component_price = float(availability.price)
                        currency = availability.currency
                elif component.component_type == 'car':
                    # Pour les voitures, utiliser car_availability
                    from car_rentals.models import CarAvailability
                    availability = CarAvailability.objects.filter(
                        car=component_obj
                    ).first()
                    if availability and availability.price_per_day:
                        component_price = float(availability.price_per_day)
                        currency = availability.currency
                elif component.component_type == 'activity':
                    # Pour les activités, utiliser activity_schedules
                    from tour_activities.models import ActivitySchedule
                    schedule = ActivitySchedule.objects.filter(
                        activity=component_obj
                    ).first()
                    if schedule and schedule.price:
                        component_price = float(schedule.price)
                        currency = schedule.currency
                elif component.component_type == 'cruise':
                    # Pour les croisières, utiliser cruise_cabins
                    from cruises.models import CruiseCabin
                    cabin = CruiseCabin.objects.filter(
                        cruise=component_obj
                    ).first()
                    if cabin and cabin.price:
                        component_price = float(cabin.price)
                        currency = cabin.currency
                
                components_details.append({
                    'component_type': component.component_type,
                    'component_id': str(component.component_id),
                    'component_name': str(component_obj) if component_obj else 'N/A',
                    'price': component_price,
                })
                
                total_price += component_price
        
        # Appliquer la réduction
        discount_amount = total_price * (float(package_obj.discount_percent) / 100.0) / 100.0
        final_price = total_price - discount_amount
        
        return Response({
            'package_id': str(package_obj.id),
            'package_name': package_obj.name,
            'discount_percent': float(package_obj.discount_percent),
            'components': components_details,
            'subtotal': round(total_price, 2),
            'discount_amount': round(discount_amount, 2),
            'total_price': round(final_price, 2),
            'currency': currency
        })
