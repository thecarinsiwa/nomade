# ✈️ API Flights (Vols)

Cette application Django gère le domaine fonctionnel **VOLS** de la plateforme Nomade.

## 📋 Tables Gérées (5 tables)

1. **airlines** - Compagnies aériennes (code, nom, logo, pays)
2. **airports** - Aéroports (codes IATA/ICAO, coordonnées, timezone)
3. **flight_classes** - Classes de vol (économique, business, première classe)
4. **flights** - Vols (numéro, aéroports départ/arrivée, durée, statut)
5. **flight_availability** - Disponibilités par date/classe (sièges disponibles, prix)

## 🔗 Endpoints API

### Base URL
```
/api/flights/
```

### Endpoints Disponibles

#### Airlines
- `GET /api/flights/airlines/` - Liste des compagnies aériennes
- `POST /api/flights/airlines/` - Créer une compagnie
- `GET /api/flights/airlines/{id}/` - Détails d'une compagnie
- `PUT/PATCH /api/flights/airlines/{id}/` - Modifier une compagnie
- `DELETE /api/flights/airlines/{id}/` - Supprimer une compagnie

#### Airports
- `GET /api/flights/airports/` - Liste des aéroports
- `POST /api/flights/airports/` - Créer un aéroport
- `GET /api/flights/airports/{id}/` - Détails d'un aéroport
- `PUT/PATCH /api/flights/airports/{id}/` - Modifier un aéroport
- `DELETE /api/flights/airports/{id}/` - Supprimer un aéroport
- `GET /api/flights/airports/nearby/` - Rechercher des aéroports proches (latitude, longitude, radius)

#### Flight Classes
- `GET /api/flights/flight-classes/` - Liste des classes de vol
- `POST /api/flights/flight-classes/` - Créer une classe
- `GET /api/flights/flight-classes/{id}/` - Détails d'une classe
- `PUT/PATCH /api/flights/flight-classes/{id}/` - Modifier une classe
- `DELETE /api/flights/flight-classes/{id}/` - Supprimer une classe

#### Flights
- `GET /api/flights/flights/` - Liste des vols
- `POST /api/flights/flights/` - Créer un vol
- `GET /api/flights/flights/{id}/` - Détails d'un vol
- `PUT/PATCH /api/flights/flights/{id}/` - Modifier un vol
- `DELETE /api/flights/flights/{id}/` - Supprimer un vol
- `GET /api/flights/flights/search/` - Recherche avancée de vols
- `GET /api/flights/flights/{id}/availability/` - Disponibilités d'un vol
- `GET /api/flights/flights/{id}/prices/` - Prix d'un vol par classe pour une date

#### Flight Availability
- `GET /api/flights/flight-availability/` - Liste des disponibilités
- `POST /api/flights/flight-availability/` - Créer une disponibilité
- `GET /api/flights/flight-availability/{id}/` - Détails d'une disponibilité
- `PUT/PATCH /api/flights/flight-availability/{id}/` - Modifier une disponibilité
- `DELETE /api/flights/flight-availability/{id}/` - Supprimer une disponibilité

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Airports
- `?city=` - Filtrer par ville
- `?country=` - Filtrer par pays
- `?iata_code=` - Filtrer par code IATA

### Filtres Spécifiques Flights
- `?airline_id=` - Filtrer par compagnie
- `?departure_airport_id=` - Filtrer par aéroport de départ
- `?arrival_airport_id=` - Filtrer par aéroport d'arrivée
- `?departure_iata=` - Filtrer par code IATA de départ
- `?arrival_iata=` - Filtrer par code IATA d'arrivée
- `?status=` - Filtrer par statut (scheduled, delayed, cancelled, completed)
- `?flight_number=` - Filtrer par numéro de vol

### Filtres Spécifiques Flight Availability
- `?flight_id=` - Filtrer par vol
- `?flight_class_id=` - Filtrer par classe
- `?date_from=` - Date de début (YYYY-MM-DD)
- `?date_to=` - Date de fin (YYYY-MM-DD)
- `?min_seats=` - Nombre minimum de sièges disponibles
- `?max_price=` - Prix maximum

## 📝 Exemples d'Utilisation

### Recherche de vols
```http
GET /api/flights/flights/search/?departure_iata=CDG&arrival_iata=JFK&date=2025-06-01&min_seats=2&max_price=1000
```

### Recherche avec villes
```http
GET /api/flights/flights/search/?departure_city=Paris&arrival_city=New York&date=2025-06-01
```

### Disponibilités d'un vol
```http
GET /api/flights/flights/{id}/availability/?date_from=2025-06-01&date_to=2025-06-30&flight_class_id={uuid}
```

### Prix d'un vol pour une date
```http
GET /api/flights/flights/{id}/prices/?date=2025-06-01
```

### Trouver des aéroports proches
```http
GET /api/flights/airports/nearby/?latitude=48.8566&longitude=2.3522&radius=50
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🚀 Installation

1. Les migrations sont déjà créées dans `flights/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate flights --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/flights/
```

