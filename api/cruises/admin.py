from django.contrib import admin
from .models import (
    CruiseLine, CruiseShip, CruisePort, Cruise, CruiseCabinType, CruiseCabin
)


# ============================================================================
# CRUISE LINES
# ============================================================================

@admin.register(CruiseLine)
class CruiseLineAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# CRUISE SHIPS
# ============================================================================

@admin.register(CruiseShip)
class CruiseShipAdmin(admin.ModelAdmin):
    list_display = ['name', 'cruise_line', 'capacity', 'year_built', 'created_at']
    search_fields = ['name', 'cruise_line__name']
    list_filter = ['cruise_line', 'created_at']
    ordering = ['cruise_line', 'name']
    autocomplete_fields = ['cruise_line']


# ============================================================================
# CRUISE PORTS
# ============================================================================

@admin.register(CruisePort)
class CruisePortAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'created_at']
    search_fields = ['name', 'city', 'country']
    list_filter = ['country', 'city', 'created_at']
    ordering = ['country', 'city', 'name']


# ============================================================================
# CRUISE CABIN TYPES
# ============================================================================

@admin.register(CruiseCabinType)
class CruiseCabinTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# CRUISE CABINS
# ============================================================================

@admin.register(CruiseCabin)
class CruiseCabinAdmin(admin.ModelAdmin):
    list_display = ['cruise', 'cabin_number', 'cabin_type', 'max_guests', 'price', 'available', 'created_at']
    search_fields = ['cabin_number', 'cruise__name', 'cruise__cruise_line__name']
    list_filter = ['available', 'cabin_type', 'created_at']
    ordering = ['cruise', 'cabin_number']
    autocomplete_fields = ['cruise', 'cabin_type']


# ============================================================================
# CRUISES
# ============================================================================

class CruiseCabinInline(admin.TabularInline):
    model = CruiseCabin
    extra = 1
    fields = ['cabin_type', 'cabin_number', 'max_guests', 'price', 'currency', 'available']
    autocomplete_fields = ['cabin_type']


@admin.register(Cruise)
class CruiseAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'cruise_line', 'ship', 'departure_port', 'arrival_port',
        'start_date', 'end_date', 'duration_days', 'status', 'created_at'
    ]
    search_fields = ['name', 'cruise_line__name', 'ship__name']
    list_filter = ['status', 'cruise_line', 'start_date', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['cruise_line', 'ship', 'departure_port', 'arrival_port']
    inlines = [CruiseCabinInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'cruise_line', 'ship', 'departure_port', 'arrival_port'
        )
