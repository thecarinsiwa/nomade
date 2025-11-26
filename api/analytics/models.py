import uuid
import json
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


# ============================================================================
# 1. USER SEARCHES
# ============================================================================

class UserSearch(models.Model):
    """Recherches effectuées (type, paramètres JSON, nombre de résultats)"""
    SEARCH_TYPE_CHOICES = [
        ('hotel', 'Hôtel'),
        ('flight', 'Vol'),
        ('car', 'Voiture'),
        ('package', 'Forfait'),
        ('activity', 'Activité'),
        ('cruise', 'Croisière'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='searches',
        db_index=True
    )
    search_type = models.CharField(
        max_length=20,
        choices=SEARCH_TYPE_CHOICES,
        db_index=True
    )
    search_params = models.JSONField(
        blank=True,
        null=True,
        help_text="Paramètres de recherche au format JSON"
    )
    results_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'user_searches'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['search_type']),
            models.Index(fields=['created_at']),
        ]
        verbose_name_plural = 'User Searches'
    
    def __str__(self):
        user_str = self.user.email if self.user else "Anonyme"
        return f"{self.get_search_type_display()} - {user_str} ({self.results_count} résultats)"
    
    def get_search_params_dict(self):
        """Retourne les paramètres de recherche sous forme de dictionnaire"""
        if isinstance(self.search_params, str):
            try:
                return json.loads(self.search_params)
            except json.JSONDecodeError:
                return {}
        return self.search_params or {}


# ============================================================================
# 2. ANALYTICS EVENTS
# ============================================================================

class AnalyticsEvent(models.Model):
    """Événements analytics (type, données JSON, IP, user agent)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='analytics_events',
        db_index=True
    )
    event_type = models.CharField(max_length=100, db_index=True)
    event_data = models.JSONField(
        blank=True,
        null=True,
        help_text="Données de l'événement au format JSON"
    )
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = 'analytics_events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        user_str = self.user.email if self.user else "Anonyme"
        return f"{self.event_type} - {user_str} ({self.created_at})"
    
    def get_event_data_dict(self):
        """Retourne les données de l'événement sous forme de dictionnaire"""
        if isinstance(self.event_data, str):
            try:
                return json.loads(self.event_data)
            except json.JSONDecodeError:
                return {}
        return self.event_data or {}
