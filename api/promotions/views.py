from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import PromotionType, Promotion, PromotionCode
from .serializers import (
    PromotionTypeSerializer, PromotionSerializer, PromotionListSerializer,
    PromotionDetailSerializer, PromotionCodeSerializer
)


# ============================================================================
# PROMOTION TYPES
# ============================================================================

class PromotionTypeViewSet(viewsets.ModelViewSet):
    """ViewSet pour PromotionType"""
    queryset = PromotionType.objects.all().annotate(
        promotions_count=Count('promotions')
    )
    serializer_class = PromotionTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ============================================================================
# PROMOTION CODES
# ============================================================================

class PromotionCodeViewSet(viewsets.ModelViewSet):
    """ViewSet pour PromotionCode"""
    queryset = PromotionCode.objects.select_related('promotion').all()
    serializer_class = PromotionCodeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'promotion__name']
    ordering_fields = ['code', 'used_count', 'created_at']
    ordering = ['promotion', 'code']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        promotion_id = self.request.query_params.get('promotion_id')
        code = self.request.query_params.get('code')
        active_only = self.request.query_params.get('active_only')
        available_only = self.request.query_params.get('available_only')
        
        if promotion_id:
            queryset = queryset.filter(promotion_id=promotion_id)
        if code:
            queryset = queryset.filter(code__icontains=code)
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        if available_only and available_only.lower() == 'true':
            # Filtrer les codes disponibles
            today = timezone.now().date()
            queryset = queryset.filter(
                is_active=True,
                promotion__is_active=True,
                promotion__start_date__lte=today,
                promotion__end_date__gte=today
            )
            # Filtrer ceux qui n'ont pas atteint leur limite
            queryset = [
                code for code in queryset
                if code.is_available
            ]
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def validate_code(self, request):
        """Valider un code promotionnel"""
        code = request.query_params.get('code')
        
        if not code:
            return Response(
                {'error': 'Le paramètre "code" est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            promotion_code = PromotionCode.objects.get(code=code.upper())
        except PromotionCode.DoesNotExist:
            return Response(
                {'error': 'Code promotionnel invalide', 'valid': False},
                status=status.HTTP_404_NOT_FOUND
            )
        
        is_available = promotion_code.is_available
        
        serializer = PromotionCodeSerializer(promotion_code)
        data = serializer.data
        data['valid'] = is_available
        
        if not is_available:
            reasons = []
            if not promotion_code.is_active:
                reasons.append('Code désactivé')
            if not promotion_code.promotion.is_currently_active:
                reasons.append('Promotion expirée ou non active')
            if promotion_code.usage_limit and promotion_code.used_count >= promotion_code.usage_limit:
                reasons.append('Limite d\'utilisation atteinte')
            data['reasons'] = reasons
        
        return Response(data)
    
    @action(detail=True, methods=['post'])
    def use_code(self, request, pk=None):
        """Utiliser un code promotionnel (incrémente le compteur)"""
        promotion_code = self.get_object()
        
        if not promotion_code.is_available:
            return Response(
                {'error': 'Ce code promotionnel n\'est pas disponible'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        promotion_code.increment_usage()
        
        serializer = PromotionCodeSerializer(promotion_code)
        return Response(serializer.data)


# ============================================================================
# PROMOTIONS
# ============================================================================

class PromotionViewSet(viewsets.ModelViewSet):
    """ViewSet pour Promotion"""
    queryset = Promotion.objects.select_related('promotion_type').prefetch_related('codes').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'start_date', 'end_date', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PromotionListSerializer
        elif self.action == 'retrieve':
            return PromotionDetailSerializer
        return PromotionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtres
        promotion_type_id = self.request.query_params.get('promotion_type_id')
        active_only = self.request.query_params.get('active_only')
        currently_active = self.request.query_params.get('currently_active')
        date = self.request.query_params.get('date')
        has_discount_percent = self.request.query_params.get('has_discount_percent')
        has_discount_amount = self.request.query_params.get('has_discount_amount')
        
        if promotion_type_id:
            queryset = queryset.filter(promotion_type_id=promotion_type_id)
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        if currently_active and currently_active.lower() == 'true':
            # Filtrer les promotions actuellement actives
            today = timezone.now().date()
            queryset = queryset.filter(
                is_active=True,
                start_date__lte=today,
                end_date__gte=today
            )
        if date:
            try:
                search_date = datetime.strptime(date, '%Y-%m-%d').date()
                queryset = queryset.filter(
                    start_date__lte=search_date,
                    end_date__gte=search_date
                )
            except ValueError:
                pass
        if has_discount_percent and has_discount_percent.lower() == 'true':
            queryset = queryset.exclude(discount_percent__isnull=True)
        if has_discount_amount and has_discount_amount.lower() == 'true':
            queryset = queryset.exclude(discount_amount__isnull=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer toutes les promotions actuellement actives"""
        today = timezone.now().date()
        promotions = self.get_queryset().filter(
            is_active=True,
            start_date__lte=today,
            end_date__gte=today
        )
        
        page = self.paginate_queryset(promotions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(promotions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def codes(self, request, pk=None):
        """Récupérer tous les codes d'une promotion"""
        promotion_obj = self.get_object()
        codes = promotion_obj.codes.all()
        
        active_only = request.query_params.get('active_only')
        available_only = request.query_params.get('available_only')
        
        if active_only and active_only.lower() == 'true':
            codes = codes.filter(is_active=True)
        if available_only and available_only.lower() == 'true':
            codes = [code for code in codes if code.is_available]
        
        serializer = PromotionCodeSerializer(codes, many=True)
        return Response(serializer.data)
