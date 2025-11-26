from rest_framework import serializers
from .models import Review, ReviewRating, ReviewPhoto


# ============================================================================
# REVIEW PHOTOS
# ============================================================================

class ReviewPhotoSerializer(serializers.ModelSerializer):
    """Serializer pour ReviewPhoto"""
    review_title = serializers.CharField(source='review.title', read_only=True)
    
    class Meta:
        model = ReviewPhoto
        fields = [
            'id', 'review', 'review_title', 'photo_url',
            'display_order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# REVIEW RATINGS
# ============================================================================

class ReviewRatingSerializer(serializers.ModelSerializer):
    """Serializer pour ReviewRating"""
    review_title = serializers.CharField(source='review.title', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = ReviewRating
        fields = [
            'id', 'review', 'review_title', 'category', 'category_display',
            'rating', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================================
# REVIEWS
# ============================================================================

class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des avis"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    property_name = serializers.CharField(source='property.name', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    detailed_ratings_count = serializers.SerializerMethodField()
    photos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'property', 'property_name', 'activity', 'activity_name',
            'booking', 'booking_reference', 'rating', 'title', 'comment',
            'is_verified', 'helpful_count', 'detailed_ratings_count',
            'photos_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email.split('@')[0]
    
    def get_detailed_ratings_count(self, obj):
        return obj.detailed_ratings.count()
    
    def get_photos_count(self, obj):
        return obj.photos.count()


class ReviewDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un avis avec toutes ses relations"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    property_name = serializers.CharField(source='property.name', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    detailed_ratings = ReviewRatingSerializer(many=True, read_only=True)
    photos = ReviewPhotoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'property', 'property_name', 'activity', 'activity_name',
            'booking', 'booking_reference', 'rating', 'title', 'comment',
            'is_verified', 'helpful_count', 'detailed_ratings', 'photos',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email.split('@')[0]


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer de base pour Review"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    property_name = serializers.CharField(source='property.name', read_only=True)
    activity_name = serializers.CharField(source='activity.name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'property', 'property_name', 'activity', 'activity_name',
            'booking', 'rating', 'title', 'comment',
            'is_verified', 'helpful_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email.split('@')[0]

