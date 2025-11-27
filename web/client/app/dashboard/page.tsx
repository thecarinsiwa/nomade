"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, User, HelpCircle, Package, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const tabs = [
  { id: "bookings", label: "Réservations", icon: Package },
  { id: "profile", label: "Profil", icon: User },
  { id: "payments", label: "Paiements", icon: CreditCard },
  { id: "support", label: "Support", icon: HelpCircle },
]

const mockBookings = [
  {
    id: "1",
    destination: "Hôtel Plaza Paris",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    checkIn: "2024-03-15",
    checkOut: "2024-03-18",
    guests: 2,
    price: 360,
    status: "confirmed",
  },
  {
    id: "2",
    destination: "Resort Maldives",
    location: "Maldives",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    checkIn: "2024-04-20",
    checkOut: "2024-04-27",
    guests: 2,
    price: 2450,
    status: "pending",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("bookings")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmé</Badge>
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "bookings" && (
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 h-48 md:h-auto">
                        <Image
                          src={booking.image}
                          alt={booking.destination}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{booking.destination}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{booking.location}</span>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Arrivée</p>
                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString("fr-FR")}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Départ</p>
                            <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString("fr-FR")}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Voyageurs</p>
                            <p className="font-medium">{booking.guests}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Prix total</p>
                            <p className="font-medium text-lg text-primary">€{booking.price}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Voir les détails
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button variant="outline" size="sm">
                              Annuler
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Prénom</label>
                      <input
                        type="text"
                        defaultValue="Jean"
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom</label>
                      <input
                        type="text"
                        defaultValue="Dupont"
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="jean.dupont@example.com"
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <input
                        type="tel"
                        defaultValue="+33 6 12 34 56 78"
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                    <Button>Enregistrer les modifications</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Préférences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Langue</label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>Français</option>
                        <option>English</option>
                        <option>Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Devise</label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>EUR (€)</option>
                        <option>USD ($)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Recevoir des offres par email</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Méthodes de paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">**** **** **** 1234</p>
                            <p className="text-sm text-gray-600">Expire le 12/25</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Supprimer</Button>
                      </div>
                      <Button variant="outline" className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Ajouter une carte
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historique des paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: "1", date: "2024-03-10", amount: 360, description: "Hôtel Plaza Paris" },
                        { id: "2", date: "2024-02-15", amount: 450, description: "Resort Maldives" },
                      ].map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString("fr-FR")}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">€{payment.amount}</p>
                            <Button variant="ghost" size="sm" className="text-xs">Facture</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "support" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Centre d&apos;aide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href="/support/faq">
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Questions fréquentes
                      </Button>
                    </Link>
                    <Link href="/support/contact">
                      <Button variant="outline" className="w-full justify-start">
                        Contacter le support
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nouvelle demande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Sujet</label>
                      <select className="w-full border rounded-md px-3 py-2">
                        <option>Question sur une réservation</option>
                        <option>Problème de paiement</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea
                        className="w-full border rounded-md px-3 py-2 h-32"
                        placeholder="Décrivez votre problème..."
                      />
                    </div>
                    <Button>Envoyer</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

