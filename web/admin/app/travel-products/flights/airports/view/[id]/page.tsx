"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  MapPin,
  Globe,
  Clock,
  Plane,
  TrendingUp,
  Navigation,
  ExternalLink,
  Calendar,
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
import { AirportImageGallery } from "@/components/flights/airport-image-gallery"
import { airportsService, flightsService } from "@/lib/services/flights"
import { Airport, Flight } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ViewAirportPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [airport, setAirport] = useState<Airport | null>(null)
  const [departureFlights, setDepartureFlights] = useState<Flight[]>([])
  const [arrivalFlights, setArrivalFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFlights, setIsLoadingFlights] = useState(false)

  const airportId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await airportsService.getById(airportId)
        setAirport(data)

        // Charger les vols associés
        if (data.id) {
          setIsLoadingFlights(true)
          try {
            const flightsData = await flightsService.getAll(1)
            const allFlights = flightsData.results || []
            const deps = allFlights.filter(
              (f: Flight) => 
                (typeof f.departure_airport === 'string' ? f.departure_airport : f.departure_airport?.id) === data.id
            )
            const arrs = allFlights.filter(
              (f: Flight) => 
                (typeof f.arrival_airport === 'string' ? f.arrival_airport : f.arrival_airport?.id) === data.id
            )
            setDepartureFlights(deps.slice(0, 10))
            setArrivalFlights(arrs.slice(0, 10))
          } catch (error) {
            console.error("Error fetching flights:", error)
          } finally {
            setIsLoadingFlights(false)
          }
        }
      } catch (error) {
        console.error("Error fetching airport:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger l'aéroport",
          variant: "destructive",
        })
        router.push("/travel-products/flights/airports")
      } finally {
        setIsLoading(false)
      }
    }

    if (airportId) {
      fetchData()
    }
  }, [airportId, router, toast])

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? `${mins}min` : ""}`
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

  if (!airport) {
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
            <Link href="/travel-products/flights/airports">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/flights/airports/edit/${airport.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/flights/airports/delete/${airport.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{airport.name}</h1>
              <p className="text-muted-foreground">
                <Badge variant="outline" className="font-mono mr-2">
                  {airport.iata_code}
                </Badge>
                {airport.city && `${airport.city}`}
                {airport.country && `, ${airport.country}`}
              </p>
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
                <CardTitle className="text-sm font-medium">Vols au départ</CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Plane className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {airport.departure_flights_count || departureFlights.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vols partant de cet aéroport
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
                <CardTitle className="text-sm font-medium">Vols à l'arrivée</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plane className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {airport.arrival_flights_count || arrivalFlights.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vols arrivant à cet aéroport
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
                <CardTitle className="text-sm font-medium">Total de vols</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(airport.departure_flights_count || 0) + (airport.arrival_flights_count || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vols au total
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
                <CardTitle className="text-sm font-medium">Date de création</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDate(airport.created_at)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(airport.created_at)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'aéroport</CardTitle>
              <CardDescription>Détails de {airport.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>Code IATA</span>
                  </p>
                  <Badge variant="outline" className="font-mono text-lg">
                    {airport.iata_code}
                  </Badge>
                </div>
                {airport.icao_code && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Code ICAO</p>
                    <Badge variant="outline" className="font-mono text-lg">
                      {airport.icao_code}
                    </Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nom complet</p>
                  <p className="font-medium text-lg">{airport.name}</p>
                </div>
                {airport.city && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ville</p>
                    <p className="font-medium">{airport.city}</p>
                  </div>
                )}
                {airport.country && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                      <Globe className="h-4 w-4" />
                      <span>Pays</span>
                    </p>
                    <p className="font-medium">{airport.country}</p>
                  </div>
                )}
                {airport.timezone && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>Fuseau horaire</span>
                    </p>
                    <p className="font-medium">{airport.timezone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
              <CardDescription>Coordonnées géographiques</CardDescription>
            </CardHeader>
            <CardContent>
              {airport.latitude && airport.longitude ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Latitude</p>
                      <p className="font-medium font-mono">{Number(airport.latitude).toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Longitude</p>
                      <p className="font-medium font-mono">{Number(airport.longitude).toFixed(6)}</p>
                    </div>
                  </div>
                  <a
                    href={getGoogleMapsUrl(Number(airport.latitude), Number(airport.longitude))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary hover:underline"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Voir sur Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Coordonnées non disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Images de l'aéroport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AirportImageGallery airportId={airportId} readonly={false} />
        </motion.div>

        {/* Vols au départ */}
        {departureFlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vols au départ</CardTitle>
                    <CardDescription>
                      {departureFlights.length} vol{departureFlights.length > 1 ? "s" : ""} récent{departureFlights.length > 1 ? "s" : ""} partant de cet aéroport
                    </CardDescription>
                  </div>
                  <Link href={`/travel-products/flights?departure=${airport.id}`}>
                    <Button variant="outline" size="sm">
                      Voir tous les vols
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingFlights ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numéro de vol</TableHead>
                          <TableHead>Compagnie</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Durée</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departureFlights.map((flight) => (
                          <TableRow key={flight.id}>
                            <TableCell className="font-mono font-medium">
                              {flight.flight_number}
                            </TableCell>
                            <TableCell>
                              {flight.airline_name ? (
                                <Badge variant="outline">{flight.airline_name}</Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {flight.arrival_airport_name || "-"}
                            </TableCell>
                            <TableCell>
                              {formatDuration(flight.duration_minutes)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={flight.status === "scheduled" ? "default" : "secondary"}>
                                {flight.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/travel-products/flights/view/${flight.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Vols à l'arrivée */}
        {arrivalFlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vols à l'arrivée</CardTitle>
                    <CardDescription>
                      {arrivalFlights.length} vol{arrivalFlights.length > 1 ? "s" : ""} récent{arrivalFlights.length > 1 ? "s" : ""} arrivant à cet aéroport
                    </CardDescription>
                  </div>
                  <Link href={`/travel-products/flights?arrival=${airport.id}`}>
                    <Button variant="outline" size="sm">
                      Voir tous les vols
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingFlights ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numéro de vol</TableHead>
                          <TableHead>Compagnie</TableHead>
                          <TableHead>Origine</TableHead>
                          <TableHead>Durée</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {arrivalFlights.map((flight) => (
                          <TableRow key={flight.id}>
                            <TableCell className="font-mono font-medium">
                              {flight.flight_number}
                            </TableCell>
                            <TableCell>
                              {flight.airline_name ? (
                                <Badge variant="outline">{flight.airline_name}</Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {flight.departure_airport_name || "-"}
                            </TableCell>
                            <TableCell>
                              {formatDuration(flight.duration_minutes)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={flight.status === "scheduled" ? "default" : "secondary"}>
                                {flight.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/travel-products/flights/view/${flight.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}

