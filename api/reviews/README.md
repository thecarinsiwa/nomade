# ⭐ API Reviews (Avis et Évaluations)

Cette application Django gère le domaine fonctionnel **AVIS ET ÉVALUATIONS** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **reviews** - Avis clients (note globale, titre, commentaire, vérification)
2. **review_ratings** - Notes détaillées par catégorie (propreté, service, emplacement, rapport qualité/prix)
3. **review_photos** - Photos ajoutées dans les avis

## 🔗 Endpoints API

### Base URL
```
/api/reviews/
```

### Endpoints Disponibles

#### Reviews
- `GET /api/reviews/reviews/` - Liste des avis
- `POST /api/reviews/reviews/` - Créer un avis
- `GET /api/reviews/reviews/{id}/` - Détails d'un avis
- `PUT/PATCH /api/reviews/reviews/{id}/` - Modifier un avis
- `DELETE /api/reviews/reviews/{id}/` - Supprimer un avis
- `GET /api/reviews/reviews/by_property/` - Avis d'une propriété avec statistiques
- `GET /api/reviews/reviews/by_activity/` - Avis d'une activité avec statistiques
- `POST /api/reviews/reviews/{id}/mark_helpful/` - Marquer un avis comme utile
- `POST /api/reviews/reviews/{id}/verify/` - Vérifier un avis (staff seulement)

#### Review Ratings
- `GET /api/reviews/ratings/` - Liste des notes détaillées
- `POST /api/reviews/ratings/` - Créer une note détaillée
- `GET /api/reviews/ratings/{id}/` - Détails d'une note
- `PUT/PATCH /api/reviews/ratings/{id}/` - Modifier une note
- `DELETE /api/reviews/ratings/{id}/` - Supprimer une note

#### Review Photos
- `GET /api/reviews/photos/` - Liste des photos d'avis
- `POST /api/reviews/photos/` - Ajouter une photo
- `GET /api/reviews/photos/{id}/` - Détails d'une photo
- `PUT/PATCH /api/reviews/photos/{id}/` - Modifier une photo
- `DELETE /api/reviews/photos/{id}/` - Supprimer une photo

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (titre, commentaire)
- `?ordering=` - Tri (ex: `?ordering=-rating`, `?ordering=-helpful_count`)
- `?page=` - Pagination

### Filtres Spécifiques Reviews
- `?user_id=` - Filtrer par utilisateur
- `?property_id=` - Filtrer par propriété
- `?activity_id=` - Filtrer par activité
- `?booking_id=` - Filtrer par réservation
- `?min_rating=` - Note minimale (0-5)
- `?max_rating=` - Note maximale (0-5)
- `?verified_only=` - Filtrer uniquement les avis vérifiés (true/false)

### Filtres Spécifiques Review Ratings
- `?review_id=` - Filtrer par avis
- `?category=` - Filtrer par catégorie (cleanliness, service, location, value, etc.)

### Filtres Spécifiques Review Photos
- `?review_id=` - Filtrer par avis

## 📝 Exemples d'Utilisation

### Avis d'une propriété avec statistiques
```http
GET /api/reviews/reviews/by_property/?property_id={uuid}
```

Réponse inclut :
- Liste des avis
- Statistiques (total, moyenne, avis vérifiés, répartition des notes)

### Avis d'une activité avec statistiques
```http
GET /api/reviews/reviews/by_activity/?activity_id={uuid}
```

### Marquer un avis comme utile
```http
POST /api/reviews/reviews/{id}/mark_helpful/
```

### Vérifier un avis (staff seulement)
```http
POST /api/reviews/reviews/{id}/verify/
```

### Recherche d'avis
```http
GET /api/reviews/reviews/?property_id={uuid}&min_rating=4&verified_only=true
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)
- **Vérification** : Nécessite les permissions staff

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Catégories de Notes Détaillées

Les notes détaillées peuvent être dans les catégories suivantes :
- **cleanliness** - Propreté
- **service** - Service
- **location** - Emplacement
- **value** - Rapport qualité/prix
- **comfort** - Confort
- **facilities** - Équipements
- **food** - Nourriture
- **entertainment** - Divertissement

## 🚀 Installation

1. Les migrations sont déjà créées dans `reviews/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate reviews --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/reviews/
```

