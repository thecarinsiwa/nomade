import uuid
from django.db import models
from django.core.validators import MinValueValidator


# ============================================================================
# 1. AIRLINES
# ============================================================================

class Airline(models.Model):
    """Compagnies aériennes (code, nom, logo, pays)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True, db_index=True)
    name = models.CharField(max_length=255, db_index=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'airlines'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


# ============================================================================
# 2. AIRPORTS
# ============================================================================

class Airport(models.Model):
    """Aéroports (codes IATA/ICAO, coordonnées, timezone)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    iata_code = models.CharField(max_length=3, unique=True, db_index=True)
    icao_code = models.CharField(max_length=4, blank=True, null=True)
    name = models.CharField(max_length=255, db_index=True)
    city = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'airports'
        ordering = ['country', 'city', 'name']
        indexes = [
            models.Index(fields=['iata_code']),
            models.Index(fields=['city']),
        ]
    
    def __str__(self):
        return f"{self.iata_code} - {self.name} ({self.city or ''}, {self.country or ''})".strip(', ')


# ============================================================================
# 3. FLIGHT CLASSES
# ============================================================================

class FlightClass(models.Model):
    """Classes de vol (économique, business, première classe)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'flight_classes'
        ordering = ['name']
        verbose_name_plural = 'Flight Classes'
    
    def __str__(self):
        return self.name


# ============================================================================
# 4. FLIGHTS
# ============================================================================

class Flight(models.Model):
    """Vols (numéro, aéroports départ/arrivée, durée, statut)"""
    STATUS_CHOICES = [
        ('scheduled', 'Programmé'),
        ('delayed', 'Retardé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    airline = models.ForeignKey(
        Airline,
        on_delete=models.CASCADE,
        related_name='flights',
        db_index=True
    )
    flight_number = models.CharField(max_length=20, db_index=True)
    departure_airport = models.ForeignKey(
        Airport,
        on_delete=models.CASCADE,
        related_name='departure_flights',
        db_index=True
    )
    arrival_airport = models.ForeignKey(
        Airport,
        on_delete=models.CASCADE,
        related_name='arrival_flights',
        db_index=True
    )
    duration_minutes = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        help_text="Durée du vol en minutes"
    )
    aircraft_type = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flights'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['airline']),
            models.Index(fields=['departure_airport']),
            models.Index(fields=['arrival_airport']),
            models.Index(fields=['flight_number']),
        ]
    
    def __str__(self):
        return f"{self.airline.code}{self.flight_number} - {self.departure_airport.iata_code} → {self.arrival_airport.iata_code}"
    
    @property
    def duration_hours(self):
        """Retourne la durée en heures"""
        if self.duration_minutes:
            return round(self.duration_minutes / 60, 1)
        return None


# ============================================================================
# 5. FLIGHT AVAILABILITY
# ============================================================================

class FlightAvailability(models.Model):
    """Disponibilités par date/classe (sièges disponibles, prix)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        related_name='availabilities',
        db_index=True
    )
    flight_class = models.ForeignKey(
        FlightClass,
        on_delete=models.CASCADE,
        related_name='flight_availabilities',
        db_index=True
    )
    date = models.DateField(db_index=True)
    available_seats = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flight_availability'
        unique_together = [['flight', 'flight_class', 'date']]
        ordering = ['date', 'flight_class']
        indexes = [
            models.Index(fields=['flight']),
            models.Index(fields=['date']),
        ]
        verbose_name_plural = 'Flight Availabilities'
    
    def __str__(self):
        return f"{self.flight} - {self.flight_class.name} - {self.date} ({self.available_seats} sièges)"

