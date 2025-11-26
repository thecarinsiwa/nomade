import uuid
from django.db import models
from django.conf import settings


# ============================================================================
# 1. SUPPORT CATEGORIES
# ============================================================================

class SupportCategory(models.Model):
    """Catégories de support (réservation, paiement, technique, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'support_categories'
        ordering = ['name']
        verbose_name_plural = 'Support Categories'
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. SUPPORT TICKETS
# ============================================================================

class SupportTicket(models.Model):
    """Tickets de support (sujet, statut, priorité, réservation liée)"""
    STATUS_CHOICES = [
        ('open', 'Ouvert'),
        ('in_progress', 'En cours'),
        ('resolved', 'Résolu'),
        ('closed', 'Fermé'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Haute'),
        ('urgent', 'Urgente'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_tickets',
        db_index=True
    )
    category = models.ForeignKey(
        SupportCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets',
        db_index=True
    )
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='support_tickets'
    )
    subject = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
        db_index=True
    )
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='medium',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'support_tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]
    
    def __str__(self):
        return f"{self.subject} - {self.user.email} ({self.get_status_display()})"
    
    @property
    def is_open(self):
        """Vérifie si le ticket est ouvert"""
        return self.status in ['open', 'in_progress']
    
    @property
    def is_closed(self):
        """Vérifie si le ticket est fermé"""
        return self.status in ['resolved', 'closed']
    
    @property
    def messages_count(self):
        """Nombre de messages dans le ticket"""
        return self.messages.count()
    
    @property
    def last_message(self):
        """Dernier message du ticket"""
        return self.messages.order_by('-created_at').first()


# ============================================================================
# 3. SUPPORT MESSAGES
# ============================================================================

class SupportMessage(models.Model):
    """Messages dans les tickets (utilisateur/staff, contenu)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name='messages',
        db_index=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='support_messages'
    )
    message = models.TextField()
    is_from_staff = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'support_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['ticket']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        sender = "Staff" if self.is_from_staff else (self.user.email if self.user else "Système")
        return f"Message de {sender} - {self.ticket.subject}"
    
    def save(self, *args, **kwargs):
        # Déterminer automatiquement si le message vient du staff
        if self.user and not self.is_from_staff:
            self.is_from_staff = self.user.is_staff
        super().save(*args, **kwargs)
