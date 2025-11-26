# 🔐 API Security (Sécurité et Conformité)

Cette application Django gère le domaine fonctionnel **SÉCURITÉ ET CONFORMITÉ** de la plateforme Nomade.

## 📋 Tables Gérées (2 tables)

1. **audit_logs** - Logs d'audit (action, table, enregistrement, valeurs anciennes/nouvelles)
2. **security_events** - Événements de sécurité (type, sévérité, description, IP)

## 🔗 Endpoints API

### Base URL
```
/api/security/
```

### Endpoints Disponibles

#### Audit Logs
- `GET /api/security/audit-logs/` - Liste des logs d'audit (lecture seule)
- `GET /api/security/audit-logs/{id}/` - Détails d'un log
- `GET /api/security/audit-logs/statistics/` - Statistiques sur les logs (staff seulement)

#### Security Events
- `GET /api/security/security-events/` - Liste des événements (uniquement les vôtres si non-staff)
- `POST /api/security/security-events/` - Créer un événement
- `GET /api/security/security-events/{id}/` - Détails d'un événement
- `PUT/PATCH /api/security/security-events/{id}/` - Modifier un événement
- `DELETE /api/security/security-events/{id}/` - Supprimer un événement
- `GET /api/security/security-events/critical/` - Événements critiques
- `GET /api/security/security-events/statistics/` - Statistiques sur les événements (staff seulement)

## 🔍 Filtres et Recherche

### Filtres Communs
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Audit Logs
- `?user_id=` - Filtrer par utilisateur (staff seulement)
- `?action=` - Filtrer par action (recherche partielle)
- `?table_name=` - Filtrer par table (recherche partielle)
- `?record_id=` - Filtrer par ID d'enregistrement
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale

### Filtres Spécifiques Security Events
- `?user_id=` - Filtrer par utilisateur (staff seulement)
- `?event_type=` - Filtrer par type d'événement (recherche partielle)
- `?severity=` - Filtrer par sévérité (low, medium, high, critical)
- `?critical_only=` - Filtrer uniquement les événements critiques (true/false)
- `?high_severity_only=` - Filtrer les événements de haute sévérité (true/false)
- `?date_from=` - Date de création minimale
- `?date_to=` - Date de création maximale

## 📝 Exemples d'Utilisation

### Statistiques sur les logs d'audit (staff seulement)
```http
GET /api/security/audit-logs/statistics/?date_from=2025-01-01&date_to=2025-12-31
```

Réponse inclut :
- Total de logs
- Répartition par action
- Répartition par table
- Top 10 utilisateurs
- Logs par jour (30 derniers jours)

### Événements critiques
```http
GET /api/security/security-events/critical/
```

### Statistiques sur les événements (staff seulement)
```http
GET /api/security/security-events/statistics/?date_from=2025-01-01
```

Réponse inclut :
- Total d'événements
- Événements critiques récents (7 derniers jours)
- Répartition par type
- Répartition par sévérité
- Top 10 utilisateurs

### Créer un événement de sécurité
```http
POST /api/security/security-events/
Content-Type: application/json

{
    "event_type": "failed_login",
    "severity": "high",
    "description": "Tentative de connexion échouée avec mauvais mot de passe"
}
```

L'IP et le user agent sont automatiquement récupérés depuis la requête.

### Recherche de logs d'audit
```http
GET /api/security/audit-logs/?action=update&table_name=bookings&date_from=2025-01-01
```

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Audit Logs** : Lecture seule, les utilisateurs non-staff ne peuvent voir que leurs propres logs
- **Security Events** : Les utilisateurs non-staff ne peuvent voir que leurs propres événements (sauf staff)
- **Statistiques** : Nécessitent les permissions staff

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Types d'Actions d'Audit

Les logs d'audit peuvent enregistrer les actions suivantes :
- **create** - Création
- **update** - Modification
- **delete** - Suppression
- **view** - Consultations
- **export** - Export
- **login** - Connexion
- **logout** - Déconnexion

## 🚨 Niveaux de Sévérité

Les événements de sécurité peuvent avoir les sévérités suivantes :
- **low** - Faible
- **medium** - Moyenne
- **high** - Haute
- **critical** - Critique

## 🎯 Fonctionnalités Spéciales

- **Logs d'audit en lecture seule** : Empêchent la modification ou suppression accidentelle
- **Champs JSON** : Support natif pour les valeurs anciennes/nouvelles dans les logs d'audit
- **Détection automatique IP et User Agent** : Récupérés automatiquement lors de la création d'un événement
- **Méthodes utilitaires** :
  - `get_old_values_dict()` : Retourne les anciennes valeurs sous forme de dictionnaire
  - `get_new_values_dict()` : Retourne les nouvelles valeurs sous forme de dictionnaire
  - `is_critical` : Vérifie si l'événement est critique
  - `is_high_severity` : Vérifie si l'événement est de haute sévérité
- **Statistiques avancées** : Endpoints dédiés pour les analyses (staff seulement)
- **Protection admin** : Les logs d'audit ne peuvent pas être créés ou modifiés depuis l'admin

## 🚀 Installation

1. Les migrations sont déjà créées dans `security/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate security --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/security/
```

