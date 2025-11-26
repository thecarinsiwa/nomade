from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import SupportCategory, SupportTicket, SupportMessage
from .serializers import (
    SupportCategorySerializer, SupportTicketSerializer, SupportTicketListSerializer,
    SupportTicketDetailSerializer, SupportMessageSerializer
)


# ============================================================================
# SUPPORT CATEGORIES
# ============================================================================

class SupportCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet pour SupportCategory"""
    queryset = SupportCategory.objects.all().annotate(
        tickets_count=Count('tickets')
    )
    serializer_class = SupportCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# SUPPORT MESSAGES
# ============================================================================

class SupportMessageViewSet(viewsets.ModelViewSet):
    """ViewSet pour SupportMessage"""
    queryset = SupportMessage.objects.select_related('ticket', 'user').all()
    serializer_class = SupportMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        ticket_id = self.request.query_params.get('ticket_id')
        is_from_staff = self.request.query_params.get('is_from_staff')
        
        # Les utilisateurs ne peuvent voir que les messages de leurs propres tickets
        if not self.request.user.is_staff:
            queryset = queryset.filter(ticket__user=self.request.user)
        
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
        if is_from_staff is not None:
            queryset = queryset.filter(is_from_staff=is_from_staff.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un message pour un ticket"""
        ticket = serializer.validated_data.get('ticket')
        
        # Vérifier que l'utilisateur peut accéder à ce ticket
        if not self.request.user.is_staff and ticket.user != self.request.user:
            raise permissions.PermissionDenied("Vous n'avez pas accès à ce ticket.")
        
        # Définir l'utilisateur et si c'est du staff
        serializer.save(user=self.request.user)


# ============================================================================
# SUPPORT TICKETS
# ============================================================================

class SupportTicketViewSet(viewsets.ModelViewSet):
    """ViewSet pour SupportTicket"""
    queryset = SupportTicket.objects.select_related(
        'user', 'category', 'booking'
    ).prefetch_related('messages').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject']
    ordering_fields = ['created_at', 'updated_at', 'priority', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SupportTicketListSerializer
        elif self.action == 'retrieve':
            return SupportTicketDetailSerializer
        return SupportTicketSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs ne peuvent voir que leurs propres tickets
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        category_id = self.request.query_params.get('category_id')
        booking_id = self.request.query_params.get('booking_id')
        status_filter = self.request.query_params.get('status')
        priority_filter = self.request.query_params.get('priority')
        open_only = self.request.query_params.get('open_only')
        closed_only = self.request.query_params.get('closed_only')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        if open_only and open_only.lower() == 'true':
            queryset = queryset.filter(status__in=['open', 'in_progress'])
        if closed_only and closed_only.lower() == 'true':
            queryset = queryset.filter(status__in=['resolved', 'closed'])
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un ticket pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_tickets(self, request):
        """Récupérer tous les tickets de l'utilisateur connecté"""
        tickets = self.get_queryset().filter(user=request.user)
        
        page = self.paginate_queryset(tickets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def open_tickets(self, request):
        """Récupérer tous les tickets ouverts"""
        tickets = self.get_queryset().filter(status__in=['open', 'in_progress'])
        
        page = self.paginate_queryset(tickets)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Récupérer tous les messages d'un ticket"""
        ticket_obj = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à ce ticket
        if not request.user.is_staff and ticket_obj.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à ce ticket'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        messages = ticket_obj.messages.all()
        serializer = SupportMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Ajouter un message à un ticket"""
        ticket_obj = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à ce ticket
        if not request.user.is_staff and ticket_obj.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à ce ticket'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message_text = request.data.get('message')
        if not message_text:
            return Response(
                {'error': 'Le message est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si le ticket est fermé et que l'utilisateur n'est pas staff, le rouvrir
        if ticket_obj.is_closed and not request.user.is_staff:
            ticket_obj.status = 'open'
            ticket_obj.save()
        
        message = SupportMessage.objects.create(
            ticket=ticket_obj,
            user=request.user,
            message=message_text
        )
        
        serializer = SupportMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Changer le statut d'un ticket (staff seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent changer le statut d\'un ticket'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        ticket_obj = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Le statut est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valid_statuses = [choice[0] for choice in SupportTicket.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Statut invalide. Statuts valides: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket_obj.status = new_status
        ticket_obj.save()
        
        serializer = self.get_serializer(ticket_obj)
        return Response(serializer.data)
