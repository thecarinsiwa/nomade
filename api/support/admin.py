from django.contrib import admin
from .models import SupportCategory, SupportTicket, SupportMessage


# ============================================================================
# SUPPORT CATEGORIES
# ============================================================================

@admin.register(SupportCategory)
class SupportCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# SUPPORT MESSAGES
# ============================================================================

@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'user', 'is_from_staff', 'created_at']
    search_fields = ['message', 'ticket__subject', 'user__email']
    list_filter = ['is_from_staff', 'created_at']
    ordering = ['ticket', 'created_at']
    autocomplete_fields = ['ticket', 'user']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('ticket', 'user')


# ============================================================================
# SUPPORT TICKETS
# ============================================================================

class SupportMessageInline(admin.TabularInline):
    model = SupportMessage
    extra = 0
    fields = ['user', 'message', 'is_from_staff', 'created_at']
    readonly_fields = ['created_at']
    ordering = ['created_at']


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = [
        'subject', 'user', 'category', 'status', 'priority',
        'created_at', 'updated_at'
    ]
    search_fields = ['subject', 'user__email']
    list_filter = ['status', 'priority', 'category', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user', 'category', 'booking']
    inlines = [SupportMessageInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'category', 'booking')
