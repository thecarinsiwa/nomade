from rest_framework import serializers
from .models import PackageType, Package, PackageComponent


# ============================================================================
# PACKAGE TYPES
# ============================================================================

class PackageTypeSerializer(serializers.ModelSerializer):
    """Serializer pour PackageType"""
    packages_count = serializers.SerializerMethodField()
    
    class Meta:
        model = PackageType
        fields = ['id', 'name', 'description', 'packages_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_packages_count(self, obj):
        return obj.packages.count()


# ============================================================================
# PACKAGE COMPONENTS
# ============================================================================

class PackageComponentSerializer(serializers.ModelSerializer):
    """Serializer pour PackageComponent"""
    package_name = serializers.CharField(source='package.name', read_only=True)
    component_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PackageComponent
        fields = [
            'id', 'package', 'package_name', 'component_type',
            'component_id', 'component_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_component_name(self, obj):
        """Récupère le nom du composant"""
        component = obj.get_component_object()
        if component:
            return str(component)
        return f"{obj.get_component_type_display()} - {obj.component_id}"


# ============================================================================
# PACKAGES
# ============================================================================

class PackageListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des forfaits"""
    package_type_name = serializers.CharField(source='package_type.name', read_only=True)
    components_count = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Package
        fields = [
            'id', 'package_type', 'package_type_name', 'name', 'description',
            'discount_percent', 'status', 'start_date', 'end_date',
            'components_count', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_components_count(self, obj):
        return obj.components.count()
    
    def get_is_active(self, obj):
        return obj.is_active


class PackageDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un forfait avec toutes ses relations"""
    package_type = PackageTypeSerializer(read_only=True)
    components = PackageComponentSerializer(many=True, read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Package
        fields = [
            'id', 'package_type', 'name', 'description',
            'discount_percent', 'status', 'start_date', 'end_date',
            'components', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_active(self, obj):
        return obj.is_active


class PackageSerializer(serializers.ModelSerializer):
    """Serializer de base pour Package"""
    package_type_name = serializers.CharField(source='package_type.name', read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = Package
        fields = [
            'id', 'package_type', 'package_type_name', 'name', 'description',
            'discount_percent', 'status', 'start_date', 'end_date',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_active(self, obj):
        return obj.is_active

