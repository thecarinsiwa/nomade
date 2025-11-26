# 🏨 API Accommodations (Hébergements)

Cette application Django gère le domaine fonctionnel **HÉBERGEMENTS (HOTELS & VACATION RENTALS)** de la plateforme Nomade.

## 📋 Tables Gérées (14 tables)

1. **property_types** - Types de propriétés (hôtel, appartement, villa, etc.)
2. **property_categories** - Catégories (luxe, économique, milieu de gamme)
3. **property_addresses** - Adresses avec coordonnées GPS
4. **properties** - Propriétés principales (nom, note, statut, horaires check-in/out)
5. **property_amenities** - Équipements disponibles (piscine, WiFi, spa, etc.)
6. **property_amenities_link** - Table de liaison propriétés ↔ équipements
7. **property_images** - Photos et images des propriétés
8. **property_descriptions** - Descriptions multilingues
9. **room_types** - Types de chambres (standard, deluxe, suite)
10. **rooms** - Chambres individuelles (capacité, taille, type de lit)
11. **room_amenities** - Équipements des chambres (TV, minibar, balcon)
12. **room_amenities_link** - Table de liaison chambres ↔ équipements
13. **room_availability** - Disponibilités par date (disponible/indisponible, prix)
14. **room_pricing** - Tarifs par saison (basse, moyenne, haute, pic)

## 🔗 Endpoints API

### Base URL
```
/api/accommodations/
```

### Endpoints Disponibles

#### Property Types
- `GET /api/accommodations/property-types/` - Liste des types de propriétés
- `POST /api/accommodations/property-types/` - Créer un type de propriété
- `GET /api/accommodations/property-types/{id}/` - Détails d'un type
- `PUT/PATCH /api/accommodations/property-types/{id}/` - Modifier un type
- `DELETE /api/accommodations/property-types/{id}/` - Supprimer un type

#### Property Categories
- `GET /api/accommodations/property-categories/` - Liste des catégories
- `POST /api/accommodations/property-categories/` - Créer une catégorie
- `GET /api/accommodations/property-categories/{id}/` - Détails d'une catégorie
- `PUT/PATCH /api/accommodations/property-categories/{id}/` - Modifier une catégorie
- `DELETE /api/accommodations/property-categories/{id}/` - Supprimer une catégorie

#### Property Addresses
- `GET /api/accommodations/property-addresses/` - Liste des adresses
- `POST /api/accommodations/property-addresses/` - Créer une adresse
- `GET /api/accommodations/property-addresses/{id}/` - Détails d'une adresse
- `GET /api/accommodations/property-addresses/nearby/` - Rechercher des adresses proches (requiert latitude, longitude, radius)

#### Properties
- `GET /api/accommodations/properties/` - Liste des propriétés
- `POST /api/accommodations/properties/` - Créer une propriété
- `GET /api/accommodations/properties/{id}/` - Détails d'une propriété
- `PUT/PATCH /api/accommodations/properties/{id}/` - Modifier une propriété
- `DELETE /api/accommodations/properties/{id}/` - Supprimer une propriété
- `GET /api/accommodations/properties/search/` - Recherche avancée (check_in, check_out, guests, city, country, min_rating)
- `GET /api/accommodations/properties/{id}/rooms/` - Chambres d'une propriété
- `GET /api/accommodations/properties/{id}/availability/` - Disponibilités d'une propriété

#### Property Amenities
- `GET /api/accommodations/property-amenities/` - Liste des équipements
- `POST /api/accommodations/property-amenities/` - Créer un équipement
- `GET /api/accommodations/property-amenities/{id}/` - Détails d'un équipement
- `PUT/PATCH /api/accommodations/property-amenities/{id}/` - Modifier un équipement
- `DELETE /api/accommodations/property-amenities/{id}/` - Supprimer un équipement

#### Property Amenity Links
- `GET /api/accommodations/property-amenity-links/` - Liste des liens
- `POST /api/accommodations/property-amenity-links/` - Créer un lien
- `GET /api/accommodations/property-amenity-links/{id}/` - Détails d'un lien
- `DELETE /api/accommodations/property-amenity-links/{id}/` - Supprimer un lien

#### Property Images
- `GET /api/accommodations/property-images/` - Liste des images
- `POST /api/accommodations/property-images/` - Créer une image
- `GET /api/accommodations/property-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/accommodations/property-images/{id}/` - Modifier une image
- `DELETE /api/accommodations/property-images/{id}/` - Supprimer une image

#### Property Descriptions
- `GET /api/accommodations/property-descriptions/` - Liste des descriptions
- `POST /api/accommodations/property-descriptions/` - Créer une description
- `GET /api/accommodations/property-descriptions/{id}/` - Détails d'une description
- `PUT/PATCH /api/accommodations/property-descriptions/{id}/` - Modifier une description
- `DELETE /api/accommodations/property-descriptions/{id}/` - Supprimer une description

#### Room Types
- `GET /api/accommodations/room-types/` - Liste des types de chambres
- `POST /api/accommodations/room-types/` - Créer un type de chambre
- `GET /api/accommodations/room-types/{id}/` - Détails d'un type
- `PUT/PATCH /api/accommodations/room-types/{id}/` - Modifier un type
- `DELETE /api/accommodations/room-types/{id}/` - Supprimer un type

#### Rooms
- `GET /api/accommodations/rooms/` - Liste des chambres
- `POST /api/accommodations/rooms/` - Créer une chambre
- `GET /api/accommodations/rooms/{id}/` - Détails d'une chambre
- `PUT/PATCH /api/accommodations/rooms/{id}/` - Modifier une chambre
- `DELETE /api/accommodations/rooms/{id}/` - Supprimer une chambre

#### Room Amenities
- `GET /api/accommodations/room-amenities/` - Liste des équipements de chambres
- `POST /api/accommodations/room-amenities/` - Créer un équipement
- `GET /api/accommodations/room-amenities/{id}/` - Détails d'un équipement
- `PUT/PATCH /api/accommodations/room-amenities/{id}/` - Modifier un équipement
- `DELETE /api/accommodations/room-amenities/{id}/` - Supprimer un équipement

#### Room Amenity Links
- `GET /api/accommodations/room-amenity-links/` - Liste des liens
- `POST /api/accommodations/room-amenity-links/` - Créer un lien
- `GET /api/accommodations/room-amenity-links/{id}/` - Détails d'un lien
- `DELETE /api/accommodations/room-amenity-links/{id}/` - Supprimer un lien

#### Room Availability
- `GET /api/accommodations/room-availability/` - Liste des disponibilités
- `POST /api/accommodations/room-availability/` - Créer une disponibilité
- `GET /api/accommodations/room-availability/{id}/` - Détails d'une disponibilité
- `PUT/PATCH /api/accommodations/room-availability/{id}/` - Modifier une disponibilité
- `DELETE /api/accommodations/room-availability/{id}/` - Supprimer une disponibilité
- `GET /api/accommodations/room-availability/check_availability/` - Vérifier la disponibilité (room_id, check_in, check_out)

#### Room Pricing
- `GET /api/accommodations/room-pricing/` - Liste des tarifs
- `POST /api/accommodations/room-pricing/` - Créer un tarif
- `GET /api/accommodations/room-pricing/{id}/` - Détails d'un tarif
- `PUT/PATCH /api/accommodations/room-pricing/{id}/` - Modifier un tarif
- `DELETE /api/accommodations/room-pricing/{id}/` - Supprimer un tarif

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-rating` pour trier par note décroissante)
- `?page=` - Pagination

### Filtres Spécifiques Properties
- `?property_type_id=` - Filtrer par type de propriété
- `?property_category_id=` - Filtrer par catégorie
- `?city=` - Filtrer par ville
- `?country=` - Filtrer par pays
- `?status=` - Filtrer par statut (active, inactive, pending, suspended)
- `?min_rating=` - Note minimale
- `?amenity_id=` - Filtrer par équipement

### Filtres Spécifiques Rooms
- `?property_id=` - Filtrer par propriété
- `?room_type_id=` - Filtrer par type de chambre
- `?status=` - Filtrer par statut (available, unavailable, maintenance)
- `?min_guests=` - Capacité minimale

### Filtres Spécifiques Room Availability
- `?room_id=` - Filtrer par chambre
- `?date_from=` - Date de début (YYYY-MM-DD)
- `?date_to=` - Date de fin (YYYY-MM-DD)
- `?available=` - Filtrer par disponibilité (true/false)

## 📝 Exemples d'Utilisation

### Recherche de propriétés disponibles
```http
GET /api/accommodations/properties/search/?check_in=2025-06-01&check_out=2025-06-05&guests=2&city=Paris&min_rating=4.0
```

### Vérifier la disponibilité d'une chambre
```http
GET /api/accommodations/room-availability/check_availability/?room_id={uuid}&check_in=2025-06-01&check_out=2025-06-05
```

### Trouver des adresses proches
```http
GET /api/accommodations/property-addresses/nearby/?latitude=48.8566&longitude=2.3522&radius=5
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🚀 Installation

1. Les migrations sont déjà créées dans `accommodations/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate accommodations
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/accommodations/
```

