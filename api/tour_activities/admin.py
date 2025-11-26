from django.contrib import admin
from .models import ActivityCategory, Activity, ActivitySchedule


# ============================================================================
# ACTIVITY CATEGORIES
# ============================================================================

@admin.register(ActivityCategory)
class ActivityCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# ACTIVITY SCHEDULES
# ============================================================================

@admin.register(ActivitySchedule)
class ActivityScheduleAdmin(admin.ModelAdmin):
    list_display = ['activity', 'start_date', 'end_date', 'available_spots', 'price', 'currency', 'created_at']
    search_fields = ['activity__name', 'activity__city', 'activity__location']
    list_filter = ['currency', 'created_at']
    ordering = ['start_date']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['activity']


# ============================================================================
# ACTIVITIES
# ============================================================================

class ActivityScheduleInline(admin.TabularInline):
    model = ActivitySchedule
    extra = 1
    fields = ['start_date', 'end_date', 'available_spots', 'price', 'currency']
    ordering = ['start_date']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'city', 'country', 'duration_hours',
        'rating', 'status', 'created_at'
    ]
    search_fields = ['name', 'description', 'location', 'city', 'country']
    list_filter = ['status', 'category', 'country', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['category']
    inlines = [ActivityScheduleInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')
