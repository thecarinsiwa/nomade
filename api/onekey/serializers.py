from rest_framework import serializers
from .models import OneKeyAccount, OneKeyReward, OneKeyTransaction


class OneKeyAccountSerializer(serializers.ModelSerializer):
    """Serializer pour le compte OneKey"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = OneKeyAccount
        fields = [
            'id', 'user', 'user_email', 'user_name', 'onekey_number',
            'tier', 'total_points', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'onekey_number', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email


class OneKeyRewardSerializer(serializers.ModelSerializer):
    """Serializer pour les récompenses OneKey"""
    onekey_account_number = serializers.CharField(source='onekey_account.onekey_number', read_only=True)
    user_email = serializers.EmailField(source='onekey_account.user.email', read_only=True)
    
    class Meta:
        model = OneKeyReward
        fields = [
            'id', 'onekey_account', 'onekey_account_number', 'user_email',
            'points', 'reward_type', 'description', 'expires_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class OneKeyTransactionSerializer(serializers.ModelSerializer):
    """Serializer pour les transactions OneKey"""
    onekey_account_number = serializers.CharField(source='onekey_account.onekey_number', read_only=True)
    user_email = serializers.EmailField(source='onekey_account.user.email', read_only=True)
    
    class Meta:
        model = OneKeyTransaction
        fields = [
            'id', 'onekey_account', 'onekey_account_number', 'user_email',
            'transaction_type', 'points', 'booking_id', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class OneKeyAccountDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un compte OneKey avec ses relations"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    rewards = OneKeyRewardSerializer(many=True, read_only=True)
    transactions = OneKeyTransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = OneKeyAccount
        fields = [
            'id', 'user', 'user_email', 'user_name', 'onekey_number',
            'tier', 'total_points', 'created_at', 'updated_at',
            'rewards', 'transactions'
        ]
        read_only_fields = ['id', 'user', 'onekey_number', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        if obj.user.first_name and obj.user.last_name:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return obj.user.email

