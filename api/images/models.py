import uuid
from django.db import models
from django.core.validators import MinValueValidator


# ============================================================================
# 1. ROOM IMAGES
# ============================================================================

class RoomImage(models.Model):
    """Images des chambres"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('gallery', 'Galerie'),
        ('bathroom', 'Salle de bain'),
        ('bedroom', 'Chambre'),
        ('view', 'Vue'),
        ('amenity', 'Équipement'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        'accommodations.Room',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='gallery',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    width = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1)])
    height = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1)])
    file_size = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0)], help_text='Taille en bytes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'room_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['room']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.room.name} - {self.get_image_type_display()}"


# ============================================================================
# 2. DESTINATION IMAGES
# ============================================================================

class DestinationImage(models.Model):
    """Images des destinations touristiques"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('gallery', 'Galerie'),
        ('landmark', 'Monument'),
        ('culture', 'Culture'),
        ('nature', 'Nature'),
        ('food', 'Gastronomie'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    destination = models.ForeignKey(
        'destinations.Destination',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='gallery',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    caption = models.CharField(max_length=500, blank=True, null=True, help_text='Légende de l\'image')
    photographer = models.CharField(max_length=255, blank=True, null=True, help_text='Crédit photo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'destination_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['destination']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.destination.name} - {self.get_image_type_display()}"


# ============================================================================
# 3. ACTIVITY IMAGES
# ============================================================================

class ActivityImage(models.Model):
    """Images des activités"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('gallery', 'Galerie'),
        ('experience', 'Expérience'),
        ('location', 'Lieu'),
        ('participants', 'Participants'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity = models.ForeignKey(
        'tour_activities.Activity',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='gallery',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    caption = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'activity_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['activity']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.activity.name} - {self.get_image_type_display()}"


# ============================================================================
# 4. AIRLINE IMAGES
# ============================================================================

class AirlineImage(models.Model):
    """Images des compagnies aériennes"""
    IMAGE_TYPE_CHOICES = [
        ('logo', 'Logo'),
        ('aircraft', 'Avion'),
        ('cabin', 'Cabine'),
        ('service', 'Service'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    airline = models.ForeignKey(
        'flights.Airline',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='logo',
        db_index=True
    )
    display_order = models.IntegerField(default=0)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'airline_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['airline']),
            models.Index(fields=['image_type']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.airline.name} - {self.get_image_type_display()}"


# ============================================================================
# 5. FLIGHT IMAGES
# ============================================================================

class FlightImage(models.Model):
    """Images des vols"""
    IMAGE_TYPE_CHOICES = [
        ('aircraft', 'Avion'),
        ('cabin_economy', 'Cabine Économique'),
        ('cabin_business', 'Cabine Business'),
        ('cabin_first', 'Cabine Première Classe'),
        ('meal', 'Repas'),
        ('service', 'Service'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    flight = models.ForeignKey(
        'flights.Flight',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='aircraft',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flight_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['flight']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
        ]
    
    def __str__(self):
        return f"{self.flight} - {self.get_image_type_display()}"


# ============================================================================
# 6. CAR IMAGES
# ============================================================================

class CarImage(models.Model):
    """Images des voitures de location"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('exterior', 'Extérieur'),
        ('interior', 'Intérieur'),
        ('dashboard', 'Tableau de bord'),
        ('trunk', 'Coffre'),
        ('engine', 'Moteur'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    car = models.ForeignKey(
        'car_rentals.Car',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    angle = models.CharField(max_length=50, blank=True, null=True, help_text='Angle de la photo (front, side, back, etc.)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'car_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['car']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.car} - {self.get_image_type_display()}"


# ============================================================================
# 7. CRUISE SHIP IMAGES
# ============================================================================

class CruiseShipImage(models.Model):
    """Images des navires de croisière"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('exterior', 'Extérieur'),
        ('deck', 'Pont'),
        ('pool', 'Piscine'),
        ('restaurant', 'Restaurant'),
        ('cabin', 'Cabine'),
        ('entertainment', 'Divertissement'),
        ('spa', 'Spa'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise_ship = models.ForeignKey(
        'cruises.CruiseShip',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    caption = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cruise_ship_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['cruise_ship']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.cruise_ship.name} - {self.get_image_type_display()}"


# ============================================================================
# 8. CRUISE CABIN IMAGES
# ============================================================================

class CruiseCabinImage(models.Model):
    """Images des cabines de croisière"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('interior', 'Intérieur'),
        ('bathroom', 'Salle de bain'),
        ('balcony', 'Balcon'),
        ('view', 'Vue'),
        ('amenity', 'Équipement'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise_cabin = models.ForeignKey(
        'cruises.CruiseCabin',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cruise_cabin_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['cruise_cabin']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.cruise_cabin} - {self.get_image_type_display()}"


# ============================================================================
# 9. CRUISE IMAGES
# ============================================================================

class CruiseImage(models.Model):
    """Images des croisières"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('itinerary', 'Itinéraire'),
        ('destination', 'Destination'),
        ('excursion', 'Excursion'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cruise = models.ForeignKey(
        'cruises.Cruise',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    caption = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cruise_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['cruise']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.cruise.name} - {self.get_image_type_display()}"


# ============================================================================
# 10. USER IMAGES
# ============================================================================

class UserImage(models.Model):
    """Images des utilisateurs (avatars, photos de profil)"""
    IMAGE_TYPE_CHOICES = [
        ('avatar', 'Avatar'),
        ('profile', 'Photo de profil'),
        ('verification', 'Vérification'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='avatar',
        db_index=True
    )
    display_order = models.IntegerField(default=0)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    is_verified = models.BooleanField(default=False, help_text='Photo vérifiée par l\'administration')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['image_type']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.get_image_type_display()}"


# ============================================================================
# 11. PROMOTION IMAGES
# ============================================================================

class PromotionImage(models.Model):
    """Images des promotions (bannières, etc.)"""
    IMAGE_TYPE_CHOICES = [
        ('banner', 'Bannière'),
        ('thumbnail', 'Miniature'),
        ('hero', 'Hero'),
        ('mobile', 'Mobile'),
        ('desktop', 'Desktop'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    promotion = models.ForeignKey(
        'promotions.Promotion',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='banner',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    target_url = models.URLField(max_length=500, blank=True, null=True, help_text='URL de redirection au clic')
    start_date = models.DateField(blank=True, null=True, help_text='Date de début d\'affichage')
    end_date = models.DateField(blank=True, null=True, help_text='Date de fin d\'affichage')
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'promotion_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['promotion']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
            models.Index(fields=['is_active']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.promotion.name} - {self.get_image_type_display()}"


# ============================================================================
# 12. PACKAGE IMAGES
# ============================================================================

class PackageImage(models.Model):
    """Images des packages"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('gallery', 'Galerie'),
        ('itinerary', 'Itinéraire'),
        ('included', 'Inclus'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package = models.ForeignKey(
        'packages.Package',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0, db_index=True)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    caption = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'package_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['package']),
            models.Index(fields=['image_type']),
            models.Index(fields=['display_order']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.package.name} - {self.get_image_type_display()}"


# ============================================================================
# 13. AIRPORT IMAGES
# ============================================================================

class AirportImage(models.Model):
    """Images des aéroports"""
    IMAGE_TYPE_CHOICES = [
        ('main', 'Principale'),
        ('terminal', 'Terminal'),
        ('gate', 'Porte'),
        ('lounge', 'Salon'),
        ('facility', 'Installation'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    airport = models.ForeignKey(
        'flights.Airport',
        on_delete=models.CASCADE,
        related_name='images',
        db_index=True
    )
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default='main',
        db_index=True
    )
    display_order = models.IntegerField(default=0)
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'airport_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['airport']),
            models.Index(fields=['image_type']),
            models.Index(fields=['is_primary']),
        ]
    
    def __str__(self):
        return f"{self.airport.name} - {self.get_image_type_display()}"


# ============================================================================
# 14. GENERIC IMAGES
# ============================================================================

class GenericImage(models.Model):
    """Images génériques (logos, icônes, images de fond, etc.)"""
    IMAGE_TYPE_CHOICES = [
        ('logo', 'Logo'),
        ('icon', 'Icône'),
        ('background', 'Image de fond'),
        ('placeholder', 'Placeholder'),
        ('banner', 'Bannière'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image_url = models.URLField(max_length=500)
    image_type = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        db_index=True
    )
    category = models.CharField(max_length=100, blank=True, null=True, help_text='Catégorie de l\'image (header, footer, etc.)', db_index=True)
    display_name = models.CharField(max_length=255, blank=True, null=True, help_text='Nom d\'affichage')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    target_url = models.URLField(max_length=500, blank=True, null=True, help_text='URL de redirection si applicable')
    is_active = models.BooleanField(default=True, db_index=True)
    display_order = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'generic_images'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['image_type']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
            models.Index(fields=['display_order']),
        ]
    
    def __str__(self):
        return f"{self.display_name or self.image_type} - {self.category or 'N/A'}"


# ============================================================================
# 15. IMAGE METADATA
# ============================================================================

class ImageMetadata(models.Model):
    """Métadonnées techniques des images"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image_url = models.URLField(max_length=500, unique=True, help_text='URL de l\'image', db_index=True)
    entity_type = models.CharField(max_length=50, help_text='Type d\'entité (property, room, etc.)', db_index=True)
    entity_id = models.CharField(max_length=36, blank=True, null=True, help_text='ID de l\'entité associée', db_index=True)
    width = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1)])
    height = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(1)])
    file_size = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0)], help_text='Taille en bytes')
    mime_type = models.CharField(max_length=100, blank=True, null=True, help_text='Type MIME (image/jpeg, image/png, etc.)')
    format = models.CharField(max_length=10, blank=True, null=True, help_text='Format (JPEG, PNG, WEBP, etc.)', db_index=True)
    color_space = models.CharField(max_length=20, blank=True, null=True, help_text='Espace colorimétrique (RGB, CMYK, etc.)')
    has_thumbnail = models.BooleanField(default=False)
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True, help_text='URL de la miniature')
    is_optimized = models.BooleanField(default=False)
    optimization_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'image_metadata'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['image_url']),
            models.Index(fields=['format']),
        ]
    
    def __str__(self):
        return f"{self.image_url} - {self.entity_type}"

