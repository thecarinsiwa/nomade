import uuid
import json
from django.db import models
from django.conf import settings


# ============================================================================
# 1. AUDIT LOGS
# ============================================================================

class AuditLog(models.Model):
    """Logs d'audit (action, table, enregistrement, valeurs anciennes/nouvelles)"""
    ACTION_CHOICES = [
        ('create', 'Création'),
        ('update', 'Modification'),
        ('delete', 'Suppression'),
        ('view', 'Consultation'),
        ('export', 'Export'),
        ('login', 'Connexion'),
        ('logout', 'Déconnexion'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
        db_index=True
    )
    action = models.CharField(max_length=100, db_index=True)
    table_name = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    record_id = models.CharField(max_length=36, blank=True, null=True)
    old_values = models.JSONField(
        blank=True,
        null=True,
        help_text="Valeurs avant modification (format JSON)"
    )
    new_values = models.JSONField(
        blank=True,
        null=True,
        help_text="Valeurs après modification (format JSON)"
    )
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['action']),
            models.Index(fields=['table_name']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        user_str = self.user.email if self.user else "Système"
        return f"{self.action} - {self.table_name or 'N/A'} - {user_str} ({self.created_at})"
    
    def get_old_values_dict(self):
        """Retourne les anciennes valeurs sous forme de dictionnaire"""
        if isinstance(self.old_values, str):
            try:
                return json.loads(self.old_values)
            except json.JSONDecodeError:
                return {}
        return self.old_values or {}
    
    def get_new_values_dict(self):
        """Retourne les nouvelles valeurs sous forme de dictionnaire"""
        if isinstance(self.new_values, str):
            try:
                return json.loads(self.new_values)
            except json.JSONDecodeError:
                return {}
        return self.new_values or {}


# ============================================================================
# 2. SECURITY EVENTS
# ============================================================================

class SecurityEvent(models.Model):
    """Événements de sécurité (type, sévérité, description, IP)"""
    SEVERITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Haute'),
        ('critical', 'Critique'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='security_events',
        db_index=True
    )
    event_type = models.CharField(max_length=100, db_index=True)
    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES,
        default='medium',
        db_index=True
    )
    description = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'security_events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['event_type']),
            models.Index(fields=['severity']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        user_str = self.user.email if self.user else "Anonyme"
        return f"{self.event_type} ({self.get_severity_display()}) - {user_str} ({self.created_at})"
    
    @property
    def is_critical(self):
        """Vérifie si l'événement est critique"""
        return self.severity == 'critical'
    
    @property
    def is_high_severity(self):
        """Vérifie si l'événement est de haute sévérité"""
        return self.severity in ['high', 'critical']
