import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Award, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative h-64 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À propos de Nomade</h1>
            <p className="text-xl">Votre compagnon de voyage depuis 2020</p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
              <p className="text-lg text-gray-700 mb-4">
                Nomade est né de la passion pour le voyage et le désir de rendre les expériences de voyage
                accessibles à tous. Fondée en 2020, notre plateforme connecte les voyageurs aux meilleures
                destinations et hébergements à travers le monde.
              </p>
              <p className="text-lg text-gray-700">
                Nous croyons que chaque voyage devrait être une aventure mémorable, et nous nous engageons
                à offrir un service exceptionnel à chaque étape de votre parcours.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
                  <p className="text-gray-600">
                    Rendre le voyage accessible à tous, partout dans le monde
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Passion</h3>
                  <p className="text-gray-600">
                    Nous aimons ce que nous faisons et cela se ressent
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    Nous visons l&apos;excellence dans chaque interaction
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Communauté</h3>
                  <p className="text-gray-600">
                    Construire une communauté de voyageurs passionnés
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-gray-600">Voyageurs satisfaits</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-gray-600">Destinations</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                <div className="text-gray-600">Hébergements</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4.8</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

