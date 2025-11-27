"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Star, Wifi, Car, Utensils, Dumbbell, Waves, Users, Calendar, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

// Mock data
const destinationData = {
  id: "1",
  name: "Hôtel Plaza Paris",
  location: "Paris, France",
  rating: 4.8,
  reviewCount: 324,
  price: 120,
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  ],
  description: `
    Découvrez le charme authentique de Paris depuis cet hôtel élégant situé en plein cœur de la capitale.
    L'Hôtel Plaza Paris vous offre un séjour inoubliable avec ses chambres modernes et confortables,
    son service exceptionnel et son emplacement privilégié à proximité des plus beaux monuments parisiens.
    
    Profitez de notre spa, de notre restaurant gastronomique et de nos équipements de dernière génération.
    Idéal pour les voyages d'affaires comme pour les séjours romantiques.
  `,
  amenities: [
    { name: "Wi-Fi gratuit", icon: Wifi },
    { name: "Parking", icon: Car },
    { name: "Restaurant", icon: Utensils },
    { name: "Salle de sport", icon: Dumbbell },
    { name: "Piscine", icon: Waves },
  ],
  coordinates: { lat: 48.8566, lng: 2.3522 },
}

const reviews = [
  {
    id: 1,
    author: "Marie Dupont",
    rating: 5,
    date: "2024-01-15",
    comment: "Excellent séjour ! L'hôtel est magnifique et le personnel très accueillant.",
  },
  {
    id: 2,
    author: "Jean Martin",
    rating: 4,
    date: "2024-01-10",
    comment: "Très bon rapport qualité-prix. L'emplacement est parfait pour visiter Paris.",
  },
  {
    id: 3,
    author: "Sophie Bernard",
    rating: 5,
    date: "2024-01-05",
    comment: "Un hôtel de charme avec tout le confort moderne. Je recommande vivement !",
  },
]

export default function DestinationDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")

  const data = destinationData // In real app, fetch by params.id

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Image Gallery */}
        <div className="relative h-[500px] md:h-[600px]">
          <div className="grid grid-cols-4 gap-2 h-full">
            <div className="col-span-4 md:col-span-2 row-span-2 relative">
              <Image
                src={data.images[selectedImage]}
                alt={data.name}
                fill
                className="object-cover cursor-pointer"
                onClick={() => setSelectedImage(0)}
              />
            </div>
            {data.images.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative hidden md:block cursor-pointer"
                onClick={() => setSelectedImage(idx + 1)}
              >
                <Image
                  src={img}
                  alt={`${data.name} ${idx + 1}`}
                  fill
                  className="object-cover hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{data.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-lg font-semibold">{data.rating}</span>
                      <span className="text-gray-500 ml-1">({data.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">À propos</h2>
                  <p className="text-gray-700 whitespace-pre-line">{data.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Équipements</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.amenities.map((amenity, idx) => {
                      const Icon = amenity.icon
                      return (
                        <div key={idx} className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-sm">{amenity.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Carte interactive (Mapbox/Leaflet)</p>
                    <p className="text-sm text-gray-400 ml-2">
                      {data.coordinates.lat}, {data.coordinates.lng}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.author}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-primary">€{data.price}</span>
                      <span className="text-gray-500 ml-2">/ nuit</span>
                    </div>
                  </div>

                  <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-4" size="lg">
                        Réserver maintenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Réserver votre séjour</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Dates</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={checkIn}
                              onChange={(e) => setCheckIn(e.target.value)}
                              className="border rounded-md px-3 py-2"
                            />
                            <input
                              type="date"
                              value={checkOut}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="border rounded-md px-3 py-2"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Voyageurs</label>
                          <input
                            type="number"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            min="1"
                            className="border rounded-md px-3 py-2 w-full"
                          />
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between mb-2">
                            <span>€{data.price} x 3 nuits</span>
                            <span>€{data.price * 3}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>Frais de service</span>
                            <span>€{(data.price * 3 * 0.1).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>€{(data.price * 3 * 1.1).toFixed(2)}</span>
                          </div>
                        </div>
                        <Button className="w-full" onClick={() => setShowBookingModal(false)}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Confirmer la réservation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Annulation gratuite jusqu&apos;à 24h avant</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Jusqu&apos;à 4 voyageurs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

