from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Avg, Max, Min
from django.utils import timezone
from datetime import datetime, timedelta

from .models import UserSearch, AnalyticsEvent
from .serializers import (
    UserSearchSerializer, AnalyticsEventSerializer
)


# ============================================================================
# USER SEARCHES
# ============================================================================

class UserSearchViewSet(viewsets.ModelViewSet):
    """ViewSet pour UserSearch"""
    queryset = UserSearch.objects.select_related('user').all()
    serializer_class = UserSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'results_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs non-staff ne peuvent voir que leurs propres recherches
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        search_type = self.request.query_params.get('search_type')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_results = self.request.query_params.get('min_results')
        max_results = self.request.query_params.get('max_results')
        
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        if search_type:
            queryset = queryset.filter(search_type=search_type)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        if min_results:
            queryset = queryset.filter(results_count__gte=int(min_results))
        if max_results:
            queryset = queryset.filter(results_count__lte=int(max_results))
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer une recherche pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques sur les recherches"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent voir les statistiques'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        
        # Filtres optionnels pour les statistiques
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        # Statistiques globales
        total_searches = queryset.count()
        avg_results = queryset.aggregate(avg=Avg('results_count'))['avg'] or 0
        max_results = queryset.aggregate(max=Max('results_count'))['max'] or 0
        min_results = queryset.aggregate(min=Min('results_count'))['min'] or 0
        
        # Répartition par type
        by_type = queryset.values('search_type').annotate(
            count=Count('id'),
            avg_results=Avg('results_count')
        ).order_by('-count')
        
        # Répartition par utilisateur (top 10)
        by_user = queryset.values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'total_searches': total_searches,
            'average_results': round(float(avg_results), 2),
            'max_results': max_results,
            'min_results': min_results,
            'by_type': list(by_type),
            'top_users': list(by_user)
        })


# ============================================================================
# ANALYTICS EVENTS
# ============================================================================

class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """ViewSet pour AnalyticsEvent"""
    queryset = AnalyticsEvent.objects.select_related('user').all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'event_type']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs non-staff ne peuvent voir que leurs propres événements
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        event_type = self.request.query_params.get('event_type')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        if event_type:
            queryset = queryset.filter(event_type__icontains=event_type)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un événement analytics"""
        # Récupérer l'IP et le user agent depuis la requête
        ip_address = self.get_client_ip()
        user_agent = self.request.META.get('HTTP_USER_AGENT', '')
        
        serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    def get_client_ip(self):
        """Récupère l'adresse IP du client"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques sur les événements analytics"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent voir les statistiques'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = self.get_queryset()
        
        # Filtres optionnels pour les statistiques
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        # Statistiques globales
        total_events = queryset.count()
        
        # Répartition par type d'événement
        by_type = queryset.values('event_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Répartition par utilisateur (top 10)
        by_user = queryset.values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Événements par jour (derniers 30 jours)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        events_by_day = queryset.filter(
            created_at__gte=thirty_days_ago
        ).extra(
            select={'day': 'DATE(created_at)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        return Response({
            'total_events': total_events,
            'by_type': list(by_type),
            'top_users': list(by_user),
            'events_by_day': list(events_by_day)
        })
    
    @action(detail=False, methods=['post'])
    def track(self, request):
        """Endpoint simplifié pour tracker un événement"""
        event_type = request.data.get('event_type')
        event_data = request.data.get('event_data', {})
        
        if not event_type:
            return Response(
                {'error': 'Le type d\'événement est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupérer l'IP et le user agent
        ip_address = self.get_client_ip()
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        event = AnalyticsEvent.objects.create(
            user=request.user if request.user.is_authenticated else None,
            event_type=event_type,
            event_data=event_data,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
