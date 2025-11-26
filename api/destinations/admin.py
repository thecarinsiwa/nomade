from django.contrib import admin
from .models import Country, Region, City, Destination


# ============================================================================
# COUNTRIES
# ============================================================================

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'code_iso3', 'created_at']
    search_fields = ['name', 'code', 'code_iso3']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# REGIONS
# ============================================================================

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'code', 'created_at']
    search_fields = ['name', 'code', 'country__name']
    list_filter = ['country', 'created_at']
    ordering = ['country', 'name']
    autocomplete_fields = ['country']


# ============================================================================
# CITIES
# ============================================================================

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'country', 'latitude', 'longitude', 'created_at']
    search_fields = ['name', 'country__name', 'region__name']
    list_filter = ['country', 'created_at']
    ordering = ['country', 'name']
    autocomplete_fields = ['country', 'region']


# ============================================================================
# DESTINATIONS
# ============================================================================

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'is_popular', 'created_at']
    search_fields = ['name', 'description', 'city__name', 'city__country__name']
    list_filter = ['is_popular', 'created_at']
    ordering = ['-is_popular', 'name']
    autocomplete_fields = ['city']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('city', 'city__country', 'city__region')
