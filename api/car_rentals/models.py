import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


# ============================================================================
# 1. CAR RENTAL COMPANIES
# ============================================================================

class CarRentalCompany(models.Model):
    """Agences de location (nom, code, logo)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    code = models.CharField(max_length=20, unique=True, blank=True, null=True, db_index=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'car_rental_companies'
        ordering = ['name']
        verbose_name_plural = 'Car Rental Companies'
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. CAR RENTAL LOCATIONS
# ============================================================================

class CarRentalLocation(models.Model):
    """Points de location (aéroports, villes, gares)"""
    LOCATION_TYPE_CHOICES = [
        ('airport', 'Aéroport'),
        ('city', 'Ville'),
        ('station', 'Gare'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        CarRentalCompany,
        on_delete=models.CASCADE,
        related_name='locations',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    location_type = models.CharField(
        max_length=20,
        choices=LOCATION_TYPE_CHOICES,
        default='city'
    )
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'car_rental_locations'
        ordering = ['company', 'city', 'name']
        indexes = [
            models.Index(fields=['company']),
            models.Index(fields=['city']),
        ]
    
    def __str__(self):
        return f"{self.company.name} - {self.name} ({self.city or ''})".strip(' - ')


# ============================================================================
# 3. CAR CATEGORIES
# ============================================================================

class CarCategory(models.Model):
    """Catégories de voitures (compacte, SUV, berline, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'car_categories'
        ordering = ['name']
        verbose_name_plural = 'Car Categories'
    
    def __str__(self):
        return self.name


# ============================================================================
# 4. CARS
# ============================================================================

class Car(models.Model):
    """Véhicules (marque, modèle, année, transmission, carburant)"""
    TRANSMISSION_CHOICES = [
        ('manual', 'Manuelle'),
        ('automatic', 'Automatique'),
    ]
    
    FUEL_TYPE_CHOICES = [
        ('petrol', 'Essence'),
        ('diesel', 'Diesel'),
        ('electric', 'Électrique'),
        ('hybrid', 'Hybride'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('rented', 'Louée'),
        ('maintenance', 'En maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(
        CarRentalCompany,
        on_delete=models.CASCADE,
        related_name='cars',
        db_index=True
    )
    category = models.ForeignKey(
        CarCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cars',
        db_index=True
    )
    make = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    model = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    year = models.IntegerField(
        blank=True,
        null=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2100)
        ]
    )
    seats = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1), MaxValueValidator(50)]
    )
    transmission = models.CharField(
        max_length=20,
        choices=TRANSMISSION_CHOICES,
        default='automatic'
    )
    fuel_type = models.CharField(
        max_length=20,
        choices=FUEL_TYPE_CHOICES,
        default='petrol'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cars'
        ordering = ['company', 'make', 'model']
        indexes = [
            models.Index(fields=['company']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        car_name = f"{self.make or ''} {self.model or ''}".strip()
        if self.year:
            car_name = f"{car_name} ({self.year})"
        return car_name or f"Voiture {self.id}"


# ============================================================================
# 5. CAR AVAILABILITY
# ============================================================================

class CarAvailability(models.Model):
    """Disponibilités par période (dates, prix/jour)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name='availabilities',
        db_index=True
    )
    location = models.ForeignKey(
        CarRentalLocation,
        on_delete=models.CASCADE,
        related_name='car_availabilities',
        db_index=True
    )
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)
    available = models.BooleanField(default=True)
    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'car_availability'
        ordering = ['start_date', 'end_date']
        indexes = [
            models.Index(fields=['car']),
            models.Index(fields=['location']),
            models.Index(fields=['start_date', 'end_date']),
        ]
        verbose_name_plural = 'Car Availabilities'
    
    def __str__(self):
        status = "Disponible" if self.available else "Indisponible"
        return f"{self.car} - {self.location.name} ({self.start_date} à {self.end_date}) - {status}"
    
    def clean(self):
        """Valider que end_date est après start_date"""
        from django.core.exceptions import ValidationError
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être après la date de début.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

