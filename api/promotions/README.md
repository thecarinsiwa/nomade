# 🎁 API Promotions (Promotions et Offres)

Cette application Django gère le domaine fonctionnel **PROMOTIONS ET OFFRES** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **promotion_types** - Types de promotions (Black Friday, saisonnières, etc.)
2. **promotions** - Promotions (nom, description, pourcentage/montant, dates)
3. **promotion_codes** - Codes promotionnels (code unique, limite d'utilisation, compteur)

## 🔗 Endpoints API

### Base URL
```
/api/promotions/
```

### Endpoints Disponibles

#### Promotion Types
- `GET /api/promotions/promotion-types/` - Liste des types de promotions
- `POST /api/promotions/promotion-types/` - Créer un type
- `GET /api/promotions/promotion-types/{id}/` - Détails d'un type
- `PUT/PATCH /api/promotions/promotion-types/{id}/` - Modifier un type
- `DELETE /api/promotions/promotion-types/{id}/` - Supprimer un type

#### Promotions
- `GET /api/promotions/promotions/` - Liste des promotions
- `POST /api/promotions/promotions/` - Créer une promotion
- `GET /api/promotions/promotions/{id}/` - Détails d'une promotion
- `PUT/PATCH /api/promotions/promotions/{id}/` - Modifier une promotion
- `DELETE /api/promotions/promotions/{id}/` - Supprimer une promotion
- `GET /api/promotions/promotions/active/` - Promotions actuellement actives
- `GET /api/promotions/promotions/{id}/codes/` - Codes d'une promotion

#### Promotion Codes
- `GET /api/promotions/codes/` - Liste des codes promotionnels
- `POST /api/promotions/codes/` - Créer un code
- `GET /api/promotions/codes/{id}/` - Détails d'un code
- `PUT/PATCH /api/promotions/codes/{id}/` - Modifier un code
- `DELETE /api/promotions/codes/{id}/` - Supprimer un code
- `GET /api/promotions/codes/validate_code/` - Valider un code promotionnel
- `POST /api/promotions/codes/{id}/use_code/` - Utiliser un code (incrémente le compteur)

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Promotions
- `?promotion_type_id=` - Filtrer par type de promotion
- `?active_only=` - Filtrer uniquement les promotions actives (true/false)
- `?currently_active=` - Filtrer les promotions actuellement actives (true/false)
- `?date=` - Filtrer par date de validité (YYYY-MM-DD)
- `?has_discount_percent=` - Filtrer les promotions avec réduction en pourcentage (true/false)
- `?has_discount_amount=` - Filtrer les promotions avec réduction en montant fixe (true/false)

### Filtres Spécifiques Promotion Codes
- `?promotion_id=` - Filtrer par promotion
- `?code=` - Filtrer par code (recherche partielle)
- `?active_only=` - Filtrer uniquement les codes actifs (true/false)
- `?available_only=` - Filtrer uniquement les codes disponibles (true/false)

## 📝 Exemples d'Utilisation

### Promotions actuellement actives
```http
GET /api/promotions/promotions/active/
```

### Valider un code promotionnel
```http
GET /api/promotions/codes/validate_code/?code=BLACKFRIDAY2025
```

Réponse inclut :
- Informations du code
- `valid`: true/false
- `is_available`: true/false
- `remaining_uses`: nombre d'utilisations restantes
- `reasons`: liste des raisons si le code n'est pas disponible

### Utiliser un code promotionnel
```http
POST /api/promotions/codes/{id}/use_code/
```

Incrémente le compteur `used_count` du code.

### Codes d'une promotion
```http
GET /api/promotions/promotions/{id}/codes/?available_only=true
```

### Recherche de promotions
```http
GET /api/promotions/promotions/?currently_active=true&promotion_type_id={uuid}
```

## 🔐 Permissions

- **Lecture** : Accessible à tous (authentifiés ou non)
- **Écriture** : Nécessite une authentification (Token ou Session)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Fonctionnalités Spéciales

- **Validation automatique** : Un code promotionnel ne peut être utilisé que s'il est actif, que la promotion est active et dans sa période de validité, et que la limite d'utilisation n'est pas atteinte
- **Compteur d'utilisation** : Suivi automatique du nombre d'utilisations d'un code
- **Propriété `is_available`** : Vérifie automatiquement si un code peut être utilisé
- **Propriété `is_currently_active`** : Vérifie si une promotion est actuellement active
- **Propriété `discount_display`** : Affiche la réduction de manière lisible (% ou montant)
- **Propriété `remaining_uses`** : Calcule le nombre d'utilisations restantes (None = illimité)

## 🚀 Installation

1. Les migrations sont déjà créées dans `promotions/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate promotions --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/promotions/
```

