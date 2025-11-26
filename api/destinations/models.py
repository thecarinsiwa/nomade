import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# ============================================================================
# 1. COUNTRIES
# ============================================================================

class Country(models.Model):
    """Pays (nom, codes ISO)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    code = models.CharField(max_length=2, unique=True, blank=True, null=True, help_text="Code ISO 3166-1 alpha-2")
    code_iso3 = models.CharField(max_length=3, blank=True, null=True, help_text="Code ISO 3166-1 alpha-3")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'countries'
        ordering = ['name']
        verbose_name_plural = 'Countries'
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. REGIONS
# ============================================================================

class Region(models.Model):
    """Régions/États (rattachés aux pays)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='regions',
        db_index=True
    )
    name = models.CharField(max_length=100, db_index=True)
    code = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'regions'
        ordering = ['country', 'name']
        unique_together = [['country', 'name']]
    
    def __str__(self):
        return f"{self.name}, {self.country.name}"


# ============================================================================
# 3. CITIES
# ============================================================================

class City(models.Model):
    """Villes (rattachées aux régions/pays, coordonnées GPS)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cities'
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='cities',
        db_index=True
    )
    name = models.CharField(max_length=100, db_index=True)
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=8,
        blank=True,
        null=True,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
        help_text="Latitude GPS (-90 à 90)"
    )
    longitude = models.DecimalField(
        max_digits=11,
        decimal_places=8,
        blank=True,
        null=True,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
        help_text="Longitude GPS (-180 à 180)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cities'
        ordering = ['country', 'name']
        verbose_name_plural = 'Cities'
        indexes = [
            models.Index(fields=['country']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self):
        region_str = f", {self.region.name}" if self.region else ""
        return f"{self.name}{region_str}, {self.country.name}"
    
    @property
    def has_coordinates(self):
        """Vérifie si la ville a des coordonnées GPS"""
        return self.latitude is not None and self.longitude is not None


# ============================================================================
# 4. DESTINATIONS
# ============================================================================

class Destination(models.Model):
    """Destinations touristiques (nom, description, image, popularité)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    city = models.ForeignKey(
        City,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='destinations',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_popular = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'destinations'
        ordering = ['-is_popular', 'name']
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['is_popular']),
        ]
    
    def __str__(self):
        city_str = f" - {self.city.name}" if self.city else ""
        return f"{self.name}{city_str}"
    
    @property
    def location_info(self):
        """Retourne les informations de localisation complètes"""
        if not self.city:
            return None
        
        info = {
            'city': self.city.name,
            'country': self.city.country.name,
        }
        
        if self.city.region:
            info['region'] = self.city.region.name
        
        if self.city.has_coordinates:
            info['latitude'] = float(self.city.latitude)
            info['longitude'] = float(self.city.longitude)
        
        return info
