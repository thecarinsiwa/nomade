# ⚙️ API System Config (Configuration Système)

Cette application Django gère le domaine fonctionnel **CONFIGURATION SYSTÈME** de la plateforme Nomade.

## 📋 Tables Gérées (3 tables)

1. **currencies** - Devises supportées (code, nom, symbole, taux de change)
2. **languages** - Langues disponibles (code, nom, nom natif)
3. **settings** - Paramètres système (clé/valeur, type, description)

## 🔗 Endpoints API

### Base URL
```
/api/system-config/
```

### Endpoints Disponibles

#### Currencies
- `GET /api/system-config/currencies/` - Liste des devises
- `POST /api/system-config/currencies/` - Créer une devise
- `GET /api/system-config/currencies/{id}/` - Détails d'une devise
- `PUT/PATCH /api/system-config/currencies/{id}/` - Modifier une devise
- `DELETE /api/system-config/currencies/{id}/` - Supprimer une devise
- `GET /api/system-config/currencies/active/` - Devises actives
- `GET /api/system-config/currencies/convert/` - Convertir un montant entre devises

#### Languages
- `GET /api/system-config/languages/` - Liste des langues
- `POST /api/system-config/languages/` - Créer une langue
- `GET /api/system-config/languages/{id}/` - Détails d'une langue
- `PUT/PATCH /api/system-config/languages/{id}/` - Modifier une langue
- `DELETE /api/system-config/languages/{id}/` - Supprimer une langue
- `GET /api/system-config/languages/active/` - Langues actives

#### Settings
- `GET /api/system-config/settings/` - Liste des paramètres (lecture seule pour non-staff)
- `POST /api/system-config/settings/` - Créer un paramètre (staff seulement)
- `GET /api/system-config/settings/{id}/` - Détails d'un paramètre
- `PUT/PATCH /api/system-config/settings/{id}/` - Modifier un paramètre (staff seulement)
- `DELETE /api/system-config/settings/{id}/` - Supprimer un paramètre (staff seulement)
- `GET /api/system-config/settings/get_value/` - Récupérer la valeur d'un paramètre par clé
- `POST /api/system-config/settings/{id}/set_value/` - Définir la valeur d'un paramètre (staff seulement)

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=code`)
- `?page=` - Pagination

### Filtres Spécifiques Currencies
- `?active_only=` - Filtrer uniquement les devises actives (true/false)

### Filtres Spécifiques Languages
- `?active_only=` - Filtrer uniquement les langues actives (true/false)

### Filtres Spécifiques Settings
- `?key=` - Filtrer par clé (recherche partielle)
- `?type=` - Filtrer par type (string, integer, float, boolean, json)

## 📝 Exemples d'Utilisation

### Devises actives
```http
GET /api/system-config/currencies/active/
```

### Convertir un montant entre devises
```http
GET /api/system-config/currencies/convert/?amount=100&from=EUR&to=USD
```

Réponse :
```json
{
    "amount": 100,
    "from_currency": "EUR",
    "to_currency": "USD",
    "converted_amount": 110.50,
    "exchange_rate": 1.105
}
```

### Langues actives
```http
GET /api/system-config/languages/active/
```

### Récupérer la valeur d'un paramètre
```http
GET /api/system-config/settings/get_value/?key=site_name
```

Réponse :
```json
{
    "key": "site_name",
    "value": "Nomade",
    "type": "string"
}
```

### Définir la valeur d'un paramètre (staff seulement)
```http
POST /api/system-config/settings/{id}/set_value/
Content-Type: application/json

{
    "value": "Nouvelle valeur"
}
```

### Recherche de devises
```http
GET /api/system-config/currencies/?active_only=true&search=EUR
```

## 🔐 Permissions

- **Currencies et Languages** : Lecture accessible à tous, écriture nécessite authentification
- **Settings** : Lecture accessible à tous, écriture nécessite les permissions staff

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types de Paramètres

Les paramètres système peuvent être de type :
- **string** - Chaîne de caractères
- **integer** - Entier
- **float** - Nombre décimal
- **boolean** - Booléen
- **json** - JSON

## 🎯 Fonctionnalités Spéciales

- **Conversion de devises** : Endpoint dédié pour convertir un montant entre deux devises
- **Conversion automatique des valeurs** : Les paramètres système sont automatiquement convertis selon leur type
- **Méthodes utilitaires** :
  - `get_value()` : Retourne la valeur convertie selon le type
  - `set_value()` : Définit la valeur en la convertissant en chaîne selon le type
- **Propriété `typed_value`** : Dans les serializers, retourne la valeur convertie

## 🚀 Installation

1. Les migrations sont déjà créées dans `system_config/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate system_config --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/system-config/
```

