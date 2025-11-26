from rest_framework import serializers
from django.db.models import Sum
from .models import PaymentMethod, PaymentStatus, Payment, Refund, Invoice


# ============================================================================
# PAYMENT METHODS
# ============================================================================

class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer pour PaymentMethod"""
    payments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'description', 'is_active', 'payments_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_payments_count(self, obj):
        return obj.payments.count()


# ============================================================================
# PAYMENT STATUSES
# ============================================================================

class PaymentStatusSerializer(serializers.ModelSerializer):
    """Serializer pour PaymentStatus"""
    payments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PaymentStatus
        fields = ['id', 'name', 'description', 'payments_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_payments_count(self, obj):
        return obj.payments.count()


# ============================================================================
# REFUNDS
# ============================================================================

class RefundSerializer(serializers.ModelSerializer):
    """Serializer pour Refund"""
    payment_info = serializers.SerializerMethodField()
    booking_reference = serializers.CharField(source='payment.booking.booking_reference', read_only=True)
    
    class Meta:
        model = Refund
        fields = [
            'id', 'payment', 'payment_info', 'booking_reference',
            'amount', 'currency', 'reason', 'status', 'processed_at',
            'created_at'
        ]
        read_only_fields = ['id', 'processed_at', 'created_at']
    
    def get_payment_info(self, obj):
        return f"{obj.payment.amount} {obj.payment.currency} - {obj.payment.transaction_id or 'N/A'}"


# ============================================================================
# INVOICES
# ============================================================================

class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer pour Invoice"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    user_email = serializers.EmailField(source='booking.user.email', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'booking', 'booking_reference', 'user_email',
            'invoice_number', 'invoice_date', 'total_amount', 'currency',
            'tax_amount', 'subtotal', 'pdf_url', 'created_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'created_at']
    
    def get_subtotal(self, obj):
        return float(obj.subtotal)


# ============================================================================
# PAYMENTS
# ============================================================================

class PaymentListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des paiements"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    user_email = serializers.EmailField(source='booking.user.email', read_only=True)
    payment_method_name = serializers.CharField(source='payment_method.name', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    refunds_count = serializers.SerializerMethodField()
    total_refunded = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_reference', 'user_email',
            'payment_method', 'payment_method_name', 'status', 'status_name',
            'amount', 'currency', 'transaction_id', 'payment_date',
            'refunds_count', 'total_refunded', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']
    
    def get_refunds_count(self, obj):
        return obj.refunds.count()
    
    def get_total_refunded(self, obj):
        total = obj.refunds.filter(status='processed').aggregate(
            total=Sum('amount')
        )['total']
        return float(total) if total else 0.0


class PaymentDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un paiement avec toutes ses relations"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    status = PaymentStatusSerializer(read_only=True)
    refunds = RefundSerializer(many=True, read_only=True)
    total_refunded = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_reference', 'payment_method', 'status',
            'amount', 'currency', 'transaction_id', 'payment_date',
            'refunds', 'total_refunded', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']
    
    def get_total_refunded(self, obj):
        from django.db.models import Sum
        total = obj.refunds.filter(status='processed').aggregate(
            total=Sum('amount')
        )['total']
        return float(total) if total else 0.0


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer de base pour Payment"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    payment_method_name = serializers.CharField(source='payment_method.name', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_reference', 'payment_method', 'payment_method_name',
            'status', 'status_name', 'amount', 'currency', 'transaction_id',
            'payment_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']

