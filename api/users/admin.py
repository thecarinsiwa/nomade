from django.contrib import admin
from .models import User, UserProfile, UserAddress, UserPaymentMethod, UserSession


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Administration pour le modèle User"""
    list_display = ['email', 'first_name', 'last_name', 'status', 'email_verified', 'created_at']
    list_filter = ['status', 'email_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        (None, {'fields': ('id', 'email', 'password')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name', 'date_of_birth', 'phone')}),
        ('Statut', {'fields': ('status', 'email_verified')}),
        ('Dates', {'fields': ('created_at', 'updated_at')}),
    )
    
    def save_model(self, request, obj, form, change):
        """Sauvegarder le modèle avec gestion du mot de passe"""
        if 'password' in form.changed_data:
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Administration pour le modèle UserProfile"""
    list_display = ['user', 'preferred_language', 'preferred_currency', 'timezone', 'created_at']
    list_filter = ['preferred_language', 'preferred_currency', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    """Administration pour le modèle UserAddress"""
    list_display = ['user', 'address_type', 'city', 'country', 'is_default', 'created_at']
    list_filter = ['address_type', 'is_default', 'country', 'created_at']
    search_fields = ['user__email', 'street', 'city', 'postal_code']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(UserPaymentMethod)
class UserPaymentMethodAdmin(admin.ModelAdmin):
    """Administration pour le modèle UserPaymentMethod"""
    list_display = ['user', 'payment_type', 'card_brand', 'card_last_four', 'is_default', 'is_active', 'created_at']
    list_filter = ['payment_type', 'is_default', 'is_active', 'created_at']
    search_fields = ['user__email', 'card_last_four']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Administration pour le modèle UserSession"""
    list_display = ['user', 'session_token', 'ip_address', 'expires_at', 'is_expired_display', 'created_at']
    list_filter = ['expires_at', 'created_at']
    search_fields = ['user__email', 'session_token', 'ip_address']
    readonly_fields = ['id', 'session_token', 'created_at']
    
    def is_expired_display(self, obj):
        """Afficher si la session est expirée"""
        return obj.is_expired()
    is_expired_display.short_description = 'Expirée'
    is_expired_display.boolean = True

