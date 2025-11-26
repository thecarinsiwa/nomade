from rest_framework import serializers
from .models import ActivityCategory, Activity, ActivitySchedule


# ============================================================================
# ACTIVITY CATEGORIES
# ============================================================================

class ActivityCategorySerializer(serializers.ModelSerializer):
    """Serializer pour ActivityCategory"""
    activities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityCategory
        fields = ['id', 'name', 'description', 'activities_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_activities_count(self, obj):
        return obj.activities.count()


# ============================================================================
# ACTIVITY SCHEDULES
# ============================================================================

class ActivityScheduleSerializer(serializers.ModelSerializer):
    """Serializer pour ActivitySchedule"""
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    activity_location = serializers.CharField(source='activity.location', read_only=True)
    activity_city = serializers.CharField(source='activity.city', read_only=True)
    is_available = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivitySchedule
        fields = [
            'id', 'activity', 'activity_name', 'activity_location', 'activity_city',
            'start_date', 'end_date', 'available_spots', 'is_available',
            'price', 'currency', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_is_available(self, obj):
        return obj.is_available


# ============================================================================
# ACTIVITIES
# ============================================================================

class ActivityListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des activités"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    schedules_count = serializers.SerializerMethodField()
    available_schedules_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'location', 'city', 'country', 'duration_hours', 'rating',
            'status', 'schedules_count', 'available_schedules_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_schedules_count(self, obj):
        return obj.schedules.count()
    
    def get_available_schedules_count(self, obj):
        return obj.schedules.filter(available_spots__gt=0).count()


class ActivityDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une activité avec toutes ses relations"""
    category = ActivityCategorySerializer(read_only=True)
    schedules = ActivityScheduleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id', 'category', 'name', 'description',
            'location', 'city', 'country', 'duration_hours', 'rating',
            'status', 'schedules', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer de base pour Activity"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'location', 'city', 'country', 'duration_hours', 'rating',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

