from django.contrib import admin
from .models import Review, ReviewRating, ReviewPhoto


# ============================================================================
# REVIEW PHOTOS
# ============================================================================

@admin.register(ReviewPhoto)
class ReviewPhotoAdmin(admin.ModelAdmin):
    list_display = ['review', 'display_order', 'created_at']
    search_fields = ['review__title', 'review__comment']
    list_filter = ['created_at']
    ordering = ['review', 'display_order']
    autocomplete_fields = ['review']


# ============================================================================
# REVIEW RATINGS
# ============================================================================

@admin.register(ReviewRating)
class ReviewRatingAdmin(admin.ModelAdmin):
    list_display = ['review', 'category', 'rating', 'created_at']
    search_fields = ['review__title', 'review__comment']
    list_filter = ['category', 'rating', 'created_at']
    ordering = ['review', 'category']
    autocomplete_fields = ['review']


# ============================================================================
# REVIEWS
# ============================================================================

class ReviewRatingInline(admin.TabularInline):
    model = ReviewRating
    extra = 0
    fields = ['category', 'rating']
    ordering = ['category']


class ReviewPhotoInline(admin.TabularInline):
    model = ReviewPhoto
    extra = 0
    fields = ['photo_url', 'display_order']
    ordering = ['display_order']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'property', 'activity', 'rating', 'title',
        'is_verified', 'helpful_count', 'created_at'
    ]
    search_fields = ['title', 'comment', 'user__email', 'property__name', 'activity__name']
    list_filter = ['is_verified', 'rating', 'created_at']
    ordering = ['-created_at']
    autocomplete_fields = ['user', 'property', 'activity', 'booking']
    inlines = [ReviewRatingInline, ReviewPhotoInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'property', 'activity', 'booking'
        )
