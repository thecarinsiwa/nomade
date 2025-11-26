# 📊 API Analytics (Analytics et Tracking)

Cette application Django gère le domaine fonctionnel **ANALYTICS ET TRACKING** de la plateforme Nomade.

## 📋 Tables Gérées (2 tables)

1. **user_searches** - Recherches effectuées (type, paramètres JSON, nombre de résultats)
2. **analytics_events** - Événements analytics (type, données JSON, IP, user agent)

## 🔗 Endpoints API

### Base URL
```
/api/analytics/
```

### Endpoints Disponibles

#### User Searches
- `GET /api/analytics/searches/` - Liste des recherches (uniquement les vôtres si non-staff)
- `POST /api/analytics/searches/` - Créer une recherche
- `GET /api/analytics/searches/{id}/` - Détails d'une recherche
- `PUT/PATCH /api/analytics/searches/{id}/` - Modifier une recherche
- `DELETE /api/analytics/searches/{id}/` - Supprimer une recherche
- `GET /api/analytics/searches/statistics/` - Statistiques sur les recherches (staff seulement)

#### Analytics Events
- `GET /api/analytics/events/` - Liste des événements (uniquement les vôtres si non-staff)
- `POST /api/analytics/events/` - Créer un événement
- `GET /api/analytics/events/{id}/` - Détails d'un événement
- `PUT/PATCH /api/analytics/events/{id}/` - Modifier un événement
- `DELETE /api/analytics/events/{id}/` - Supprimer un événement
- `GET /api/analytics/events/statistics/` - Statistiques sur les événements (staff seulement)
- `POST /api/analytics/events/track/` - Endpoint simplifié pour tracker un événement

## 🔍 Filtres et Recherche

### Filtres Communs
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques User Searches
- `?user_id=` - Filtrer par utilisateur (staff seulement)
- `?search_type=` - Filtrer par type (hotel, flight, car, package, activity, cruise)
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale
- `?min_results=` - Nombre minimum de résultats
- `?max_results=` - Nombre maximum de résultats

### Filtres Spécifiques Analytics Events
- `?user_id=` - Filtrer par utilisateur (staff seulement)
- `?event_type=` - Filtrer par type d'événement (recherche partielle)
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale

## 📝 Exemples d'Utilisation

### Statistiques sur les recherches (staff seulement)
```http
GET /api/analytics/searches/statistics/?date_from=2025-01-01&date_to=2025-12-31
```

Réponse inclut :
- Total de recherches
- Moyenne, min, max de résultats
- Répartition par type de recherche
- Top 10 utilisateurs

### Statistiques sur les événements (staff seulement)
```http
GET /api/analytics/events/statistics/?date_from=2025-01-01
```

Réponse inclut :
- Total d'événements
- Répartition par type d'événement
- Top 10 utilisateurs
- Événements par jour (30 derniers jours)

### Tracker un événement (endpoint simplifié)
```http
POST /api/analytics/events/track/
Content-Type: application/json

{
    "event_type": "page_view",
    "event_data": {
        "page": "/hotels",
        "duration": 45
    }
}
```

L'IP et le user agent sont automatiquement récupérés depuis la requête.

### Créer une recherche
```http
POST /api/analytics/searches/
Content-Type: application/json

{
    "search_type": "hotel",
    "search_params": {
        "destination": "Paris",
        "check_in": "2025-06-01",
        "check_out": "2025-06-05",
        "guests": 2
    },
    "results_count": 25
}
```

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Sécurité** : Les utilisateurs ne peuvent voir que leurs propres recherches et événements (sauf staff)
- **Statistiques** : Nécessitent les permissions staff

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types de Recherches

Les recherches peuvent être de type :
- **hotel** - Hôtel
- **flight** - Vol
- **car** - Voiture
- **package** - Forfait
- **activity** - Activité
- **cruise** - Croisière

## 🎯 Fonctionnalités Spéciales

- **Champs JSON** : Support natif pour les champs JSON (paramètres de recherche et données d'événements)
- **Détection automatique IP et User Agent** : Récupérés automatiquement lors de la création d'un événement
- **Méthodes utilitaires** :
  - `get_search_params_dict()` : Retourne les paramètres de recherche sous forme de dictionnaire
  - `get_event_data_dict()` : Retourne les données de l'événement sous forme de dictionnaire
- **Statistiques avancées** : Endpoints dédiés pour les analyses (staff seulement)
- **Endpoint simplifié de tracking** : `/events/track/` pour faciliter l'intégration

## 🚀 Installation

1. Les migrations sont déjà créées dans `analytics/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate analytics --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/analytics/
```

