from django.contrib import admin
from .models import OneKeyAccount, OneKeyReward, OneKeyTransaction


@admin.register(OneKeyAccount)
class OneKeyAccountAdmin(admin.ModelAdmin):
    """Administration pour le modèle OneKeyAccount"""
    list_display = ['user', 'onekey_number', 'tier', 'total_points', 'created_at']
    list_filter = ['tier', 'created_at']
    search_fields = ['user__email', 'onekey_number']
    readonly_fields = ['id', 'onekey_number', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'user', 'onekey_number')}),
        ('Informations OneKey', {'fields': ('tier', 'total_points')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(OneKeyReward)
class OneKeyRewardAdmin(admin.ModelAdmin):
    """Administration pour le modèle OneKeyReward"""
    list_display = ['onekey_account', 'points', 'reward_type', 'expires_at', 'created_at']
    list_filter = ['reward_type', 'expires_at', 'created_at']
    search_fields = ['onekey_account__user__email', 'onekey_account__onekey_number', 'description']
    readonly_fields = ['id', 'created_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'onekey_account')}),
        ('Récompense', {'fields': ('points', 'reward_type', 'description', 'expires_at')}),
        ('Dates', {'fields': ('created_at',)}),
    )


@admin.register(OneKeyTransaction)
class OneKeyTransactionAdmin(admin.ModelAdmin):
    """Administration pour le modèle OneKeyTransaction"""
    list_display = ['onekey_account', 'transaction_type', 'points', 'booking_id', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['onekey_account__user__email', 'onekey_account__onekey_number', 'description', 'booking_id']
    readonly_fields = ['id', 'created_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'onekey_account')}),
        ('Transaction', {'fields': ('transaction_type', 'points', 'booking_id', 'description')}),
        ('Dates', {'fields': ('created_at',)}),
    )

