from rest_framework import serializers
from .models import (
    BookingStatus, Booking, BookingItem, BookingGuest,
    BookingRoom, BookingFlight, BookingCar, BookingActivity, BookingCruise
)


# ============================================================================
# BOOKING STATUSES
# ============================================================================

class BookingStatusSerializer(serializers.ModelSerializer):
    """Serializer pour BookingStatus"""
    bookings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BookingStatus
        fields = ['id', 'name', 'description', 'bookings_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_bookings_count(self, obj):
        return obj.bookings.count()


# ============================================================================
# BOOKING GUESTS
# ============================================================================

class BookingGuestSerializer(serializers.ModelSerializer):
    """Serializer pour BookingGuest"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    
    class Meta:
        model = BookingGuest
        fields = [
            'id', 'booking', 'booking_reference', 'first_name', 'last_name',
            'email', 'phone', 'date_of_birth', 'passport_number', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# BOOKING ITEMS
# ============================================================================

class BookingItemSerializer(serializers.ModelSerializer):
    """Serializer pour BookingItem"""
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    item_name = serializers.SerializerMethodField()
    
    class Meta:
        model = BookingItem
        fields = [
            'id', 'booking', 'booking_reference', 'item_type', 'item_id',
            'item_name', 'quantity', 'unit_price', 'total_price', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_item_name(self, obj):
        """Récupère le nom de l'élément selon son type"""
        try:
            if obj.item_type == 'hotel':
                from accommodations.models import Property
                item = Property.objects.get(id=obj.item_id)
                return item.name
            elif obj.item_type == 'flight':
                from flights.models import Flight
                item = Flight.objects.get(id=obj.item_id)
                return f"{item.airline.code}{item.flight_number}"
            elif obj.item_type == 'car':
                from car_rentals.models import Car
                item = Car.objects.get(id=obj.item_id)
                return f"{item.make} {item.model}"
            elif obj.item_type == 'activity':
                from tour_activities.models import Activity
                item = Activity.objects.get(id=obj.item_id)
                return item.name
            elif obj.item_type == 'cruise':
                from cruises.models import Cruise
                item = Cruise.objects.get(id=obj.item_id)
                return item.name
            elif obj.item_type == 'package':
                from packages.models import Package
                item = Package.objects.get(id=obj.item_id)
                return item.name
        except:
            pass
        return f"{obj.get_item_type_display()} - {obj.item_id}"


# ============================================================================
# BOOKING ROOMS
# ============================================================================

class BookingRoomSerializer(serializers.ModelSerializer):
    """Serializer pour BookingRoom"""
    booking_reference = serializers.CharField(source='booking_item.booking.booking_reference', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    property_name = serializers.CharField(source='room.property.name', read_only=True)
    
    class Meta:
        model = BookingRoom
        fields = [
            'id', 'booking_item', 'booking_reference', 'room', 'room_name',
            'property_name', 'check_in', 'check_out', 'guests', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# BOOKING FLIGHTS
# ============================================================================

class BookingFlightSerializer(serializers.ModelSerializer):
    """Serializer pour BookingFlight"""
    booking_reference = serializers.CharField(source='booking_item.booking.booking_reference', read_only=True)
    flight_info = serializers.SerializerMethodField()
    flight_class_name = serializers.CharField(source='flight_class.name', read_only=True)
    
    class Meta:
        model = BookingFlight
        fields = [
            'id', 'booking_item', 'booking_reference', 'flight', 'flight_info',
            'flight_class', 'flight_class_name', 'flight_date', 'passengers', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_flight_info(self, obj):
        return f"{obj.flight.airline.code}{obj.flight.flight_number} - {obj.flight.departure_airport.iata_code} → {obj.flight.arrival_airport.iata_code}"


# ============================================================================
# BOOKING CARS
# ============================================================================

class BookingCarSerializer(serializers.ModelSerializer):
    """Serializer pour BookingCar"""
    booking_reference = serializers.CharField(source='booking_item.booking.booking_reference', read_only=True)
    car_info = serializers.SerializerMethodField()
    pickup_location_name = serializers.CharField(source='pickup_location.name', read_only=True)
    dropoff_location_name = serializers.CharField(source='dropoff_location.name', read_only=True)
    
    class Meta:
        model = BookingCar
        fields = [
            'id', 'booking_item', 'booking_reference', 'car', 'car_info',
            'pickup_location', 'pickup_location_name',
            'dropoff_location', 'dropoff_location_name',
            'pickup_date', 'dropoff_date', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_car_info(self, obj):
        car_name = f"{obj.car.make or ''} {obj.car.model or ''}".strip()
        if obj.car.year:
            car_name = f"{car_name} ({obj.car.year})"
        return car_name or f"Voiture {obj.car.id}"


# ============================================================================
# BOOKING ACTIVITIES
# ============================================================================

class BookingActivitySerializer(serializers.ModelSerializer):
    """Serializer pour BookingActivity"""
    booking_reference = serializers.CharField(source='booking_item.booking.booking_reference', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    activity_location = serializers.CharField(source='activity.location', read_only=True)
    
    class Meta:
        model = BookingActivity
        fields = [
            'id', 'booking_item', 'booking_reference', 'activity', 'activity_name',
            'activity_location', 'schedule', 'activity_date', 'participants', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# BOOKING CRUISES
# ============================================================================

class BookingCruiseSerializer(serializers.ModelSerializer):
    """Serializer pour BookingCruise"""
    booking_reference = serializers.CharField(source='booking_item.booking.booking_reference', read_only=True)
    cruise_name = serializers.CharField(source='cruise.name', read_only=True)
    cabin_number = serializers.CharField(source='cabin.cabin_number', read_only=True)
    
    class Meta:
        model = BookingCruise
        fields = [
            'id', 'booking_item', 'booking_reference', 'cruise', 'cruise_name',
            'cabin', 'cabin_number', 'passengers', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# BOOKINGS
# ============================================================================

class BookingListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des réservations"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    items_count = serializers.SerializerMethodField()
    guests_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_email', 'booking_reference', 'status', 'status_name',
            'total_amount', 'currency', 'discount_amount', 'promotion_code',
            'items_count', 'guests_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booking_reference', 'created_at', 'updated_at']
    
    def get_items_count(self, obj):
        return obj.items.count()
    
    def get_guests_count(self, obj):
        return obj.guests.count()


class BookingDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une réservation avec toutes ses relations"""
    status = BookingStatusSerializer(read_only=True)
    items = BookingItemSerializer(many=True, read_only=True)
    guests = BookingGuestSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_email', 'booking_reference', 'status',
            'total_amount', 'currency', 'discount_amount', 'promotion_code',
            'notes', 'items', 'guests', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booking_reference', 'created_at', 'updated_at']


class BookingSerializer(serializers.ModelSerializer):
    """Serializer de base pour Booking"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_email', 'booking_reference', 'status', 'status_name',
            'total_amount', 'currency', 'discount_amount', 'promotion_code',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'booking_reference', 'created_at', 'updated_at']

