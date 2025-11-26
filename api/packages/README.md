# 📦 API Packages (Forfaits)

Cette application Django gère le domaine fonctionnel **FORFAITS (PACKAGES)** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **package_types** - Types de forfaits
2. **packages** - Forfaits (nom, description, pourcentage de réduction, dates)
3. **package_components** - Composants d'un forfait (hôtel, vol, voiture, activité, croisière)

## 🔗 Endpoints API

### Base URL
```
/api/packages/
```

### Endpoints Disponibles

#### Package Types
- `GET /api/packages/package-types/` - Liste des types de forfaits
- `POST /api/packages/package-types/` - Créer un type
- `GET /api/packages/package-types/{id}/` - Détails d'un type
- `PUT/PATCH /api/packages/package-types/{id}/` - Modifier un type
- `DELETE /api/packages/package-types/{id}/` - Supprimer un type

#### Packages
- `GET /api/packages/packages/` - Liste des forfaits
- `POST /api/packages/packages/` - Créer un forfait
- `GET /api/packages/packages/{id}/` - Détails d'un forfait
- `PUT/PATCH /api/packages/packages/{id}/` - Modifier un forfait
- `DELETE /api/packages/packages/{id}/` - Supprimer un forfait
- `GET /api/packages/packages/search/` - Recherche avancée de forfaits
- `GET /api/packages/packages/{id}/components/` - Composants d'un forfait
- `GET /api/packages/packages/{id}/calculate_price/` - Calculer le prix total avec réduction

#### Package Components
- `GET /api/packages/components/` - Liste des composants
- `POST /api/packages/components/` - Créer un composant
- `GET /api/packages/components/{id}/` - Détails d'un composant
- `PUT/PATCH /api/packages/components/{id}/` - Modifier un composant
- `DELETE /api/packages/components/{id}/` - Supprimer un composant

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-discount_percent`)
- `?page=` - Pagination

### Filtres Spécifiques Packages
- `?package_type_id=` - Filtrer par type de forfait
- `?status=` - Filtrer par statut (active, inactive)
- `?active_only=` - Filtrer uniquement les forfaits actifs (true/false)
- `?date=` - Filtrer par date de validité (YYYY-MM-DD)
- `?min_discount=` - Réduction minimale en pourcentage
- `?component_type=` - Filtrer par type de composant (hotel, flight, car, activity, cruise)
- `?component_id=` - Filtrer par ID de composant

### Filtres Spécifiques Package Components
- `?package_id=` - Filtrer par forfait
- `?component_type=` - Filtrer par type de composant
- `?component_id=` - Filtrer par ID de composant

## 📝 Exemples d'Utilisation

### Recherche de forfaits
```http
GET /api/packages/packages/search/?component_type=hotel&component_type=flight&min_discount=10&date=2025-06-01
```

### Recherche avec composant spécifique
```http
GET /api/packages/packages/search/?component_id={uuid}&active_only=true
```

### Composants d'un forfait
```http
GET /api/packages/packages/{id}/components/?component_type=hotel
```

### Calculer le prix d'un forfait
```http
GET /api/packages/packages/{id}/calculate_price/
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types de Composants

Les forfaits peuvent contenir les types de composants suivants :
- **hotel** - Propriétés d'hébergement
- **flight** - Vols
- **car** - Voitures de location
- **activity** - Activités touristiques
- **cruise** - Croisières

## 🚀 Installation

1. Les migrations sont déjà créées dans `packages/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate packages --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/packages/
```

