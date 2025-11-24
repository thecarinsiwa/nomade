# 📚 Documentation Pédagogique : Structure de Base de Données Expedia

## 🎯 Introduction

Cette documentation vous aidera à comprendre comment une plateforme de réservation de voyages comme Expedia organise ses données. Nous allons explorer chaque domaine fonctionnel, les relations entre les tables, et voir comment tout s'articule ensemble.

---

## 📋 Table des Matières

1. [Concepts Fondamentaux](#concepts-fondamentaux)
2. [Architecture Globale](#architecture-globale)
3. [Domaines Fonctionnels Détaillés](#domaines-fonctionnels-détaillés)
4. [Relations Entre Tables](#relations-entre-tables)
5. [Cas d'Usage Concrets](#cas-dusage-concrets)
6. [Diagrammes de Relations](#diagrammes-de-relations)

---

## 🔍 Concepts Fondamentaux

### Qu'est-ce qu'une base de données relationnelle ?

Une base de données relationnelle organise les données en **tables** (comme des feuilles Excel) qui sont liées entre elles par des **clés** (identifiants uniques).

**Exemple simple :**
- Table `users` : contient les utilisateurs
- Table `bookings` : contient les réservations
- Relation : chaque réservation appartient à un utilisateur (via `user_id`)

### Types de Relations

1. **Un-à-plusieurs (1:N)** : Un utilisateur peut avoir plusieurs réservations
2. **Plusieurs-à-plusieurs (N:N)** : Une propriété peut avoir plusieurs équipements, et un équipement peut être dans plusieurs propriétés
3. **Un-à-un (1:1)** : Un utilisateur a un seul profil détaillé

---

## 🏗️ Architecture Globale

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    EXPEDIA PLATFORM                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   UTILISATEURS│  │  PRODUITS    │  │ RÉSERVATIONS │ │
│  │   & AUTH      │  │  (Hôtels,    │  │  & PAIEMENTS │ │
│  │               │  │   Vols, etc) │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   AVIS &     │  │  PROMOTIONS  │  │   SUPPORT    │ │
│  │  ÉVALUATIONS │  │  & DEALS     │  │   CLIENT     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Flux Principal d'une Réservation

```
1. UTILISATEUR cherche → Recherche dans les PRODUITS
2. UTILISATEUR sélectionne → Création d'une RÉSERVATION
3. UTILISATEUR paie → Enregistrement du PAIEMENT
4. UTILISATEUR voyage → Possibilité de laisser un AVIS
```

---

## 📖 Domaines Fonctionnels Détaillés

### 1️⃣ GESTION DES UTILISATEURS

#### Pourquoi ce domaine existe-t-il ?

Expedia doit connaître ses clients pour :
- Gérer leurs réservations
- Personnaliser leur expérience
- Gérer leur programme de fidélité
- Respecter la réglementation (RGPD)

#### Tables Principales

**`users`** - Table centrale des utilisateurs
```
Exemple de données :
id  | email              | password_hash | first_name | last_name | created_at
----|--------------------|---------------|------------|-----------|------------
1   | jean@email.com     | $2y$10$...    | Jean       | Dupont    | 2024-01-15
2   | marie@email.com    | $2y$10$...    | Marie      | Martin   | 2024-02-20
```

**`user_profiles`** - Informations complémentaires
```
Exemple :
user_id | phone        | date_of_birth | preferred_language | preferred_currency
--------|--------------|---------------|-------------------|-------------------
1       | +33123456789 | 1985-05-20    | fr                 | EUR
```

**Relation :** `user_profiles.user_id` → `users.id` (1:1)

#### Cas d'Usage

**Scénario :** Un utilisateur s'inscrit
1. Insertion dans `users` (email, mot de passe hashé)
2. Insertion dans `user_profiles` (informations complémentaires)
3. Création d'un compte OneKey dans `onekey_accounts`

---

### 2️⃣ HÉBERGEMENTS (HOTELS & VACATION RENTALS)

#### Pourquoi ce domaine existe-t-il ?

C'est le cœur métier d'Expedia : proposer des hébergements aux clients.

#### Structure Hiérarchique

```
PROPERTY (Hôtel/Villa)
  ├── ROOMS (Chambres)
  │     ├── ROOM_TYPES (Standard, Deluxe, Suite)
  │     ├── ROOM_AVAILABILITY (Disponibilités par date)
  │     └── ROOM_PRICING (Tarifs)
  ├── PROPERTY_AMENITIES (Piscine, WiFi, etc.)
  └── PROPERTY_IMAGES (Photos)
```

#### Tables Clés

**`properties`** - Les hébergements
```
Exemple :
id  | name                    | property_type_id | address_id | rating | status
----|-------------------------|------------------|------------|--------|--------
101 | Hôtel Plaza Paris       | 1 (Hotel)        | 501        | 4.5    | active
102 | Villa Méditerranée      | 2 (Vacation)     | 502        | 4.8    | active
```

**`rooms`** - Les chambres
```
Exemple :
id  | property_id | room_type_id | name              | max_guests | size_sqm
----|-------------|--------------|-------------------|------------|----------
201 | 101         | 1            | Chambre Standard  | 2          | 25
202 | 101         | 2            | Suite Deluxe      | 4          | 50
```

**`room_availability`** - Disponibilités
```
Exemple :
id  | room_id | date       | available | price
----|---------|------------|-----------|-------
301 | 201     | 2025-06-15 | true      | 120.00
302 | 201     | 2025-06-16 | true      | 120.00
303 | 201     | 2025-06-17 | false     | NULL (réservée)
```

#### Relations Importantes

- `rooms.property_id` → `properties.id` (N:1) : Plusieurs chambres appartiennent à une propriété
- `room_availability.room_id` → `rooms.id` (N:1) : Une chambre a plusieurs disponibilités (une par date)

#### Cas d'Usage

**Scénario :** Recherche d'un hôtel à Paris
1. Recherche dans `properties` avec filtre sur `addresses.city = "Paris"`
2. Vérification des disponibilités dans `room_availability` pour les dates demandées
3. Calcul du prix total en consultant `room_pricing`
4. Affichage des images depuis `property_images`

---

### 3️⃣ VOLS

#### Structure

```
AIRLINE (Compagnie aérienne)
  └── FLIGHTS (Vols)
        ├── FLIGHT_ROUTES (Itinéraires)
        ├── FLIGHT_SEGMENTS (Segments)
        └── FLIGHT_AVAILABILITY (Disponibilités)
```

#### Tables Clés

**`airlines`**
```
id  | code | name              | logo_url
----|------|-------------------|------------------
1   | AF   | Air France        | /logos/af.png
2   | LH   | Lufthansa         | /logos/lh.png
```

**`flights`**
```
id  | airline_id | flight_number | departure_airport | arrival_airport | duration_minutes
----|------------|---------------|-------------------|-----------------|-----------------
501 | 1          | AF123         | CDG (Paris)       | JFK (New York)  | 480
```

**`flight_availability`**
```
id  | flight_id | date       | class        | available_seats | price
----|-----------|------------|--------------|-----------------|-------
601 | 501       | 2025-07-01 | economy      | 45              | 650.00
602 | 501       | 2025-07-01 | business     | 8               | 2500.00
```

#### Cas d'Usage

**Scénario :** Recherche d'un vol Paris → New York
1. Recherche dans `flights` avec `departure_airport = "CDG"` et `arrival_airport = "JFK"`
2. Vérification des disponibilités dans `flight_availability` pour la date
3. Affichage des options par classe (économique, business)
4. Calcul du prix total

---

### 4️⃣ RÉSERVATIONS

#### C'est le Point Central !

Toutes les réservations (hôtel, vol, voiture, etc.) passent par ce domaine.

#### Structure

**`bookings`** - Table principale
```
id  | user_id | booking_reference | status      | total_amount | created_at
----|---------|------------------|-------------|--------------|------------
1001| 1       | EXP-2025-001234  | confirmed   | 850.00       | 2025-05-10
1002| 2       | EXP-2025-001235  | cancelled   | 1200.00      | 2025-05-11
```

**`booking_items`** - Éléments de la réservation
```
id  | booking_id | item_type | item_id | quantity | price
----|------------|-----------|---------|----------|-------
2001| 1001       | hotel     | 201     | 1        | 600.00
2002| 1001       | flight    | 501     | 2        | 250.00
```

**`booking_rooms`** - Détails des chambres réservées
```
id  | booking_item_id | room_id | check_in   | check_out  | guests
----|-----------------|---------|------------|------------|-------
3001| 2001            | 201     | 2025-06-15 | 2025-06-20 | 2
```

#### Flux Complet d'une Réservation

```
1. UTILISATEUR sélectionne un produit
   ↓
2. Création d'une entrée dans BOOKINGS
   ↓
3. Création d'entrées dans BOOKING_ITEMS (hôtel, vol, etc.)
   ↓
4. Création d'entrées dans BOOKING_ROOMS, BOOKING_FLIGHTS, etc.
   ↓
5. PAIEMENT effectué → enregistrement dans PAYMENTS
   ↓
6. Mise à jour de la disponibilité (ROOM_AVAILABILITY, FLIGHT_AVAILABILITY)
   ↓
7. Confirmation envoyée à l'utilisateur
```

#### Cas d'Usage

**Scénario :** Réservation d'un forfait (hôtel + vol)
1. Création d'une `booking` avec `user_id = 1`
2. Création de 2 `booking_items` :
   - Un pour l'hôtel (`item_type = "hotel"`, `item_id = 201`)
   - Un pour le vol (`item_type = "flight"`, `item_id = 501`)
3. Création d'une `booking_room` avec les dates
4. Création d'une `booking_flight` avec les passagers
5. Enregistrement du paiement dans `payments`
6. Mise à jour des disponibilités

---

### 5️⃣ PAIEMENTS

#### Structure

**`payments`**
```
id  | booking_id | amount  | currency | payment_method | status    | transaction_id
----|------------|---------|----------|----------------|-----------|----------------
5001| 1001       | 850.00  | EUR      | credit_card    | completed | tx_abc123
5002| 1002       | 1200.00 | EUR      | paypal         | refunded  | tx_def456
```

**`payment_methods`** - Méthodes enregistrées
```
id  | user_id | type         | last_four_digits | expiry_date
----|---------|--------------|------------------|-------------
7001| 1       | credit_card  | 1234             | 2026-12-31
7002| 1       | paypal       | NULL             | NULL
```

#### Relations

- `payments.booking_id` → `bookings.id` (N:1) : Une réservation peut avoir plusieurs paiements (acompte + solde)
- `payment_methods.user_id` → `users.id` (N:1) : Un utilisateur peut avoir plusieurs méthodes de paiement

---

### 6️⃣ AVIS ET ÉVALUATIONS

#### Pourquoi c'est important ?

Les avis influencent les décisions d'achat et améliorent la confiance.

#### Structure

**`reviews`**
```
id  | user_id | property_id | rating | title              | comment                    | created_at
----|---------|-------------|--------|-------------------|----------------------------|------------
8001| 1       | 101         | 5      | "Excellent séjour" | "Hôtel magnifique, service..." | 2025-06-25
```

**`review_ratings`** - Notes détaillées
```
id  | review_id | category      | rating
----|-----------|---------------|-------
9001| 8001      | cleanliness   | 5
9002| 8001      | service        | 5
9003| 8001      | location       | 4
9004| 8001      | value          | 4
```

#### Relations

- `reviews.user_id` → `users.id` (N:1)
- `reviews.property_id` → `properties.id` (N:1)
- `review_ratings.review_id` → `reviews.id` (N:1)

#### Cas d'Usage

**Scénario :** Un utilisateur laisse un avis
1. Vérification que l'utilisateur a bien séjourné (dans `bookings`)
2. Création d'une entrée dans `reviews`
3. Création d'entrées dans `review_ratings` pour chaque catégorie
4. Mise à jour de la note moyenne dans `properties.rating`

---

### 7️⃣ PROMOTIONS ET OFFRES

#### Structure

**`promotions`**
```
id  | name              | type           | discount_percent | start_date  | end_date    | active
----|------------------|----------------|------------------|-------------|-------------|-------
100 | Black Friday 2025| black_friday   | 30               | 2025-11-25  | 2025-11-30  | true
```

**`promotion_codes`**
```
id  | promotion_id | code      | usage_limit | used_count
----|-------------|------------|-------------|------------
200 | 100         | BF2025    | 10000       | 5234
```

#### Application d'une Promotion

Quand un utilisateur utilise un code promo :
1. Vérification du code dans `promotion_codes`
2. Vérification de la validité (dates, limite d'utilisation)
3. Application de la réduction au montant total
4. Enregistrement dans `bookings.promotion_code_id`

---

## 🔗 Relations Entre Tables

### Diagramme de Relations Principales

```
┌──────────┐
│  USERS  │
└────┬─────┘
     │
     │ (1:N)
     ├─────────────────┐
     │                 │
┌────▼─────┐    ┌──────▼──────┐
│ BOOKINGS │    │ ONEKEY_    │
└────┬─────┘    │ ACCOUNTS    │
     │          └─────────────┘
     │ (1:N)
     ├─────────────────┐
     │                 │
┌────▼─────┐    ┌──────▼──────┐
│ PAYMENTS │    │ BOOKING_    │
└──────────┘    │ ITEMS       │
                └──────┬───────┘
                       │
                       │ (N:1)
                ┌──────▼───────┐
                │ PROPERTIES   │
                │ FLIGHTS      │
                │ CARS         │
                └──────────────┘
```

### Relations Clés à Retenir

1. **Users → Bookings** : Un utilisateur peut avoir plusieurs réservations
2. **Bookings → Booking_Items** : Une réservation contient plusieurs éléments
3. **Booking_Items → Properties/Flights/Cars** : Chaque élément référence un produit
4. **Bookings → Payments** : Une réservation peut avoir plusieurs paiements
5. **Properties → Rooms** : Une propriété a plusieurs chambres
6. **Rooms → Room_Availability** : Une chambre a plusieurs disponibilités (une par date)

---

## 💡 Cas d'Usage Concrets

### Cas 1 : Réservation Complète d'un Forfait

**Contexte :** Jean veut réserver un forfait "Hôtel + Vol" pour Paris

**Étapes dans la base de données :**

1. **Vérification utilisateur**
   ```sql
   SELECT * FROM users WHERE id = 1;
   ```

2. **Recherche de produits disponibles**
   ```sql
   -- Recherche hôtel
   SELECT * FROM properties 
   WHERE address_id IN (SELECT id FROM addresses WHERE city = 'Paris')
   AND status = 'active';
   
   -- Recherche vol
   SELECT * FROM flights 
   WHERE departure_airport = 'CDG' 
   AND arrival_airport = 'ORY'
   AND date = '2025-07-15';
   ```

3. **Création de la réservation**
   ```sql
   INSERT INTO bookings (user_id, booking_reference, status, total_amount)
   VALUES (1, 'EXP-2025-001234', 'pending', 850.00);
   ```

4. **Ajout des éléments**
   ```sql
   -- Hôtel
   INSERT INTO booking_items (booking_id, item_type, item_id, price)
   VALUES (1001, 'hotel', 201, 600.00);
   
   -- Vol
   INSERT INTO booking_items (booking_id, item_type, item_id, price)
   VALUES (1001, 'flight', 501, 250.00);
   ```

5. **Enregistrement du paiement**
   ```sql
   INSERT INTO payments (booking_id, amount, status, payment_method)
   VALUES (1001, 850.00, 'completed', 'credit_card');
   ```

6. **Mise à jour des disponibilités**
   ```sql
   UPDATE room_availability 
   SET available = false 
   WHERE room_id = 201 AND date BETWEEN '2025-07-15' AND '2025-07-20';
   ```

7. **Confirmation**
   ```sql
   UPDATE bookings SET status = 'confirmed' WHERE id = 1001;
   ```

### Cas 2 : Gestion des Avis

**Contexte :** Après son séjour, Jean laisse un avis

**Étapes :**

1. **Vérification de l'éligibilité**
   ```sql
   SELECT * FROM bookings 
   WHERE user_id = 1 
   AND property_id = 101 
   AND status = 'completed';
   ```

2. **Création de l'avis**
   ```sql
   INSERT INTO reviews (user_id, property_id, rating, title, comment)
   VALUES (1, 101, 5, 'Excellent séjour', 'Hôtel magnifique...');
   ```

3. **Ajout des notes détaillées**
   ```sql
   INSERT INTO review_ratings (review_id, category, rating)
   VALUES 
   (8001, 'cleanliness', 5),
   (8001, 'service', 5),
   (8001, 'location', 4),
   (8001, 'value', 4);
   ```

4. **Mise à jour de la note moyenne**
   ```sql
   UPDATE properties 
   SET rating = (
     SELECT AVG(rating) FROM reviews WHERE property_id = 101
   )
   WHERE id = 101;
   ```

---

## 📊 Diagrammes de Relations

### Modèle Entité-Relation Simplifié

```
┌─────────────────────────────────────────────────────────────┐
│                      MODÈLE PRINCIPAL                         │
└─────────────────────────────────────────────────────────────┘

USERS (1) ──────< (N) BOOKINGS (1) ──────< (N) PAYMENTS
   │                    │
   │                    │
   │                    ├───< (N) BOOKING_ITEMS
   │                    │
   │                    └───< (N) BOOKING_ROOMS
   │
   └───< (N) REVIEWS ────> (N) PROPERTIES
                              │
                              └───< (N) ROOMS
                                    │
                                    └───< (N) ROOM_AVAILABILITY
```

### Relations Many-to-Many

**Exemple : Propriétés ↔ Équipements**

```
PROPERTIES (N) ────< PROPERTY_AMENITIES >─── (N) AMENITIES
                      (table de liaison)
```

**Table de liaison `property_amenities` :**
```
property_id | amenity_id
------------|-----------
101         | 1 (WiFi)
101         | 2 (Piscine)
101         | 3 (Parking)
102         | 1 (WiFi)
102         | 4 (Spa)
```

---

## 🎓 Concepts Avancés

### Index et Performance

Pour accélérer les recherches, on crée des **index** sur les colonnes fréquemment utilisées :

```sql
-- Index sur les recherches par ville
CREATE INDEX idx_properties_city ON properties(address_id);

-- Index sur les dates de disponibilité
CREATE INDEX idx_availability_date ON room_availability(date);

-- Index sur les réservations par utilisateur
CREATE INDEX idx_bookings_user ON bookings(user_id);
```

### Transactions et Intégrité

Une réservation doit être **atomique** : soit tout réussit, soit tout échoue.

```sql
BEGIN TRANSACTION;
  INSERT INTO bookings ...;
  INSERT INTO booking_items ...;
  UPDATE room_availability ...;
  INSERT INTO payments ...;
COMMIT;
```

Si une étape échoue, toutes les modifications sont annulées (ROLLBACK).

---

## 🔐 Sécurité et Bonnes Pratiques

### 1. Hashage des Mots de Passe
- Ne JAMAIS stocker les mots de passe en clair
- Utiliser des algorithmes de hashage (bcrypt, argon2)

### 2. Protection des Données Personnelles
- Chiffrement des données sensibles (numéros de carte)
- Conformité RGPD
- Logs d'audit pour tracer les accès

### 3. Validation des Données
- Vérifier les dates (check-in < check-out)
- Vérifier les montants (prix > 0)
- Vérifier les disponibilités avant réservation

---

## 📝 Résumé des Tables par Domaine

### Domaine Utilisateurs (7 tables)
- users, user_profiles, user_addresses, user_payment_methods, user_preferences, user_sessions, user_authentication

### Domaine Hébergements (15 tables)
- properties, property_types, property_categories, property_addresses, property_amenities, property_images, property_descriptions, rooms, room_types, room_amenities, room_availability, room_pricing, property_partners, property_ratings, property_reviews

### Domaine Vols (9 tables)
- airlines, airports, flights, flight_routes, flight_segments, flight_classes, flight_availability, flight_pricing, aircraft_types

### Domaine Réservations (9 tables)
- bookings, booking_items, booking_statuses, booking_guests, booking_rooms, booking_flights, booking_cars, booking_activities, booking_cruises

### Domaine Paiements (6 tables)
- payments, payment_methods, payment_statuses, refunds, invoices, payment_plans

---

## 🚀 Pour Aller Plus Loin

### Questions à Se Poser

1. **Comment gérer les annulations ?**
   - Mettre à jour le statut de la réservation
   - Libérer les disponibilités
   - Gérer les remboursements

2. **Comment optimiser les recherches ?**
   - Utiliser des index
   - Mettre en cache les résultats fréquents
   - Paginer les résultats

3. **Comment gérer la concurrence ?**
   - Verrouiller les disponibilités pendant la réservation
   - Utiliser des transactions

4. **Comment scaler la base de données ?**
   - Réplication (plusieurs copies)
   - Partitionnement (diviser les tables)
   - Cache (Redis, Memcached)

---

## 📚 Glossaire

- **Clé Primaire (PK)** : Identifiant unique d'une ligne (ex: `id`)
- **Clé Étrangère (FK)** : Référence vers une autre table (ex: `user_id`)
- **Index** : Structure qui accélère les recherches
- **Transaction** : Groupe d'opérations qui doivent toutes réussir
- **Normalisation** : Organisation des données pour éviter la redondance
- **Relation 1:N** : Un enregistrement peut avoir plusieurs enfants
- **Relation N:N** : Plusieurs enregistrements peuvent être liés à plusieurs autres (nécessite une table de liaison)

---

## ✅ Checklist de Compréhension

Après avoir lu cette documentation, vous devriez être capable de :

- [ ] Comprendre la structure générale de la base de données
- [ ] Identifier les relations entre les tables principales
- [ ] Expliquer le flux d'une réservation
- [ ] Comprendre comment les disponibilités sont gérées
- [ ] Savoir comment les paiements sont enregistrés
- [ ] Comprendre le système d'avis et d'évaluations
- [ ] Identifier les tables nécessaires pour une fonctionnalité donnée

---

## 📞 Ressources Complémentaires

- **SQL Basics** : Apprendre les requêtes SELECT, INSERT, UPDATE, DELETE
- **Database Design** : Comprendre la normalisation et les relations
- **Performance** : Optimisation des requêtes et indexation
- **Sécurité** : Protection des données et injection SQL

---

**Date de création :** 2025  
**Version :** 1.0  
**Auteur :** Documentation pédagogique basée sur l'analyse d'Expedia

---

*Cette documentation est une estimation basée sur l'analyse des fonctionnalités d'Expedia. La structure réelle peut varier selon les choix d'implémentation.*

