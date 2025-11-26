import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================================
# 1. PACKAGE TYPES
# ============================================================================

class PackageType(models.Model):
    """Types de forfaits"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'package_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. PACKAGES
# ============================================================================

class Package(models.Model):
    """Forfaits (nom, description, pourcentage de réduction, dates)"""
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('inactive', 'Inactif'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package_type = models.ForeignKey(
        PackageType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='packages',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(100.00)],
        help_text="Pourcentage de réduction (0-100)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )
    start_date = models.DateField(blank=True, null=True, db_index=True)
    end_date = models.DateField(blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'packages'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return self.name
    
    def clean(self):
        """Valider que end_date est après start_date si fourni"""
        from django.core.exceptions import ValidationError
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être après la date de début.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    @property
    def is_active(self):
        """Vérifie si le forfait est actif et dans sa période de validité"""
        from django.utils import timezone
        if self.status != 'active':
            return False
        today = timezone.now().date()
        if self.start_date and today < self.start_date:
            return False
        if self.end_date and today > self.end_date:
            return False
        return True


# ============================================================================
# 3. PACKAGE COMPONENTS
# ============================================================================

class PackageComponent(models.Model):
    """Composants d'un forfait (hôtel, vol, voiture, activité, croisière)"""
    COMPONENT_TYPE_CHOICES = [
        ('hotel', 'Hôtel'),
        ('flight', 'Vol'),
        ('car', 'Voiture'),
        ('activity', 'Activité'),
        ('cruise', 'Croisière'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='components',
        db_index=True
    )
    component_type = models.CharField(
        max_length=20,
        choices=COMPONENT_TYPE_CHOICES,
        db_index=True
    )
    component_id = models.CharField(max_length=36, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'package_components'
        ordering = ['package', 'component_type']
        indexes = [
            models.Index(fields=['package']),
            models.Index(fields=['component_type', 'component_id']),
        ]
    
    def __str__(self):
        return f"{self.package.name} - {self.get_component_type_display()} ({self.component_id})"
    
    def get_component_object(self):
        """Récupère l'objet du composant selon son type"""
        from accommodations.models import Property
        from flights.models import Flight
        from car_rentals.models import Car
        from tour_activities.models import Activity
        from cruises.models import Cruise
        
        model_map = {
            'hotel': Property,
            'flight': Flight,
            'car': Car,
            'activity': Activity,
            'cruise': Cruise,
        }
        
        model = model_map.get(self.component_type)
        if model:
            try:
                return model.objects.get(id=self.component_id)
            except model.DoesNotExist:
                return None
        return None
