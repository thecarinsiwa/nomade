import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings


# ============================================================================
# 1. PAYMENT METHODS
# ============================================================================

class PaymentMethod(models.Model):
    """Méthodes de paiement acceptées (carte, PayPal, virement)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_methods'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. PAYMENT STATUSES
# ============================================================================

class PaymentStatus(models.Model):
    """Statuts (réussi, échoué, en attente, remboursé)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payment_statuses'
        ordering = ['name']
        verbose_name_plural = 'Payment Statuses'
    
    def __str__(self):
        return self.name


# ============================================================================
# 3. PAYMENTS
# ============================================================================

class Payment(models.Model):
    """Transactions de paiement (montant, méthode, statut, ID transaction)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='payments',
        db_index=True
    )
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments',
        db_index=True
    )
    status = models.ForeignKey(
        PaymentStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments',
        db_index=True
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    transaction_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    payment_date = models.DateTimeField(auto_now_add=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking']),
            models.Index(fields=['status']),
            models.Index(fields=['transaction_id']),
        ]
    
    def __str__(self):
        return f"{self.booking.booking_reference} - {self.amount} {self.currency} ({self.status.name if self.status else 'N/A'})"


# ============================================================================
# 4. REFUNDS
# ============================================================================

class Refund(models.Model):
    """Remboursements (montant, raison, statut)"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processed', 'Traité'),
        ('rejected', 'Rejeté'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds',
        db_index=True
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True
    )
    processed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'refunds'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Remboursement {self.amount} {self.currency} - {self.payment.booking.booking_reference} ({self.get_status_display()})"
    
    def save(self, *args, **kwargs):
        # Mettre à jour processed_at si le statut passe à 'processed'
        if self.status == 'processed' and not self.processed_at:
            from django.utils import timezone
            self.processed_at = timezone.now()
        super().save(*args, **kwargs)


# ============================================================================
# 5. INVOICES
# ============================================================================

class Invoice(models.Model):
    """Factures (numéro unique, montant, TVA, PDF)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='invoices',
        db_index=True
    )
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    invoice_date = models.DateField(db_index=True)
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    tax_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )
    pdf_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'invoices'
        ordering = ['-invoice_date', '-created_at']
        indexes = [
            models.Index(fields=['booking']),
            models.Index(fields=['invoice_number']),
        ]
    
    def __str__(self):
        return f"Facture {self.invoice_number} - {self.booking.booking_reference}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Générer un numéro de facture unique si non fourni
            import random
            import string
            from datetime import datetime
            prefix = f"INV-{datetime.now().strftime('%Y%m%d')}-"
            suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            self.invoice_number = f"{prefix}{suffix}"
            # Vérifier l'unicité
            while Invoice.objects.filter(invoice_number=self.invoice_number).exists():
                suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                self.invoice_number = f"{prefix}{suffix}"
        super().save(*args, **kwargs)
    
    @property
    def subtotal(self):
        """Montant HT (sans TVA)"""
        return self.total_amount - self.tax_amount
