import uuid
from django.db import models
from django.conf import settings


class OneKeyAccount(models.Model):
    """Compte OneKey pour le programme de fidélité"""
    TIER_CHOICES = [
        ('silver', 'Argent'),
        ('gold', 'Or'),
        ('platinum', 'Platine'),
        ('diamond', 'Diamant'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='onekey_account',
        unique=True,
        db_index=True
    )
    onekey_number = models.CharField(max_length=50, unique=True, blank=True, null=True, db_index=True)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='silver')
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'onekey_accounts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'OneKey Account - {self.user.email} ({self.tier})'
    
    def save(self, *args, **kwargs):
        # Générer un numéro OneKey si non fourni
        if not self.onekey_number:
            self.onekey_number = f'OK{str(self.user.id).replace("-", "").upper()[:12]}'
        super().save(*args, **kwargs)


class OneKeyReward(models.Model):
    """Récompenses OneKey (points accumulés)"""
    REWARD_TYPE_CHOICES = [
        ('earned', 'Gagné'),
        ('redeemed', 'Utilisé'),
        ('expired', 'Expiré'),
        ('bonus', 'Bonus'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    onekey_account = models.ForeignKey(
        OneKeyAccount,
        on_delete=models.CASCADE,
        related_name='rewards',
        db_index=True
    )
    points = models.IntegerField()
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    expires_at = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'onekey_rewards'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.points} points ({self.get_reward_type_display()}) - {self.onekey_account.user.email}'


class OneKeyTransaction(models.Model):
    """Transactions OneKey (historique des mouvements de points)"""
    TRANSACTION_TYPE_CHOICES = [
        ('earn', 'Gain'),
        ('redeem', 'Utilisation'),
        ('expire', 'Expiration'),
        ('adjustment', 'Ajustement'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    onekey_account = models.ForeignKey(
        OneKeyAccount,
        on_delete=models.CASCADE,
        related_name='transactions',
        db_index=True
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    points = models.IntegerField()
    booking_id = models.UUIDField(blank=True, null=True, db_index=True)  # Référence à une réservation
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'onekey_transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['booking_id']),
        ]
    
    def __str__(self):
        return f'{self.get_transaction_type_display()} - {self.points} points - {self.onekey_account.user.email}'

