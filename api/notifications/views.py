from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Notification, EmailTemplate
from .serializers import (
    NotificationSerializer, NotificationListSerializer, NotificationDetailSerializer,
    EmailTemplateSerializer
)


# ============================================================================
# EMAIL TEMPLATES
# ============================================================================

class EmailTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet pour EmailTemplate"""
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'subject', 'body']
    ordering_fields = ['name', 'language', 'created_at']
    ordering = ['name', 'language']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        language = self.request.query_params.get('language')
        name = self.request.query_params.get('name')
        
        if language:
            queryset = queryset.filter(language=language)
        if name:
            queryset = queryset.filter(name__icontains=name)
        
        return queryset


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet pour Notification"""
    queryset = Notification.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NotificationListSerializer
        elif self.action == 'retrieve':
            return NotificationDetailSerializer
        return NotificationSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs ne peuvent voir que leurs propres notifications
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        type_filter = self.request.query_params.get('type')
        is_read = self.request.query_params.get('is_read')
        unread_only = self.request.query_params.get('unread_only')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        if unread_only and unread_only.lower() == 'true':
            queryset = queryset.filter(is_read=False)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer une notification pour l'utilisateur spécifié ou l'utilisateur connecté"""
        user = serializer.validated_data.get('user')
        # Si l'utilisateur n'est pas staff, forcer l'utilisateur connecté
        if not self.request.user.is_staff and user != self.request.user:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def my_notifications(self, request):
        """Récupérer toutes les notifications de l'utilisateur connecté"""
        notifications = self.get_queryset().filter(user=request.user)
        
        page = self.paginate_queryset(notifications)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Compter les notifications non lues de l'utilisateur connecté"""
        count = self.get_queryset().filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Marquer toutes les notifications de l'utilisateur connecté comme lues"""
        updated = self.get_queryset().filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'message': f'{updated} notification(s) marquée(s) comme lue(s)',
            'updated_count': updated
        })
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marquer une notification comme lue"""
        notification = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à cette notification
        if not request.user.is_staff and notification.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à cette notification'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_unread(self, request, pk=None):
        """Marquer une notification comme non lue"""
        notification = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à cette notification
        if not request.user.is_staff and notification.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à cette notification'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.mark_as_unread()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
