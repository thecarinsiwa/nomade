from django.contrib import admin
from .models import (
    BookingStatus, Booking, BookingItem, BookingGuest,
    BookingRoom, BookingFlight, BookingCar, BookingActivity, BookingCruise
)


# ============================================================================
# BOOKING STATUSES
# ============================================================================

@admin.register(BookingStatus)
class BookingStatusAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# BOOKING GUESTS
# ============================================================================

@admin.register(BookingGuest)
class BookingGuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'booking', 'email', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'booking__booking_reference']
    list_filter = ['created_at']
    ordering = ['booking', 'last_name', 'first_name']
    autocomplete_fields = ['booking']


# ============================================================================
# BOOKING ITEMS
# ============================================================================

@admin.register(BookingItem)
class BookingItemAdmin(admin.ModelAdmin):
    list_display = ['booking', 'item_type', 'item_id', 'quantity', 'total_price', 'created_at']
    search_fields = ['booking__booking_reference', 'item_id']
    list_filter = ['item_type', 'created_at']
    ordering = ['booking', 'item_type']
    autocomplete_fields = ['booking']


# ============================================================================
# BOOKING ROOMS
# ============================================================================

@admin.register(BookingRoom)
class BookingRoomAdmin(admin.ModelAdmin):
    list_display = ['booking_item', 'room', 'check_in', 'check_out', 'guests', 'created_at']
    search_fields = ['booking_item__booking__booking_reference', 'room__name']
    list_filter = ['check_in', 'check_out', 'created_at']
    ordering = ['check_in', 'check_out']
    date_hierarchy = 'check_in'
    autocomplete_fields = ['booking_item', 'room']


# ============================================================================
# BOOKING FLIGHTS
# ============================================================================

@admin.register(BookingFlight)
class BookingFlightAdmin(admin.ModelAdmin):
    list_display = ['booking_item', 'flight', 'flight_class', 'flight_date', 'passengers', 'created_at']
    search_fields = ['booking_item__booking__booking_reference', 'flight__flight_number']
    list_filter = ['flight_date', 'created_at']
    ordering = ['flight_date']
    date_hierarchy = 'flight_date'
    autocomplete_fields = ['booking_item', 'flight', 'flight_class']


# ============================================================================
# BOOKING CARS
# ============================================================================

@admin.register(BookingCar)
class BookingCarAdmin(admin.ModelAdmin):
    list_display = ['booking_item', 'car', 'pickup_location', 'pickup_date', 'dropoff_date', 'created_at']
    search_fields = ['booking_item__booking__booking_reference', 'car__make', 'car__model']
    list_filter = ['pickup_date', 'dropoff_date', 'created_at']
    ordering = ['pickup_date', 'dropoff_date']
    date_hierarchy = 'pickup_date'
    autocomplete_fields = ['booking_item', 'car', 'pickup_location', 'dropoff_location']


# ============================================================================
# BOOKING ACTIVITIES
# ============================================================================

@admin.register(BookingActivity)
class BookingActivityAdmin(admin.ModelAdmin):
    list_display = ['booking_item', 'activity', 'activity_date', 'participants', 'created_at']
    search_fields = ['booking_item__booking__booking_reference', 'activity__name']
    list_filter = ['activity_date', 'created_at']
    ordering = ['activity_date']
    date_hierarchy = 'activity_date'
    autocomplete_fields = ['booking_item', 'activity', 'schedule']


# ============================================================================
# BOOKING CRUISES
# ============================================================================

@admin.register(BookingCruise)
class BookingCruiseAdmin(admin.ModelAdmin):
    list_display = ['booking_item', 'cruise', 'cabin', 'passengers', 'created_at']
    search_fields = ['booking_item__booking__booking_reference', 'cruise__name']
    list_filter = ['created_at']
    ordering = ['cruise', 'cabin']
    autocomplete_fields = ['booking_item', 'cruise', 'cabin']


# ============================================================================
# BOOKINGS
# ============================================================================

class BookingItemInline(admin.TabularInline):
    model = BookingItem
    extra = 0
    fields = ['item_type', 'item_id', 'quantity', 'unit_price', 'total_price']
    readonly_fields = ['created_at']


class BookingGuestInline(admin.TabularInline):
    model = BookingGuest
    extra = 0
    fields = ['first_name', 'last_name', 'email', 'phone', 'passport_number']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_reference', 'user', 'status', 'total_amount', 'currency',
        'discount_amount', 'created_at'
    ]
    search_fields = ['booking_reference', 'user__email', 'notes']
    list_filter = ['status', 'currency', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    autocomplete_fields = ['user', 'status']
    inlines = [BookingItemInline, BookingGuestInline]
    readonly_fields = ['booking_reference', 'created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'status')
