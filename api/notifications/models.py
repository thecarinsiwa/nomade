import uuid
from django.db import models
from django.conf import settings


# ============================================================================
# 1. NOTIFICATIONS
# ============================================================================

class Notification(models.Model):
    """Notifications envoyées aux utilisateurs (type, titre, message, lu/non lu)"""
    TYPE_CHOICES = [
        ('booking', 'Réservation'),
        ('payment', 'Paiement'),
        ('promotion', 'Promotion'),
        ('system', 'Système'),
        ('reminder', 'Rappel'),
        ('alert', 'Alerte'),
        ('info', 'Information'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        db_index=True
    )
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, db_index=True)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    is_read = models.BooleanField(default=False, db_index=True)
    link_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.title} ({self.user.email})"
    
    def mark_as_read(self):
        """Marquer la notification comme lue"""
        self.is_read = True
        self.save(update_fields=['is_read'])
    
    def mark_as_unread(self):
        """Marquer la notification comme non lue"""
        self.is_read = False
        self.save(update_fields=['is_read'])


# ============================================================================
# 2. EMAIL TEMPLATES
# ============================================================================

class EmailTemplate(models.Model):
    """Modèles d'emails (sujet, corps, langue)"""
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'English'),
        ('es', 'Español'),
        ('de', 'Deutsch'),
        ('it', 'Italiano'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='fr', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'email_templates'
        ordering = ['name', 'language']
        unique_together = [['name', 'language']]
    
    def __str__(self):
        return f"{self.name} ({self.get_language_display()})"
