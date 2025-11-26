import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


# ============================================================================
# 1. REVIEWS
# ============================================================================

class Review(models.Model):
    """Avis clients (note globale, titre, commentaire, vérification)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
        db_index=True
    )
    property = models.ForeignKey(
        'accommodations.Property',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='reviews',
        db_index=True
    )
    activity = models.ForeignKey(
        'tour_activities.Activity',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='reviews',
        db_index=True
    )
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews'
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)],
        db_index=True
    )
    title = models.CharField(max_length=255, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    helpful_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['property']),
            models.Index(fields=['activity']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        target = self.property.name if self.property else (self.activity.name if self.activity else 'N/A')
        return f"Avis de {self.user.email} - {target} ({self.rating}/5)"
    
    def clean(self):
        """Valider qu'un avis est lié soit à une propriété, soit à une activité"""
        from django.core.exceptions import ValidationError
        if not self.property and not self.activity:
            raise ValidationError("Un avis doit être lié à une propriété ou une activité.")
        if self.property and self.activity:
            raise ValidationError("Un avis ne peut pas être lié à la fois à une propriété et une activité.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


# ============================================================================
# 2. REVIEW RATINGS
# ============================================================================

class ReviewRating(models.Model):
    """Notes détaillées par catégorie (propreté, service, emplacement, rapport qualité/prix)"""
    CATEGORY_CHOICES = [
        ('cleanliness', 'Propreté'),
        ('service', 'Service'),
        ('location', 'Emplacement'),
        ('value', 'Rapport qualité/prix'),
        ('comfort', 'Confort'),
        ('facilities', 'Équipements'),
        ('food', 'Nourriture'),
        ('entertainment', 'Divertissement'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='detailed_ratings',
        db_index=True
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Note de 1 à 5"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review_ratings'
        ordering = ['review', 'category']
        indexes = [
            models.Index(fields=['review']),
        ]
        unique_together = [['review', 'category']]
    
    def __str__(self):
        return f"{self.review} - {self.get_category_display()}: {self.rating}/5"


# ============================================================================
# 3. REVIEW PHOTOS
# ============================================================================

class ReviewPhoto(models.Model):
    """Photos ajoutées dans les avis"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name='photos',
        db_index=True
    )
    photo_url = models.URLField(max_length=500)
    display_order = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review_photos'
        ordering = ['display_order', 'created_at']
        indexes = [
            models.Index(fields=['review']),
        ]
    
    def __str__(self):
        return f"Photo {self.display_order} - {self.review}"
