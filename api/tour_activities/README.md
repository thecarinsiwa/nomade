# 🎯 API Tour Activities (Activités - Things To Do)

Cette application Django gère le domaine fonctionnel **ACTIVITÉS (THINGS TO DO)** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **activity_categories** - Catégories (culture, sport, aventure, gastronomie, etc.)
2. **activities** - Activités (nom, description, lieu, durée, note)
3. **activity_schedules** - Horaires et disponibilités (dates/heures, places disponibles, prix)

## 🔗 Endpoints API

### Base URL
```
/api/activities/
```

### Endpoints Disponibles

#### Activity Categories
- `GET /api/activities/categories/` - Liste des catégories
- `POST /api/activities/categories/` - Créer une catégorie
- `GET /api/activities/categories/{id}/` - Détails d'une catégorie
- `PUT/PATCH /api/activities/categories/{id}/` - Modifier une catégorie
- `DELETE /api/activities/categories/{id}/` - Supprimer une catégorie

#### Activities
- `GET /api/activities/activities/` - Liste des activités
- `POST /api/activities/activities/` - Créer une activité
- `GET /api/activities/activities/{id}/` - Détails d'une activité
- `PUT/PATCH /api/activities/activities/{id}/` - Modifier une activité
- `DELETE /api/activities/activities/{id}/` - Supprimer une activité
- `GET /api/activities/activities/search/` - Recherche avancée d'activités
- `GET /api/activities/activities/{id}/schedules/` - Horaires d'une activité
- `GET /api/activities/activities/{id}/available_schedules/` - Horaires disponibles d'une activité

#### Activity Schedules
- `GET /api/activities/schedules/` - Liste des horaires
- `POST /api/activities/schedules/` - Créer un horaire
- `GET /api/activities/schedules/{id}/` - Détails d'un horaire
- `PUT/PATCH /api/activities/schedules/{id}/` - Modifier un horaire
- `DELETE /api/activities/schedules/{id}/` - Supprimer un horaire

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-rating`)
- `?page=` - Pagination

### Filtres Spécifiques Activities
- `?category_id=` - Filtrer par catégorie
- `?city=` - Filtrer par ville
- `?country=` - Filtrer par pays
- `?status=` - Filtrer par statut (active, inactive)
- `?min_rating=` - Note minimale
- `?min_duration=` - Durée minimale en heures
- `?max_duration=` - Durée maximale en heures

### Filtres Spécifiques Activity Schedules
- `?activity_id=` - Filtrer par activité
- `?date_from=` - Date de début (YYYY-MM-DD ou YYYY-MM-DDTHH:MM)
- `?date_to=` - Date de fin (YYYY-MM-DD ou YYYY-MM-DDTHH:MM)
- `?available_only=` - Filtrer uniquement les disponibilités (true/false)
- `?max_price=` - Prix maximum

## 📝 Exemples d'Utilisation

### Recherche d'activités
```http
GET /api/activities/activities/search/?city=Paris&category_id={uuid}&date_from=2025-06-01&date_to=2025-06-30&min_rating=4.0&max_price=100&min_spots=2
```

### Recherche avec pays
```http
GET /api/activities/activities/search/?country=France&category_id={uuid}&max_duration=3
```

### Horaires d'une activité
```http
GET /api/activities/activities/{id}/schedules/?date_from=2025-06-01&available_only=true&max_price=50
```

### Horaires disponibles d'une activité
```http
GET /api/activities/activities/{id}/available_schedules/?date_from=2025-06-01&date_to=2025-06-30
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🚀 Installation

1. Les migrations sont déjà créées dans `tour_activities/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate tour_activities --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/activities/
```

