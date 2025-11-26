from rest_framework import serializers
from .models import Country, Region, City, Destination


# ============================================================================
# COUNTRIES
# ============================================================================

class CountrySerializer(serializers.ModelSerializer):
    """Serializer pour Country"""
    regions_count = serializers.SerializerMethodField()
    cities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Country
        fields = [
            'id', 'name', 'code', 'code_iso3',
            'regions_count', 'cities_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_regions_count(self, obj):
        return obj.regions.count()
    
    def get_cities_count(self, obj):
        return obj.cities.count()


# ============================================================================
# REGIONS
# ============================================================================

class RegionSerializer(serializers.ModelSerializer):
    """Serializer pour Region"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_code = serializers.CharField(source='country.code', read_only=True)
    cities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Region
        fields = [
            'id', 'country', 'country_name', 'country_code',
            'name', 'code', 'cities_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_cities_count(self, obj):
        return obj.cities.count()


# ============================================================================
# CITIES
# ============================================================================

class CityListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des villes"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    country_code = serializers.CharField(source='country.code', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)
    has_coordinates = serializers.SerializerMethodField()
    destinations_count = serializers.SerializerMethodField()
    
    class Meta:
        model = City
        fields = [
            'id', 'region', 'region_name', 'country', 'country_name', 'country_code',
            'name', 'latitude', 'longitude', 'has_coordinates',
            'destinations_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_has_coordinates(self, obj):
        return obj.has_coordinates
    
    def get_destinations_count(self, obj):
        return obj.destinations.count()


class CityDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une ville avec toutes ses relations"""
    country = CountrySerializer(read_only=True)
    region = RegionSerializer(read_only=True)
    destinations = serializers.SerializerMethodField()
    has_coordinates = serializers.SerializerMethodField()
    
    class Meta:
        model = City
        fields = [
            'id', 'region', 'country', 'name',
            'latitude', 'longitude', 'has_coordinates',
            'destinations', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_has_coordinates(self, obj):
        return obj.has_coordinates
    
    def get_destinations(self, obj):
        destinations = obj.destinations.all()
        return DestinationSerializer(destinations, many=True).data


class CitySerializer(serializers.ModelSerializer):
    """Serializer de base pour City"""
    country_name = serializers.CharField(source='country.name', read_only=True)
    region_name = serializers.CharField(source='region.name', read_only=True)
    has_coordinates = serializers.SerializerMethodField()
    
    class Meta:
        model = City
        fields = [
            'id', 'region', 'region_name', 'country', 'country_name',
            'name', 'latitude', 'longitude', 'has_coordinates', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_has_coordinates(self, obj):
        return obj.has_coordinates


# ============================================================================
# DESTINATIONS
# ============================================================================

class DestinationListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des destinations"""
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)
    location_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'city', 'city_name', 'country_name',
            'name', 'description', 'image_url', 'is_popular',
            'location_info', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_location_info(self, obj):
        return obj.location_info


class DestinationDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une destination avec toutes ses relations"""
    city = CityDetailSerializer(read_only=True)
    location_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'city', 'name', 'description', 'image_url',
            'is_popular', 'location_info', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_location_info(self, obj):
        return obj.location_info


class DestinationSerializer(serializers.ModelSerializer):
    """Serializer de base pour Destination"""
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)
    location_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Destination
        fields = [
            'id', 'city', 'city_name', 'country_name',
            'name', 'description', 'image_url', 'is_popular',
            'location_info', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_location_info(self, obj):
        return obj.location_info

