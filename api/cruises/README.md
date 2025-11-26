# 🚢 API Cruises (Croisières)

Cette application Django gère le domaine fonctionnel **CROISIÈRES** de la plateforme Nomade.

## 📋 Tables Gérées (6 tables)

1. **cruise_lines** - Compagnies de croisières (nom, logo)
2. **cruise_ships** - Navires (nom, capacité, année de construction)
3. **cruise_ports** - Ports d'embarquement/débarquement
4. **cruises** - Croisières (nom, dates, durée, ports, statut)
5. **cruise_cabin_types** - Types de cabines (intérieure, extérieure, suite)
6. **cruise_cabins** - Cabines individuelles (numéro, capacité, prix, disponibilité)

## 🔗 Endpoints API

### Base URL
```
/api/cruises/
```

### Endpoints Disponibles

#### Cruise Lines
- `GET /api/cruises/cruise-lines/` - Liste des compagnies de croisières
- `POST /api/cruises/cruise-lines/` - Créer une compagnie
- `GET /api/cruises/cruise-lines/{id}/` - Détails d'une compagnie
- `PUT/PATCH /api/cruises/cruise-lines/{id}/` - Modifier une compagnie
- `DELETE /api/cruises/cruise-lines/{id}/` - Supprimer une compagnie

#### Cruise Ships
- `GET /api/cruises/ships/` - Liste des navires
- `POST /api/cruises/ships/` - Créer un navire
- `GET /api/cruises/ships/{id}/` - Détails d'un navire
- `PUT/PATCH /api/cruises/ships/{id}/` - Modifier un navire
- `DELETE /api/cruises/ships/{id}/` - Supprimer un navire

#### Cruise Ports
- `GET /api/cruises/ports/` - Liste des ports
- `POST /api/cruises/ports/` - Créer un port
- `GET /api/cruises/ports/{id}/` - Détails d'un port
- `PUT/PATCH /api/cruises/ports/{id}/` - Modifier un port
- `DELETE /api/cruises/ports/{id}/` - Supprimer un port
- `GET /api/cruises/ports/nearby/` - Rechercher des ports proches (latitude, longitude, radius)

#### Cruises
- `GET /api/cruises/cruises/` - Liste des croisières
- `POST /api/cruises/cruises/` - Créer une croisière
- `GET /api/cruises/cruises/{id}/` - Détails d'une croisière
- `PUT/PATCH /api/cruises/cruises/{id}/` - Modifier une croisière
- `DELETE /api/cruises/cruises/{id}/` - Supprimer une croisière
- `GET /api/cruises/cruises/search/` - Recherche avancée de croisières
- `GET /api/cruises/cruises/{id}/cabins/` - Toutes les cabines d'une croisière
- `GET /api/cruises/cruises/{id}/available_cabins/` - Cabines disponibles d'une croisière

#### Cruise Cabin Types
- `GET /api/cruises/cabin-types/` - Liste des types de cabines
- `POST /api/cruises/cabin-types/` - Créer un type
- `GET /api/cruises/cabin-types/{id}/` - Détails d'un type
- `PUT/PATCH /api/cruises/cabin-types/{id}/` - Modifier un type
- `DELETE /api/cruises/cabin-types/{id}/` - Supprimer un type

#### Cruise Cabins
- `GET /api/cruises/cabins/` - Liste des cabines
- `POST /api/cruises/cabins/` - Créer une cabine
- `GET /api/cruises/cabins/{id}/` - Détails d'une cabine
- `PUT/PATCH /api/cruises/cabins/{id}/` - Modifier une cabine
- `DELETE /api/cruises/cabins/{id}/` - Supprimer une cabine

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Ships
- `?cruise_line_id=` - Filtrer par compagnie

### Filtres Spécifiques Ports
- `?city=` - Filtrer par ville
- `?country=` - Filtrer par pays

### Filtres Spécifiques Cruises
- `?cruise_line_id=` - Filtrer par compagnie
- `?ship_id=` - Filtrer par navire
- `?departure_port_id=` - Filtrer par port de départ
- `?arrival_port_id=` - Filtrer par port d'arrivée
- `?departure_city=` - Filtrer par ville de départ
- `?arrival_city=` - Filtrer par ville d'arrivée
- `?status=` - Filtrer par statut (scheduled, cancelled, completed)
- `?date_from=` - Date de début minimale (YYYY-MM-DD)
- `?date_to=` - Date de fin maximale (YYYY-MM-DD)
- `?min_duration=` - Durée minimale en jours
- `?max_duration=` - Durée maximale en jours

### Filtres Spécifiques Cabins
- `?cruise_id=` - Filtrer par croisière
- `?cabin_type_id=` - Filtrer par type de cabine
- `?available=` - Filtrer par disponibilité (true/false)
- `?min_guests=` - Capacité minimale
- `?max_price=` - Prix maximum

## 📝 Exemples d'Utilisation

### Recherche de croisières
```http
GET /api/cruises/cruises/search/?departure_city=Marseille&arrival_city=Barcelone&date_from=2025-06-01&date_to=2025-08-31&min_duration=7&max_duration=14&cabin_type_id={uuid}&min_guests=2&max_price=5000
```

### Recherche avec ports
```http
GET /api/cruises/cruises/search/?departure_port_id={uuid}&arrival_port_id={uuid}&date_from=2025-06-01
```

### Cabines disponibles d'une croisière
```http
GET /api/cruises/cruises/{id}/available_cabins/?cabin_type_id={uuid}&min_guests=2&max_price=3000
```

### Toutes les cabines d'une croisière
```http
GET /api/cruises/cruises/{id}/cabins/?cabin_type_id={uuid}&available=true
```

### Trouver des ports proches
```http
GET /api/cruises/ports/nearby/?latitude=43.2965&longitude=5.3698&radius=50
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🚀 Installation

1. Les migrations sont déjà créées dans `cruises/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate cruises --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/cruises/
```

