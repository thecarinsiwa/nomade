from rest_framework import serializers
from .models import Currency, Language, Setting


# ============================================================================
# CURRENCIES
# ============================================================================

class CurrencySerializer(serializers.ModelSerializer):
    """Serializer pour Currency"""
    class Meta:
        model = Currency
        fields = [
            'id', 'code', 'name', 'symbol', 'exchange_rate',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ============================================================================
# LANGUAGES
# ============================================================================

class LanguageSerializer(serializers.ModelSerializer):
    """Serializer pour Language"""
    class Meta:
        model = Language
        fields = [
            'id', 'code', 'name', 'native_name',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# SETTINGS
# ============================================================================

class SettingSerializer(serializers.ModelSerializer):
    """Serializer pour Setting"""
    type_display = serializers.CharField(source='get_setting_type_display', read_only=True)
    typed_value = serializers.SerializerMethodField()
    
    class Meta:
        model = Setting
        fields = [
            'id', 'setting_key', 'setting_value', 'typed_value',
            'setting_type', 'type_display', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_typed_value(self, obj):
        """Retourne la valeur convertie selon le type"""
        return obj.get_value()

