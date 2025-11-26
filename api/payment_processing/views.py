from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta

from .models import PaymentMethod, PaymentStatus, Payment, Refund, Invoice
from .serializers import (
    PaymentMethodSerializer, PaymentStatusSerializer,
    PaymentSerializer, PaymentListSerializer, PaymentDetailSerializer,
    RefundSerializer, InvoiceSerializer
)


# ============================================================================
# PAYMENT METHODS
# ============================================================================

class PaymentMethodViewSet(viewsets.ModelViewSet):
    """ViewSet pour PaymentMethod"""
    queryset = PaymentMethod.objects.all().annotate(
        payments_count=Count('payments')
    )
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'is_active', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        active_only = self.request.query_params.get('active_only')
        
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset


# ============================================================================
# PAYMENT STATUSES
# ============================================================================

class PaymentStatusViewSet(viewsets.ModelViewSet):
    """ViewSet pour PaymentStatus"""
    queryset = PaymentStatus.objects.all().annotate(
        payments_count=Count('payments')
    )
    serializer_class = PaymentStatusSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# REFUNDS
# ============================================================================

class RefundViewSet(viewsets.ModelViewSet):
    """ViewSet pour Refund"""
    queryset = Refund.objects.select_related(
        'payment', 'payment__booking', 'payment__booking__user'
    ).all()
    serializer_class = RefundSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['status', 'amount', 'created_at', 'processed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        payment_id = self.request.query_params.get('payment_id')
        status_filter = self.request.query_params.get('status')
        
        # Les utilisateurs ne peuvent voir que leurs propres remboursements
        if not self.request.user.is_staff:
            queryset = queryset.filter(payment__booking__user=self.request.user)
        
        if payment_id:
            queryset = queryset.filter(payment_id=payment_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    def perform_update(self, serializer):
        """Mettre à jour le remboursement"""
        instance = serializer.save()
        # Si le statut passe à 'processed', processed_at sera mis à jour automatiquement
        if instance.status == 'processed' and not instance.processed_at:
            instance.processed_at = timezone.now()
            instance.save()


# ============================================================================
# INVOICES
# ============================================================================

class InvoiceViewSet(viewsets.ModelViewSet):
    """ViewSet pour Invoice"""
    queryset = Invoice.objects.select_related('booking', 'booking__user').all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'booking__booking_reference']
    ordering_fields = ['invoice_number', 'invoice_date', 'total_amount', 'created_at']
    ordering = ['-invoice_date', '-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        booking_id = self.request.query_params.get('booking_id')
        invoice_number = self.request.query_params.get('invoice_number')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        # Les utilisateurs ne peuvent voir que leurs propres factures
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking__user=self.request.user)
        
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        if invoice_number:
            queryset = queryset.filter(invoice_number__icontains=invoice_number)
        if date_from:
            queryset = queryset.filter(invoice_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(invoice_date__lte=date_to)
        
        return queryset


# ============================================================================
# PAYMENTS
# ============================================================================

class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet pour Payment"""
    queryset = Payment.objects.select_related(
        'booking', 'booking__user', 'payment_method', 'status'
    ).prefetch_related('refunds').all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transaction_id', 'booking__booking_reference']
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        elif self.action == 'retrieve':
            return PaymentDetailSerializer
        return PaymentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Les utilisateurs ne peuvent voir que leurs propres paiements
        if not self.request.user.is_staff:
            queryset = queryset.filter(booking__user=self.request.user)
        
        # Filtres
        booking_id = self.request.query_params.get('booking_id')
        payment_method_id = self.request.query_params.get('payment_method_id')
        status_id = self.request.query_params.get('status_id')
        transaction_id = self.request.query_params.get('transaction_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        if payment_method_id:
            queryset = queryset.filter(payment_method_id=payment_method_id)
        if status_id:
            queryset = queryset.filter(status_id=status_id)
        if transaction_id:
            queryset = queryset.filter(transaction_id__icontains=transaction_id)
        if date_from:
            queryset = queryset.filter(payment_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(payment_date__lte=date_to)
        if min_amount:
            queryset = queryset.filter(amount__gte=float(min_amount))
        if max_amount:
            queryset = queryset.filter(amount__lte=float(max_amount))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Récupérer tous les paiements de l'utilisateur connecté"""
        payments = self.get_queryset().filter(booking__user=request.user)
        
        page = self.paginate_queryset(payments)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def refunds(self, request, pk=None):
        """Récupérer tous les remboursements d'un paiement"""
        payment_obj = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à ce paiement
        if not request.user.is_staff and payment_obj.booking.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à ce paiement'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        refunds = payment_obj.refunds.all()
        serializer = RefundSerializer(refunds, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def process_refund(self, request, pk=None):
        """Créer un remboursement pour un paiement"""
        payment_obj = self.get_object()
        
        # Vérifier que l'utilisateur peut accéder à ce paiement
        if not request.user.is_staff and payment_obj.booking.user != request.user:
            return Response(
                {'error': 'Vous n\'avez pas accès à ce paiement'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        amount = request.data.get('amount')
        reason = request.data.get('reason', '')
        
        if not amount:
            return Response(
                {'error': 'Le montant est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = float(amount)
            if amount <= 0:
                return Response(
                    {'error': 'Le montant doit être positif'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if amount > float(payment_obj.amount):
                return Response(
                    {'error': 'Le montant du remboursement ne peut pas dépasser le montant du paiement'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (ValueError, TypeError):
            return Response(
                {'error': 'Montant invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier le total des remboursements déjà traités
        total_refunded = payment_obj.refunds.filter(status='processed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        if float(total_refunded) + amount > float(payment_obj.amount):
            return Response(
                {'error': 'Le montant total des remboursements ne peut pas dépasser le montant du paiement'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        refund = Refund.objects.create(
            payment=payment_obj,
            amount=amount,
            currency=payment_obj.currency,
            reason=reason
        )
        
        serializer = RefundSerializer(refund)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
