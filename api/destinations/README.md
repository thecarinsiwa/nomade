# 🌍 API Destinations (Destinations et Géographie)

Cette application Django gère le domaine fonctionnel **DESTINATIONS ET GÉOGRAPHIE** de la plateforme Nomade.

## 📋 Tables Gérées (4 tables)

1. **countries** - Pays (nom, codes ISO)
2. **regions** - Régions/États (rattachés aux pays)
3. **cities** - Villes (rattachées aux régions/pays, coordonnées GPS)
4. **destinations** - Destinations touristiques (nom, description, image, popularité)

## 🔗 Endpoints API

### Base URL
```
/api/destinations/
```

### Endpoints Disponibles

#### Countries
- `GET /api/destinations/countries/` - Liste des pays
- `POST /api/destinations/countries/` - Créer un pays
- `GET /api/destinations/countries/{id}/` - Détails d'un pays
- `PUT/PATCH /api/destinations/countries/{id}/` - Modifier un pays
- `DELETE /api/destinations/countries/{id}/` - Supprimer un pays

#### Regions
- `GET /api/destinations/regions/` - Liste des régions
- `POST /api/destinations/regions/` - Créer une région
- `GET /api/destinations/regions/{id}/` - Détails d'une région
- `PUT/PATCH /api/destinations/regions/{id}/` - Modifier une région
- `DELETE /api/destinations/regions/{id}/` - Supprimer une région

#### Cities
- `GET /api/destinations/cities/` - Liste des villes
- `POST /api/destinations/cities/` - Créer une ville
- `GET /api/destinations/cities/{id}/` - Détails d'une ville
- `PUT/PATCH /api/destinations/cities/{id}/` - Modifier une ville
- `DELETE /api/destinations/cities/{id}/` - Supprimer une ville
- `GET /api/destinations/cities/nearby/` - Villes proches d'un point GPS

#### Destinations
- `GET /api/destinations/destinations/` - Liste des destinations
- `POST /api/destinations/destinations/` - Créer une destination
- `GET /api/destinations/destinations/{id}/` - Détails d'une destination
- `PUT/PATCH /api/destinations/destinations/{id}/` - Modifier une destination
- `DELETE /api/destinations/destinations/{id}/` - Supprimer une destination
- `GET /api/destinations/destinations/popular/` - Destinations populaires

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Regions
- `?country_id=` - Filtrer par pays

### Filtres Spécifiques Cities
- `?country_id=` - Filtrer par pays
- `?region_id=` - Filtrer par région
- `?has_coordinates=` - Filtrer uniquement les villes avec coordonnées GPS (true/false)
- `?latitude=` - Filtrer par latitude (avec longitude et radius)
- `?longitude=` - Filtrer par longitude (avec latitude et radius)
- `?radius=` - Rayon de recherche en km (avec latitude et longitude)

### Filtres Spécifiques Destinations
- `?city_id=` - Filtrer par ville
- `?country_id=` - Filtrer par pays
- `?popular_only=` - Filtrer uniquement les destinations populaires (true/false)

## 📝 Exemples d'Utilisation

### Villes proches d'un point GPS
```http
GET /api/destinations/cities/nearby/?latitude=48.8566&longitude=2.3522&radius=50
```

Réponse inclut :
- Liste des villes avec distance en km
- Triées par distance croissante

### Destinations populaires
```http
GET /api/destinations/destinations/popular/
```

### Recherche de villes par pays
```http
GET /api/destinations/cities/?country_id={uuid}&has_coordinates=true
```

### Recherche de destinations par ville
```http
GET /api/destinations/destinations/?city_id={uuid}&popular_only=true
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Fonctionnalités Spéciales

- **Hiérarchie géographique** : Pays → Régions → Villes → Destinations
- **Géolocalisation** : Recherche de villes par coordonnées GPS avec calcul de distance
- **Propriété `has_coordinates`** : Vérifie si une ville a des coordonnées GPS
- **Propriété `location_info`** : Retourne les informations de localisation complètes d'une destination
- **Recherche par proximité** : Endpoint `/cities/nearby/` pour trouver les villes dans un rayon donné
- **Destinations populaires** : Endpoint dédié pour les destinations mises en avant

## 🚀 Installation

1. Les migrations sont déjà créées dans `destinations/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate destinations --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/destinations/
```

