import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


# ============================================================================
# 1. PROMOTION TYPES
# ============================================================================

class PromotionType(models.Model):
    """Types de promotions (Black Friday, saisonnières, etc.)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'promotion_types'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# ============================================================================
# 2. PROMOTIONS
# ============================================================================

class Promotion(models.Model):
    """Promotions (nom, description, pourcentage/montant, dates)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    promotion_type = models.ForeignKey(
        PromotionType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='promotions',
        db_index=True
    )
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0.00), MaxValueValidator(100.00)],
        help_text="Pourcentage de réduction (0-100)"
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0.00)],
        help_text="Montant fixe de réduction"
    )
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'promotions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['start_date', 'end_date']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    def clean(self):
        """Valider que end_date est après start_date et qu'au moins une réduction est définie"""
        from django.core.exceptions import ValidationError
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("La date de fin doit être après la date de début.")
        if not self.discount_percent and not self.discount_amount:
            raise ValidationError("Au moins une réduction (pourcentage ou montant) doit être définie.")
        if self.discount_percent and self.discount_amount:
            raise ValidationError("Une seule réduction (pourcentage ou montant) doit être définie.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    @property
    def is_currently_active(self):
        """Vérifie si la promotion est active et dans sa période de validité"""
        if not self.is_active:
            return False
        today = timezone.now().date()
        if today < self.start_date:
            return False
        if today > self.end_date:
            return False
        return True
    
    @property
    def discount_display(self):
        """Affiche la réduction de manière lisible"""
        if self.discount_percent:
            return f"{self.discount_percent}%"
        elif self.discount_amount:
            return f"{self.discount_amount} EUR"
        return "Aucune réduction"


# ============================================================================
# 3. PROMOTION CODES
# ============================================================================

class PromotionCode(models.Model):
    """Codes promotionnels (code unique, limite d'utilisation, compteur)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    promotion = models.ForeignKey(
        Promotion,
        on_delete=models.CASCADE,
        related_name='codes',
        db_index=True
    )
    code = models.CharField(max_length=50, unique=True, db_index=True, help_text="Code promotionnel unique")
    usage_limit = models.IntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        help_text="Limite d'utilisation (None = illimité)"
    )
    used_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'promotion_codes'
        ordering = ['promotion', 'code']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['promotion']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.promotion.name}"
    
    @property
    def is_available(self):
        """Vérifie si le code est disponible (actif, promotion active, et pas de limite atteinte)"""
        if not self.is_active:
            return False
        if not self.promotion.is_currently_active:
            return False
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False
        return True
    
    @property
    def remaining_uses(self):
        """Nombre d'utilisations restantes"""
        if not self.usage_limit:
            return None  # Illimité
        return max(0, self.usage_limit - self.used_count)
    
    def increment_usage(self):
        """Incrémente le compteur d'utilisation"""
        self.used_count += 1
        self.save(update_fields=['used_count'])
    
    def can_use(self):
        """Vérifie si le code peut être utilisé"""
        return self.is_available
