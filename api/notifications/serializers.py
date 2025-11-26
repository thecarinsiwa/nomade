from rest_framework import serializers
from .models import Notification, EmailTemplate


# ============================================================================
# EMAIL TEMPLATES
# ============================================================================

class EmailTemplateSerializer(serializers.ModelSerializer):
    """Serializer pour EmailTemplate"""
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    
    class Meta:
        model = EmailTemplate
        fields = [
            'id', 'name', 'subject', 'body', 'language', 'language_display',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des notifications"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_email', 'type', 'type_display',
            'title', 'message', 'is_read', 'link_url', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NotificationDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une notification"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_email', 'type', 'type_display',
            'title', 'message', 'is_read', 'link_url', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer de base pour Notification"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_email', 'type', 'type_display',
            'title', 'message', 'is_read', 'link_url', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

