from rest_framework import serializers
from .models import (
    CruiseLine, CruiseShip, CruisePort, Cruise, CruiseCabinType, CruiseCabin
)


# ============================================================================
# CRUISE LINES
# ============================================================================

class CruiseLineSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseLine"""
    ships_count = serializers.SerializerMethodField()
    cruises_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CruiseLine
        fields = ['id', 'name', 'logo_url', 'ships_count', 'cruises_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_ships_count(self, obj):
        return obj.ships.count()
    
    def get_cruises_count(self, obj):
        return obj.cruises.count()


# ============================================================================
# CRUISE SHIPS
# ============================================================================

class CruiseShipSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseShip"""
    cruise_line_name = serializers.CharField(source='cruise_line.name', read_only=True)
    cruises_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CruiseShip
        fields = [
            'id', 'cruise_line', 'cruise_line_name', 'name', 'capacity',
            'year_built', 'cruises_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_cruises_count(self, obj):
        return obj.cruises.count()


# ============================================================================
# CRUISE PORTS
# ============================================================================

class CruisePortSerializer(serializers.ModelSerializer):
    """Serializer pour CruisePort"""
    departure_cruises_count = serializers.SerializerMethodField()
    arrival_cruises_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CruisePort
        fields = [
            'id', 'name', 'city', 'country', 'latitude', 'longitude',
            'departure_cruises_count', 'arrival_cruises_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_departure_cruises_count(self, obj):
        return obj.departure_cruises.count()
    
    def get_arrival_cruises_count(self, obj):
        return obj.arrival_cruises.count()


# ============================================================================
# CRUISE CABIN TYPES
# ============================================================================

class CruiseCabinTypeSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseCabinType"""
    cabins_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CruiseCabinType
        fields = ['id', 'name', 'description', 'cabins_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_cabins_count(self, obj):
        return obj.cabins.count()


# ============================================================================
# CRUISE CABINS
# ============================================================================

class CruiseCabinSerializer(serializers.ModelSerializer):
    """Serializer pour CruiseCabin"""
    cruise_name = serializers.CharField(source='cruise.name', read_only=True)
    cruise_line_name = serializers.CharField(source='cruise.cruise_line.name', read_only=True)
    cabin_type_name = serializers.CharField(source='cabin_type.name', read_only=True)
    
    class Meta:
        model = CruiseCabin
        fields = [
            'id', 'cruise', 'cruise_name', 'cruise_line_name',
            'cabin_type', 'cabin_type_name', 'cabin_number',
            'max_guests', 'price', 'currency', 'available',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# CRUISES
# ============================================================================

class CruiseListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des croisières"""
    cruise_line_name = serializers.CharField(source='cruise_line.name', read_only=True)
    ship_name = serializers.CharField(source='ship.name', read_only=True)
    departure_port_name = serializers.CharField(source='departure_port.name', read_only=True)
    departure_city = serializers.CharField(source='departure_port.city', read_only=True)
    arrival_port_name = serializers.CharField(source='arrival_port.name', read_only=True)
    arrival_city = serializers.CharField(source='arrival_port.city', read_only=True)
    cabins_count = serializers.SerializerMethodField()
    available_cabins_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Cruise
        fields = [
            'id', 'cruise_line', 'cruise_line_name', 'ship', 'ship_name',
            'name', 'departure_port', 'departure_port_name', 'departure_city',
            'arrival_port', 'arrival_port_name', 'arrival_city',
            'duration_days', 'start_date', 'end_date', 'status',
            'cabins_count', 'available_cabins_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_cabins_count(self, obj):
        return obj.cabins.count()
    
    def get_available_cabins_count(self, obj):
        return obj.cabins.filter(available=True).count()


class CruiseDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une croisière avec toutes ses relations"""
    cruise_line = CruiseLineSerializer(read_only=True)
    ship = CruiseShipSerializer(read_only=True)
    departure_port = CruisePortSerializer(read_only=True)
    arrival_port = CruisePortSerializer(read_only=True)
    cabins = CruiseCabinSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cruise
        fields = [
            'id', 'cruise_line', 'ship', 'name',
            'departure_port', 'arrival_port',
            'duration_days', 'start_date', 'end_date', 'status',
            'cabins', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CruiseSerializer(serializers.ModelSerializer):
    """Serializer de base pour Cruise"""
    cruise_line_name = serializers.CharField(source='cruise_line.name', read_only=True)
    ship_name = serializers.CharField(source='ship.name', read_only=True)
    departure_port_name = serializers.CharField(source='departure_port.name', read_only=True)
    arrival_port_name = serializers.CharField(source='arrival_port.name', read_only=True)
    
    class Meta:
        model = Cruise
        fields = [
            'id', 'cruise_line', 'cruise_line_name', 'ship', 'ship_name',
            'name', 'departure_port', 'departure_port_name',
            'arrival_port', 'arrival_port_name',
            'duration_days', 'start_date', 'end_date', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

