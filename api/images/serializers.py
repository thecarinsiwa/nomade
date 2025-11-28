from rest_framework import serializers
from .models import (
    RoomImage, DestinationImage, ActivityImage, AirlineImage, FlightImage,
    CarImage, CruiseShipImage, CruiseCabinImage, CruiseImage, UserImage,
    PromotionImage, PackageImage, AirportImage, GenericImage, ImageMetadata
)


# ============================================================================
# 1. ROOM IMAGES
# ============================================================================

class RoomImageSerializer(serializers.ModelSerializer):
    """Serializer pour RoomImage"""
    room_name = serializers.CharField(source='room.name', read_only=True)
    
    class Meta:
        model = RoomImage
        fields = [
            'id', 'room', 'room_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'width', 'height',
            'file_size', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 2. DESTINATION IMAGES
# ============================================================================

class DestinationImageSerializer(serializers.ModelSerializer):
    """Serializer pour DestinationImage"""
    destination_name = serializers.CharField(source='destination.name', read_only=True)
    
    class Meta:
        model = DestinationImage
        fields = [
            'id', 'destination', 'destination_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'caption', 'photographer',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 3. ACTIVITY IMAGES
# ============================================================================

class ActivityImageSerializer(serializers.ModelSerializer):
    """Serializer pour ActivityImage"""
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    
    class Meta:
        model = ActivityImage
        fields = [
            'id', 'activity', 'activity_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'caption',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 4. AIRLINE IMAGES
# ============================================================================

class AirlineImageSerializer(serializers.ModelSerializer):
    """Serializer pour AirlineImage"""
    airline_name = serializers.CharField(source='airline.name', read_only=True)
    airline_code = serializers.CharField(source='airline.code', read_only=True)
    
    class Meta:
        model = AirlineImage
        fields = [
            'id', 'airline', 'airline_name', 'airline_code', 'image_url',
            'image_type', 'display_order', 'alt_text', 'is_primary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 5. FLIGHT IMAGES
# ============================================================================

class FlightImageSerializer(serializers.ModelSerializer):
    """Serializer pour FlightImage"""
    flight_number = serializers.SerializerMethodField()
    
    class Meta:
        model = FlightImage
        fields = [
            'id', 'flight', 'flight_number', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_flight_number(self, obj):
        return str(obj.flight)


# ============================================================================
# 6. CAR IMAGES
# ============================================================================

class CarImageSerializer(serializers.ModelSerializer):
    """Serializer pour CarImage"""
    car_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CarImage
        fields = [
            'id', 'car', 'car_display', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'angle',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_car_display(self, obj):
        return str(obj.car)


# ============================================================================
# 7. CRUISE SHIP IMAGES
# ============================================================================

class CruiseShipImageSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseShipImage"""
    cruise_ship_name = serializers.CharField(source='cruise_ship.name', read_only=True)
    
    class Meta:
        model = CruiseShipImage
        fields = [
            'id', 'cruise_ship', 'cruise_ship_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'caption',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 8. CRUISE CABIN IMAGES
# ============================================================================

class CruiseCabinImageSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseCabinImage"""
    cruise_cabin_display = serializers.SerializerMethodField()
    
    class Meta:
        model = CruiseCabinImage
        fields = [
            'id', 'cruise_cabin', 'cruise_cabin_display', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_cruise_cabin_display(self, obj):
        return str(obj.cruise_cabin)


# ============================================================================
# 9. CRUISE IMAGES
# ============================================================================

class CruiseImageSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseImage"""
    cruise_name = serializers.CharField(source='cruise.name', read_only=True)
    
    class Meta:
        model = CruiseImage
        fields = [
            'id', 'cruise', 'cruise_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'caption',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 10. USER IMAGES
# ============================================================================

class UserImageSerializer(serializers.ModelSerializer):
    """Serializer pour UserImage"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserImage
        fields = [
            'id', 'user', 'user_email', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 11. PROMOTION IMAGES
# ============================================================================

class PromotionImageSerializer(serializers.ModelSerializer):
    """Serializer pour PromotionImage"""
    promotion_name = serializers.CharField(source='promotion.name', read_only=True)
    
    class Meta:
        model = PromotionImage
        fields = [
            'id', 'promotion', 'promotion_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'target_url',
            'start_date', 'end_date', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 12. PACKAGE IMAGES
# ============================================================================

class PackageImageSerializer(serializers.ModelSerializer):
    """Serializer pour PackageImage"""
    package_name = serializers.CharField(source='package.name', read_only=True)
    
    class Meta:
        model = PackageImage
        fields = [
            'id', 'package', 'package_name', 'image_url', 'image_type',
            'display_order', 'alt_text', 'is_primary', 'caption',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 13. AIRPORT IMAGES
# ============================================================================

class AirportImageSerializer(serializers.ModelSerializer):
    """Serializer pour AirportImage"""
    airport_name = serializers.CharField(source='airport.name', read_only=True)
    airport_code = serializers.CharField(source='airport.iata_code', read_only=True)
    
    class Meta:
        model = AirportImage
        fields = [
            'id', 'airport', 'airport_name', 'airport_code', 'image_url',
            'image_type', 'display_order', 'alt_text', 'is_primary',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 14. GENERIC IMAGES
# ============================================================================

class GenericImageSerializer(serializers.ModelSerializer):
    """Serializer pour GenericImage"""
    
    class Meta:
        model = GenericImage
        fields = [
            'id', 'image_url', 'image_type', 'category', 'display_name',
            'alt_text', 'target_url', 'is_active', 'display_order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# 15. IMAGE METADATA
# ============================================================================

class ImageMetadataSerializer(serializers.ModelSerializer):
    """Serializer pour ImageMetadata"""
    
    class Meta:
        model = ImageMetadata
        fields = [
            'id', 'image_url', 'entity_type', 'entity_id', 'width', 'height',
            'file_size', 'mime_type', 'format', 'color_space',
            'has_thumbnail', 'thumbnail_url', 'is_optimized',
            'optimization_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

