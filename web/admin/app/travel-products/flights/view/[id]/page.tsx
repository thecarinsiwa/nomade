"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Plane,
  MapPin,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
  Globe,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminLayout } from "@/components/layout/admin-layout"
import { flightsService } from "@/lib/services/flights"
import { Flight, FlightAvailability, Airline, Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import { FlightImageGallery } from "@/components/flights/flight-image-gallery"
import Link from "next/link"

export default function ViewFlightPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const flightId = params.id as string

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setIsLoading(true)
        const data = await flightsService.getById(flightId)
        setFlight(data)
      } catch (error) {
        console.error("Error fetching flight:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger le vol",
          variant: "destructive",
        })
        router.push("/travel-products/flights")
      } finally {
        setIsLoading(false)
      }
    }

    if (flightId) {
      fetchFlight()
    }
  }, [flightId, router, toast])

  // Extraire les données des objets imbriqués
  const airline = typeof flight?.airline === 'object' ? flight.airline : null
  const departureAirport = typeof flight?.departure_airport === 'object' ? flight.departure_airport : null
  const arrivalAirport = typeof flight?.arrival_airport === 'object' ? flight.arrival_airport : null
  const availabilities = flight?.availabilities || []

  // Calculer les statistiques
  const totalAvailabilities = availabilities.length
  const totalSeats = availabilities.reduce((sum, a) => sum + a.available_seats, 0)
  const avgPrice = availabilities.length > 0
    ? availabilities.reduce((sum, a) => sum + Number(a.price), 0) / availabilities.length
    : 0
  const classesCount = new Set(availabilities.map(a => a.flight_class_name)).size

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "default",
      delayed: "outline",
      cancelled: "destructive",
      completed: "secondary",
    }
    const labels: Record<string, string> = {
      scheduled: "Programmé",
      delayed: "Retardé",
      cancelled: "Annulé",
      completed: "Terminé",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? `${mins}min` : ""}`
  }

  const formatPrice = (price: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!flight) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/flights">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/flights/edit/${flight.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/flights/delete/${flight.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {flight.flight_number}
              </h1>
              <p className="text-muted-foreground">
                {airline?.name || flight.airline_name || "Compagnie inconnue"}
                {flight.airline_code && ` (${flight.airline_code})`}
              </p>
            </div>
            <div className="ml-auto">
              {getStatusBadge(flight.status)}
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibilités</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAvailabilities}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dates disponibles
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sièges totaux</CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSeats}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Sièges disponibles
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgPrice > 0 ? formatPrice(avgPrice) : "-"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Prix moyen
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classesCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Classes de vol
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du vol</CardTitle>
              <CardDescription>Détails du vol {flight.flight_number}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Plane className="h-4 w-4" />
                    <span>Numéro de vol</span>
                  </p>
                  <p className="font-mono font-medium text-lg">{flight.flight_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Statut</p>
                  {getStatusBadge(flight.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Building2 className="h-4 w-4" />
                    <span>Compagnie aérienne</span>
                  </p>
                  {airline ? (
                    <Link href={`/travel-products/flights/airlines/view/${airline.id}`}>
                      <div className="flex items-center space-x-2 group">
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {airline.name}
                        </p>
                        {airline.code && (
                          <Badge variant="outline" className="font-mono">
                            {airline.code}
                          </Badge>
                        )}
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ) : (
                    <p className="font-medium">{flight.airline_name || "-"}</p>
                  )}
                </div>
                {flight.aircraft_type && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type d'avion</p>
                    <p className="font-medium">{flight.aircraft_type}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Durée</span>
                  </p>
                  <p className="font-medium">
                    {formatDuration(flight.duration_minutes)}
                    {flight.duration_hours && (
                      <span className="text-muted-foreground text-sm ml-2">
                        ({flight.duration_hours}h)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itinéraire</CardTitle>
              <CardDescription>Départ et arrivée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>Départ</span>
                  </p>
                  {departureAirport ? (
                    <Link href={`/travel-products/flights/airports/view/${departureAirport.id}`}>
                      <div className="group">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {departureAirport.iata_code}
                          </Badge>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {departureAirport.name}
                          </p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {departureAirport.city && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {departureAirport.city}
                            {departureAirport.country && `, ${departureAirport.country}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <Badge variant="outline" className="font-mono">
                        {flight.departure_airport_code || "-"}
                      </Badge>
                      <p className="font-medium mt-1">
                        {flight.departure_airport_name || "-"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-px w-full bg-border"></div>
                  <Plane className="h-5 w-5 text-muted-foreground mx-2" />
                  <div className="h-px w-full bg-border"></div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span>Arrivée</span>
                  </p>
                  {arrivalAirport ? (
                    <Link href={`/travel-products/flights/airports/view/${arrivalAirport.id}`}>
                      <div className="group">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {arrivalAirport.iata_code}
                          </Badge>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {arrivalAirport.name}
                          </p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {arrivalAirport.city && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {arrivalAirport.city}
                            {arrivalAirport.country && `, ${arrivalAirport.country}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <Badge variant="outline" className="font-mono">
                        {flight.arrival_airport_code || "-"}
                      </Badge>
                      <p className="font-medium mt-1">
                        {flight.arrival_airport_name || "-"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images du vol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <FlightImageGallery flightId={flightId} readonly={false} />
        </motion.div>

        {/* Disponibilités */}
        {availabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Disponibilités</CardTitle>
                <CardDescription>
                  {availabilities.length} disponibilité{availabilities.length > 1 ? "s" : ""} pour ce vol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Classe</TableHead>
                        <TableHead>Sièges disponibles</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Créé le</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availabilities.map((availability) => (
                        <TableRow key={availability.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formatDate(availability.date)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {availability.flight_class_name || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {availability.available_seats}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {formatPrice(Number(availability.price), availability.currency)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(availability.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Informations système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
              <CardDescription>Dates de création et de mise à jour</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                <p className="font-medium">{formatDateTime(flight.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(flight.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

