# 📧 API Notifications (Notifications et Communication)

Cette application Django gère le domaine fonctionnel **NOTIFICATIONS ET COMMUNICATION** de la plateforme Nomade.

## 📋 Tables Gérées (2 tables)

1. **notifications** - Notifications envoyées aux utilisateurs (type, titre, message, lu/non lu)
2. **email_templates** - Modèles d'emails (sujet, corps, langue)

## 🔗 Endpoints API

### Base URL
```
/api/notifications/
```

### Endpoints Disponibles

#### Notifications
- `GET /api/notifications/notifications/` - Liste des notifications (uniquement les vôtres si non-staff)
- `POST /api/notifications/notifications/` - Créer une notification
- `GET /api/notifications/notifications/{id}/` - Détails d'une notification
- `PUT/PATCH /api/notifications/notifications/{id}/` - Modifier une notification
- `DELETE /api/notifications/notifications/{id}/` - Supprimer une notification
- `GET /api/notifications/notifications/my_notifications/` - Mes notifications
- `GET /api/notifications/notifications/unread_count/` - Nombre de notifications non lues
- `POST /api/notifications/notifications/mark_all_as_read/` - Marquer toutes comme lues
- `POST /api/notifications/notifications/{id}/mark_as_read/` - Marquer comme lue
- `POST /api/notifications/notifications/{id}/mark_as_unread/` - Marquer comme non lue

#### Email Templates
- `GET /api/notifications/email-templates/` - Liste des modèles d'emails
- `POST /api/notifications/email-templates/` - Créer un modèle
- `GET /api/notifications/email-templates/{id}/` - Détails d'un modèle
- `PUT/PATCH /api/notifications/email-templates/{id}/` - Modifier un modèle
- `DELETE /api/notifications/email-templates/{id}/` - Supprimer un modèle

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Notifications
- `?type=` - Filtrer par type (booking, payment, promotion, system, reminder, alert, info)
- `?is_read=` - Filtrer par statut lu/non lu (true/false)
- `?unread_only=` - Filtrer uniquement les notifications non lues (true/false)
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale

### Filtres Spécifiques Email Templates
- `?language=` - Filtrer par langue (fr, en, es, de, it)
- `?name=` - Filtrer par nom (recherche partielle)

## 📝 Exemples d'Utilisation

### Mes notifications
```http
GET /api/notifications/notifications/my_notifications/
```

### Nombre de notifications non lues
```http
GET /api/notifications/notifications/unread_count/
```

Réponse :
```json
{
    "unread_count": 5
}
```

### Marquer toutes les notifications comme lues
```http
POST /api/notifications/notifications/mark_all_as_read/
```

Réponse :
```json
{
    "message": "5 notification(s) marquée(s) comme lue(s)",
    "updated_count": 5
}
```

### Marquer une notification comme lue
```http
POST /api/notifications/notifications/{id}/mark_as_read/
```

### Recherche de notifications
```http
GET /api/notifications/notifications/?type=booking&unread_only=true
```

### Recherche de modèles d'emails
```http
GET /api/notifications/email-templates/?language=fr&name=booking
```

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Sécurité** : Les utilisateurs ne peuvent voir que leurs propres notifications (sauf staff)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types de Notifications

Les notifications peuvent être de type :
- **booking** - Réservation
- **payment** - Paiement
- **promotion** - Promotion
- **system** - Système
- **reminder** - Rappel
- **alert** - Alerte
- **info** - Information

## 🌍 Langues Supportées pour les Templates

Les modèles d'emails supportent les langues suivantes :
- **fr** - Français
- **en** - English
- **es** - Español
- **de** - Deutsch
- **it** - Italiano

## 🚀 Installation

1. Les migrations sont déjà créées dans `notifications/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate notifications --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/notifications/
```

