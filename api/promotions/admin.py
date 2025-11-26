from django.contrib import admin
from .models import PromotionType, Promotion, PromotionCode


# ============================================================================
# PROMOTION TYPES
# ============================================================================

@admin.register(PromotionType)
class PromotionTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# PROMOTION CODES
# ============================================================================

@admin.register(PromotionCode)
class PromotionCodeAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'promotion', 'usage_limit', 'used_count',
        'is_active', 'created_at'
    ]
    search_fields = ['code', 'promotion__name']
    list_filter = ['is_active', 'created_at']
    ordering = ['promotion', 'code']
    autocomplete_fields = ['promotion']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('promotion')


# ============================================================================
# PROMOTIONS
# ============================================================================

class PromotionCodeInline(admin.TabularInline):
    model = PromotionCode
    extra = 1
    fields = ['code', 'usage_limit', 'used_count', 'is_active']
    ordering = ['code']


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'promotion_type', 'discount_display', 'start_date',
        'end_date', 'is_active', 'created_at'
    ]
    search_fields = ['name', 'description']
    list_filter = ['is_active', 'promotion_type', 'start_date', 'end_date', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['promotion_type']
    inlines = [PromotionCodeInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('promotion_type')
    
    def discount_display(self, obj):
        return obj.discount_display
    discount_display.short_description = 'Réduction'
