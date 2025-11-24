# 🧳 Nomade - Plateforme de Réservation de Voyages

> Documentation complète de l'architecture de base de données pour une plateforme de réservation de voyages moderne

[![Documentation](https://img.shields.io/badge/Documentation-Complete-brightgreen)]()
[![Language](https://img.shields.io/badge/Language-French-blue)]()
[![Database](https://img.shields.io/badge/Database-SQL-orange)]()
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()

## 📋 Description

**Nomade** est une plateforme de réservation de voyages complète permettant aux utilisateurs de réserver des hébergements, des vols, des locations de voitures, des croisières, des activités et des forfaits combinés. Ce repository contient la documentation complète de l'architecture de base de données nécessaire pour faire fonctionner une telle plateforme.

## ✨ Fonctionnalités

- 🏨 **Réservation d'hébergements** (hôtels, locations de vacances)
- ✈️ **Réservation de vols** avec plusieurs compagnies aériennes
- 🚗 **Location de voitures** dans le monde entier
- 🚢 **Croisières** avec différents itinéraires
- 🎯 **Activités et expériences** à destination
- 📦 **Forfaits combinés** (hôtel + vol) avec réductions
- ⭐ **Système d'avis et d'évaluations**
- 💳 **Gestion des paiements** sécurisée
- 🎁 **Promotions et codes promo**
- 👥 **Programme de fidélité** (points et récompenses)
- 📱 **Support client** intégré

## 📁 Structure du Projet

```
nomade/
├── README.md                              # Ce fichier
├── documentation_structure_bdd_expedia.md  # Documentation pédagogique complète
├── database/
│   └── expedia_database_tables.txt         # Liste exhaustive des tables
└── GITHUB_DESCRIPTION.md                  # Options de descriptions GitHub
```

## 📚 Documentation

### Documentation Principale

- **[Documentation Pédagogique](documentation_structure_bdd_expedia.md)** - Guide complet de 716 lignes expliquant :
  - Concepts fondamentaux des bases de données relationnelles
  - Architecture globale du système
  - Domaines fonctionnels détaillés avec exemples
  - Relations entre tables
  - Cas d'usage concrets avec requêtes SQL
  - Diagrammes de relations
  - Concepts avancés (index, transactions, sécurité)

### Liste des Tables

- **[Liste des Tables](database/expedia_database_tables.txt)** - Répertoire complet de toutes les tables organisées par domaine fonctionnel

## 🗂️ Domaines Fonctionnels

### 👥 Gestion des Utilisateurs
- Authentification et sécurité
- Profils utilisateurs
- Préférences et paramètres
- Adresses et coordonnées

### 🏨 Hébergements
- Propriétés (hôtels, villas, appartements)
- Types de chambres et suites
- Disponibilités et tarifs dynamiques
- Équipements et services
- Images et descriptions

### ✈️ Vols
- Compagnies aériennes
- Itinéraires et routes
- Classes de vol
- Disponibilités et tarifs
- Gestion des segments

### 🚗 Locations de Voitures
- Agences de location
- Catégories de véhicules
- Disponibilités par localisation
- Tarifs et options

### 🚢 Croisières
- Compagnies de croisières
- Navires et cabines
- Itinéraires
- Ports d'embarquement

### 🎯 Activités
- Expériences à destination
- Fournisseurs d'activités
- Horaires et disponibilités
- Réservations d'activités

### 📦 Forfaits
- Combinaisons hôtel + vol
- Calcul automatique des réductions
- Gestion des composants

### 💳 Réservations & Paiements
- Système de réservation centralisé
- Gestion des statuts
- Paiements sécurisés
- Remboursements et annulations
- Plans de paiement

### ⭐ Avis & Évaluations
- Système de notation
- Commentaires détaillés
- Photos dans les avis
- Réponses des propriétaires

### 🎁 Promotions
- Codes promotionnels
- Offres spéciales
- Campagnes marketing
- Réductions saisonnières

### 📍 Destinations
- Gestion géographique
- Points d'intérêt
- Guides de voyage

### 💬 Support Client
- Tickets de support
- FAQ
- Articles d'aide
- Communication client

## 🛠️ Technologies

- **Base de données** : SQL (MySQL/PostgreSQL)
- **Architecture** : Base de données relationnelle
- **Modélisation** : Normalisation 3NF
- **Sécurité** : Hashage des mots de passe, chiffrement des données sensibles

## 📊 Architecture de la Base de Données

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    NOMADE PLATFORM                       │
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

### Relations Principales

- **Users** → **Bookings** (1:N) : Un utilisateur peut avoir plusieurs réservations
- **Bookings** → **Booking_Items** (1:N) : Une réservation contient plusieurs éléments
- **Properties** → **Rooms** (1:N) : Une propriété a plusieurs chambres
- **Rooms** → **Room_Availability** (1:N) : Une chambre a plusieurs disponibilités
- **Bookings** → **Payments** (1:N) : Une réservation peut avoir plusieurs paiements

## 🚀 Démarrage Rapide

1. **Consultez la documentation principale**
   ```bash
   # Ouvrez le fichier de documentation
   documentation_structure_bdd_expedia.md
   ```

2. **Explorez la liste des tables**
   ```bash
   # Consultez toutes les tables organisées par domaine
   database/expedia_database_tables.txt
   ```

3. **Comprenez les relations**
   - Lisez la section "Relations Entre Tables" dans la documentation
   - Consultez les diagrammes de relations

4. **Testez avec des exemples**
   - Suivez les cas d'usage concrets
   - Exécutez les requêtes SQL d'exemple

## 📖 Prérequis

- Connaissances de base en SQL
- Compréhension des bases de données relationnelles
- Intérêt pour l'architecture de systèmes complexes

## 🎯 Objectifs du Projet

Cette documentation a pour but de :
- ✅ Comprendre l'architecture d'une base de données complexe
- ✅ Apprendre les relations entre tables
- ✅ Visualiser le flux de données dans une application de réservation
- ✅ Servir de référence pour implémenter la base de données de Nomade
- ✅ Fournir une base solide pour le développement de la plateforme

## 📈 Statistiques

- **+100 tables** organisées en 20 domaines fonctionnels
- **716 lignes** de documentation pédagogique
- **20+ cas d'usage** avec exemples SQL
- **15+ diagrammes** de relations

## 🤝 Contribution

Les suggestions d'amélioration, corrections et ajouts sont les bienvenues !

### Comment contribuer ?

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est à des fins éducatives et de documentation.

## ⭐ Avis

Si ce projet vous a été utile, n'hésitez pas à laisser une étoile ⭐ !

## 📞 Contact

Pour toute question ou suggestion concernant le projet Nomade, n'hésitez pas à ouvrir une issue.

---

**Nomade** - *Votre compagnon de voyage numérique* 🧳✈️

---

## 📌 Tags

`nomade` `travel-booking` `database-design` `sql` `travel-platform` `reservation-system` `documentation` `learning` `database-architecture` `relational-database` `schema-design` `data-modeling` `educational`

