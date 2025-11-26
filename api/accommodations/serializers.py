from rest_framework import serializers
from .models import (
    PropertyType, PropertyCategory, PropertyAddress, Property,
    PropertyAmenity, PropertyAmenityLink, PropertyImage, PropertyDescription,
    RoomType, Room, RoomAmenity, RoomAmenityLink,
    RoomAvailability, RoomPricing
)


# ============================================================================
# PROPERTY TYPES
# ============================================================================

class PropertyTypeSerializer(serializers.ModelSerializer):
    """Serializer pour PropertyType"""
    properties_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyType
        fields = ['id', 'name', 'description', 'properties_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_properties_count(self, obj):
        return obj.properties.count()


# ============================================================================
# PROPERTY CATEGORIES
# ============================================================================

class PropertyCategorySerializer(serializers.ModelSerializer):
    """Serializer pour PropertyCategory"""
    properties_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyCategory
        fields = ['id', 'name', 'description', 'properties_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_properties_count(self, obj):
        return obj.properties.count()


# ============================================================================
# PROPERTY ADDRESSES
# ============================================================================

class PropertyAddressSerializer(serializers.ModelSerializer):
    """Serializer pour PropertyAddress"""
    properties_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyAddress
        fields = [
            'id', 'street', 'city', 'postal_code', 'country', 'region',
            'latitude', 'longitude', 'properties_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_properties_count(self, obj):
        return obj.properties.count()


# ============================================================================
# PROPERTY AMENITIES
# ============================================================================

class PropertyAmenitySerializer(serializers.ModelSerializer):
    """Serializer pour PropertyAmenity"""
    properties_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PropertyAmenity
        fields = ['id', 'name', 'icon', 'category', 'properties_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_properties_count(self, obj):
        return obj.property_links.count()


# ============================================================================
# PROPERTY AMENITIES LINK
# ============================================================================

class PropertyAmenityLinkSerializer(serializers.ModelSerializer):
    """Serializer pour PropertyAmenityLink"""
    property_name = serializers.CharField(source='property.name', read_only=True)
    amenity_name = serializers.CharField(source='amenity.name', read_only=True)
    
    class Meta:
        model = PropertyAmenityLink
        fields = ['id', 'property', 'property_name', 'amenity', 'amenity_name', 'created_at']
        read_only_fields = ['id', 'created_at']


# ============================================================================
# PROPERTY IMAGES
# ============================================================================

class PropertyImageSerializer(serializers.ModelSerializer):
    """Serializer pour PropertyImage"""
    property_name = serializers.CharField(source='property.name', read_only=True)
    
    class Meta:
        model = PropertyImage
        fields = [
            'id', 'property', 'property_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# PROPERTY DESCRIPTIONS
# ============================================================================

class PropertyDescriptionSerializer(serializers.ModelSerializer):
    """Serializer pour PropertyDescription"""
    property_name = serializers.CharField(source='property.name', read_only=True)
    
    class Meta:
        model = PropertyDescription
        fields = [
            'id', 'property', 'property_name', 'language', 'title',
            'description', 'short_description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# ROOM TYPES
# ============================================================================

class RoomTypeSerializer(serializers.ModelSerializer):
    """Serializer pour RoomType"""
    rooms_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'description', 'rooms_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_rooms_count(self, obj):
        return obj.rooms.count()


# ============================================================================
# ROOM AMENITIES
# ============================================================================

class RoomAmenitySerializer(serializers.ModelSerializer):
    """Serializer pour RoomAmenity"""
    rooms_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RoomAmenity
        fields = ['id', 'name', 'icon', 'rooms_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_rooms_count(self, obj):
        return obj.room_links.count()


# ============================================================================
# ROOM AMENITIES LINK
# ============================================================================

class RoomAmenityLinkSerializer(serializers.ModelSerializer):
    """Serializer pour RoomAmenityLink"""
    room_name = serializers.CharField(source='room.name', read_only=True)
    amenity_name = serializers.CharField(source='amenity.name', read_only=True)
    
    class Meta:
        model = RoomAmenityLink
        fields = ['id', 'room', 'room_name', 'amenity', 'amenity_name', 'created_at']
        read_only_fields = ['id', 'created_at']


# ============================================================================
# ROOM AVAILABILITY
# ============================================================================

class RoomAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer pour RoomAvailability"""
    room_name = serializers.CharField(source='room.name', read_only=True)
    property_name = serializers.CharField(source='room.property.name', read_only=True)
    
    class Meta:
        model = RoomAvailability
        fields = [
            'id', 'room', 'room_name', 'property_name', 'date',
            'available', 'price', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# ROOM PRICING
# ============================================================================

class RoomPricingSerializer(serializers.ModelSerializer):
    """Serializer pour RoomPricing"""
    room_name = serializers.CharField(source='room.name', read_only=True)
    property_name = serializers.CharField(source='room.property.name', read_only=True)
    
    class Meta:
        model = RoomPricing
        fields = [
            'id', 'room', 'room_name', 'property_name', 'base_price',
            'currency', 'season_type', 'start_date', 'end_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# ROOMS
# ============================================================================

class RoomSerializer(serializers.ModelSerializer):
    """Serializer pour Room"""
    property_name = serializers.CharField(source='property.name', read_only=True)
    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    amenities = serializers.SerializerMethodField()
    availabilities_count = serializers.SerializerMethodField()
    pricings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = [
            'id', 'property', 'property_name', 'room_type', 'room_type_name',
            'name', 'max_guests', 'size_sqm', 'bed_type', 'status',
            'amenities', 'availabilities_count', 'pricings_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_amenities(self, obj):
        return [link.amenity.name for link in obj.amenity_links.all()]
    
    def get_availabilities_count(self, obj):
        return obj.availabilities.count()
    
    def get_pricings_count(self, obj):
        return obj.pricings.count()


# ============================================================================
# PROPERTIES (avec relations)
# ============================================================================

class PropertyListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des propriétés"""
    property_type_name = serializers.CharField(source='property_type.name', read_only=True)
    property_category_name = serializers.CharField(source='property_category.name', read_only=True)
    city = serializers.CharField(source='address.city', read_only=True)
    country = serializers.CharField(source='address.country', read_only=True)
    main_image = serializers.SerializerMethodField()
    rooms_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'name', 'property_type', 'property_type_name',
            'property_category', 'property_category_name',
            'address', 'city', 'country', 'rating', 'total_reviews',
            'status', 'check_in_time', 'check_out_time',
            'main_image', 'rooms_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_main_image(self, obj):
        main_image = obj.images.filter(image_type='main').first()
        return main_image.image_url if main_image else None
    
    def get_rooms_count(self, obj):
        return obj.rooms.count()


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une propriété avec toutes ses relations"""
    property_type = PropertyTypeSerializer(read_only=True)
    property_category = PropertyCategorySerializer(read_only=True)
    address = PropertyAddressSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    descriptions = PropertyDescriptionSerializer(many=True, read_only=True)
    amenities = serializers.SerializerMethodField()
    rooms = RoomSerializer(many=True, read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'name', 'property_type', 'property_category', 'address',
            'rating', 'total_reviews', 'status', 'check_in_time', 'check_out_time',
            'images', 'descriptions', 'amenities', 'rooms',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_amenities(self, obj):
        amenities = []
        for link in obj.amenity_links.select_related('amenity').all():
            amenities.append({
                'id': link.amenity.id,
                'name': link.amenity.name,
                'icon': link.amenity.icon,
                'category': link.amenity.category,
            })
        return amenities


class PropertySerializer(serializers.ModelSerializer):
    """Serializer de base pour Property"""
    property_type_name = serializers.CharField(source='property_type.name', read_only=True)
    property_category_name = serializers.CharField(source='property_category.name', read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'name', 'property_type', 'property_type_name',
            'property_category', 'property_category_name', 'address',
            'rating', 'total_reviews', 'status', 'check_in_time',
            'check_out_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

