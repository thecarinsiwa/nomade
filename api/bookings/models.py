import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings


# ============================================================================
# 1. BOOKING STATUSES
# ============================================================================

class BookingStatus(models.Model):
    """Statuts (confirmé, en attente, annulé, complété)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_statuses'
        ordering = ['name']
        verbose_name_plural = 'Booking Statuses'
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. BOOKINGS
# ============================================================================

class Booking(models.Model):
    """Réservations principales (référence unique, montant total, statut)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        db_index=True
    )
    booking_reference = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.ForeignKey(
        BookingStatus,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings',
        db_index=True
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )
    promotion_code = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['booking_reference']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.booking_reference} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        if not self.booking_reference:
            # Générer une référence unique si elle n'existe pas
            import random
            import string
            self.booking_reference = ''.join(
                random.choices(string.ascii_uppercase + string.digits, k=10)
            )
        super().save(*args, **kwargs)


# ============================================================================
# 3. BOOKING ITEMS
# ============================================================================

class BookingItem(models.Model):
    """Éléments d'une réservation (hôtel, vol, voiture, etc.)"""
    ITEM_TYPE_CHOICES = [
        ('hotel', 'Hôtel'),
        ('flight', 'Vol'),
        ('car', 'Voiture'),
        ('activity', 'Activité'),
        ('cruise', 'Croisière'),
        ('package', 'Forfait'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='items',
        db_index=True
    )
    item_type = models.CharField(
        max_length=20,
        choices=ITEM_TYPE_CHOICES,
        db_index=True
    )
    item_id = models.CharField(max_length=36, db_index=True)
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_items'
        ordering = ['booking', 'item_type']
        indexes = [
            models.Index(fields=['booking']),
            models.Index(fields=['item_type', 'item_id']),
        ]
    
    def __str__(self):
        return f"{self.booking.booking_reference} - {self.get_item_type_display()} ({self.item_id})"


# ============================================================================
# 4. BOOKING GUESTS
# ============================================================================

class BookingGuest(models.Model):
    """Informations des voyageurs (nom, email, passeport)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='guests',
        db_index=True
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_guests'
        ordering = ['booking', 'last_name', 'first_name']
        indexes = [
            models.Index(fields=['booking']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.booking.booking_reference}"


# ============================================================================
# 5. BOOKING ROOMS
# ============================================================================

class BookingRoom(models.Model):
    """Détails des chambres réservées (dates check-in/out, nombre de personnes)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_item = models.OneToOneField(
        BookingItem,
        on_delete=models.CASCADE,
        related_name='room_details',
        db_index=True
    )
    room = models.ForeignKey(
        'accommodations.Room',
        on_delete=models.CASCADE,
        related_name='booking_rooms',
        db_index=True
    )
    check_in = models.DateField(db_index=True)
    check_out = models.DateField(db_index=True)
    guests = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_rooms'
        ordering = ['check_in', 'check_out']
        indexes = [
            models.Index(fields=['booking_item']),
            models.Index(fields=['room']),
            models.Index(fields=['check_in', 'check_out']),
        ]
    
    def __str__(self):
        return f"{self.booking_item.booking.booking_reference} - Chambre {self.room.name} ({self.check_in} à {self.check_out})"
    
    def clean(self):
        """Valider que check_out est après check_in"""
        from django.core.exceptions import ValidationError
        if self.check_out and self.check_in and self.check_out <= self.check_in:
            raise ValidationError("La date de check-out doit être après la date de check-in.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# ============================================================================
# 6. BOOKING FLIGHTS
# ============================================================================

class BookingFlight(models.Model):
    """Détails des vols réservés (date, classe, passagers)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_item = models.OneToOneField(
        BookingItem,
        on_delete=models.CASCADE,
        related_name='flight_details',
        db_index=True
    )
    flight = models.ForeignKey(
        'flights.Flight',
        on_delete=models.CASCADE,
        related_name='booking_flights',
        db_index=True
    )
    flight_class = models.ForeignKey(
        'flights.FlightClass',
        on_delete=models.CASCADE,
        related_name='booking_flights'
    )
    flight_date = models.DateField(db_index=True)
    passengers = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_flights'
        ordering = ['flight_date']
        indexes = [
            models.Index(fields=['booking_item']),
            models.Index(fields=['flight']),
        ]
    
    def __str__(self):
        return f"{self.booking_item.booking.booking_reference} - {self.flight} ({self.flight_date})"


# ============================================================================
# 7. BOOKING CARS
# ============================================================================

class BookingCar(models.Model):
    """Détails des voitures réservées (dates, lieux de prise/retour)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_item = models.OneToOneField(
        BookingItem,
        on_delete=models.CASCADE,
        related_name='car_details',
        db_index=True
    )
    car = models.ForeignKey(
        'car_rentals.Car',
        on_delete=models.CASCADE,
        related_name='booking_cars',
        db_index=True
    )
    pickup_location = models.ForeignKey(
        'car_rentals.CarRentalLocation',
        on_delete=models.CASCADE,
        related_name='pickup_bookings',
        db_index=True
    )
    dropoff_location = models.ForeignKey(
        'car_rentals.CarRentalLocation',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='dropoff_bookings'
    )
    pickup_date = models.DateField(db_index=True)
    dropoff_date = models.DateField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_cars'
        ordering = ['pickup_date', 'dropoff_date']
        indexes = [
            models.Index(fields=['booking_item']),
            models.Index(fields=['car']),
        ]
    
    def __str__(self):
        return f"{self.booking_item.booking.booking_reference} - {self.car} ({self.pickup_date} à {self.dropoff_date})"
    
    def clean(self):
        """Valider que dropoff_date est après pickup_date"""
        from django.core.exceptions import ValidationError
        if self.dropoff_date and self.pickup_date and self.dropoff_date <= self.pickup_date:
            raise ValidationError("La date de retour doit être après la date de prise.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# ============================================================================
# 8. BOOKING ACTIVITIES
# ============================================================================

class BookingActivity(models.Model):
    """Détails des activités réservées (date, participants)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_item = models.OneToOneField(
        BookingItem,
        on_delete=models.CASCADE,
        related_name='activity_details',
        db_index=True
    )
    activity = models.ForeignKey(
        'tour_activities.Activity',
        on_delete=models.CASCADE,
        related_name='booking_activities',
        db_index=True
    )
    schedule = models.ForeignKey(
        'tour_activities.ActivitySchedule',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='booking_activities'
    )
    activity_date = models.DateField(db_index=True)
    participants = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_activities'
        ordering = ['activity_date']
        indexes = [
            models.Index(fields=['booking_item']),
            models.Index(fields=['activity']),
        ]
        verbose_name_plural = 'Booking Activities'
    
    def __str__(self):
        return f"{self.booking_item.booking.booking_reference} - {self.activity.name} ({self.activity_date})"


# ============================================================================
# 9. BOOKING CRUISES
# ============================================================================

class BookingCruise(models.Model):
    """Détails des croisières réservées (cabine, passagers)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_item = models.OneToOneField(
        BookingItem,
        on_delete=models.CASCADE,
        related_name='cruise_details',
        db_index=True
    )
    cruise = models.ForeignKey(
        'cruises.Cruise',
        on_delete=models.CASCADE,
        related_name='booking_cruises',
        db_index=True
    )
    cabin = models.ForeignKey(
        'cruises.CruiseCabin',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='booking_cruises'
    )
    passengers = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_cruises'
        ordering = ['cruise', 'cabin']
        indexes = [
            models.Index(fields=['booking_item']),
            models.Index(fields=['cruise']),
        ]
    
    def __str__(self):
        return f"{self.booking_item.booking.booking_reference} - {self.cruise.name} (Cabine {self.cabin.cabin_number if self.cabin else 'N/A'})"
