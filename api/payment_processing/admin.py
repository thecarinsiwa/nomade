from django.contrib import admin
from .models import PaymentMethod, PaymentStatus, Payment, Refund, Invoice


# ============================================================================
# PAYMENT METHODS
# ============================================================================

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['is_active', 'created_at']
    ordering = ['name']


# ============================================================================
# PAYMENT STATUSES
# ============================================================================

@admin.register(PaymentStatus)
class PaymentStatusAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# REFUNDS
# ============================================================================

@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['payment', 'amount', 'currency', 'status', 'processed_at', 'created_at']
    search_fields = ['payment__transaction_id', 'payment__booking__booking_reference', 'reason']
    list_filter = ['status', 'currency', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['payment']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('payment', 'payment__booking')


# ============================================================================
# INVOICES
# ============================================================================

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'booking', 'invoice_date', 'total_amount', 'currency', 'tax_amount', 'created_at']
    search_fields = ['invoice_number', 'booking__booking_reference']
    list_filter = ['currency', 'invoice_date', 'created_at']
    ordering = ['-invoice_date', '-created_at']
    date_hierarchy = 'invoice_date'
    autocomplete_fields = ['booking']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('booking', 'booking__user')


# ============================================================================
# PAYMENTS
# ============================================================================

class RefundInline(admin.TabularInline):
    model = Refund
    extra = 0
    fields = ['amount', 'currency', 'reason', 'status', 'processed_at']
    readonly_fields = ['processed_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'booking', 'payment_method', 'status', 'amount', 'currency',
        'transaction_id', 'payment_date', 'created_at'
    ]
    search_fields = ['transaction_id', 'booking__booking_reference']
    list_filter = ['status', 'payment_method', 'currency', 'payment_date', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'payment_date'
    autocomplete_fields = ['booking', 'payment_method', 'status']
    inlines = [RefundInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'booking', 'payment_method', 'status'
        )
