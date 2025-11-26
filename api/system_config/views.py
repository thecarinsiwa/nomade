from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import Currency, Language, Setting
from .serializers import (
    CurrencySerializer, LanguageSerializer, SettingSerializer
)


# ============================================================================
# CURRENCIES
# ============================================================================

class CurrencyViewSet(viewsets.ModelViewSet):
    """ViewSet pour Currency"""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'symbol']
    ordering_fields = ['code', 'name', 'exchange_rate', 'created_at']
    ordering = ['code']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        active_only = self.request.query_params.get('active_only')
        
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer toutes les devises actives"""
        currencies = self.get_queryset().filter(is_active=True)
        
        page = self.paginate_queryset(currencies)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(currencies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def convert(self, request):
        """Convertir un montant d'une devise à une autre"""
        amount = request.query_params.get('amount')
        from_currency = request.query_params.get('from')
        to_currency = request.query_params.get('to')
        
        if not all([amount, from_currency, to_currency]):
            return Response(
                {'error': 'Les paramètres amount, from et to sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = float(amount)
            from_curr = Currency.objects.get(code=from_currency.upper(), is_active=True)
            to_curr = Currency.objects.get(code=to_currency.upper(), is_active=True)
        except Currency.DoesNotExist:
            return Response(
                {'error': 'Devise non trouvée ou inactive'},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {'error': 'Montant invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Conversion : montant * (taux_to / taux_from)
        if from_curr.exchange_rate == 0:
            return Response(
                {'error': 'Taux de change invalide pour la devise source'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        converted_amount = amount * (float(to_curr.exchange_rate) / float(from_curr.exchange_rate))
        
        return Response({
            'amount': amount,
            'from_currency': from_curr.code,
            'to_currency': to_curr.code,
            'converted_amount': round(converted_amount, 2),
            'exchange_rate': float(to_curr.exchange_rate) / float(from_curr.exchange_rate)
        })


# ============================================================================
# LANGUAGES
# ============================================================================

class LanguageViewSet(viewsets.ModelViewSet):
    """ViewSet pour Language"""
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'native_name']
    ordering_fields = ['code', 'name', 'created_at']
    ordering = ['code']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        active_only = self.request.query_params.get('active_only')
        
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer toutes les langues actives"""
        languages = self.get_queryset().filter(is_active=True)
        
        page = self.paginate_queryset(languages)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(languages, many=True)
        return Response(serializer.data)


# ============================================================================
# SETTINGS
# ============================================================================

class SettingViewSet(viewsets.ModelViewSet):
    """ViewSet pour Setting"""
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['setting_key', 'description']
    ordering_fields = ['setting_key', 'setting_type', 'created_at']
    ordering = ['setting_key']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        setting_key = self.request.query_params.get('key')
        setting_type = self.request.query_params.get('type')
        
        if setting_key:
            queryset = queryset.filter(setting_key__icontains=setting_key)
        if setting_type:
            queryset = queryset.filter(setting_type=setting_type)
        
        return queryset
    
    def perform_create(self, serializer):
        """Créer un paramètre système (staff seulement)"""
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Seuls les administrateurs peuvent créer des paramètres système.")
        serializer.save()
    
    def perform_update(self, serializer):
        """Modifier un paramètre système (staff seulement)"""
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Seuls les administrateurs peuvent modifier des paramètres système.")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Supprimer un paramètre système (staff seulement)"""
        if not self.request.user.is_staff:
            raise permissions.PermissionDenied("Seuls les administrateurs peuvent supprimer des paramètres système.")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def get_value(self, request):
        """Récupérer la valeur d'un paramètre par sa clé"""
        key = request.query_params.get('key')
        
        if not key:
            return Response(
                {'error': 'Le paramètre "key" est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            setting = Setting.objects.get(setting_key=key)
            return Response({
                'key': setting.setting_key,
                'value': setting.get_value(),
                'type': setting.setting_type
            })
        except Setting.DoesNotExist:
            return Response(
                {'error': f'Paramètre "{key}" non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def set_value(self, request, pk=None):
        """Définir la valeur d'un paramètre (staff seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent modifier des paramètres système'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        setting_obj = self.get_object()
        value = request.data.get('value')
        
        if value is None:
            return Response(
                {'error': 'La valeur est requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        setting_obj.set_value(value)
        serializer = self.get_serializer(setting_obj)
        return Response(serializer.data)
