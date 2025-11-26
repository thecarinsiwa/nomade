from django.contrib import admin
from .models import UserSearch, AnalyticsEvent


# ============================================================================
# USER SEARCHES
# ============================================================================

@admin.register(UserSearch)
class UserSearchAdmin(admin.ModelAdmin):
    list_display = ['user', 'search_type', 'results_count', 'created_at']
    search_fields = ['user__email', 'search_type']
    list_filter = ['search_type', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


# ============================================================================
# ANALYTICS EVENTS
# ============================================================================

@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ['user', 'event_type', 'ip_address', 'created_at']
    search_fields = ['user__email', 'event_type', 'ip_address']
    list_filter = ['event_type', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
