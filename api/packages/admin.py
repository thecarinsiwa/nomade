from django.contrib import admin
from .models import PackageType, Package, PackageComponent


# ============================================================================
# PACKAGE TYPES
# ============================================================================

@admin.register(PackageType)
class PackageTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']
    ordering = ['name']


# ============================================================================
# PACKAGE COMPONENTS
# ============================================================================

@admin.register(PackageComponent)
class PackageComponentAdmin(admin.ModelAdmin):
    list_display = ['package', 'component_type', 'component_id', 'created_at']
    search_fields = ['package__name', 'component_id']
    list_filter = ['component_type', 'created_at']
    ordering = ['package', 'component_type']
    autocomplete_fields = ['package']


# ============================================================================
# PACKAGES
# ============================================================================

class PackageComponentInline(admin.TabularInline):
    model = PackageComponent
    extra = 1
    fields = ['component_type', 'component_id']
    ordering = ['component_type']


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'package_type', 'discount_percent', 'status',
        'start_date', 'end_date', 'created_at'
    ]
    search_fields = ['name', 'description']
    list_filter = ['status', 'package_type', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'start_date'
    autocomplete_fields = ['package_type']
    inlines = [PackageComponentInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('package_type')
