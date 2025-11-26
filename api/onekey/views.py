from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import OneKeyAccount, OneKeyReward, OneKeyTransaction
from .serializers import (
    OneKeyAccountSerializer, OneKeyRewardSerializer,
    OneKeyTransactionSerializer, OneKeyAccountDetailSerializer
)


class OneKeyAccountViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des comptes OneKey"""
    queryset = OneKeyAccount.objects.all()
    serializer_class = OneKeyAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OneKeyAccountDetailSerializer
        return OneKeyAccountSerializer
    
    def get_queryset(self):
        """Retourner uniquement le compte OneKey de l'utilisateur connecté"""
        return OneKeyAccount.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Créer un compte OneKey pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Récupérer le compte OneKey de l'utilisateur connecté"""
        account, created = OneKeyAccount.objects.get_or_create(user=request.user)
        serializer = OneKeyAccountDetailSerializer(account)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_points(self, request, pk=None):
        """Ajouter des points au compte OneKey"""
        account = self.get_object()
        if account.user != request.user:
            return Response(
                {'error': 'Vous ne pouvez pas modifier ce compte'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        points = request.data.get('points', 0)
        description = request.data.get('description', 'Ajout de points')
        booking_id = request.data.get('booking_id', None)
        
        if points <= 0:
            return Response(
                {'error': 'Le nombre de points doit être positif'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Créer la transaction
                transaction_obj = OneKeyTransaction.objects.create(
                    onekey_account=account,
                    transaction_type='earn',
                    points=points,
                    booking_id=booking_id,
                    description=description
                )
                
                # Créer la récompense
                reward = OneKeyReward.objects.create(
                    onekey_account=account,
                    points=points,
                    reward_type='earned',
                    description=description
                )
                
                # Mettre à jour le total de points
                account.total_points += points
                account.save()
            
            return Response({
                'message': f'{points} points ajoutés avec succès',
                'new_total': account.total_points,
                'transaction': OneKeyTransactionSerializer(transaction_obj).data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def redeem_points(self, request, pk=None):
        """Utiliser des points du compte OneKey"""
        account = self.get_object()
        if account.user != request.user:
            return Response(
                {'error': 'Vous ne pouvez pas modifier ce compte'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        points = request.data.get('points', 0)
        description = request.data.get('description', 'Utilisation de points')
        booking_id = request.data.get('booking_id', None)
        
        if points <= 0:
            return Response(
                {'error': 'Le nombre de points doit être positif'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if account.total_points < points:
            return Response(
                {'error': 'Points insuffisants'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Créer la transaction
                transaction_obj = OneKeyTransaction.objects.create(
                    onekey_account=account,
                    transaction_type='redeem',
                    points=-points,  # Négatif pour indiquer une utilisation
                    booking_id=booking_id,
                    description=description
                )
                
                # Créer la récompense (type redeemed)
                reward = OneKeyReward.objects.create(
                    onekey_account=account,
                    points=-points,
                    reward_type='redeemed',
                    description=description
                )
                
                # Mettre à jour le total de points
                account.total_points -= points
                account.save()
            
            return Response({
                'message': f'{points} points utilisés avec succès',
                'new_total': account.total_points,
                'transaction': OneKeyTransactionSerializer(transaction_obj).data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class OneKeyRewardViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la consultation des récompenses OneKey (lecture seule)"""
    queryset = OneKeyReward.objects.all()
    serializer_class = OneKeyRewardSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement les récompenses de l'utilisateur connecté"""
        return OneKeyReward.objects.filter(onekey_account__user=self.request.user)


class OneKeyTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la consultation des transactions OneKey (lecture seule)"""
    queryset = OneKeyTransaction.objects.all()
    serializer_class = OneKeyTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement les transactions de l'utilisateur connecté, filtrées par type si fourni"""
        queryset = OneKeyTransaction.objects.filter(onekey_account__user=self.request.user)
        transaction_type = self.request.query_params.get('type', None)
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
        return queryset.order_by('-created_at')

