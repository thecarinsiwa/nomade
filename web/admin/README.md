# Nomade Admin Panel

Panneau d'administration moderne pour la plateforme Nomade, développé avec Next.js 14+ (App Router), Tailwind CSS, TypeScript et shadcn/ui.

## 🚀 Fonctionnalités

- ✅ Authentification complète (login/logout)
- ✅ Dashboard dynamique avec statistiques
- ✅ Module Users (CRUD complet)
- ✅ Navbar responsive avec menu mobile
- ✅ Design moderne et animations fluides
- ✅ Architecture modulaire et scalable

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- API Django REST Framework en cours d'exécution (par défaut sur http://localhost:8000)

## 🛠️ Installation

1. **Installer les dépendances**

```bash
cd web/admin
npm install
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du dossier `web/admin` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Lancer le serveur de développement**

```bash
npm run dev
```

Le panneau d'administration sera accessible sur [http://localhost:3001](http://localhost:3001)

## 📁 Structure du projet

```
web/admin/
├── app/                    # Pages Next.js (App Router)
│   ├── dashboard/         # Page dashboard
│   ├── users/             # Module utilisateurs
│   ├── login/             # Page de connexion
│   └── ...
├── components/            # Composants React
│   ├── ui/               # Composants UI (shadcn/ui)
│   ├── layout/           # Composants de layout
│   └── users/            # Composants spécifiques aux utilisateurs
├── lib/                  # Utilitaires et services
│   ├── api.ts            # Configuration Axios
│   ├── services/         # Services API
│   └── store/            # Stores Zustand
├── types/                # Types TypeScript
└── hooks/                # Hooks React personnalisés
```

## 🎨 Stack technique

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (composants UI)
- **Zustand** (gestion d'état)
- **Axios** (requêtes HTTP)
- **Framer Motion** (animations)
- **React Hook Form** (formulaires)
- **Zod** (validation)
- **lucide-react** (icônes)

## 📚 Modules disponibles

### ✅ Utilisateurs (Users)
- Liste des utilisateurs avec recherche
- Création, modification, suppression
- Vue détaillée avec profil, adresses, méthodes de paiement
- Gestion des statuts (actif, inactif, suspendu, supprimé)

### 🚧 Modules à venir
- Réservations (Bookings)
- Packages
- Paiements (Payments)
- Analytiques (Analytics)
- Paramètres (Settings)

## 🔐 Authentification

L'authentification utilise le système de tokens Django REST Framework. Le token est stocké dans le localStorage et automatiquement inclus dans toutes les requêtes API.

## 🎯 Développement

### Ajouter un nouveau module

1. Créer le service API dans `lib/services/`
2. Créer les composants dans `components/[module]/`
3. Créer la page dans `app/[module]/page.tsx`
4. Ajouter le lien dans la navbar (`components/layout/navbar.tsx`)

### Exemple de service API

```typescript
// lib/services/example.ts
import api from '@/lib/api'

export const exampleService = {
  async getAll(): Promise<any[]> {
    const response = await api.get('/api/example/')
    return response.data
  },
}
```

## 📝 Notes

- Le panneau d'administration est séparé du client principal et fonctionne sur le port 3001
- Assurez-vous que l'API Django est configurée pour accepter les requêtes CORS depuis `http://localhost:3001`
- Les tokens d'authentification sont persistés dans le localStorage

## 🤝 Contribution

Pour ajouter de nouveaux modules ou fonctionnalités, suivez la structure existante et maintenez la cohérence du code.

## 📄 Licence

Ce projet fait partie de la plateforme Nomade.

