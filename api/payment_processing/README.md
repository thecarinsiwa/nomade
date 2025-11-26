# 💳 API Payment Processing (Paiements)

Cette application Django gère le domaine fonctionnel **PAIEMENTS** de la plateforme Nomade.

## 📋 Tables Gérées (5 tables)

1. **payment_methods** - Méthodes de paiement acceptées (carte, PayPal, virement)
2. **payment_statuses** - Statuts (réussi, échoué, en attente, remboursé)
3. **payments** - Transactions de paiement (montant, méthode, statut, ID transaction)
4. **refunds** - Remboursements (montant, raison, statut)
5. **invoices** - Factures (numéro unique, montant, TVA, PDF)

## 🔗 Endpoints API

### Base URL
```
/api/payments/
```

### Endpoints Disponibles

#### Payment Methods
- `GET /api/payments/payment-methods/` - Liste des méthodes de paiement
- `POST /api/payments/payment-methods/` - Créer une méthode
- `GET /api/payments/payment-methods/{id}/` - Détails d'une méthode
- `PUT/PATCH /api/payments/payment-methods/{id}/` - Modifier une méthode
- `DELETE /api/payments/payment-methods/{id}/` - Supprimer une méthode

#### Payment Statuses
- `GET /api/payments/payment-statuses/` - Liste des statuts
- `POST /api/payments/payment-statuses/` - Créer un statut
- `GET /api/payments/payment-statuses/{id}/` - Détails d'un statut
- `PUT/PATCH /api/payments/payment-statuses/{id}/` - Modifier un statut
- `DELETE /api/payments/payment-statuses/{id}/` - Supprimer un statut

#### Payments
- `GET /api/payments/payments/` - Liste des paiements (uniquement les vôtres si non-staff)
- `POST /api/payments/payments/` - Créer un paiement
- `GET /api/payments/payments/{id}/` - Détails d'un paiement
- `PUT/PATCH /api/payments/payments/{id}/` - Modifier un paiement
- `DELETE /api/payments/payments/{id}/` - Supprimer un paiement
- `GET /api/payments/payments/my_payments/` - Mes paiements
- `GET /api/payments/payments/{id}/refunds/` - Remboursements d'un paiement
- `POST /api/payments/payments/{id}/process_refund/` - Créer un remboursement

#### Refunds
- `GET /api/payments/refunds/` - Liste des remboursements
- `POST /api/payments/refunds/` - Créer un remboursement
- `GET /api/payments/refunds/{id}/` - Détails d'un remboursement
- `PUT/PATCH /api/payments/refunds/{id}/` - Modifier un remboursement
- `DELETE /api/payments/refunds/{id}/` - Supprimer un remboursement

#### Invoices
- `GET /api/payments/invoices/` - Liste des factures (uniquement les vôtres si non-staff)
- `POST /api/payments/invoices/` - Créer une facture
- `GET /api/payments/invoices/{id}/` - Détails d'une facture
- `PUT/PATCH /api/payments/invoices/{id}/` - Modifier une facture
- `DELETE /api/payments/invoices/{id}/` - Supprimer une facture

## 🔍 Filtres et Recherche

### Filtres Communs
- `?search=` - Recherche textuelle (selon les champs configurés)
- `?ordering=` - Tri (ex: `?ordering=-created_at`)
- `?page=` - Pagination

### Filtres Spécifiques Payment Methods
- `?active_only=` - Filtrer uniquement les méthodes actives (true/false)

### Filtres Spécifiques Payments
- `?booking_id=` - Filtrer par réservation
- `?payment_method_id=` - Filtrer par méthode de paiement
- `?status_id=` - Filtrer par statut
- `?transaction_id=` - Filtrer par ID de transaction
- `?date_from=` - Date de paiement minimale
- `?date_to=` - Date de paiement maximale
- `?min_amount=` - Montant minimum
- `?max_amount=` - Montant maximum

### Filtres Spécifiques Refunds
- `?payment_id=` - Filtrer par paiement
- `?status=` - Filtrer par statut (pending, processed, rejected)

### Filtres Spécifiques Invoices
- `?booking_id=` - Filtrer par réservation
- `?invoice_number=` - Filtrer par numéro de facture
- `?date_from=` - Date de facture minimale
- `?date_to=` - Date de facture maximale

## 📝 Exemples d'Utilisation

### Mes paiements
```http
GET /api/payments/payments/my_payments/
```

### Remboursements d'un paiement
```http
GET /api/payments/payments/{id}/refunds/
```

### Créer un remboursement
```http
POST /api/payments/payments/{id}/process_refund/
Content-Type: application/json

{
    "amount": 100.00,
    "reason": "Annulation de réservation"
}
```

### Recherche de paiements
```http
GET /api/payments/payments/?booking_id={uuid}&status_id={uuid}&date_from=2025-01-01
```

## 🔐 Permissions

- **Toutes les actions** : Nécessitent une authentification (Token ou Session)
- **Sécurité** : Les utilisateurs ne peuvent voir que leurs propres paiements et factures (sauf staff)

## 📊 Modèles Django

Tous les modèles utilisent des **UUID** comme clés primaires et suivent la structure de la base de données SQL définie dans `database/nomade_database.sql`.

## 🎯 Fonctionnalités Spéciales

- **Génération automatique de numéro de facture** : Format `INV-YYYYMMDD-XXXXXX`
- **Gestion des remboursements** : Vérification que le montant total ne dépasse pas le paiement
- **Calcul automatique de processed_at** : Mis à jour automatiquement quand le statut passe à 'processed'
- **Calcul du montant HT** : Propriété `subtotal` pour les factures

## 🚀 Installation

1. Les migrations sont déjà créées dans `payment_processing/migrations/`
2. Exécuter les migrations :
   ```bash
   python manage.py migrate payment_processing --fake-initial
   ```
3. L'app est déjà ajoutée dans `settings.py` et `urls.py`

## 📚 Documentation Complète

Pour plus de détails sur chaque endpoint, consultez la documentation interactive de Django REST Framework à :
```
http://localhost:8000/api/payments/
```

