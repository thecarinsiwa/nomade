import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================================
# 1. PROPERTY TYPES
# ============================================================================

class PropertyType(models.Model):
    """Types de propriétés (hôtel, appartement, villa, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. PROPERTY CATEGORIES
# ============================================================================

class PropertyCategory(models.Model):
    """Catégories (luxe, économique, milieu de gamme)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_categories'
        ordering = ['name']
        verbose_name_plural = 'Property Categories'
    
    def __str__(self):
        return self.name


# ============================================================================
# 3. PROPERTY ADDRESSES
# ============================================================================

class PropertyAddress(models.Model):
    """Adresses avec coordonnées GPS"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    street = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, db_index=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, db_index=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_addresses'
        ordering = ['country', 'city']
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['country']),
            models.Index(fields=['latitude', 'longitude']),
        ]
    
    def __str__(self):
        return f"{self.street or ''}, {self.city}, {self.country}".strip(', ')


# ============================================================================
# 4. PROPERTIES
# ============================================================================

class Property(models.Model):
    """Propriétés principales (nom, note, statut, horaires check-in/out)"""
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('inactive', 'Inactif'),
        ('pending', 'En attente'),
        ('suspended', 'Suspendu'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, db_index=True)
    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties',
        db_index=True
    )
    property_category = models.ForeignKey(
        PropertyCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties',
        db_index=True
    )
    address = models.ForeignKey(
        PropertyAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='properties',
        db_index=True
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)],
        db_index=True
    )
    total_reviews = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )
    check_in_time = models.TimeField(default='15:00:00')
    check_out_time = models.TimeField(default='11:00:00')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'properties'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['property_type']),
            models.Index(fields=['address']),
            models.Index(fields=['status']),
            models.Index(fields=['rating']),
        ]
        verbose_name_plural = 'Properties'
    
    def __str__(self):
        return self.name


# ============================================================================
# 5. PROPERTY AMENITIES
# ============================================================================

class PropertyAmenity(models.Model):
    """Équipements disponibles (piscine, WiFi, spa, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_amenities'
        ordering = ['name']
        verbose_name_plural = 'Property Amenities'
    
    def __str__(self):
        return self.name


# ============================================================================
# 6. PROPERTY AMENITIES LINK
# ============================================================================

class PropertyAmenityLink(models.Model):
    """Table de liaison propriétés ↔ équipements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='amenity_links',
        db_index=True
    )
    amenity = models.ForeignKey(
        PropertyAmenity,
        on_delete=models.CASCADE,
        related_name='property_links',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_amenities_link'
        unique_together = [['property', 'amenity']]
        indexes = [
            models.Index(fields=['property']),
            models.Index(fields=['amenity']),
        ]
    
    def __str__(self):
        return f"{self.property.name} - {self.amenity.name}"


# ============================================================================
# 7. PROPERTY IMAGES
# ============================================================================

class PropertyImage(models.Model):
    """Photos et images des propriétés"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('gallery', 'Galerie'),
        ('room', 'Chambre'),
        ('amenity', 'Équipement'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='gallery'
    )
    display_order = models.IntegerField(default=0)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'property_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['property']),
        ]
    
    def __str__(self):
        return f"{self.property.name} - {self.get_image_type_display()}"


# ============================================================================
# 8. PROPERTY DESCRIPTIONS
# ============================================================================

class PropertyDescription(models.Model):
    """Descriptions multilingues"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='descriptions',
        db_index=True
    )
    language = models.CharField(max_length=10, default='fr', db_index=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    short_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'property_descriptions'
        unique_together = [['property', 'language']]
        indexes = [
            models.Index(fields=['property']),
            models.Index(fields=['language']),
        ]
    
    def __str__(self):
        return f"{self.property.name} - {self.language}"


# ============================================================================
# 9. ROOM TYPES
# ============================================================================

class RoomType(models.Model):
    """Types de chambres (standard, deluxe, suite)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 10. ROOMS
# ============================================================================

class Room(models.Model):
    """Chambres individuelles (capacité, taille, type de lit)"""
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('unavailable', 'Indisponible'),
        ('maintenance', 'En maintenance'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='rooms',
        db_index=True
    )
    room_type = models.ForeignKey(
        RoomType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rooms',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    max_guests = models.IntegerField(default=2, validators=[MinValueValidator(1)])
    size_sqm = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    bed_type = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'rooms'
        ordering = ['property', 'name']
        indexes = [
            models.Index(fields=['property']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.property.name} - {self.name}"


# ============================================================================
# 11. ROOM AMENITIES
# ============================================================================

class RoomAmenity(models.Model):
    """Équipements des chambres (TV, minibar, balcon)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_amenities'
        ordering = ['name']
        verbose_name_plural = 'Room Amenities'
    
    def __str__(self):
        return self.name


# ============================================================================
# 12. ROOM AMENITIES LINK
# ============================================================================

class RoomAmenityLink(models.Model):
    """Table de liaison chambres ↔ équipements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='amenity_links',
        db_index=True
    )
    amenity = models.ForeignKey(
        RoomAmenity,
        on_delete=models.CASCADE,
        related_name='room_links',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_amenities_link'
        unique_together = [['room', 'amenity']]
        indexes = [
            models.Index(fields=['room']),
        ]
    
    def __str__(self):
        return f"{self.room.name} - {self.amenity.name}"


# ============================================================================
# 13. ROOM AVAILABILITY
# ============================================================================

class RoomAvailability(models.Model):
    """Disponibilités par date (disponible/indisponible, prix)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='availabilities',
        db_index=True
    )
    date = models.DateField(db_index=True)
    available = models.BooleanField(default=True, db_index=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'room_availability'
        unique_together = [['room', 'date']]
        ordering = ['date']
        indexes = [
            models.Index(fields=['room']),
            models.Index(fields=['date']),
            models.Index(fields=['available']),
        ]
        verbose_name_plural = 'Room Availabilities'
    
    def __str__(self):
        status = "Disponible" if self.available else "Indisponible"
        return f"{self.room.name} - {self.date} ({status})"


# ============================================================================
# 14. ROOM PRICING
# ============================================================================

class RoomPricing(models.Model):
    """Tarifs par saison (basse, moyenne, haute, pic)"""
    SEASON_TYPE_CHOICES = [
        ('low', 'Basse saison'),
        ('medium', 'Moyenne saison'),
        ('high', 'Haute saison'),
        ('peak', 'Pic de saison'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='pricings',
        db_index=True
    )
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    currency = models.CharField(max_length=3, default='EUR')
    season_type = models.CharField(
        max_length=20,
        choices=SEASON_TYPE_CHOICES,
        default='medium'
    )
    start_date = models.DateField(blank=True, null=True, db_index=True)
    end_date = models.DateField(blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'room_pricing'
        ordering = ['start_date', 'season_type']
        indexes = [
            models.Index(fields=['room']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.room.name} - {self.get_season_type_display()} ({self.base_price} {self.currency})"
