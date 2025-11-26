from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import AuditLog, SecurityEvent
from .serializers import (
    AuditLogSerializer, SecurityEventSerializer
)


# ============================================================================
# AUDIT LOGS
# ============================================================================

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour AuditLog (lecture seule pour la sécurité)"""
    queryset = AuditLog.objects.select_related('user').all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Seuls les staff peuvent voir les logs d'audit
        if not self.request.user.is_staff:
            # Les utilisateurs non-staff ne peuvent voir que leurs propres logs
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        action = self.request.query_params.get('action')
        table_name = self.request.query_params.get('table_name')
        record_id = self.request.query_params.get('record_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        if action:
            queryset = queryset.filter(action__icontains=action)
        if table_name:
            queryset = queryset.filter(table_name__icontains=table_name)
        if record_id:
            queryset = queryset.filter(record_id=record_id)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques sur les logs d'audit (staff seulement)"""
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
        total_logs = queryset.count()
        
        # Répartition par action
        by_action = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Répartition par table
        by_table = queryset.values('table_name').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Répartition par utilisateur (top 10)
        by_user = queryset.values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Logs par jour (derniers 30 jours)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        logs_by_day = queryset.filter(
            created_at__gte=thirty_days_ago
        ).extra(
            select={'day': 'DATE(created_at)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        return Response({
            'total_logs': total_logs,
            'by_action': list(by_action),
            'by_table': list(by_table),
            'top_users': list(by_user),
            'logs_by_day': list(logs_by_day)
        })


# ============================================================================
# SECURITY EVENTS
# ============================================================================

class SecurityEventViewSet(viewsets.ModelViewSet):
    """ViewSet pour SecurityEvent"""
    queryset = SecurityEvent.objects.select_related('user').all()
    serializer_class = SecurityEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'severity', 'event_type']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Seuls les staff peuvent voir tous les événements
        if not self.request.user.is_staff:
            # Les utilisateurs non-staff ne peuvent voir que leurs propres événements
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        event_type = self.request.query_params.get('event_type')
        severity = self.request.query_params.get('severity')
        critical_only = self.request.query_params.get('critical_only')
        high_severity_only = self.request.query_params.get('high_severity_only')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if user_id and self.request.user.is_staff:
            queryset = queryset.filter(user_id=user_id)
        if event_type:
            queryset = queryset.filter(event_type__icontains=event_type)
        if severity:
            queryset = queryset.filter(severity=severity)
        if critical_only and critical_only.lower() == 'true':
            queryset = queryset.filter(severity='critical')
        if high_severity_only and high_severity_only.lower() == 'true':
            queryset = queryset.filter(severity__in=['high', 'critical'])
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un événement de sécurité"""
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
    def critical(self, request):
        """Récupérer tous les événements critiques"""
        events = self.get_queryset().filter(severity='critical')
        
        page = self.paginate_queryset(events)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques sur les événements de sécurité (staff seulement)"""
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
        
        # Répartition par sévérité
        by_severity = queryset.values('severity').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Répartition par utilisateur (top 10)
        by_user = queryset.values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Événements critiques récents (7 derniers jours)
        seven_days_ago = timezone.now() - timedelta(days=7)
        critical_recent = queryset.filter(
            severity='critical',
            created_at__gte=seven_days_ago
        ).count()
        
        return Response({
            'total_events': total_events,
            'critical_recent': critical_recent,
            'by_type': list(by_type),
            'by_severity': list(by_severity),
            'top_users': list(by_user)
        })
