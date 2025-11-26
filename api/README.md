# API Django RESTful - Nomade

Backend Django RESTful pour la plateforme de réservation de voyages Nomade.

## 🚀 Installation

### Prérequis
- Python 3.8+
- MySQL 5.7+ ou MariaDB
- pip

### Étapes d'installation

1. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

2. **Configurer la base de données**

Modifiez les paramètres de connexion dans `nomade_api/settings.py` si nécessaire :
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'nomade',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

3. **Créer les migrations**
```bash
python manage.py makemigrations
```

4. **Appliquer les migrations**
```bash
python manage.py migrate
```

5. **Créer un superutilisateur (optionnel)**
```bash
python manage.py createsuperuser
```

6. **Lancer le serveur de développement**
```bash
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

## 📚 Structure de l'API

### 1. Gestion des Utilisateurs (`/api/users/`)

#### Endpoints disponibles :

- **POST** `/api/users/users/register/` - Inscription d'un nouvel utilisateur
- **POST** `/api/users/users/login/` - Connexion d'un utilisateur
- **GET** `/api/users/users/me/` - Récupérer le profil de l'utilisateur connecté
- **PUT/PATCH** `/api/users/users/me/` - Mettre à jour le profil
- **POST** `/api/users/users/logout/` - Déconnexion
- **GET** `/api/users/users/` - Liste des utilisateurs (authentifié)
- **GET** `/api/users/users/{id}/` - Détails d'un utilisateur
- **PUT/PATCH** `/api/users/users/{id}/` - Mettre à jour un utilisateur
- **DELETE** `/api/users/users/{id}/` - Supprimer un utilisateur

#### Profils utilisateur :
- **GET** `/api/users/profiles/me/` - Récupérer le profil
- **PUT/PATCH** `/api/users/profiles/me/` - Mettre à jour le profil

#### Adresses :
- **GET** `/api/users/addresses/` - Liste des adresses
- **POST** `/api/users/addresses/` - Créer une adresse
- **GET** `/api/users/addresses/{id}/` - Détails d'une adresse
- **PUT/PATCH** `/api/users/addresses/{id}/` - Mettre à jour une adresse
- **DELETE** `/api/users/addresses/{id}/` - Supprimer une adresse

#### Méthodes de paiement :
- **GET** `/api/users/payment-methods/` - Liste des méthodes de paiement
- **POST** `/api/users/payment-methods/` - Ajouter une méthode de paiement
- **GET** `/api/users/payment-methods/{id}/` - Détails d'une méthode
- **PUT/PATCH** `/api/users/payment-methods/{id}/` - Mettre à jour une méthode
- **DELETE** `/api/users/payment-methods/{id}/` - Désactiver une méthode

#### Sessions :
- **GET** `/api/users/sessions/` - Liste des sessions actives
- **GET** `/api/users/sessions/{id}/` - Détails d'une session
- **DELETE** `/api/users/sessions/{id}/revoke/` - Révoquer une session
- **DELETE** `/api/users/sessions/revoke_all/` - Révoquer toutes les sessions

### 2. Programme de Fidélité ONEKEY (`/api/onekey/`)

#### Endpoints disponibles :

- **GET** `/api/onekey/accounts/me/` - Récupérer mon compte OneKey
- **GET** `/api/onekey/accounts/` - Liste des comptes (authentifié)
- **GET** `/api/onekey/accounts/{id}/` - Détails d'un compte
- **POST** `/api/onekey/accounts/{id}/add_points/` - Ajouter des points
- **POST** `/api/onekey/accounts/{id}/redeem_points/` - Utiliser des points

#### Récompenses :
- **GET** `/api/onekey/rewards/` - Liste des récompenses

#### Transactions :
- **GET** `/api/onekey/transactions/` - Liste des transactions
- **GET** `/api/onekey/transactions/?type=earn` - Filtrer par type (earn, redeem, expire, adjustment)

## 🔐 Authentification

L'API utilise l'authentification par token. Pour utiliser les endpoints protégés :

1. **S'inscrire ou se connecter** pour obtenir un token
2. **Inclure le token** dans les en-têtes de requête :
```
Authorization: Token <votre_token>
```

### Exemple d'inscription :
```json
POST /api/users/users/register/
{
    "email": "user@example.com",
    "password": "motdepasse123",
    "password_confirm": "motdepasse123",
    "first_name": "John",
    "last_name": "Doe"
}
```

### Exemple de connexion :
```json
POST /api/users/users/login/
{
    "email": "user@example.com",
    "password": "motdepasse123"
}
```

## 📝 Exemples d'utilisation

### Ajouter des points OneKey
```json
POST /api/onekey/accounts/{account_id}/add_points/
Authorization: Token <votre_token>
{
    "points": 1000,
    "description": "Points gagnés pour une réservation",
    "booking_id": "uuid-de-la-reservation"
}
```

### Utiliser des points OneKey
```json
POST /api/onekey/accounts/{account_id}/redeem_points/
Authorization: Token <votre_token>
{
    "points": 500,
    "description": "Utilisation de points pour une réduction",
    "booking_id": "uuid-de-la-reservation"
}
```

## 🗄️ Modèles de données

### Users
- `User` - Comptes utilisateurs
- `UserProfile` - Profils avec préférences
- `UserAddress` - Adresses utilisateur
- `UserPaymentMethod` - Méthodes de paiement
- `UserSession` - Sessions actives

### OneKey
- `OneKeyAccount` - Comptes de fidélité
- `OneKeyReward` - Récompenses/points
- `OneKeyTransaction` - Historique des transactions

## 🛠️ Administration Django

Accédez à l'interface d'administration Django sur :
```
http://localhost:8000/admin/
```

Utilisez les identifiants du superutilisateur créé avec `createsuperuser`.

## 📦 Dépendances principales

- Django 4.2.7
- Django REST Framework 3.14.0
- django-cors-headers 4.3.0
- mysqlclient 2.2.0

## 🔧 Configuration

Les paramètres principaux sont dans `nomade_api/settings.py` :
- Configuration de la base de données
- Paramètres REST Framework
- Configuration CORS
- Modèle d'utilisateur personnalisé

## 📄 Licence

Ce projet fait partie de la plateforme Nomade.

