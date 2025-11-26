from django.contrib import admin
from .models import Notification, EmailTemplate


# ============================================================================
# EMAIL TEMPLATES
# ============================================================================

@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'language', 'subject', 'created_at', 'updated_at']
    search_fields = ['name', 'subject', 'body']
    list_filter = ['language', 'created_at']
    ordering = ['name', 'language']


# ============================================================================
# NOTIFICATIONS
# ============================================================================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'type', 'title', 'is_read', 'created_at'
    ]
    search_fields = ['title', 'message', 'user__email']
    list_filter = ['type', 'is_read', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
