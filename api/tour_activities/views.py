from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import ActivityCategory, Activity, ActivitySchedule
from .serializers import (
    ActivityCategorySerializer, ActivitySerializer, ActivityListSerializer,
    ActivityDetailSerializer, ActivityScheduleSerializer
)


# ============================================================================
# ACTIVITY CATEGORIES
# ============================================================================

class ActivityCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour ActivityCategory"""
    queryset = ActivityCategory.objects.all().annotate(
        activities_count=Count('activities')
    )
    serializer_class = ActivityCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# ACTIVITY SCHEDULES
# ============================================================================

class ActivityScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet pour ActivitySchedule"""
    queryset = ActivitySchedule.objects.select_related('activity', 'activity__category').all()
    serializer_class = ActivityScheduleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start_date', 'price', 'available_spots', 'created_at']
    ordering = ['start_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        activity_id = self.request.query_params.get('activity_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        available_only = self.request.query_params.get('available_only')
        max_price = self.request.query_params.get('max_price')
        
        if activity_id:
            queryset = queryset.filter(activity_id=activity_id)
        if date_from:
            queryset = queryset.filter(start_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(start_date__lte=date_to)
        if available_only and available_only.lower() == 'true':
            queryset = queryset.filter(available_spots__gt=0)
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        return queryset


# ============================================================================
# ACTIVITIES
# ============================================================================

class ActivityViewSet(viewsets.ModelViewSet):
    """ViewSet pour Activity"""
    queryset = Activity.objects.select_related('category').prefetch_related('schedules').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'location', 'city', 'country']
    ordering_fields = ['name', 'rating', 'duration_hours', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ActivityListSerializer
        elif self.action == 'retrieve':
            return ActivityDetailSerializer
        return ActivitySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        category_id = self.request.query_params.get('category_id')
        city = self.request.query_params.get('city')
        country = self.request.query_params.get('country')
        status_filter = self.request.query_params.get('status')
        min_rating = self.request.query_params.get('min_rating')
        max_duration = self.request.query_params.get('max_duration')
        min_duration = self.request.query_params.get('min_duration')
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if country:
            queryset = queryset.filter(country__icontains=country)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        if min_duration:
            queryset = queryset.filter(duration_hours__gte=float(min_duration))
        if max_duration:
            queryset = queryset.filter(duration_hours__lte=float(max_duration))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée d'activités"""
        city = request.query_params.get('city')
        country = request.query_params.get('country')
        category_id = request.query_params.get('category_id')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        min_rating = request.query_params.get('min_rating')
        max_price = request.query_params.get('max_price')
        min_spots = request.query_params.get('min_spots', 1)
        max_duration = request.query_params.get('max_duration')
        
        queryset = self.get_queryset().filter(status='active')
        
        # Filtres géographiques
        if city:
            queryset = queryset.filter(city__icontains=city)
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        # Filtre par catégorie
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filtre par note
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
        
        # Filtre par durée
        if max_duration:
            queryset = queryset.filter(duration_hours__lte=float(max_duration))
        
        # Filtre par disponibilité et dates
        if date_from or date_to or max_price or min_spots:
            available_schedules = ActivitySchedule.objects.filter(available_spots__gte=int(min_spots))
            
            if date_from:
                available_schedules = available_schedules.filter(start_date__gte=date_from)
            if date_to:
                available_schedules = available_schedules.filter(start_date__lte=date_to)
            if max_price:
                available_schedules = available_schedules.filter(price__lte=float(max_price))
            
            activity_ids = available_schedules.values_list('activity_id', flat=True).distinct()
            queryset = queryset.filter(id__in=activity_ids)
        
        # Trier par note décroissante
        queryset = queryset.order_by('-rating', 'name')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        """Récupérer les horaires d'une activité"""
        activity_obj = self.get_object()
        schedules = activity_obj.schedules.all()
        
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        available_only = request.query_params.get('available_only')
        max_price = request.query_params.get('max_price')
        
        if date_from:
            schedules = schedules.filter(start_date__gte=date_from)
        if date_to:
            schedules = schedules.filter(start_date__lte=date_to)
        if available_only and available_only.lower() == 'true':
            schedules = schedules.filter(available_spots__gt=0)
        if max_price:
            schedules = schedules.filter(price__lte=float(max_price))
        
        serializer = ActivityScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def available_schedules(self, request, pk=None):
        """Récupérer les horaires disponibles d'une activité"""
        activity_obj = self.get_object()
        schedules = activity_obj.schedules.filter(
            available_spots__gt=0,
            start_date__gte=timezone.now()
        )
        
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        max_price = request.query_params.get('max_price')
        
        if date_from:
            schedules = schedules.filter(start_date__gte=date_from)
        if date_to:
            schedules = schedules.filter(start_date__lte=date_to)
        if max_price:
            schedules = schedules.filter(price__lte=float(max_price))
        
        serializer = ActivityScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
