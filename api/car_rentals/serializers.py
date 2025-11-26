from rest_framework import serializers
from .models import (
    CarRentalCompany, CarRentalLocation, CarCategory, Car, CarAvailability
)


# ============================================================================
# CAR RENTAL COMPANIES
# ============================================================================

class CarRentalCompanySerializer(serializers.ModelSerializer):
    """Serializer pour CarRentalCompany"""
    locations_count = serializers.SerializerMethodField()
    cars_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CarRentalCompany
        fields = ['id', 'name', 'code', 'logo_url', 'locations_count', 'cars_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_locations_count(self, obj):
        return obj.locations.count()
    
    def get_cars_count(self, obj):
        return obj.cars.count()


# ============================================================================
# CAR RENTAL LOCATIONS
# ============================================================================

class CarRentalLocationSerializer(serializers.ModelSerializer):
    """Serializer pour CarRentalLocation"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_code = serializers.CharField(source='company.code', read_only=True)
    availabilities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CarRentalLocation
        fields = [
            'id', 'company', 'company_name', 'company_code', 'name', 'address',
            'city', 'country', 'location_type', 'latitude', 'longitude',
            'availabilities_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_availabilities_count(self, obj):
        return obj.car_availabilities.count()


# ============================================================================
# CAR CATEGORIES
# ============================================================================

class CarCategorySerializer(serializers.ModelSerializer):
    """Serializer pour CarCategory"""
    cars_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CarCategory
        fields = ['id', 'name', 'description', 'cars_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_cars_count(self, obj):
        return obj.cars.count()


# ============================================================================
# CAR AVAILABILITY
# ============================================================================

class CarAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer pour CarAvailability"""
    car_info = serializers.SerializerMethodField()
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_city = serializers.CharField(source='location.city', read_only=True)
    company_name = serializers.CharField(source='car.company.name', read_only=True)
    
    class Meta:
        model = CarAvailability
        fields = [
            'id', 'car', 'car_info', 'location', 'location_name', 'location_city',
            'company_name', 'start_date', 'end_date', 'available',
            'price_per_day', 'currency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_car_info(self, obj):
        car_name = f"{obj.car.make or ''} {obj.car.model or ''}".strip()
        if obj.car.year:
            car_name = f"{car_name} ({obj.car.year})"
        return car_name or f"Voiture {obj.car.id}"


# ============================================================================
# CARS
# ============================================================================

class CarListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des voitures"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_code = serializers.CharField(source='company.code', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    availabilities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Car
        fields = [
            'id', 'company', 'company_name', 'company_code',
            'category', 'category_name', 'make', 'model', 'year',
            'seats', 'transmission', 'fuel_type', 'status',
            'availabilities_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_availabilities_count(self, obj):
        return obj.availabilities.count()


class CarDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une voiture avec toutes ses relations"""
    company = CarRentalCompanySerializer(read_only=True)
    category = CarCategorySerializer(read_only=True)
    availabilities = CarAvailabilitySerializer(many=True, read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'company', 'category', 'make', 'model', 'year',
            'seats', 'transmission', 'fuel_type', 'status',
            'availabilities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CarSerializer(serializers.ModelSerializer):
    """Serializer de base pour Car"""
    company_name = serializers.CharField(source='company.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'company', 'company_name', 'category', 'category_name',
            'make', 'model', 'year', 'seats', 'transmission', 'fuel_type',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

