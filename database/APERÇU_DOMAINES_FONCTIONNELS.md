# 📊 Aperçu Général des 18 Domaines Fonctionnels

## Vue d'Ensemble

La base de données **Nomade** est organisée en **18 domaines fonctionnels** couvrant tous les aspects d'une plateforme de réservation de voyages moderne. Chaque domaine regroupe des tables liées qui travaillent ensemble pour fournir une fonctionnalité complète.

---

## 🎯 1. GESTION DES UTILISATEURS
**5 tables** | **Rôle :** Gérer les comptes utilisateurs et leurs informations personnelles

### Tables
- **`users`** - Comptes utilisateurs (email, mot de passe, nom, statut)
- **`user_profiles`** - Profils détaillés (préférences langue/devise, timezone)
- **`user_addresses`** - Adresses des utilisateurs (facturation, livraison, domicile)
- **`user_payment_methods`** - Méthodes de paiement enregistrées (cartes, PayPal)
- **`user_sessions`** - Sessions actives des utilisateurs (authentification)

### Fonctionnalités Clés
- Authentification et gestion de session
- Profils utilisateurs personnalisables
- Gestion multi-adresses
- Paiements enregistrés pour paiement rapide

---

## 🎁 2. PROGRAMME DE FIDÉLITÉ (ONEKEY)
**3 tables** | **Rôle :** Gérer le programme de points et récompenses

### Tables
- **`onekey_accounts`** - Comptes OneKey (niveaux : silver, gold, platinum, diamond)
- **`onekey_rewards`** - Points et récompenses accumulés
- **`onekey_transactions`** - Historique des transactions de points (gain, utilisation, expiration)

### Fonctionnalités Clés
- Système de points de fidélité
- Niveaux de membres avec avantages
- Historique complet des transactions
- Expiration et gestion des points

---

## 🏨 3. HÉBERGEMENTS (HOTELS & VACATION RENTALS)
**15 tables** | **Rôle :** Gérer les propriétés, chambres, disponibilités et tarifs

### Tables
- **`property_types`** - Types de propriétés (hôtel, appartement, villa, etc.)
- **`property_categories`** - Catégories (luxe, économique, milieu de gamme)
- **`property_addresses`** - Adresses avec coordonnées GPS
- **`properties`** - Propriétés principales (nom, note, statut, horaires check-in/out)
- **`property_amenities`** - Équipements disponibles (piscine, WiFi, spa, etc.)
- **`property_amenities_link`** - Table de liaison propriétés ↔ équipements
- **`property_images`** - Photos et images des propriétés
- **`property_descriptions`** - Descriptions multilingues
- **`room_types`** - Types de chambres (standard, deluxe, suite)
- **`rooms`** - Chambres individuelles (capacité, taille, type de lit)
- **`room_amenities`** - Équipements des chambres (TV, minibar, balcon)
- **`room_amenities_link`** - Table de liaison chambres ↔ équipements
- **`room_availability`** - Disponibilités par date (disponible/indisponible, prix)
- **`room_pricing`** - Tarifs par saison (basse, moyenne, haute, pic)

### Fonctionnalités Clés
- Gestion complète des hébergements
- Disponibilités en temps réel par date
- Tarification dynamique par saison
- Multilingue et multi-images
- Recherche géolocalisée

---

## ✈️ 4. VOLS
**6 tables** | **Rôle :** Gérer les compagnies aériennes, aéroports, vols et disponibilités

### Tables
- **`airlines`** - Compagnies aériennes (code, nom, logo, pays)
- **`airports`** - Aéroports (codes IATA/ICAO, coordonnées, timezone)
- **`flight_classes`** - Classes de vol (économique, business, première classe)
- **`flights`** - Vols (numéro, aéroports départ/arrivée, durée, statut)
- **`flight_availability`** - Disponibilités par date/classe (sièges disponibles, prix)

### Fonctionnalités Clés
- Recherche de vols par origine/destination
- Disponibilités par classe et date
- Gestion des statuts de vol (programmé, retardé, annulé)
- Tarification par classe

---

## 🚗 5. LOCATIONS DE VOITURES
**5 tables** | **Rôle :** Gérer les agences de location, véhicules et disponibilités

### Tables
- **`car_rental_companies`** - Agences de location (nom, code, logo)
- **`car_rental_locations`** - Points de location (aéroports, villes, gares)
- **`car_categories`** - Catégories de voitures (compacte, SUV, berline, etc.)
- **`cars`** - Véhicules (marque, modèle, année, transmission, carburant)
- **`car_availability`** - Disponibilités par période (dates, prix/jour)

### Fonctionnalités Clés
- Recherche par lieu de prise/retour
- Disponibilités par période
- Filtres par catégorie et caractéristiques
- Tarification à la journée

---

## 🚢 6. CROISIÈRES
**6 tables** | **Rôle :** Gérer les compagnies de croisières, navires, itinéraires et cabines

### Tables
- **`cruise_lines`** - Compagnies de croisières (nom, logo)
- **`cruise_ships`** - Navires (nom, capacité, année de construction)
- **`cruise_ports`** - Ports d'embarquement/débarquement
- **`cruises`** - Croisières (nom, dates, durée, ports, statut)
- **`cruise_cabin_types`** - Types de cabines (intérieure, extérieure, suite)
- **`cruise_cabins`** - Cabines individuelles (numéro, capacité, prix, disponibilité)

### Fonctionnalités Clés
- Recherche par destination et dates
- Sélection de cabines par type
- Gestion des itinéraires
- Disponibilités en temps réel

---

## 🎯 7. ACTIVITÉS (THINGS TO DO)
**3 tables** | **Rôle :** Gérer les activités touristiques et expériences

### Tables
- **`activity_categories`** - Catégories (culture, sport, aventure, gastronomie, etc.)
- **`activities`** - Activités (nom, description, lieu, durée, note)
- **`activity_schedules`** - Horaires et disponibilités (dates/heures, places disponibles, prix)

### Fonctionnalités Clés
- Recherche d'activités par destination
- Réservation avec horaires spécifiques
- Gestion des places disponibles
- Système de notation

---

## 📦 8. FORFAITS (PACKAGES)
**3 tables** | **Rôle :** Gérer les forfaits combinés (hôtel + vol, etc.) avec réductions

### Tables
- **`package_types`** - Types de forfaits
- **`packages`** - Forfaits (nom, description, pourcentage de réduction, dates)
- **`package_components`** - Composants d'un forfait (hôtel, vol, voiture, activité, croisière)

### Fonctionnalités Clés
- Forfaits combinant plusieurs services
- Réductions automatiques
- Flexibilité dans la composition
- Gestion des dates de validité

---

## 📋 9. RÉSERVATIONS
**9 tables** | **Rôle :** Point central de toutes les réservations

### Tables
- **`booking_statuses`** - Statuts (confirmé, en attente, annulé, complété)
- **`bookings`** - Réservations principales (référence unique, montant total, statut)
- **`booking_items`** - Éléments d'une réservation (hôtel, vol, voiture, etc.)
- **`booking_guests`** - Informations des voyageurs (nom, email, passeport)
- **`booking_rooms`** - Détails des chambres réservées (dates check-in/out, nombre de personnes)
- **`booking_flights`** - Détails des vols réservés (date, classe, passagers)
- **`booking_cars`** - Détails des voitures réservées (dates, lieux de prise/retour)
- **`booking_activities`** - Détails des activités réservées (date, participants)
- **`booking_cruises`** - Détails des croisières réservées (cabine, passagers)

### Fonctionnalités Clés
- Système unifié pour tous types de réservations
- Références uniques pour chaque réservation
- Gestion des statuts en temps réel
- Historique complet des réservations
- Support multi-produits dans une seule réservation

---

## 💳 10. PAIEMENTS
**5 tables** | **Rôle :** Gérer les transactions financières, remboursements et factures

### Tables
- **`payment_methods`** - Méthodes de paiement acceptées (carte, PayPal, virement)
- **`payment_statuses`** - Statuts (réussi, échoué, en attente, remboursé)
- **`payments`** - Transactions de paiement (montant, méthode, statut, ID transaction)
- **`refunds`** - Remboursements (montant, raison, statut)
- **`invoices`** - Factures (numéro unique, montant, TVA, PDF)

### Fonctionnalités Clés
- Multiples méthodes de paiement
- Suivi des transactions
- Gestion des remboursements
- Génération de factures
- Historique complet des paiements

---

## ⭐ 11. AVIS ET ÉVALUATIONS
**3 tables** | **Rôle :** Gérer les avis clients et notations détaillées

### Tables
- **`reviews`** - Avis clients (note globale, titre, commentaire, vérification)
- **`review_ratings`** - Notes détaillées par catégorie (propreté, service, emplacement, rapport qualité/prix)
- **`review_photos`** - Photos ajoutées dans les avis

### Fonctionnalités Clés
- Système de notation 1-5 étoiles
- Avis vérifiés (après séjour)
- Notes détaillées par critère
- Photos partagées par les clients
- Compteur de votes "utile"

---

## 🎁 12. PROMOTIONS ET OFFRES
**3 tables** | **Rôle :** Gérer les promotions, codes promo et réductions

### Tables
- **`promotion_types`** - Types de promotions (Black Friday, saisonnières, etc.)
- **`promotions`** - Promotions (nom, description, pourcentage/montant, dates)
- **`promotion_codes`** - Codes promotionnels (code unique, limite d'utilisation, compteur)

### Fonctionnalités Clés
- Codes promo avec limites d'utilisation
- Promotions par période
- Réductions en pourcentage ou montant fixe
- Suivi de l'utilisation des codes

---

## 🌍 13. DESTINATIONS ET GÉOGRAPHIE
**4 tables** | **Rôle :** Gérer la hiérarchie géographique (pays → régions → villes → destinations)

### Tables
- **`countries`** - Pays (nom, codes ISO)
- **`regions`** - Régions/États (rattachés aux pays)
- **`cities`** - Villes (rattachées aux régions/pays, coordonnées GPS)
- **`destinations`** - Destinations touristiques (nom, description, image, popularité)

### Fonctionnalités Clés
- Hiérarchie géographique complète
- Recherche par destination
- Géolocalisation (coordonnées GPS)
- Destinations populaires mises en avant

---

## 📧 14. NOTIFICATIONS ET COMMUNICATION
**2 tables** | **Rôle :** Gérer les notifications utilisateurs et templates d'emails

### Tables
- **`notifications`** - Notifications envoyées aux utilisateurs (type, titre, message, lu/non lu)
- **`email_templates`** - Modèles d'emails (sujet, corps, langue)

### Fonctionnalités Clés
- Notifications en temps réel
- Système de marquage lu/non lu
- Templates d'emails multilingues
- Historique des communications

---

## 🎧 15. SUPPORT CLIENT
**3 tables** | **Rôle :** Gérer les tickets de support et la communication client

### Tables
- **`support_categories`** - Catégories de support (réservation, paiement, technique, etc.)
- **`support_tickets`** - Tickets de support (sujet, statut, priorité, réservation liée)
- **`support_messages`** - Messages dans les tickets (utilisateur/staff, contenu)

### Fonctionnalités Clés
- Système de tickets avec statuts
- Priorités (faible, moyenne, haute, urgente)
- Communication bidirectionnelle
- Historique complet des échanges
- Liens avec les réservations

---

## ⚙️ 16. CONFIGURATION SYSTÈME
**3 tables** | **Rôle :** Gérer les paramètres système, devises et langues

### Tables
- **`currencies`** - Devises supportées (code, nom, symbole, taux de change)
- **`languages`** - Langues disponibles (code, nom, nom natif)
- **`settings`** - Paramètres système (clé/valeur, type, description)

### Fonctionnalités Clés
- Multi-devises avec taux de change
- Multilingue
- Paramètres système configurables
- Gestion centralisée des configurations

---

## 📊 17. ANALYTICS ET TRACKING
**2 tables** | **Rôle :** Suivre les recherches utilisateurs et événements analytics

### Tables
- **`user_searches`** - Recherches effectuées (type, paramètres JSON, nombre de résultats)
- **`analytics_events`** - Événements analytics (type, données JSON, IP, user agent)

### Fonctionnalités Clés
- Suivi des recherches utilisateurs
- Analytics comportementaux
- Données JSON pour flexibilité
- Historique complet des interactions

---

## 🔐 18. SÉCURITÉ ET CONFORMITÉ
**2 tables** | **Rôle :** Audit, sécurité et conformité réglementaire

### Tables
- **`audit_logs`** - Logs d'audit (action, table, enregistrement, valeurs anciennes/nouvelles)
- **`security_events`** - Événements de sécurité (type, sévérité, description, IP)

### Fonctionnalités Clés
- Traçabilité complète des actions
- Logs d'audit pour conformité (RGPD)
- Détection d'événements de sécurité
- Niveaux de sévérité (faible, moyenne, haute, critique)
- Historique des modifications (avant/après)

---

## 🔗 Relations Inter-Domaines

### Flux Principal d'une Réservation

```
1. UTILISATEUR (domaine 1)
   ↓
2. RECHERCHE → Analytics (domaine 17)
   ↓
3. SÉLECTION PRODUIT → Hébergements/Vols/Voitures/etc. (domaines 3-7)
   ↓
4. CRÉATION RÉSERVATION (domaine 9)
   ↓
5. APPLICATION PROMOTION (domaine 12)
   ↓
6. PAIEMENT (domaine 10)
   ↓
7. ACCUMULATION POINTS OneKey (domaine 2)
   ↓
8. NOTIFICATION (domaine 14)
   ↓
9. AVIS APRÈS SÉJOUR (domaine 11)
```

### Domaines Transversaux

- **Domaine 1 (Utilisateurs)** : Lié à presque tous les autres domaines
- **Domaine 9 (Réservations)** : Point central reliant tous les produits
- **Domaine 10 (Paiements)** : Lié aux réservations
- **Domaine 13 (Destinations)** : Utilisé par tous les domaines de produits
- **Domaine 16 (Configuration)** : Paramètres globaux pour toute la plateforme
- **Domaine 17 (Analytics)** : Suit les interactions dans tous les domaines
- **Domaine 18 (Sécurité)** : Surveille et audite tous les domaines

---

## 📈 Statistiques Globales

- **Total de tables :** ~65 tables
- **Domaines fonctionnels :** 18
- **Clés primaires :** Toutes utilisent UUID()
- **Encodage :** UTF-8 (utf8mb4) pour support Unicode complet
- **Moteur :** InnoDB pour transactions et intégrité référentielle

---

## 🎯 Points Clés à Retenir

1. **Architecture modulaire** : Chaque domaine est indépendant mais interconnecté
2. **UUID partout** : Toutes les PK utilisent UUID() pour sécurité et scalabilité
3. **Relations bien définies** : Clés étrangères avec CASCADE ou SET NULL appropriés
4. **Index optimisés** : Index sur toutes les colonnes fréquemment recherchées
5. **Multilingue et multi-devises** : Support international complet
6. **Traçabilité complète** : Logs d'audit et sécurité pour conformité
7. **Scalabilité** : Structure prête pour croissance et performance

---

**Date de création :** 2025  
**Version :** 1.0

