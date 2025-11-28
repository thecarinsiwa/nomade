from django.contrib import admin
from .models import (
    RoomImage, DestinationImage, ActivityImage, AirlineImage, FlightImage,
    CarImage, CruiseShipImage, CruiseCabinImage, CruiseImage, UserImage,
    PromotionImage, PackageImage, AirportImage, GenericImage, ImageMetadata
)


# ============================================================================
# 1. ROOM IMAGES
# ============================================================================

@admin.register(RoomImage)
class RoomImageAdmin(admin.ModelAdmin):
    list_display = ['room', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['room__name', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['room', 'display_order']
    autocomplete_fields = ['room']


# ============================================================================
# 2. DESTINATION IMAGES
# ============================================================================

@admin.register(DestinationImage)
class DestinationImageAdmin(admin.ModelAdmin):
    list_display = ['destination', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['destination__name', 'alt_text', 'caption', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['destination', 'display_order']
    autocomplete_fields = ['destination']


# ============================================================================
# 3. ACTIVITY IMAGES
# ============================================================================

@admin.register(ActivityImage)
class ActivityImageAdmin(admin.ModelAdmin):
    list_display = ['activity', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['activity__name', 'alt_text', 'caption', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['activity', 'display_order']
    autocomplete_fields = ['activity']


# ============================================================================
# 4. AIRLINE IMAGES
# ============================================================================

@admin.register(AirlineImage)
class AirlineImageAdmin(admin.ModelAdmin):
    list_display = ['airline', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['airline__name', 'airline__code', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['airline', 'display_order']
    autocomplete_fields = ['airline']


# ============================================================================
# 5. FLIGHT IMAGES
# ============================================================================

@admin.register(FlightImage)
class FlightImageAdmin(admin.ModelAdmin):
    list_display = ['flight', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['flight__flight_number', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['flight', 'display_order']
    autocomplete_fields = ['flight']


# ============================================================================
# 6. CAR IMAGES
# ============================================================================

@admin.register(CarImage)
class CarImageAdmin(admin.ModelAdmin):
    list_display = ['car', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['car__make', 'car__model', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['car', 'display_order']
    autocomplete_fields = ['car']


# ============================================================================
# 7. CRUISE SHIP IMAGES
# ============================================================================

@admin.register(CruiseShipImage)
class CruiseShipImageAdmin(admin.ModelAdmin):
    list_display = ['cruise_ship', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['cruise_ship__name', 'alt_text', 'caption', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['cruise_ship', 'display_order']
    autocomplete_fields = ['cruise_ship']


# ============================================================================
# 8. CRUISE CABIN IMAGES
# ============================================================================

@admin.register(CruiseCabinImage)
class CruiseCabinImageAdmin(admin.ModelAdmin):
    list_display = ['cruise_cabin', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['cruise_cabin__cabin_number', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['cruise_cabin', 'display_order']
    autocomplete_fields = ['cruise_cabin']


# ============================================================================
# 9. CRUISE IMAGES
# ============================================================================

@admin.register(CruiseImage)
class CruiseImageAdmin(admin.ModelAdmin):
    list_display = ['cruise', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['cruise__name', 'alt_text', 'caption', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['cruise', 'display_order']
    autocomplete_fields = ['cruise']


# ============================================================================
# 10. USER IMAGES
# ============================================================================

@admin.register(UserImage)
class UserImageAdmin(admin.ModelAdmin):
    list_display = ['user', 'image_type', 'is_primary', 'is_verified', 'created_at']
    search_fields = ['user__email', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'is_verified', 'created_at']
    ordering = ['user', 'display_order']
    autocomplete_fields = ['user']


# ============================================================================
# 11. PROMOTION IMAGES
# ============================================================================

@admin.register(PromotionImage)
class PromotionImageAdmin(admin.ModelAdmin):
    list_display = ['promotion', 'image_type', 'is_primary', 'is_active', 'start_date', 'end_date', 'created_at']
    search_fields = ['promotion__name', 'alt_text', 'image_url', 'target_url']
    list_filter = ['image_type', 'is_primary', 'is_active', 'created_at']
    ordering = ['promotion', 'display_order']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['promotion']


# ============================================================================
# 12. PACKAGE IMAGES
# ============================================================================

@admin.register(PackageImage)
class PackageImageAdmin(admin.ModelAdmin):
    list_display = ['package', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['package__name', 'alt_text', 'caption', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['package', 'display_order']
    autocomplete_fields = ['package']


# ============================================================================
# 13. AIRPORT IMAGES
# ============================================================================

@admin.register(AirportImage)
class AirportImageAdmin(admin.ModelAdmin):
    list_display = ['airport', 'image_type', 'is_primary', 'display_order', 'created_at']
    search_fields = ['airport__name', 'airport__iata_code', 'alt_text', 'image_url']
    list_filter = ['image_type', 'is_primary', 'created_at']
    ordering = ['airport', 'display_order']
    autocomplete_fields = ['airport']


# ============================================================================
# 14. GENERIC IMAGES
# ============================================================================

@admin.register(GenericImage)
class GenericImageAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'image_type', 'category', 'is_active', 'display_order', 'created_at']
    search_fields = ['display_name', 'category', 'alt_text', 'image_url']
    list_filter = ['image_type', 'category', 'is_active', 'created_at']
    ordering = ['display_order', 'created_at']


# ============================================================================
# 15. IMAGE METADATA
# ============================================================================

@admin.register(ImageMetadata)
class ImageMetadataAdmin(admin.ModelAdmin):
    list_display = ['image_url', 'entity_type', 'entity_id', 'format', 'width', 'height', 'is_optimized', 'created_at']
    search_fields = ['image_url', 'entity_type', 'entity_id', 'mime_type']
    list_filter = ['entity_type', 'format', 'is_optimized', 'has_thumbnail', 'created_at']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

