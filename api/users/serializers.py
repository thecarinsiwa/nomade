from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, UserAddress, UserPaymentMethod, UserSession


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle User"""
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name',
            'date_of_birth', 'phone', 'status', 'email_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'email_verified']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            **validated_data
        )
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription d'un nouvel utilisateur"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'date_of_birth', 'phone']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        # Créer automatiquement un profil utilisateur
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer pour la connexion"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise serializers.ValidationError('Email ou mot de passe incorrect.')
            if user.status != 'active':
                raise serializers.ValidationError('Ce compte est inactif.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Email et mot de passe requis.')
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil utilisateur"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'user_email', 'preferred_language', 'preferred_currency',
            'timezone', 'notification_preferences', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserAddressSerializer(serializers.ModelSerializer):
    """Serializer pour les adresses utilisateur"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserAddress
        fields = [
            'id', 'user', 'user_email', 'address_type', 'street', 'city',
            'postal_code', 'country', 'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        # Si is_default est True, désactiver les autres adresses par défaut du même type
        if attrs.get('is_default', False):
            user = attrs.get('user') or self.instance.user if self.instance else None
            if user:
                UserAddress.objects.filter(
                    user=user,
                    address_type=attrs.get('address_type', self.instance.address_type if self.instance else None),
                    is_default=True
                ).exclude(id=self.instance.id if self.instance else None).update(is_default=False)
        return attrs


class UserPaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer pour les méthodes de paiement"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserPaymentMethod
        fields = [
            'id', 'user', 'user_email', 'payment_type', 'card_last_four',
            'card_brand', 'expiry_date', 'is_default', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        # Si is_default est True, désactiver les autres méthodes par défaut
        if attrs.get('is_default', False):
            user = attrs.get('user') or self.instance.user if self.instance else None
            if user:
                UserPaymentMethod.objects.filter(
                    user=user,
                    is_default=True
                ).exclude(id=self.instance.id if self.instance else None).update(is_default=False)
        return attrs


class UserSessionSerializer(serializers.ModelSerializer):
    """Serializer pour les sessions utilisateur"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    is_expired = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_email', 'session_token', 'ip_address',
            'user_agent', 'expires_at', 'is_expired', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'session_token', 'created_at']
    
    def get_is_expired(self, obj):
        return obj.is_expired()


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un utilisateur avec ses relations"""
    profile = UserProfileSerializer(read_only=True)
    addresses = UserAddressSerializer(many=True, read_only=True)
    payment_methods = UserPaymentMethodSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'date_of_birth',
            'phone', 'status', 'email_verified', 'created_at', 'updated_at',
            'profile', 'addresses', 'payment_methods'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

