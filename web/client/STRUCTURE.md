# Structure du Projet Nomade Client

## 📁 Organisation des fichiers

```
web/client/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Page d'accueil (Landing Page)
│   ├── layout.tsx                # Layout principal
│   ├── globals.css               # Styles globaux Tailwind
│   ├── search/
│   │   └── page.tsx              # Page de résultats de recherche
│   ├── destination/
│   │   └── [id]/
│   │       └── page.tsx          # Page de détail destination/hôtel
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Page de connexion
│   │   └── register/
│   │       └── page.tsx          # Page d'inscription
│   ├── dashboard/
│   │   └── page.tsx              # Tableau de bord utilisateur
│   ├── about/
│   │   └── page.tsx              # Page À propos
│   ├── contact/
│   │   └── page.tsx              # Page Contact
│   └── support/
│       ├── faq/
│       │   └── page.tsx          # FAQ
│       └── contact/
│           └── page.tsx          # Contact support
│
├── components/                    # Composants React
│   ├── ui/                       # Composants shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── slider.tsx
│   ├── navbar.tsx                # Navigation principale
│   ├── footer.tsx                # Footer
│   ├── search-bar.tsx            # Barre de recherche
│   ├── destination-card.tsx      # Carte destination
│   └── offer-card.tsx            # Carte offre spéciale
│
├── lib/                          # Utilitaires
│   └── utils.ts                  # Fonctions utilitaires (cn, etc.)
│
├── types/                        # Types TypeScript
│   └── index.ts                  # Types partagés
│
├── package.json                  # Dépendances npm
├── tsconfig.json                 # Configuration TypeScript
├── tailwind.config.ts            # Configuration Tailwind CSS
├── next.config.js                # Configuration Next.js
├── postcss.config.js             # Configuration PostCSS
└── README.md                     # Documentation
```

## 🎨 Design System

### Couleurs
- **Primary**: #FF6B35 (Orange)
- **Secondary**: #F7931E (Orange clair)
- **Background**: Blanc/Gris clair
- **Text**: Noir/Gris foncé

### Composants UI
- Tous les composants suivent le design system shadcn/ui
- Utilisation de Tailwind CSS pour le styling
- Animations avec Framer Motion

## 📄 Pages créées

1. ✅ **Page d'accueil** (`/`)
   - Barre de recherche
   - Destinations populaires
   - Offres spéciales
   - Section features
   - CTA

2. ✅ **Résultats de recherche** (`/search`)
   - Filtres (prix, type)
   - Tri dynamique
   - Grille de résultats
   - Pagination

3. ✅ **Détail destination** (`/destination/[id]`)
   - Galerie d'images
   - Description
   - Équipements
   - Carte (placeholder)
   - Avis clients
   - Formulaire de réservation

4. ✅ **Authentification**
   - Login (`/auth/login`)
   - Inscription (`/auth/register`)

5. ✅ **Tableau de bord** (`/dashboard`)
   - Réservations
   - Profil
   - Paiements
   - Support

6. ✅ **Pages complémentaires**
   - À propos (`/about`)
   - Contact (`/contact`)
   - FAQ (`/support/faq`)
   - Support (`/support/contact`)

## 🚀 Prochaines étapes

1. Installer les dépendances : `npm install`
2. Configurer les variables d'environnement
3. Connecter à l'API Django (remplacer les données mockées)
4. Ajouter la carte interactive (Mapbox/Leaflet)
5. Implémenter l'authentification réelle
6. Ajouter les tests

