from rest_framework import serializers
from .models import PromotionType, Promotion, PromotionCode


# ============================================================================
# PROMOTION TYPES
# ============================================================================

class PromotionTypeSerializer(serializers.ModelSerializer):
    """Serializer pour PromotionType"""
    promotions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PromotionType
        fields = ['id', 'name', 'description', 'promotions_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_promotions_count(self, obj):
        return obj.promotions.count()


# ============================================================================
# PROMOTION CODES
# ============================================================================

class PromotionCodeSerializer(serializers.ModelSerializer):
    """Serializer pour PromotionCode"""
    promotion_name = serializers.CharField(source='promotion.name', read_only=True)
    is_available = serializers.SerializerMethodField()
    remaining_uses = serializers.SerializerMethodField()
    
    class Meta:
        model = PromotionCode
        fields = [
            'id', 'promotion', 'promotion_name', 'code', 'usage_limit',
            'used_count', 'remaining_uses', 'is_active', 'is_available',
            'created_at'
        ]
        read_only_fields = ['id', 'used_count', 'created_at']
    
    def get_is_available(self, obj):
        return obj.is_available
    
    def get_remaining_uses(self, obj):
        return obj.remaining_uses


# ============================================================================
# PROMOTIONS
# ============================================================================

class PromotionListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des promotions"""
    promotion_type_name = serializers.CharField(source='promotion_type.name', read_only=True)
    discount_display = serializers.SerializerMethodField()
    is_currently_active = serializers.SerializerMethodField()
    codes_count = serializers.SerializerMethodField()
    active_codes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'promotion_type', 'promotion_type_name', 'name', 'description',
            'discount_percent', 'discount_amount', 'discount_display',
            'start_date', 'end_date', 'is_active', 'is_currently_active',
            'codes_count', 'active_codes_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_discount_display(self, obj):
        return obj.discount_display
    
    def get_is_currently_active(self, obj):
        return obj.is_currently_active
    
    def get_codes_count(self, obj):
        return obj.codes.count()
    
    def get_active_codes_count(self, obj):
        return obj.codes.filter(is_active=True).count()


class PromotionDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une promotion avec toutes ses relations"""
    promotion_type = PromotionTypeSerializer(read_only=True)
    codes = PromotionCodeSerializer(many=True, read_only=True)
    discount_display = serializers.SerializerMethodField()
    is_currently_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'promotion_type', 'name', 'description',
            'discount_percent', 'discount_amount', 'discount_display',
            'start_date', 'end_date', 'is_active', 'is_currently_active',
            'codes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_discount_display(self, obj):
        return obj.discount_display
    
    def get_is_currently_active(self, obj):
        return obj.is_currently_active


class PromotionSerializer(serializers.ModelSerializer):
    """Serializer de base pour Promotion"""
    promotion_type_name = serializers.CharField(source='promotion_type.name', read_only=True)
    discount_display = serializers.SerializerMethodField()
    is_currently_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Promotion
        fields = [
            'id', 'promotion_type', 'promotion_type_name', 'name', 'description',
            'discount_percent', 'discount_amount', 'discount_display',
            'start_date', 'end_date', 'is_active', 'is_currently_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_discount_display(self, obj):
        return obj.discount_display
    
    def get_is_currently_active(self, obj):
        return obj.is_currently_active

