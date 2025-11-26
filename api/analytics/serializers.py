from rest_framework import serializers
from .models import UserSearch, AnalyticsEvent


# ============================================================================
# USER SEARCHES
# ============================================================================

class UserSearchSerializer(serializers.ModelSerializer):
    """Serializer pour UserSearch"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    type_display = serializers.CharField(source='get_search_type_display', read_only=True)
    search_params_dict = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSearch
        fields = [
            'id', 'user', 'user_email', 'search_type', 'type_display',
            'search_params', 'search_params_dict', 'results_count', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_search_params_dict(self, obj):
        return obj.get_search_params_dict()


# ============================================================================
# ANALYTICS EVENTS
# ============================================================================

class AnalyticsEventSerializer(serializers.ModelSerializer):
    """Serializer pour AnalyticsEvent"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    event_data_dict = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'user', 'user_email', 'event_type',
            'event_data', 'event_data_dict', 'ip_address',
            'user_agent', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

