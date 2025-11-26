from rest_framework import serializers
from .models import Airline, Airport, FlightClass, Flight, FlightAvailability


# ============================================================================
# AIRLINES
# ============================================================================

class AirlineSerializer(serializers.ModelSerializer):
    """Serializer pour Airline"""
    flights_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Airline
        fields = ['id', 'code', 'name', 'logo_url', 'country', 'flights_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_flights_count(self, obj):
        return obj.flights.count()


# ============================================================================
# AIRPORTS
# ============================================================================

class AirportSerializer(serializers.ModelSerializer):
    """Serializer pour Airport"""
    departure_flights_count = serializers.SerializerMethodField()
    arrival_flights_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Airport
        fields = [
            'id', 'iata_code', 'icao_code', 'name', 'city', 'country',
            'latitude', 'longitude', 'timezone',
            'departure_flights_count', 'arrival_flights_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_departure_flights_count(self, obj):
        return obj.departure_flights.count()
    
    def get_arrival_flights_count(self, obj):
        return obj.arrival_flights.count()


# ============================================================================
# FLIGHT CLASSES
# ============================================================================

class FlightClassSerializer(serializers.ModelSerializer):
    """Serializer pour FlightClass"""
    availabilities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = FlightClass
        fields = ['id', 'name', 'description', 'availabilities_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_availabilities_count(self, obj):
        return obj.flight_availabilities.count()


# ============================================================================
# FLIGHT AVAILABILITY
# ============================================================================

class FlightAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer pour FlightAvailability"""
    flight_info = serializers.SerializerMethodField()
    flight_class_name = serializers.CharField(source='flight_class.name', read_only=True)
    airline_name = serializers.CharField(source='flight.airline.name', read_only=True)
    departure_airport = serializers.CharField(source='flight.departure_airport.iata_code', read_only=True)
    arrival_airport = serializers.CharField(source='flight.arrival_airport.iata_code', read_only=True)
    
    class Meta:
        model = FlightAvailability
        fields = [
            'id', 'flight', 'flight_info', 'flight_class', 'flight_class_name',
            'airline_name', 'departure_airport', 'arrival_airport',
            'date', 'available_seats', 'price', 'currency',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_flight_info(self, obj):
        return f"{obj.flight.airline.code}{obj.flight.flight_number}"


# ============================================================================
# FLIGHTS
# ============================================================================

class FlightListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des vols"""
    airline_code = serializers.CharField(source='airline.code', read_only=True)
    airline_name = serializers.CharField(source='airline.name', read_only=True)
    departure_airport_code = serializers.CharField(source='departure_airport.iata_code', read_only=True)
    departure_airport_name = serializers.CharField(source='departure_airport.name', read_only=True)
    departure_city = serializers.CharField(source='departure_airport.city', read_only=True)
    arrival_airport_code = serializers.CharField(source='arrival_airport.iata_code', read_only=True)
    arrival_airport_name = serializers.CharField(source='arrival_airport.name', read_only=True)
    arrival_city = serializers.CharField(source='arrival_airport.city', read_only=True)
    duration_hours = serializers.SerializerMethodField()
    availabilities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Flight
        fields = [
            'id', 'airline', 'airline_code', 'airline_name', 'flight_number',
            'departure_airport', 'departure_airport_code', 'departure_airport_name', 'departure_city',
            'arrival_airport', 'arrival_airport_code', 'arrival_airport_name', 'arrival_city',
            'duration_minutes', 'duration_hours', 'aircraft_type', 'status',
            'availabilities_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_duration_hours(self, obj):
        return obj.duration_hours
    
    def get_availabilities_count(self, obj):
        return obj.availabilities.count()


class FlightDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un vol avec toutes ses relations"""
    airline = AirlineSerializer(read_only=True)
    departure_airport = AirportSerializer(read_only=True)
    arrival_airport = AirportSerializer(read_only=True)
    availabilities = FlightAvailabilitySerializer(many=True, read_only=True)
    duration_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = Flight
        fields = [
            'id', 'airline', 'flight_number',
            'departure_airport', 'arrival_airport',
            'duration_minutes', 'duration_hours', 'aircraft_type', 'status',
            'availabilities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_duration_hours(self, obj):
        return obj.duration_hours


class FlightSerializer(serializers.ModelSerializer):
    """Serializer de base pour Flight"""
    airline_code = serializers.CharField(source='airline.code', read_only=True)
    airline_name = serializers.CharField(source='airline.name', read_only=True)
    departure_airport_code = serializers.CharField(source='departure_airport.iata_code', read_only=True)
    arrival_airport_code = serializers.CharField(source='arrival_airport.iata_code', read_only=True)
    duration_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = Flight
        fields = [
            'id', 'airline', 'airline_code', 'airline_name', 'flight_number',
            'departure_airport', 'departure_airport_code',
            'arrival_airport', 'arrival_airport_code',
            'duration_minutes', 'duration_hours', 'aircraft_type', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_duration_hours(self, obj):
        return obj.duration_hours

