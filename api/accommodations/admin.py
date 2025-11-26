from django.contrib import admin
from .models import (
    PropertyType, PropertyCategory, PropertyAddress, Property,
    PropertyAmenity, PropertyAmenityLink, PropertyImage, PropertyDescription,
    RoomType, Room, RoomAmenity, RoomAmenityLink,
    RoomAvailability, RoomPricing
)


# ============================================================================
# PROPERTY TYPES
# ============================================================================

@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


# ============================================================================
# PROPERTY CATEGORIES
# ============================================================================

@admin.register(PropertyCategory)
class PropertyCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


# ============================================================================
# PROPERTY ADDRESSES
# ============================================================================

@admin.register(PropertyAddress)
class PropertyAddressAdmin(admin.ModelAdmin):
    list_display = ['city', 'country', 'postal_code', 'created_at']
    search_fields = ['street', 'city', 'country', 'postal_code', 'region']
    list_filter = ['country', 'created_at']
    ordering = ['country', 'city']


# ============================================================================
# PROPERTY AMENITIES
# ============================================================================

@admin.register(PropertyAmenity)
class PropertyAmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'icon', 'created_at']
    search_fields = ['name', 'category']
    list_filter = ['category', 'created_at']
    ordering = ['name']


# ============================================================================
# PROPERTY AMENITIES LINK
# ============================================================================

@admin.register(PropertyAmenityLink)
class PropertyAmenityLinkAdmin(admin.ModelAdmin):
    list_display = ['property', 'amenity', 'created_at']
    search_fields = ['property__name', 'amenity__name']
    list_filter = ['created_at']
    autocomplete_fields = ['property', 'amenity']


# ============================================================================
# PROPERTY IMAGES
# ============================================================================

@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ['property', 'image_type', 'display_order', 'created_at']
    search_fields = ['property__name', 'alt_text']
    list_filter = ['image_type', 'created_at']
    ordering = ['property', 'display_order']


# ============================================================================
# PROPERTY DESCRIPTIONS
# ============================================================================

@admin.register(PropertyDescription)
class PropertyDescriptionAdmin(admin.ModelAdmin):
    list_display = ['property', 'language', 'title', 'created_at']
    search_fields = ['property__name', 'title', 'description']
    list_filter = ['language', 'created_at']
    ordering = ['property', 'language']


# ============================================================================
# ROOM TYPES
# ============================================================================

@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


# ============================================================================
# ROOM AMENITIES
# ============================================================================

@admin.register(RoomAmenity)
class RoomAmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# ROOM AMENITIES LINK
# ============================================================================

@admin.register(RoomAmenityLink)
class RoomAmenityLinkAdmin(admin.ModelAdmin):
    list_display = ['room', 'amenity', 'created_at']
    search_fields = ['room__name', 'amenity__name']
    list_filter = ['created_at']
    autocomplete_fields = ['room', 'amenity']


# ============================================================================
# ROOM AVAILABILITY
# ============================================================================

@admin.register(RoomAvailability)
class RoomAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['room', 'date', 'available', 'price', 'created_at']
    search_fields = ['room__name', 'room__property__name']
    list_filter = ['available', 'date', 'created_at']
    ordering = ['date']
    date_hierarchy = 'date'


# ============================================================================
# ROOM PRICING
# ============================================================================

@admin.register(RoomPricing)
class RoomPricingAdmin(admin.ModelAdmin):
    list_display = ['room', 'base_price', 'currency', 'season_type', 'start_date', 'end_date']
    search_fields = ['room__name', 'room__property__name']
    list_filter = ['season_type', 'currency', 'created_at']
    ordering = ['start_date', 'season_type']
    date_hierarchy = 'start_date'


# ============================================================================
# ROOMS
# ============================================================================

class RoomAmenityLinkInline(admin.TabularInline):
    model = RoomAmenityLink
    extra = 1
    autocomplete_fields = ['amenity']


class RoomAvailabilityInline(admin.TabularInline):
    model = RoomAvailability
    extra = 0
    fields = ['date', 'available', 'price']
    ordering = ['date']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'property', 'room_type', 'max_guests', 'status', 'created_at']
    search_fields = ['name', 'property__name', 'bed_type']
    list_filter = ['status', 'room_type', 'created_at']
    ordering = ['property', 'name']
    autocomplete_fields = ['property', 'room_type']
    inlines = [RoomAmenityLinkInline, RoomAvailabilityInline]


# ============================================================================
# PROPERTIES
# ============================================================================

class PropertyAmenityLinkInline(admin.TabularInline):
    model = PropertyAmenityLink
    extra = 1
    autocomplete_fields = ['amenity']


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    fields = ['image_url', 'image_type', 'display_order', 'alt_text']


class PropertyDescriptionInline(admin.TabularInline):
    model = PropertyDescription
    extra = 1
    fields = ['language', 'title', 'short_description']


class RoomInline(admin.TabularInline):
    model = Room
    extra = 1
    fields = ['name', 'room_type', 'max_guests', 'status']
    autocomplete_fields = ['room_type']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'property_type', 'property_category', 'city', 'country',
        'rating', 'status', 'created_at'
    ]
    search_fields = ['name', 'address__city', 'address__country']
    list_filter = ['status', 'property_type', 'property_category', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['property_type', 'property_category', 'address']
    inlines = [
        PropertyAmenityLinkInline,
        PropertyImageInline,
        PropertyDescriptionInline,
        RoomInline
    ]
    
    def city(self, obj):
        return obj.address.city if obj.address else '-'
    city.short_description = 'Ville'
    
    def country(self, obj):
        return obj.address.country if obj.address else '-'
    country.short_description = 'Pays'
