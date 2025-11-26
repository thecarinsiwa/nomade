# 📋 API Bookings (Réservations)

Cette application Django gère le domaine fonctionnel **RÉSERVATIONS** de la plateforme Nomade.

## 📋 Tables Gérées (9 tables)

1. **booking_statuses** - Statuts (confirmé, en attente, annulé, complété)
2. **bookings** - Réservations principales (référence unique, montant total, statut)
3. **booking_items** - Éléments d'une réservation (hôtel, vol, voiture, etc.)
4. **booking_guests** - Informations des voyageurs (nom, email, passeport)
5. **booking_rooms** - Détails des chambres réservées (dates check-in/out, nombre de personnes)
6. **booking_flights** - Détails des vols réservés (date, classe, passagers)
7. **booking_cars** - Détails des voitures réservées (dates, lieux de prise/retour)
8. **booking_activities** - Détails des activités réservées (date, participants)
9. **booking_cruises** - Détails des croisières réservées (cabine, passagers)

## 🔗 Endpoints API

### Base URL
```
/api/bookings/
```

### Endpoints Disponibles

#### Booking Statuses
- `GET /api/bookings/statuses/` - Liste des statuts
- `POST /api/bookings/statuses/` - Créer un statut
- `GET /api/bookings/statuses/{id}/` - Détails d'un statut
- `PUT/PATCH /api/bookings/statuses/{id}/` - Modifier un statut
- `DELETE /api/bookings/statuses/{id}/` - Supprimer un statut

#### Bookings
- `GET /api/bookings/bookings/` - Liste des réservations (uniquement les vôtres si non-staff)
- `POST /api/bookings/bookings/` - Créer une réservation
- `GET /api/bookings/bookings/{id}/` - Détails d'une réservation
- `PUT/PATCH /api/bookings/bookings/{id}/` - Modifier une réservation
- `DELETE /api/bookings/bookings/{id}/` - Supprimer une réservation
- `GET /api/bookings/bookings/my_bookings/` - Mes réservations
- `GET /api/bookings/bookings/{id}/details/` - Tous les détails d'une réservation

#### Booking Items
- `GET /api/bookings/items/` - Liste des éléments de réservation
- `POST /api/bookings/items/` - Créer un élément
- `GET /api/bookings/items/{id}/` - Détails d'un élément
- `PUT/PATCH /api/bookings/items/{id}/` - Modifier un élément
- `DELETE /api/bookings/items/{id}/` - Supprimer un élément

#### Booking Guests
- `GET /api/bookings/guests/` - Liste des voyageurs
- `POST /api/bookings/guests/` - Créer un voyageur
- `GET /api/bookings/guests/{id}/` - Détails d'un voyageur
- `PUT/PATCH /api/bookings/guests/{id}/` - Modifier un voyageur
- `DELETE /api/bookings/guests/{id}/` - Supprimer un voyageur

#### Booking Rooms
- `GET /api/bookings/rooms/` - Liste des réservations de chambres
- `POST /api/bookings/rooms/` - Créer une réservation de chambre
- `GET /api/bookings/rooms/{id}/` - Détails d'une réservation de chambre
- `PUT/PATCH /api/bookings/rooms/{id}/` - Modifier une réservation de chambre
- `DELETE /api/bookings/rooms/{id}/` - Supprimer une réservation de chambre

#### Booking Flights
- `GET /api/bookings/flights/` - Liste des réservations de vols
- `POST /api/bookings/flights/` - Créer une réservation de vol
- `GET /api/bookings/flights/{id}/` - Détails d'une réservation de vol
- `PUT/PATCH /api/bookings/flights/{id}/` - Modifier une réservation de vol
- `DELETE /api/bookings/flights/{id}/` - Supprimer une réservation de vol

#### Booking Cars
- `GET /api/bookings/cars/` - Liste des réservations de voitures
- `POST /api/bookings/cars/` - Créer une réservation de voiture
- `GET /api/bookings/cars/{id}/` - Détails d'une réservation de voiture
- `PUT/PATCH /api/bookings/cars/{id}/` - Modifier une réservation de voiture
- `DELETE /api/bookings/cars/{id}/` - Supprimer une réservation de voiture

#### Booking Activities
- `GET /api/bookings/activities/` - Liste des réservations d'activités
- `POST /api/bookings/activities/` - Créer une réservation d'activité
- `GET /api/bookings/activities/{id}/` - Détails d'une réservation d'activité
- `PUT/PATCH /api/bookings/activities/{id}/` - Modifier une réservation d'activité
- `DELETE /api/bookings/activities/{id}/` - Supprimer une réservation d'activité

#### Booking Cruises
- `GET /api/bookings/cruises/` - Liste des réservations de croisières
- `POST /api/bookings/cruises/` - Créer une réservation de croisière
- `GET /api/bookings/cruises/{id}/` - Détails d'une réservation de croisière
- `PUT/PATCH /api/bookings/cruises/{id}/` - Modifier une réservation de croisière
- `DELETE /api/bookings/cruises/{id}/` - Supprimer une réservation de croisière

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Bookings
- `?status_id=` - Filtrer par statut
- `?booking_reference=` - Filtrer par référence
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale
- `?min_amount=` - Montant minimum
- `?max_amount=` - Montant maximum

### Filtres Spécifiques Booking Items
- `?booking_id=` - Filtrer par réservation
- `?item_type=` - Filtrer par type (hotel, flight, car, activity, cruise, package)

### Filtres Spécifiques Booking Guests
- `?booking_id=` - Filtrer par réservation

### Filtres Spécifiques Booking Rooms/Flights/Cars/Activities/Cruises
- `?booking_id=` - Filtrer par réservation
- `?booking_item_id=` - Filtrer par élément de réservation

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Sécurité** : Les utilisateurs ne peuvent voir que leurs propres réservations (sauf staff)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types d'Éléments de Réservation

Les réservations peuvent contenir les types d'éléments suivants :
- **hotel** - Propriétés d'hébergement
- **flight** - Vols
- **car** - Voitures de location
- **activity** - Activités touristiques
- **cruise** - Croisières
- **package** - Forfaits

## 🚀 Installation

1. Les migrations sont déjà créées dans `bookings/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate bookings --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/bookings/
```

