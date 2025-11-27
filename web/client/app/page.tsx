import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { DestinationCard } from "@/components/destination-card"
import { OfferCard } from "@/components/offer-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Headphones } from "lucide-react"
import Image from "next/image"

// Mock data
const popularDestinations = [
  {
    id: "1",
    name: "Hôtel Plaza Paris",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 120,
    rating: 4.8,
    reviewCount: 324,
    badge: "Populaire",
  },
  {
    id: "2",
    name: "Resort Maldives",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 350,
    rating: 4.9,
    reviewCount: 512,
    badge: "Luxe",
  },
  {
    id: "3",
    name: "Boutique Hotel Tokyo",
    location: "Tokyo, Japon",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    price: 180,
    rating: 4.7,
    reviewCount: 289,
  },
  {
    id: "4",
    name: "Beach Resort Bali",
    location: "Bali, Indonésie",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    price: 150,
    rating: 4.6,
    reviewCount: 456,
    badge: "Meilleur prix",
  },
  {
    id: "5",
    name: "Mountain Lodge",
    location: "Alpes, Suisse",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    price: 200,
    rating: 4.8,
    reviewCount: 198,
  },
  {
    id: "6",
    name: "City Center Hotel",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    price: 250,
    rating: 4.5,
    reviewCount: 623,
  },
]

const specialOffers = [
  {
    id: "1",
    title: "Évasion Méditerranéenne",
    description: "Profitez d'une semaine de détente sur les plus belles plages",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    discount: 30,
    destination: "Côte d'Azur, France",
  },
  {
    id: "2",
    title: "Aventure Tropicale",
    description: "Découvrez les îles paradisiaques avec cette offre exclusive",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    discount: 25,
    destination: "Caraïbes",
  },
  {
    id: "3",
    title: "Séjour Culturel",
    description: "Explorez les capitales européennes à prix réduit",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    discount: 20,
    destination: "Europe",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
            alt="Travel"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Explorez le monde avec{" "}
            <span className="text-primary">Nomade</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Trouvez les meilleures destinations et hébergements pour vos prochains voyages
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Destinations populaires
              </h2>
              <p className="text-gray-600">
                Découvrez les hébergements les plus appréciés
              </p>
            </div>
            <Button variant="outline">
              Voir tout
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.id} {...destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Offres spéciales
            </h2>
            <p className="text-gray-600">
              Ne manquez pas ces promotions exclusives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialOffers.map((offer) => (
              <OfferCard key={offer.id} {...offer} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Pourquoi choisir Nomade ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous vous offrons la meilleure expérience de voyage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meilleurs prix</h3>
              <p className="text-gray-600">
                Garantie du meilleur prix ou remboursement de la différence
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation sécurisée</h3>
              <p className="text-gray-600">
                Vos données et paiements sont protégés par un cryptage avancé
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support 24/7</h3>
              <p className="text-gray-600">
                Notre équipe est disponible à tout moment pour vous aider
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à partir à l&apos;aventure ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Inscrivez-vous maintenant et bénéficiez de 10% de réduction sur votre première réservation
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            Commencer maintenant
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

