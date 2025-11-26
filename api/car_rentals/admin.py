from django.contrib import admin
from .models import (
    CarRentalCompany, CarRentalLocation, CarCategory, Car, CarAvailability
)


# ============================================================================
# CAR RENTAL COMPANIES
# ============================================================================

@admin.register(CarRentalCompany)
class CarRentalCompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# CAR RENTAL LOCATIONS
# ============================================================================

@admin.register(CarRentalLocation)
class CarRentalLocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'city', 'country', 'location_type', 'created_at']
    search_fields = ['name', 'address', 'city', 'country', 'company__name']
    list_filter = ['location_type', 'country', 'created_at']
    ordering = ['company', 'city', 'name']
    autocomplete_fields = ['company']


# ============================================================================
# CAR CATEGORIES
# ============================================================================

@admin.register(CarCategory)
class CarCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# CAR AVAILABILITY
# ============================================================================

@admin.register(CarAvailability)
class CarAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['car', 'location', 'start_date', 'end_date', 'available', 'price_per_day', 'currency']
    search_fields = ['car__make', 'car__model', 'location__name', 'location__city']
    list_filter = ['available', 'currency', 'created_at']
    ordering = ['start_date', 'end_date']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['car', 'location']


# ============================================================================
# CARS
# ============================================================================

class CarAvailabilityInline(admin.TabularInline):
    model = CarAvailability
    extra = 0
    fields = ['location', 'start_date', 'end_date', 'available', 'price_per_day', 'currency']
    ordering = ['start_date', 'end_date']
    autocomplete_fields = ['location']


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = [
        'make', 'model', 'year', 'company', 'category', 'seats',
        'transmission', 'fuel_type', 'status', 'created_at'
    ]
    search_fields = ['make', 'model', 'company__name']
    list_filter = ['status', 'transmission', 'fuel_type', 'category', 'created_at']
    ordering = ['company', 'make', 'model']
    autocomplete_fields = ['company', 'category']
    inlines = [CarAvailabilityInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('company', 'category')

