# 📊 Base de Données Nomade

Ce dossier contient les scripts SQL pour créer et gérer la base de données de la plateforme Nomade.

## 📁 Fichiers

- **`nomade_database.sql`** - Script principal de création de la base de données avec toutes les tables
- **`expedia_database_tables.txt`** - Documentation de la structure des tables

## 🚀 Installation

### Prérequis

- MySQL 5.7+ ou MariaDB 10.2+
- Accès administrateur à MySQL

### Étapes d'installation

1. **Ouvrir MySQL** (via ligne de commande ou phpMyAdmin)

2. **Exécuter le script SQL** :

   **Via ligne de commande :**
   ```bash
   mysql -u root -p < database/nomade_database.sql
   ```

   **Via MySQL CLI :**
   ```sql
   mysql -u root -p
   source database/nomade_database.sql
   ```

   **Via phpMyAdmin :**
   - Se connecter à phpMyAdmin
   - Sélectionner "Importer"
   - Choisir le fichier `nomade_database.sql`
   - Cliquer sur "Exécuter"

3. **Vérifier la création** :
   ```sql
   USE nomade;
   SHOW TABLES;
   ```

## 🔑 Caractéristiques

### Clés Primaires UUID

Toutes les tables utilisent des **UUID (Universally Unique Identifier)** comme clés primaires avec génération automatique :

```sql
id CHAR(36) PRIMARY KEY DEFAULT (UUID())
```

**Avantages :**
- ✅ Identifiants uniques globaux
- ✅ Pas de collision entre serveurs
- ✅ Sécurité accrue (non séquentiels)
- ✅ Génération automatique

**Exemple d'UUID généré :**
```
550e8400-e29b-41d4-a716-446655440000
```

### Structure de la Base de Données

La base de données contient **plus de 60 tables** organisées en domaines fonctionnels :

1. **Gestion des Utilisateurs** (5 tables)
   - users, user_profiles, user_addresses, user_payment_methods, user_sessions

2. **Programme de Fidélité** (3 tables)
   - onekey_accounts, onekey_rewards, onekey_transactions

3. **Hébergements** (15 tables)
   - properties, rooms, room_availability, property_amenities, etc.

4. **Vols** (6 tables)
   - airlines, airports, flights, flight_availability, etc.

5. **Locations de Voitures** (5 tables)
   - car_rental_companies, cars, car_availability, etc.

6. **Croisières** (6 tables)
   - cruise_lines, cruises, cruise_cabins, etc.

7. **Activités** (3 tables)
   - activities, activity_categories, activity_schedules

8. **Forfaits** (3 tables)
   - packages, package_types, package_components

9. **Réservations** (9 tables)
   - bookings, booking_items, booking_rooms, booking_flights, etc.

10. **Paiements** (5 tables)
    - payments, payment_methods, refunds, invoices, etc.

11. **Avis et Évaluations** (3 tables)
    - reviews, review_ratings, review_photos

12. **Promotions** (3 tables)
    - promotions, promotion_types, promotion_codes

13. **Destinations** (4 tables)
    - countries, regions, cities, destinations

14. **Notifications** (2 tables)
    - notifications, email_templates

15. **Support Client** (3 tables)
    - support_tickets, support_categories, support_messages

16. **Configuration** (3 tables)
    - currencies, languages, settings

17. **Analytics** (2 tables)
    - user_searches, analytics_events

18. **Sécurité** (2 tables)
    - audit_logs, security_events

## 🔗 Relations Clés

### Relations Principales

- **users** → **bookings** (1:N)
- **bookings** → **booking_items** (1:N)
- **bookings** → **payments** (1:N)
- **properties** → **rooms** (1:N)
- **rooms** → **room_availability** (1:N)
- **flights** → **flight_availability** (1:N)

### Contraintes de Clés Étrangères

Toutes les relations utilisent des **clés étrangères** avec :
- `ON DELETE CASCADE` pour les tables dépendantes
- `ON DELETE SET NULL` pour les relations optionnelles

## 📝 Notes Importantes

### Encodage

La base de données utilise **UTF-8 (utf8mb4)** pour supporter tous les caractères Unicode, y compris les emojis.

### Index

Des index ont été créés sur :
- Les colonnes fréquemment recherchées (email, booking_reference, etc.)
- Les colonnes utilisées dans les jointures (user_id, booking_id, etc.)
- Les colonnes de dates pour les recherches temporelles

### Valeurs par Défaut

- **Timestamps** : `created_at` et `updated_at` sont automatiquement gérés
- **Statuts** : Valeurs par défaut définies (active, pending, etc.)
- **Devises** : EUR par défaut
- **Langues** : Français (fr) par défaut

## 🔧 Maintenance

### Sauvegarde

```bash
mysqldump -u root -p nomade > nomade_backup.sql
```

### Restauration

```bash
mysql -u root -p nomade < nomade_backup.sql
```

### Vérification de l'Intégrité

```sql
-- Vérifier les contraintes de clés étrangères
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    REFERENCED_TABLE_SCHEMA = 'nomade';
```

## 🐛 Dépannage

### Erreur : "Unknown function UUID()"

Si vous obtenez cette erreur, vérifiez votre version de MySQL :
- MySQL 8.0+ : Support natif de UUID()
- MySQL 5.7 : Nécessite une fonction personnalisée ou utilisez une autre méthode

**Solution pour MySQL 5.7 :**
```sql
-- Créer une fonction UUID personnalisée
DELIMITER //
CREATE FUNCTION UUID() RETURNS CHAR(36)
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN LOWER(CONCAT(
        HEX(RANDOM_BYTES(4)), '-',
        HEX(RANDOM_BYTES(2)), '-',
        CONCAT('4', SUBSTRING(HEX(RANDOM_BYTES(2)), 2, 3)), '-',
        CONCAT(HEX(FLOOR(ASCII(RANDOM_BYTES(1)) / 64) + 8), SUBSTRING(HEX(RANDOM_BYTES(2)), 2, 3)), '-',
        HEX(RANDOM_BYTES(6))
    ));
END//
DELIMITER ;
```

### Erreur : "Table already exists"

Si certaines tables existent déjà :
```sql
DROP DATABASE IF EXISTS nomade;
-- Puis réexécutez le script
```

## 📚 Documentation Complémentaire

Pour plus de détails sur la structure et les relations, consultez :
- `../documentation_structure_bdd_expedia.md` - Documentation pédagogique complète
- `expedia_database_tables.txt` - Liste exhaustive des tables

## ✅ Checklist Post-Installation

- [ ] Base de données créée
- [ ] Toutes les tables créées (vérifier avec `SHOW TABLES;`)
- [ ] Clés étrangères actives
- [ ] Index créés
- [ ] Test de connexion réussi
- [ ] Insertion d'un enregistrement de test

## 🔐 Sécurité

⚠️ **Important** : Après l'installation en production :
1. Changez les mots de passe par défaut
2. Configurez les permissions utilisateur appropriées
3. Activez les logs d'audit
4. Configurez les sauvegardes automatiques

---

**Date de création :** 2025  
**Version :** 1.0

