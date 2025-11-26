from django.contrib import admin
from .models import Currency, Language, Setting


# ============================================================================
# CURRENCIES
# ============================================================================

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'symbol', 'exchange_rate', 'is_active', 'created_at']
    search_fields = ['code', 'name', 'symbol']
    list_filter = ['is_active', 'created_at']
    ordering = ['code']


# ============================================================================
# LANGUAGES
# ============================================================================

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'native_name', 'is_active', 'created_at']
    search_fields = ['code', 'name', 'native_name']
    list_filter = ['is_active', 'created_at']
    ordering = ['code']


# ============================================================================
# SETTINGS
# ============================================================================

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ['setting_key', 'setting_value', 'setting_type', 'created_at', 'updated_at']
    search_fields = ['setting_key', 'description']
    list_filter = ['setting_type', 'created_at']
    ordering = ['setting_key']
    readonly_fields = ['created_at', 'updated_at']
