# 🚗 API Car Rentals (Locations de Voitures)

Cette application Django gère le domaine fonctionnel **LOCATIONS DE VOITURES** de la plateforme Nomade.

## 📋 Tables Gérées (5 tables)

1. **car_rental_companies** - Agences de location (nom, code, logo)
2. **car_rental_locations** - Points de location (aéroports, villes, gares)
3. **car_categories** - Catégories de voitures (compacte, SUV, berline, etc.)
4. **cars** - Véhicules (marque, modèle, année, transmission, carburant)
5. **car_availability** - Disponibilités par période (dates, prix/jour)

## 🔗 Endpoints API

### Base URL
```
/api/car-rentals/
```

### Endpoints Disponibles

#### Car Rental Companies
- `GET /api/car-rentals/companies/` - Liste des agences de location
- `POST /api/car-rentals/companies/` - Créer une agence
- `GET /api/car-rentals/companies/{id}/` - Détails d'une agence
- `PUT/PATCH /api/car-rentals/companies/{id}/` - Modifier une agence
- `DELETE /api/car-rentals/companies/{id}/` - Supprimer une agence

#### Car Rental Locations
- `GET /api/car-rentals/locations/` - Liste des points de location
- `POST /api/car-rentals/locations/` - Créer un point de location
- `GET /api/car-rentals/locations/{id}/` - Détails d'un point
- `PUT/PATCH /api/car-rentals/locations/{id}/` - Modifier un point
- `DELETE /api/car-rentals/locations/{id}/` - Supprimer un point
- `GET /api/car-rentals/locations/nearby/` - Rechercher des points proches (latitude, longitude, radius)

#### Car Categories
- `GET /api/car-rentals/categories/` - Liste des catégories
- `POST /api/car-rentals/categories/` - Créer une catégorie
- `GET /api/car-rentals/categories/{id}/` - Détails d'une catégorie
- `PUT/PATCH /api/car-rentals/categories/{id}/` - Modifier une catégorie
- `DELETE /api/car-rentals/categories/{id}/` - Supprimer une catégorie

#### Cars
- `GET /api/car-rentals/cars/` - Liste des voitures
- `POST /api/car-rentals/cars/` - Créer une voiture
- `GET /api/car-rentals/cars/{id}/` - Détails d'une voiture
- `PUT/PATCH /api/car-rentals/cars/{id}/` - Modifier une voiture
- `DELETE /api/car-rentals/cars/{id}/` - Supprimer une voiture
- `GET /api/car-rentals/cars/search/` - Recherche avancée de voitures
- `GET /api/car-rentals/cars/{id}/availability/` - Disponibilités d'une voiture

#### Car Availability
- `GET /api/car-rentals/availability/` - Liste des disponibilités
- `POST /api/car-rentals/availability/` - Créer une disponibilité
- `GET /api/car-rentals/availability/{id}/` - Détails d'une disponibilité
- `PUT/PATCH /api/car-rentals/availability/{id}/` - Modifier une disponibilité
- `DELETE /api/car-rentals/availability/{id}/` - Supprimer une disponibilité
- `GET /api/car-rentals/availability/check_availability/` - Vérifier la disponibilité (car_id, location_id, pickup_date, return_date)

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Locations
- `?company_id=` - Filtrer par agence
- `?city=` - Filtrer par ville
- `?country=` - Filtrer par pays
- `?location_type=` - Filtrer par type (airport, city, station, other)

### Filtres Spécifiques Cars
- `?company_id=` - Filtrer par agence
- `?category_id=` - Filtrer par catégorie
- `?make=` - Filtrer par marque
- `?model=` - Filtrer par modèle
- `?transmission=` - Filtrer par transmission (manual, automatic)
- `?fuel_type=` - Filtrer par carburant (petrol, diesel, electric, hybrid)
- `?status=` - Filtrer par statut (available, rented, maintenance)
- `?min_seats=` - Nombre minimum de places
- `?min_year=` - Année minimale
- `?max_year=` - Année maximale

### Filtres Spécifiques Car Availability
- `?car_id=` - Filtrer par voiture
- `?location_id=` - Filtrer par point de location
- `?date_from=` - Date de début (YYYY-MM-DD)
- `?date_to=` - Date de fin (YYYY-MM-DD)
- `?available=` - Filtrer par disponibilité (true/false)
- `?max_price=` - Prix maximum par jour

## 📝 Exemples d'Utilisation

### Recherche de voitures
```http
GET /api/car-rentals/cars/search/?pickup_location_id={uuid}&return_location_id={uuid}&pickup_date=2025-06-01&return_date=2025-06-05&category_id={uuid}&min_seats=5&max_price_per_day=100
```

### Recherche avec villes
```http
GET /api/car-rentals/cars/search/?pickup_city=Paris&return_city=Paris&pickup_date=2025-06-01&return_date=2025-06-05
```

### Vérifier la disponibilité
```http
GET /api/car-rentals/availability/check_availability/?car_id={uuid}&location_id={uuid}&pickup_date=2025-06-01&return_date=2025-06-05
```

### Disponibilités d'une voiture
```http
GET /api/car-rentals/cars/{id}/availability/?location_id={uuid}&date_from=2025-06-01&date_to=2025-06-30
```

### Trouver des points de location proches
```http
GET /api/car-rentals/locations/nearby/?latitude=48.8566&longitude=2.3522&radius=10
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🚀 Installation

1. Les migrations sont déjà créées dans `car_rentals/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate car_rentals --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/car-rentals/
```

