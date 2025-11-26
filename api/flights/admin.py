from django.contrib import admin
from .models import Airline, Airport, FlightClass, Flight, FlightAvailability


# ============================================================================
# AIRLINES
# ============================================================================

@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'country', 'created_at']
    search_fields = ['code', 'name', 'country']
    list_filter = ['country', 'created_at']
    ordering = ['name']


# ============================================================================
# AIRPORTS
# ============================================================================

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ['iata_code', 'icao_code', 'name', 'city', 'country', 'created_at']
    search_fields = ['iata_code', 'icao_code', 'name', 'city', 'country']
    list_filter = ['country', 'city', 'created_at']
    ordering = ['country', 'city', 'name']


# ============================================================================
# FLIGHT CLASSES
# ============================================================================

@admin.register(FlightClass)
class FlightClassAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# FLIGHT AVAILABILITY
# ============================================================================

@admin.register(FlightAvailability)
class FlightAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['flight', 'flight_class', 'date', 'available_seats', 'price', 'currency', 'created_at']
    search_fields = ['flight__flight_number', 'flight__airline__name', 'flight_class__name']
    list_filter = ['date', 'currency', 'created_at']
    ordering = ['date', 'flight_class']
    date_hierarchy = 'date'
    autocomplete_fields = ['flight', 'flight_class']


# ============================================================================
# FLIGHTS
# ============================================================================

class FlightAvailabilityInline(admin.TabularInline):
    model = FlightAvailability
    extra = 0
    fields = ['flight_class', 'date', 'available_seats', 'price', 'currency']
    ordering = ['date', 'flight_class']
    autocomplete_fields = ['flight_class']


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = [
        'flight_number', 'airline', 'departure_airport', 'arrival_airport',
        'duration_minutes', 'status', 'created_at'
    ]
    search_fields = ['flight_number', 'airline__name', 'airline__code']
    list_filter = ['status', 'airline', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['airline', 'departure_airport', 'arrival_airport']
    inlines = [FlightAvailabilityInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'airline', 'departure_airport', 'arrival_airport'
        )

