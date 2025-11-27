# Nomade - Application Web Client

Application frontend moderne pour la plateforme de voyage Nomade, développée avec Next.js 14, TypeScript, Tailwind CSS et shadcn/ui.

## 🚀 Technologies

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (composants UI)
- **Framer Motion** (animations)
- **Lucide React** (icônes)
- **Recharts** (graphiques)

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Démarrer le serveur de production
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
web/client/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── search/            # Page de recherche
│   ├── destination/[id]/  # Page de détail
│   ├── auth/              # Authentification
│   ├── dashboard/         # Tableau de bord
│   ├── about/             # À propos
│   ├── contact/           # Contact
│   └── support/           # Support
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── navbar.tsx        # Navigation
│   ├── footer.tsx        # Footer
│   ├── search-bar.tsx    # Barre de recherche
│   ├── destination-card.tsx
│   └── offer-card.tsx
├── lib/                   # Utilitaires
│   └── utils.ts
└── styles/               # Styles globaux
```

## 🎨 Design

- Palette de couleurs : Orange (#FF6B35), Blanc, Noir
- Design moderne et minimaliste inspiré d'Expedia/Airbnb
- Responsive design (mobile-first)
- Animations avec Framer Motion

## ✨ Fonctionnalités

- ✅ Page d'accueil avec recherche et destinations populaires
- ✅ Page de résultats avec filtres et tri
- ✅ Page de détail avec galerie et carte
- ✅ Authentification (Login/Inscription)
- ✅ Tableau de bord utilisateur
- ✅ Pages complémentaires (À propos, Contact, Support/FAQ)

## 🔧 Configuration

Les variables d'environnement peuvent être ajoutées dans un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📝 Notes

- Les données sont actuellement mockées (à remplacer par des appels API réels)
- La carte interactive nécessite une clé API Mapbox ou Leaflet
- Les images utilisent Unsplash (à remplacer par vos propres images)

