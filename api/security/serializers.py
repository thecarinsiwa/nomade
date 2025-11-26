from rest_framework import serializers
from .models import AuditLog, SecurityEvent


# ============================================================================
# AUDIT LOGS
# ============================================================================

class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer pour AuditLog"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    old_values_dict = serializers.SerializerMethodField()
    new_values_dict = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'action', 'table_name', 'record_id',
            'old_values', 'old_values_dict', 'new_values', 'new_values_dict',
            'ip_address', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# SECURITY EVENTS
# ============================================================================

class SecurityEventSerializer(serializers.ModelSerializer):
    """Serializer pour SecurityEvent"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    is_critical = serializers.SerializerMethodField()
    is_high_severity = serializers.SerializerMethodField()
    
    class Meta:
        model = SecurityEvent
        fields = [
            'id', 'user', 'user_email', 'event_type', 'severity', 'severity_display',
            'description', 'ip_address', 'user_agent',
            'is_critical', 'is_high_severity', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_is_critical(self, obj):
        return obj.is_critical
    
    def get_is_high_severity(self, obj):
        return obj.is_high_severity

