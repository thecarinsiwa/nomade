from rest_framework import serializers
from .models import SupportCategory, SupportTicket, SupportMessage


# ============================================================================
# SUPPORT CATEGORIES
# ============================================================================

class SupportCategorySerializer(serializers.ModelSerializer):
    """Serializer pour SupportCategory"""
    tickets_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportCategory
        fields = ['id', 'name', 'description', 'tickets_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_tickets_count(self, obj):
        return obj.tickets.count()


# ============================================================================
# SUPPORT MESSAGES
# ============================================================================

class SupportMessageSerializer(serializers.ModelSerializer):
    """Serializer pour SupportMessage"""
    ticket_subject = serializers.CharField(source='ticket.subject', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportMessage
        fields = [
            'id', 'ticket', 'ticket_subject', 'user', 'user_email', 'user_name',
            'message', 'is_from_staff', 'created_at'
        ]
        read_only_fields = ['id', 'is_from_staff', 'created_at']
    
    def get_user_name(self, obj):
        if obj.user:
            if obj.user.first_name and obj.user.last_name:
                return f"{obj.user.first_name} {obj.user.last_name}"
            return obj.user.email.split('@')[0]
        return "Système"


# ============================================================================
# SUPPORT TICKETS
# ============================================================================

class SupportTicketListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des tickets"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_open = serializers.SerializerMethodField()
    is_closed = serializers.SerializerMethodField()
    messages_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_email', 'category', 'category_name',
            'booking', 'booking_reference', 'subject', 'status', 'status_display',
            'priority', 'priority_display', 'is_open', 'is_closed',
            'messages_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_open(self, obj):
        return obj.is_open
    
    def get_is_closed(self, obj):
        return obj.is_closed
    
    def get_messages_count(self, obj):
        return obj.messages_count


class SupportTicketDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un ticket avec toutes ses relations"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    category = SupportCategorySerializer(read_only=True)
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    messages = SupportMessageSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_open = serializers.SerializerMethodField()
    is_closed = serializers.SerializerMethodField()
    messages_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_email', 'category', 'booking', 'booking_reference',
            'subject', 'status', 'status_display', 'priority', 'priority_display',
            'is_open', 'is_closed', 'messages', 'messages_count', 'last_message',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_open(self, obj):
        return obj.is_open
    
    def get_is_closed(self, obj):
        return obj.is_closed
    
    def get_messages_count(self, obj):
        return obj.messages_count
    
    def get_last_message(self, obj):
        last_msg = obj.last_message
        if last_msg:
            return SupportMessageSerializer(last_msg).data
        return None


class SupportTicketSerializer(serializers.ModelSerializer):
    """Serializer de base pour SupportTicket"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_open = serializers.SerializerMethodField()
    is_closed = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'user', 'user_email', 'category', 'category_name',
            'booking', 'booking_reference', 'subject', 'status', 'status_display',
            'priority', 'priority_display', 'is_open', 'is_closed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_open(self, obj):
        return obj.is_open
    
    def get_is_closed(self, obj):
        return obj.is_closed

