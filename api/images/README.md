# 🖼️ API Images

Cette application Django gère le domaine fonctionnel **IMAGES** de la plateforme Nomade.

## 📋 Tables Gérées (15 tables)

1. **room_images** - Images des chambres
2. **destination_images** - Images des destinations touristiques
3. **activity_images** - Images des activités
4. **airline_images** - Images des compagnies aériennes
5. **flight_images** - Images des vols
6. **car_images** - Images des voitures de location
7. **cruise_ship_images** - Images des navires de croisière
8. **cruise_cabin_images** - Images des cabines de croisière
9. **cruise_images** - Images des croisières
10. **user_images** - Images des utilisateurs (avatars, photos de profil)
11. **promotion_images** - Images des promotions (bannières, etc.)
12. **package_images** - Images des packages
13. **airport_images** - Images des aéroports
14. **generic_images** - Images génériques (logos, icônes, etc.)
15. **image_metadata** - Métadonnées techniques des images

## 🔗 Endpoints API

### Base URL
```
/api/images/
```

### Endpoints Disponibles

#### Room Images
- `GET /api/images/room-images/` - Liste des images de chambres
- `POST /api/images/room-images/` - Créer une image de chambre
- `GET /api/images/room-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/room-images/{id}/` - Modifier une image
- `DELETE /api/images/room-images/{id}/` - Supprimer une image

**Filtres:**
- `?room_id=` - Filtrer par chambre
- `?image_type=` - Filtrer par type d'image (main, gallery, bathroom, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Destination Images
- `GET /api/images/destination-images/` - Liste des images de destinations
- `POST /api/images/destination-images/` - Créer une image de destination
- `GET /api/images/destination-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/destination-images/{id}/` - Modifier une image
- `DELETE /api/images/destination-images/{id}/` - Supprimer une image

**Filtres:**
- `?destination_id=` - Filtrer par destination
- `?image_type=` - Filtrer par type d'image (main, gallery, landmark, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Activity Images
- `GET /api/images/activity-images/` - Liste des images d'activités
- `POST /api/images/activity-images/` - Créer une image d'activité
- `GET /api/images/activity-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/activity-images/{id}/` - Modifier une image
- `DELETE /api/images/activity-images/{id}/` - Supprimer une image

**Filtres:**
- `?activity_id=` - Filtrer par activité
- `?image_type=` - Filtrer par type d'image (main, gallery, experience, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Airline Images
- `GET /api/images/airline-images/` - Liste des images de compagnies aériennes
- `POST /api/images/airline-images/` - Créer une image de compagnie
- `GET /api/images/airline-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/airline-images/{id}/` - Modifier une image
- `DELETE /api/images/airline-images/{id}/` - Supprimer une image

**Filtres:**
- `?airline_id=` - Filtrer par compagnie aérienne
- `?image_type=` - Filtrer par type d'image (logo, aircraft, cabin, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Flight Images
- `GET /api/images/flight-images/` - Liste des images de vols
- `POST /api/images/flight-images/` - Créer une image de vol
- `GET /api/images/flight-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/flight-images/{id}/` - Modifier une image
- `DELETE /api/images/flight-images/{id}/` - Supprimer une image

**Filtres:**
- `?flight_id=` - Filtrer par vol
- `?image_type=` - Filtrer par type d'image (aircraft, cabin_economy, etc.)

#### Car Images
- `GET /api/images/car-images/` - Liste des images de voitures
- `POST /api/images/car-images/` - Créer une image de voiture
- `GET /api/images/car-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/car-images/{id}/` - Modifier une image
- `DELETE /api/images/car-images/{id}/` - Supprimer une image

**Filtres:**
- `?car_id=` - Filtrer par voiture
- `?image_type=` - Filtrer par type d'image (main, exterior, interior, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Cruise Ship Images
- `GET /api/images/cruise-ship-images/` - Liste des images de navires
- `POST /api/images/cruise-ship-images/` - Créer une image de navire
- `GET /api/images/cruise-ship-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/cruise-ship-images/{id}/` - Modifier une image
- `DELETE /api/images/cruise-ship-images/{id}/` - Supprimer une image

**Filtres:**
- `?cruise_ship_id=` - Filtrer par navire
- `?image_type=` - Filtrer par type d'image (main, exterior, deck, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Cruise Cabin Images
- `GET /api/images/cruise-cabin-images/` - Liste des images de cabines
- `POST /api/images/cruise-cabin-images/` - Créer une image de cabine
- `GET /api/images/cruise-cabin-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/cruise-cabin-images/{id}/` - Modifier une image
- `DELETE /api/images/cruise-cabin-images/{id}/` - Supprimer une image

**Filtres:**
- `?cruise_cabin_id=` - Filtrer par cabine
- `?image_type=` - Filtrer par type d'image (main, interior, bathroom, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Cruise Images
- `GET /api/images/cruise-images/` - Liste des images de croisières
- `POST /api/images/cruise-images/` - Créer une image de croisière
- `GET /api/images/cruise-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/cruise-images/{id}/` - Modifier une image
- `DELETE /api/images/cruise-images/{id}/` - Supprimer une image

**Filtres:**
- `?cruise_id=` - Filtrer par croisière
- `?image_type=` - Filtrer par type d'image (main, itinerary, destination, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### User Images
- `GET /api/images/user-images/` - Liste des images d'utilisateurs
- `POST /api/images/user-images/` - Créer une image d'utilisateur
- `GET /api/images/user-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/user-images/{id}/` - Modifier une image
- `DELETE /api/images/user-images/{id}/` - Supprimer une image

**Filtres:**
- `?user_id=` - Filtrer par utilisateur
- `?image_type=` - Filtrer par type d'image (avatar, profile, verification, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)
- `?is_verified=` - Filtrer par images vérifiées (true/false)

#### Promotion Images
- `GET /api/images/promotion-images/` - Liste des images de promotions
- `POST /api/images/promotion-images/` - Créer une image de promotion
- `GET /api/images/promotion-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/promotion-images/{id}/` - Modifier une image
- `DELETE /api/images/promotion-images/{id}/` - Supprimer une image
- `GET /api/images/promotion-images/active/` - Images promotionnelles actives

**Filtres:**
- `?promotion_id=` - Filtrer par promotion
- `?image_type=` - Filtrer par type d'image (banner, thumbnail, hero, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)
- `?is_active=` - Filtrer par images actives (true/false)

#### Package Images
- `GET /api/images/package-images/` - Liste des images de packages
- `POST /api/images/package-images/` - Créer une image de package
- `GET /api/images/package-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/package-images/{id}/` - Modifier une image
- `DELETE /api/images/package-images/{id}/` - Supprimer une image

**Filtres:**
- `?package_id=` - Filtrer par package
- `?image_type=` - Filtrer par type d'image (main, gallery, itinerary, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Airport Images
- `GET /api/images/airport-images/` - Liste des images d'aéroports
- `POST /api/images/airport-images/` - Créer une image d'aéroport
- `GET /api/images/airport-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/airport-images/{id}/` - Modifier une image
- `DELETE /api/images/airport-images/{id}/` - Supprimer une image

**Filtres:**
- `?airport_id=` - Filtrer par aéroport
- `?image_type=` - Filtrer par type d'image (main, terminal, gate, etc.)
- `?is_primary=` - Filtrer par image principale (true/false)

#### Generic Images
- `GET /api/images/generic-images/` - Liste des images génériques
- `POST /api/images/generic-images/` - Créer une image générique
- `GET /api/images/generic-images/{id}/` - Détails d'une image
- `PUT/PATCH /api/images/generic-images/{id}/` - Modifier une image
- `DELETE /api/images/generic-images/{id}/` - Supprimer une image

**Filtres:**
- `?image_type=` - Filtrer par type d'image (logo, icon, background, etc.)
- `?category=` - Filtrer par catégorie
- `?is_active=` - Filtrer par images actives (true/false)
- `?search=` - Recherche textuelle (display_name, category, alt_text)

#### Image Metadata
- `GET /api/images/image-metadata/` - Liste des métadonnées d'images
- `POST /api/images/image-metadata/` - Créer des métadonnées
- `GET /api/images/image-metadata/{id}/` - Détails des métadonnées
- `PUT/PATCH /api/images/image-metadata/{id}/` - Modifier les métadonnées
- `DELETE /api/images/image-metadata/{id}/` - Supprimer les métadonnées

**Filtres:**
- `?entity_type=` - Filtrer par type d'entité
- `?entity_id=` - Filtrer par ID d'entité
- `?format=` - Filtrer par format (JPEG, PNG, WEBP, etc.)
- `?is_optimized=` - Filtrer par images optimisées (true/false)
- `?search=` - Recherche textuelle (image_url, entity_type, entity_id)

## 🔍 Filtres et Recherche

### Filtres Communs
- `?ordering=` - Tri (ex: `?ordering=-display_order`, `?ordering=created_at`)
- `?page=` - Pagination

### Actions Personnalisées

#### Promotion Images - Images Actives
```
GET /api/images/promotion-images/active/
```
Retourne les images promotionnelles actives (is_active=True et dans la période de validité).

## 📝 Exemples d'Utilisation

### Créer une image de chambre
```json
POST /api/images/room-images/
{
  "room": "uuid-de-la-chambre",
  "image_url": "https://example.com/image.jpg",
  "image_type": "main",
  "display_order": 0,
  "alt_text": "Chambre principale",
  "is_primary": true,
  "width": 1920,
  "height": 1080,
  "file_size": 245678
}
```

### Récupérer les images principales d'une destination
```
GET /api/images/destination-images/?destination_id=uuid&is_primary=true
```

### Récupérer les images actives d'une promotion
```
GET /api/images/promotion-images/active/
```

### Récupérer les métadonnées d'une image
```
GET /api/images/image-metadata/?image_url=https://example.com/image.jpg
```

## 🔗 Relations

Les images sont liées aux entités suivantes :
- **Room Images** → `accommodations.Room`
- **Destination Images** → `destinations.Destination`
- **Activity Images** → `tour_activities.Activity`
- **Airline Images** → `flights.Airline`
- **Flight Images** → `flights.Flight`
- **Car Images** → `car_rentals.Car`
- **Cruise Ship Images** → `cruises.CruiseShip`
- **Cruise Cabin Images** → `cruises.CruiseCabin`
- **Cruise Images** → `cruises.Cruise`
- **User Images** → `users.User`
- **Promotion Images** → `promotions.Promotion`
- **Package Images** → `packages.Package`
- **Airport Images** → `flights.Airport`
- **Generic Images** → Aucune relation (images génériques)
- **Image Metadata** → Relation flexible via `entity_type` et `entity_id`

## 📌 Notes Importantes

1. **Stockage des images**: Les images sont stockées via URL (pas de stockage BLOB dans la BDD)
2. **Image principale**: Chaque entité peut avoir une image principale (`is_primary=True`)
3. **Ordre d'affichage**: Utilisez `display_order` pour contrôler l'ordre d'affichage
4. **Métadonnées**: Utilisez `image_metadata` pour stocker les informations techniques des images
5. **Cascade**: Les images sont supprimées automatiquement si l'entité associée est supprimée (ON DELETE CASCADE)

