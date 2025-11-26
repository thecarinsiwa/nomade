from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
import secrets
from .models import User, UserProfile, UserAddress, UserPaymentMethod, UserSession
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, UserAddressSerializer, UserPaymentMethodSerializer,
    UserSessionSerializer, UserDetailSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des utilisateurs"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UserDetailSerializer
        elif self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer
    
    def get_permissions(self):
        """Permissions personnalisées selon l'action"""
        if self.action == 'create' or self.action == 'register':
            return [permissions.AllowAny()]
        elif self.action == 'me':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Inscription d'un nouvel utilisateur"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Créer un token d'authentification
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Connexion d'un utilisateur"""
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=user)
            
            # Créer une session
            session_token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(days=30)
            UserSession.objects.create(
                user=user,
                session_token=session_token,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                expires_at=expires_at
            )
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'session_token': session_token
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Récupérer ou mettre à jour le profil de l'utilisateur connecté"""
        user = request.user
        if request.method == 'GET':
            serializer = UserDetailSerializer(user)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserSerializer(user, data=request.data, partial=request.method == 'PATCH')
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def logout(self, request):
        """Déconnexion de l'utilisateur"""
        # Supprimer le token
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        
        # Supprimer les sessions expirées
        UserSession.objects.filter(user=request.user, expires_at__lt=timezone.now()).delete()
        
        return Response({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des profils utilisateur"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement le profil de l'utilisateur connecté"""
        return UserProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Créer un profil pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Récupérer ou mettre à jour le profil de l'utilisateur connecté"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(profile, data=request.data, partial=request.method == 'PATCH')
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAddressViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des adresses utilisateur"""
    queryset = UserAddress.objects.all()
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement les adresses de l'utilisateur connecté"""
        return UserAddress.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Créer une adresse pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)


class UserPaymentMethodViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des méthodes de paiement"""
    queryset = UserPaymentMethod.objects.all()
    serializer_class = UserPaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement les méthodes de paiement de l'utilisateur connecté"""
        return UserPaymentMethod.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        """Créer une méthode de paiement pour l'utilisateur connecté"""
        serializer.save(user=self.request.user)
    
    def perform_destroy(self, instance):
        """Désactiver au lieu de supprimer"""
        instance.is_active = False
        instance.save()


class UserSessionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la gestion des sessions utilisateur (lecture seule)"""
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourner uniquement les sessions de l'utilisateur connecté"""
        return UserSession.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['delete'])
    def revoke(self, request, pk=None):
        """Révoquer une session spécifique"""
        session = self.get_object()
        if session.user != request.user:
            return Response(
                {'error': 'Vous ne pouvez pas révoquer cette session'},
                status=status.HTTP_403_FORBIDDEN
            )
        session.delete()
        return Response({'message': 'Session révoquée'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['delete'])
    def revoke_all(self, request):
        """Révoquer toutes les sessions de l'utilisateur connecté"""
        UserSession.objects.filter(user=request.user).delete()
        return Response({'message': 'Toutes les sessions ont été révoquées'}, status=status.HTTP_200_OK)

