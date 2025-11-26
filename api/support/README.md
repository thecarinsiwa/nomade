# 🎧 API Support (Support Client)

Cette application Django gère le domaine fonctionnel **SUPPORT CLIENT** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **support_categories** - Catégories de support (réservation, paiement, technique, etc.)
2. **support_tickets** - Tickets de support (sujet, statut, priorité, réservation liée)
3. **support_messages** - Messages dans les tickets (utilisateur/staff, contenu)

## 🔗 Endpoints API

### Base URL
```
/api/support/
```

### Endpoints Disponibles

#### Support Categories
- `GET /api/support/categories/` - Liste des catégories
- `POST /api/support/categories/` - Créer une catégorie
- `GET /api/support/categories/{id}/` - Détails d'une catégorie
- `PUT/PATCH /api/support/categories/{id}/` - Modifier une catégorie
- `DELETE /api/support/categories/{id}/` - Supprimer une catégorie

#### Support Tickets
- `GET /api/support/tickets/` - Liste des tickets (uniquement les vôtres si non-staff)
- `POST /api/support/tickets/` - Créer un ticket
- `GET /api/support/tickets/{id}/` - Détails d'un ticket
- `PUT/PATCH /api/support/tickets/{id}/` - Modifier un ticket
- `DELETE /api/support/tickets/{id}/` - Supprimer un ticket
- `GET /api/support/tickets/my_tickets/` - Mes tickets
- `GET /api/support/tickets/open_tickets/` - Tickets ouverts
- `GET /api/support/tickets/{id}/messages/` - Messages d'un ticket
- `POST /api/support/tickets/{id}/add_message/` - Ajouter un message à un ticket
- `POST /api/support/tickets/{id}/change_status/` - Changer le statut d'un ticket (staff seulement)

#### Support Messages
- `GET /api/support/messages/` - Liste des messages
- `POST /api/support/messages/` - Créer un message
- `GET /api/support/messages/{id}/` - Détails d'un message
- `PUT/PATCH /api/support/messages/{id}/` - Modifier un message
- `DELETE /api/support/messages/{id}/` - Supprimer un message

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Support Tickets
- `?category_id=` - Filtrer par catégorie
- `?booking_id=` - Filtrer par réservation
- `?status=` - Filtrer par statut (open, in_progress, resolved, closed)
- `?priority=` - Filtrer par priorité (low, medium, high, urgent)
- `?open_only=` - Filtrer uniquement les tickets ouverts (true/false)
- `?closed_only=` - Filtrer uniquement les tickets fermés (true/false)
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale

### Filtres Spécifiques Support Messages
- `?ticket_id=` - Filtrer par ticket
- `?is_from_staff=` - Filtrer par origine (true/false)

## 📝 Exemples d'Utilisation

### Mes tickets
```http
GET /api/support/tickets/my_tickets/
```

### Tickets ouverts
```http
GET /api/support/tickets/open_tickets/
```

### Ajouter un message à un ticket
```http
POST /api/support/tickets/{id}/add_message/
Content-Type: application/json

{
    "message": "J'ai besoin d'aide avec ma réservation"
}
```

### Changer le statut d'un ticket (staff seulement)
```http
POST /api/support/tickets/{id}/change_status/
Content-Type: application/json

{
    "status": "in_progress"
}
```

### Messages d'un ticket
```http
GET /api/support/tickets/{id}/messages/
```

### Recherche de tickets
```http
GET /api/support/tickets/?status=open&priority=high&category_id={uuid}
```

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Sécurité** : Les utilisateurs ne peuvent voir que leurs propres tickets (sauf staff)
- **Changement de statut** : Nécessite les permissions staff

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Statuts de Tickets

Les tickets peuvent avoir les statuts suivants :
- **open** - Ouvert
- **in_progress** - En cours
- **resolved** - Résolu
- **closed** - Fermé

## 🚨 Priorités de Tickets

Les tickets peuvent avoir les priorités suivantes :
- **low** - Faible
- **medium** - Moyenne
- **high** - Haute
- **urgent** - Urgente

## 🎯 Fonctionnalités Spéciales

- **Détection automatique du staff** : Le champ `is_from_staff` est automatiquement défini selon les permissions de l'utilisateur
- **Réouverture automatique** : Si un utilisateur ajoute un message à un ticket fermé, celui-ci est automatiquement rouvert
- **Propriétés calculées** :
  - `is_open` : Vérifie si le ticket est ouvert
  - `is_closed` : Vérifie si le ticket est fermé
  - `messages_count` : Nombre de messages dans le ticket
  - `last_message` : Dernier message du ticket

## 🚀 Installation

1. Les migrations sont déjà créées dans `support/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate support --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/support/
```

