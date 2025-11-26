import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================================
# 1. CRUISE LINES
# ============================================================================

class CruiseLine(models.Model):
    """Compagnies de croisières (nom, logo)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cruise_lines'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. CRUISE SHIPS
# ============================================================================

class CruiseShip(models.Model):
    """Navires (nom, capacité, année de construction)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise_line = models.ForeignKey(
        CruiseLine,
        on_delete=models.CASCADE,
        related_name='ships',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    capacity = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        help_text="Capacité en nombre de passagers"
    )
    year_built = models.IntegerField(
        blank=True,
        null=True,
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(2100)
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cruise_ships'
        ordering = ['cruise_line', 'name']
    
    def __str__(self):
        return f"{self.cruise_line.name} - {self.name}"


# ============================================================================
# 3. CRUISE PORTS
# ============================================================================

class CruisePort(models.Model):
    """Ports d'embarquement/débarquement"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    city = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cruise_ports'
        ordering = ['country', 'city', 'name']
        indexes = [
            models.Index(fields=['city']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.city or ''}, {self.country or ''})".strip(', ')


# ============================================================================
# 4. CRUISES
# ============================================================================

class Cruise(models.Model):
    """Croisières (nom, dates, durée, ports, statut)"""
    STATUS_CHOICES = [
        ('scheduled', 'Programmée'),
        ('cancelled', 'Annulée'),
        ('completed', 'Terminée'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise_line = models.ForeignKey(
        CruiseLine,
        on_delete=models.CASCADE,
        related_name='cruises',
        db_index=True
    )
    ship = models.ForeignKey(
        CruiseShip,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cruises',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    departure_port = models.ForeignKey(
        CruisePort,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='departure_cruises',
        db_index=True
    )
    arrival_port = models.ForeignKey(
        CruisePort,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='arrival_cruises',
        db_index=True
    )
    duration_days = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        help_text="Durée en jours"
    )
    start_date = models.DateField(blank=True, null=True, db_index=True)
    end_date = models.DateField(blank=True, null=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cruises'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['cruise_line']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.cruise_line.name}"
    
    def clean(self):
        """Valider que end_date est après start_date"""
        from django.core.exceptions import ValidationError
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être après la date de début.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# ============================================================================
# 5. CRUISE CABIN TYPES
# ============================================================================

class CruiseCabinType(models.Model):
    """Types de cabines (intérieure, extérieure, suite)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cruise_cabin_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 6. CRUISE CABINS
# ============================================================================

class CruiseCabin(models.Model):
    """Cabines individuelles (numéro, capacité, prix, disponibilité)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise = models.ForeignKey(
        Cruise,
        on_delete=models.CASCADE,
        related_name='cabins',
        db_index=True
    )
    cabin_type = models.ForeignKey(
        CruiseCabinType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cabins',
        db_index=True
    )
    cabin_number = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    max_guests = models.IntegerField(
        default=2,
        validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    available = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cruise_cabins'
        ordering = ['cruise', 'cabin_number']
        indexes = [
            models.Index(fields=['cruise']),
        ]
    
    def __str__(self):
        cabin_info = f"Cabine {self.cabin_number or 'N/A'}"
        return f"{self.cruise.name} - {cabin_info} ({self.cabin_type.name if self.cabin_type else 'N/A'})"
