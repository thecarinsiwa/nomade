# 📋 Guide d'Installation Complète

## ⚠️ IMPORTANT : Ordre d'exécution

Pour que l'installation fonctionne correctement, suivez ces étapes **dans l'ordre** :

### Étape 1 : Créer les tables Django de base

Exécutez dans phpMyAdmin :
- `database/django_tables.sql`

### Étape 2 : Corriger la table auth_permission (OBLIGATOIRE)

**⚠️ Cette étape est CRITIQUE !**

Exécutez dans phpMyAdmin :
- `database/FINAL_FIX.sql`

Ce script supprime et recrée la table `auth_permission` avec la bonne structure (valeur par défaut pour le champ `name`).

### Étape 3 : Appliquer les migrations Django

```bash
cd api
python manage.py migrate
```

### Étape 4 : Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### Étape 5 : Tester le serveur

```bash
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

## 🔍 Vérification

Après l'étape 2, vérifiez que la table est correcte :

```sql
DESCRIBE auth_permission;
```

Vous devriez voir :
- `name` avec `Default: ''` (chaîne vide)
- `Null: NO`

## ❌ Si les migrations échouent toujours

1. Vérifiez que vous avez bien exécuté `FINAL_FIX.sql`
2. Vérifiez la structure de la table : `DESCRIBE auth_permission;`
3. Si nécessaire, réexécutez `FINAL_FIX.sql`

## ✅ Une fois tout fonctionnel

Vous pourrez :
- Accéder à l'admin Django : `http://localhost:8000/admin/`
- Utiliser l'API REST : `http://localhost:8000/api/users/`
- Tester l'authentification avec les tokens

