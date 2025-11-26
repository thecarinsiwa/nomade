from django.contrib import admin
from .models import AuditLog, SecurityEvent


# ============================================================================
# AUDIT LOGS
# ============================================================================

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'table_name', 'record_id', 'ip_address', 'created_at']
    search_fields = ['user__email', 'action', 'table_name', 'record_id', 'ip_address']
    list_filter = ['action', 'table_name', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
    
    def has_add_permission(self, request):
        # Empêcher la création manuelle de logs d'audit
        return False
    
    def has_change_permission(self, request, obj=None):
        # Empêcher la modification des logs d'audit
        return False


# ============================================================================
# SECURITY EVENTS
# ============================================================================

@admin.register(SecurityEvent)
class SecurityEventAdmin(admin.ModelAdmin):
    list_display = ['user', 'event_type', 'severity', 'ip_address', 'created_at']
    search_fields = ['user__email', 'event_type', 'description', 'ip_address']
    list_filter = ['severity', 'event_type', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
