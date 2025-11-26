import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    """Manager personnalisé pour le modèle User"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Crée et sauvegarde un utilisateur avec l'email et le mot de passe"""
        if not email:
            raise ValueError('L\'email doit être fourni')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Crée et sauvegarde un superutilisateur"""
        extra_fields.setdefault('status', 'active')
        extra_fields.setdefault('email_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    """Modèle User personnalisé"""
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('inactive', 'Inactif'),
        ('suspended', 'Suspendu'),
        ('deleted', 'Supprimé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    # password est géré par AbstractBaseUser
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', db_index=True)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email


class UserProfile(models.Model):
    """Profil utilisateur avec préférences"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', db_index=True)
    preferred_language = models.CharField(max_length=10, default='fr')
    preferred_currency = models.CharField(max_length=3, default='EUR')
    timezone = models.CharField(max_length=50, blank=True, null=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f'Profil de {self.user.email}'


class UserAddress(models.Model):
    """Adresses des utilisateurs"""
    ADDRESS_TYPE_CHOICES = [
        ('billing', 'Facturation'),
        ('shipping', 'Livraison'),
        ('home', 'Domicile'),
        ('work', 'Travail'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses', db_index=True)
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default='home')
    street = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_addresses'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f'{self.get_address_type_display()} - {self.user.email}'


class UserPaymentMethod(models.Model):
    """Méthodes de paiement des utilisateurs"""
    PAYMENT_TYPE_CHOICES = [
        ('credit_card', 'Carte de crédit'),
        ('debit_card', 'Carte de débit'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Virement bancaire'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods', db_index=True)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    card_brand = models.CharField(max_length=50, blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_payment_methods'
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f'{self.get_payment_type_display()} - {self.user.email}'


class UserSession(models.Model):
    """Sessions utilisateur"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions', db_index=True)
    session_token = models.CharField(max_length=255, unique=True, db_index=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f'Session {self.session_token[:8]}... - {self.user.email}'
    
    def is_expired(self):
        """Vérifie si la session est expirée"""
        return timezone.now() > self.expires_at

