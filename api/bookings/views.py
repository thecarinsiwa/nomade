from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta
import random
import string

from .models import (
    BookingStatus, Booking, BookingItem, BookingGuest,
    BookingRoom, BookingFlight, BookingCar, BookingActivity, BookingCruise
)
from .serializers import (
    BookingStatusSerializer, BookingSerializer, BookingListSerializer,
    BookingDetailSerializer, BookingItemSerializer, BookingGuestSerializer,
    BookingRoomSerializer, BookingFlightSerializer, BookingCarSerializer,
    BookingActivitySerializer, BookingCruiseSerializer
)


# ============================================================================
# BOOKING STATUSES
# ============================================================================

class BookingStatusViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingStatus"""
    queryset = BookingStatus.objects.all().annotate(
        bookings_count=Count('bookings')
    )
    serializer_class = BookingStatusSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# BOOKING GUESTS
# ============================================================================

class BookingGuestViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingGuest"""
    queryset = BookingGuest.objects.select_related('booking', 'booking__user').all()
    serializer_class = BookingGuestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['last_name', 'first_name', 'created_at']
    ordering = ['booking', 'last_name', 'first_name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        
        return queryset


# ============================================================================
# BOOKING ITEMS
# ============================================================================

class BookingItemViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingItem"""
    queryset = BookingItem.objects.select_related('booking', 'booking__user').all()
    serializer_class = BookingItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['item_type', 'created_at']
    ordering = ['booking', 'item_type']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        item_type = self.request.query_params.get('item_type')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        if item_type:
            queryset = queryset.filter(item_type=item_type)
        
        return queryset


# ============================================================================
# BOOKING ROOMS
# ============================================================================

class BookingRoomViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingRoom"""
    queryset = BookingRoom.objects.select_related(
        'booking_item', 'booking_item__booking', 'room', 'room__property'
    ).all()
    serializer_class = BookingRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['check_in', 'check_out', 'created_at']
    ordering = ['check_in', 'check_out']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        booking_item_id = self.request.query_params.get('booking_item_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking_item__booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_item__booking_id=booking_id)
        if booking_item_id:
            queryset = queryset.filter(booking_item_id=booking_item_id)
        
        return queryset


# ============================================================================
# BOOKING FLIGHTS
# ============================================================================

class BookingFlightViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingFlight"""
    queryset = BookingFlight.objects.select_related(
        'booking_item', 'booking_item__booking', 'flight', 'flight_class'
    ).all()
    serializer_class = BookingFlightSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['flight_date', 'created_at']
    ordering = ['flight_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        booking_item_id = self.request.query_params.get('booking_item_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking_item__booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_item__booking_id=booking_id)
        if booking_item_id:
            queryset = queryset.filter(booking_item_id=booking_item_id)
        
        return queryset


# ============================================================================
# BOOKING CARS
# ============================================================================

class BookingCarViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingCar"""
    queryset = BookingCar.objects.select_related(
        'booking_item', 'booking_item__booking', 'car', 'pickup_location', 'dropoff_location'
    ).all()
    serializer_class = BookingCarSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['pickup_date', 'dropoff_date', 'created_at']
    ordering = ['pickup_date', 'dropoff_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        booking_item_id = self.request.query_params.get('booking_item_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking_item__booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_item__booking_id=booking_id)
        if booking_item_id:
            queryset = queryset.filter(booking_item_id=booking_item_id)
        
        return queryset


# ============================================================================
# BOOKING ACTIVITIES
# ============================================================================

class BookingActivityViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingActivity"""
    queryset = BookingActivity.objects.select_related(
        'booking_item', 'booking_item__booking', 'activity', 'schedule'
    ).all()
    serializer_class = BookingActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['activity_date', 'created_at']
    ordering = ['activity_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        booking_item_id = self.request.query_params.get('booking_item_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking_item__booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_item__booking_id=booking_id)
        if booking_item_id:
            queryset = queryset.filter(booking_item_id=booking_item_id)
        
        return queryset


# ============================================================================
# BOOKING CRUISES
# ============================================================================

class BookingCruiseViewSet(viewsets.ModelViewSet):
    """ViewSet pour BookingCruise"""
    queryset = BookingCruise.objects.select_related(
        'booking_item', 'booking_item__booking', 'cruise', 'cabin'
    ).all()
    serializer_class = BookingCruiseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['cruise', 'cabin']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        booking_item_id = self.request.query_params.get('booking_item_id')
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking_item__booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_item__booking_id=booking_id)
        if booking_item_id:
            queryset = queryset.filter(booking_item_id=booking_item_id)
        
        return queryset


# ============================================================================
# BOOKINGS
# ============================================================================

class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet pour Booking"""
    queryset = Booking.objects.select_related('user', 'status').prefetch_related(
        'items', 'guests'
    ).all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['booking_reference', 'notes']
    ordering_fields = ['booking_reference', 'total_amount', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        elif self.action == 'retrieve':
            return BookingDetailSerializer
        return BookingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs ne peuvent voir que leurs propres réservations
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filtres
        status_id = self.request.query_params.get('status_id')
        booking_reference = self.request.query_params.get('booking_reference')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        
        if status_id:
            queryset = queryset.filter(status_id=status_id)
        if booking_reference:
            queryset = queryset.filter(booking_reference__icontains=booking_reference)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        if min_amount:
            queryset = queryset.filter(total_amount__gte=float(min_amount))
        if max_amount:
            queryset = queryset.filter(total_amount__lte=float(max_amount))
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer une réservation pour l'utilisateur connecté"""
        # Générer une référence unique
        booking_reference = ''.join(
            random.choices(string.ascii_uppercase + string.digits, k=10)
        )
        # Vérifier l'unicité
        while Booking.objects.filter(booking_reference=booking_reference).exists():
            booking_reference = ''.join(
                random.choices(string.ascii_uppercase + string.digits, k=10)
            )
        
        serializer.save(user=self.request.user, booking_reference=booking_reference)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Récupérer toutes les réservations de l'utilisateur connecté"""
        bookings = self.get_queryset().filter(user=request.user)
        
        page = self.paginate_queryset(bookings)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Récupérer tous les détails d'une réservation"""
        booking_obj = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à cette réservation
        if not request.user.is_staff and booking_obj.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à cette réservation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        details = {
            'booking': BookingDetailSerializer(booking_obj).data,
            'rooms': [],
            'flights': [],
            'cars': [],
            'activities': [],
            'cruises': []
        }
        
        # Récupérer les détails spécifiques
        for item in booking_obj.items.all():
            if hasattr(item, 'room_details'):
                details['rooms'].append(BookingRoomSerializer(item.room_details).data)
            if hasattr(item, 'flight_details'):
                details['flights'].append(BookingFlightSerializer(item.flight_details).data)
            if hasattr(item, 'car_details'):
                details['cars'].append(BookingCarSerializer(item.car_details).data)
            if hasattr(item, 'activity_details'):
                details['activities'].append(BookingActivitySerializer(item.activity_details).data)
            if hasattr(item, 'cruise_details'):
                details['cruises'].append(BookingCruiseSerializer(item.cruise_details).data)
        
        return Response(details)
