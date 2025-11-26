import uuid
from django.db import models
from django.core.validators import MinValueValidator


# ============================================================================
# 1. CURRENCIES
# ============================================================================

class Currency(models.Model):
    """Devises supportées (code, nom, symbole, taux de change)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=3, unique=True, db_index=True, help_text="Code ISO 4217 (ex: EUR, USD)")
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=10, blank=True, null=True)
    exchange_rate = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        default=1.000000,
        validators=[MinValueValidator(0)],
        help_text="Taux de change par rapport à la devise de base"
    )
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'currencies'
        ordering = ['code']
        verbose_name_plural = 'Currencies'
    
    def __str__(self):
        return f"{self.code} - {self.name} ({self.symbol or ''})"


# ============================================================================
# 2. LANGUAGES
# ============================================================================

class Language(models.Model):
    """Langues disponibles (code, nom, nom natif)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True, db_index=True, help_text="Code ISO 639 (ex: fr, en, es)")
    name = models.CharField(max_length=100)
    native_name = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'languages'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name} ({self.native_name or ''})"


# ============================================================================
# 3. SETTINGS
# ============================================================================

class Setting(models.Model):
    """Paramètres système (clé/valeur, type, description)"""
    TYPE_CHOICES = [
        ('string', 'Chaîne de caractères'),
        ('integer', 'Entier'),
        ('float', 'Nombre décimal'),
        ('boolean', 'Booléen'),
        ('json', 'JSON'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    setting_key = models.CharField(max_length=100, unique=True, db_index=True)
    setting_value = models.TextField(blank=True, null=True)
    setting_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='string',
        db_index=True
    )
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'settings'
        ordering = ['setting_key']
    
    def __str__(self):
        return f"{self.setting_key} = {self.setting_value}"
    
    def get_value(self):
        """Retourne la valeur convertie selon le type"""
        if not self.setting_value:
            return None
        
        if self.setting_type == 'integer':
            try:
                return int(self.setting_value)
            except ValueError:
                return None
        elif self.setting_type == 'float':
            try:
                return float(self.setting_value)
            except ValueError:
                return None
        elif self.setting_type == 'boolean':
            return self.setting_value.lower() in ('true', '1', 'yes', 'on')
        elif self.setting_type == 'json':
            import json
            try:
                return json.loads(self.setting_value)
            except (json.JSONDecodeError, ValueError):
                return None
        else:  # string
            return self.setting_value
    
    def set_value(self, value):
        """Définit la valeur en la convertissant en chaîne selon le type"""
        if value is None:
            self.setting_value = None
        elif self.setting_type == 'json':
            import json
            self.setting_value = json.dumps(value)
        else:
            self.setting_value = str(value)
        self.save()
