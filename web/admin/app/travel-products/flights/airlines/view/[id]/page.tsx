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
  Globe,
  Image,
  Calendar,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AirlineImageGallery } from "@/components/flights/airline-image-gallery"
import { airlinesService, flightsService } from "@/lib/services/flights"
import { Airline, Flight } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ViewAirlinePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [airline, setAirline] = useState<Airline | null>(null)
  const [recentFlights, setRecentFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFlights, setIsLoadingFlights] = useState(false)

  const airlineId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await airlinesService.getById(airlineId)
        setAirline(data)

        // Charger les vols de cette compagnie
        if (data.id) {
          setIsLoadingFlights(true)
          try {
            const flightsData = await flightsService.getAll(1, undefined)
            const allFlights = flightsData.results || []
            const airlineFlights = allFlights.filter(
              (f: Flight) => f.airline === data.id
            )
            setRecentFlights(airlineFlights.slice(0, 10)) // 10 derniers vols
          } catch (error) {
            console.error("Error fetching flights:", error)
          } finally {
            setIsLoadingFlights(false)
          }
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la compagnie",
          variant: "destructive",
        })
        router.push("/travel-products/flights/airlines")
      } finally {
        setIsLoading(false)
      }
    }

    if (airlineId) {
      fetchData()
    }
  }, [airlineId, router, toast])

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default" as const,
      delayed: "warning" as const,
      cancelled: "destructive" as const,
      completed: "success" as const,
    }
    const labels: Record<string, string> = {
      scheduled: "Programmé",
      delayed: "Retardé",
      cancelled: "Annulé",
      completed: "Terminé",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!airline) {
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
            <Link href="/travel-products/flights/airlines">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/flights/airlines/edit/${airline.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/flights/airlines/delete/${airline.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {airline.logo_url && (
              <img
                src={airline.logo_url}
                alt={`Logo ${airline.name}`}
                className="h-16 w-16 object-contain rounded-lg border"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold">{airline.name}</h1>
              <p className="text-muted-foreground">
                Code: <span className="font-mono font-medium">{airline.code}</span>
                {airline.country && ` • ${airline.country}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de vols</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plane className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {airline.flights_count || recentFlights.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vols associés à cette compagnie
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
                <CardTitle className="text-sm font-medium">Date de création</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDate(airline.created_at)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateTime(airline.created_at)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {airline.country && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pays</CardTitle>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Globe className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{airline.country}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pays d'origine
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Informations détaillées */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la compagnie</CardTitle>
            <CardDescription>
              Détails complets de {airline.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Plane className="h-4 w-4" />
                  <span>Code IATA/ICAO</span>
                </p>
                <p className="font-medium font-mono text-lg">{airline.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nom complet</p>
                <p className="font-medium text-lg">{airline.name}</p>
              </div>
              {airline.country && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Globe className="h-4 w-4" />
                    <span>Pays</span>
                  </p>
                  <p className="font-medium">{airline.country}</p>
                </div>
              )}
              {airline.logo_url && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <Image className="h-4 w-4" />
                    <span>Logo</span>
                  </p>
                  <div className="flex items-center space-x-2">
                    <img
                      src={airline.logo_url}
                      alt={`Logo ${airline.name}`}
                      className="h-20 w-auto object-contain border rounded-lg p-2 bg-white"
                    />
                    <a
                      href={airline.logo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center space-x-1"
                    >
                      <span>Voir l'image</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images de la compagnie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AirlineImageGallery airlineId={airlineId} readonly={false} />
        </motion.div>

        {/* Vols récents */}
        {recentFlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vols de cette compagnie</CardTitle>
                    <CardDescription>
                      {recentFlights.length} vol{recentFlights.length > 1 ? "s" : ""} récent{recentFlights.length > 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Link href={`/travel-products/flights?airline=${airline.id}`}>
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
                  <div className="space-y-3">
                    {recentFlights.map((flight) => (
                      <Link
                        key={flight.id}
                        href={`/travel-products/flights/view/${flight.id}`}
                        className="block p-4 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="flex items-center space-x-2">
                              <Plane className="h-5 w-5 text-muted-foreground" />
                              <span className="font-mono font-medium">
                                {flight.flight_number}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {flight.departure_airport_name || "-"}
                              </span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-sm">
                                {flight.arrival_airport_name || "-"}
                              </span>
                            </div>
                            {flight.duration_minutes && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatDuration(flight.duration_minutes)}</span>
                              </div>
                            )}
                            {flight.departure_time && (
                              <div className="text-sm text-muted-foreground">
                                {formatDate(flight.departure_time)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(flight.status)}
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    ))}
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
