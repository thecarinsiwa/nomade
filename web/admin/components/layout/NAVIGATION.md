# Navigation Structure

## Architecture

Le système de navigation est composé de :

1. **Navbar** (`navbar.tsx`) - Barre de navigation en haut
   - Logo et titre
   - Bouton menu mobile (sur mobile/tablette)
   - Menu utilisateur avec dropdown

2. **Sidebar** (`sidebar.tsx`) - Menu latéral (desktop)
   - Visible uniquement sur écrans larges (lg+)
   - Menu collapsible avec 7 sections principales
   - Navigation hiérarchique avec sous-menus

3. **MobileSidebar** (`mobile-sidebar.tsx`) - Menu mobile
   - Utilise le composant Sheet de shadcn/ui
   - Même structure que le Sidebar
   - S'ouvre depuis le bouton menu dans la Navbar

## Structure des menus

### 7 Sections principales :

1. **Users & Authentication**
   - Users
   - Profiles
   - Addresses
   - Payment Methods
   - Sessions
   - Security Logs

2. **Loyalty (OneKey)**
   - Accounts
   - Points
   - Rewards
   - Loyalty Transactions
   - Promotions

3. **Travel Products**
   - Accommodations
   - Flights
   - Car Rentals
   - Cruises
   - Activities
   - Packages

4. **Bookings**
   - All Bookings
   - Booking Status
   - Cancellations
   - History

5. **Payments**
   - Transactions
   - Refunds

6. **Content & Customer Care**
   - Reviews
   - Destinations
   - Notifications
   - Support Tickets

7. **System & Analytics**
   - System Config
   - Currencies
   - Languages
   - Analytics

## Comportement responsive

- **Mobile (< 1024px)** : Sidebar caché, menu mobile disponible via bouton
- **Desktop (≥ 1024px)** : Sidebar visible, menu mobile caché

## Composants UI utilisés

- `Sheet` - Pour le menu mobile
- `Collapsible` - Pour les menus déroulants
- `DropdownMenu` - Pour le menu utilisateur
- `Button` - Pour tous les boutons
- `lucide-react` - Pour les icônes

