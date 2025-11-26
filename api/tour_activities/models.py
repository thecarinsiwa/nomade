import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================================
# 1. ACTIVITY CATEGORIES
# ============================================================================

class ActivityCategory(models.Model):
    """Catégories (culture, sport, aventure, gastronomie, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_categories'
        ordering = ['name']
        verbose_name_plural = 'Activity Categories'
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. ACTIVITIES
# ============================================================================

class Activity(models.Model):
    """Activités (nom, description, lieu, durée, note)"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        ActivityCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activities',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    duration_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Durée en heures"
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)],
        db_index=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['city']),
        ]
        verbose_name_plural = 'Activities'
    
    def __str__(self):
        return self.name


# ============================================================================
# 3. ACTIVITY SCHEDULES
# ============================================================================

class ActivitySchedule(models.Model):
    """Horaires et disponibilités (dates/heures, places disponibles, prix)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name='schedules',
        db_index=True
    )
    start_date = models.DateTimeField(db_index=True)
    end_date = models.DateTimeField(blank=True, null=True)
    available_spots = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Nombre de places disponibles"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_schedules'
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['activity']),
            models.Index(fields=['start_date']),
        ]
    
    def __str__(self):
        return f"{self.activity.name} - {self.start_date.strftime('%Y-%m-%d %H:%M')}"
    
    def clean(self):
        """Valider que end_date est après start_date si fourni"""
        from django.core.exceptions import ValidationError
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être après la date de début.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    @property
    def is_available(self):
        """Vérifie si l'activité est disponible (places > 0)"""
        if self.available_spots is None:
            return True  # Si non spécifié, considéré comme disponible
        return self.available_spots > 0
