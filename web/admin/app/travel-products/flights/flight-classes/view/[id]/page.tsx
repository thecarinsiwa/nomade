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
  Calendar,
  TrendingUp,
  FileText,
  DollarSign,
  Users,
  ExternalLink,
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
import { flightClassesService, flightAvailabilityService } from "@/lib/services/flights"
import { FlightClass, FlightAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ViewFlightClassPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [flightClass, setFlightClass] = useState<FlightClass | null>(null)
  const [availabilities, setAvailabilities] = useState<FlightAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAvailabilities, setIsLoadingAvailabilities] = useState(false)

  const flightClassId = params.id as string

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await flightClassesService.getById(flightClassId)
        setFlightClass(data)

        // Charger les disponibilités pour cette classe
        if (data.id) {
          setIsLoadingAvailabilities(true)
          try {
            const availabilitiesData = await flightAvailabilityService.getAll(1, undefined, undefined, data.id)
            setAvailabilities(availabilitiesData.results || [])
          } catch (error) {
            console.error("Error fetching availabilities:", error)
          } finally {
            setIsLoadingAvailabilities(false)
          }
        }
      } catch (error) {
        console.error("Error fetching flight class:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger la classe",
          variant: "destructive",
        })
        router.push("/travel-products/flights/flight-classes")
      } finally {
        setIsLoading(false)
      }
    }

    if (flightClassId) {
      fetchData()
    }
  }, [flightClassId, router, toast])

  const formatPrice = (price: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(price)
  }

  // Calculer les statistiques
  const totalAvailabilities = availabilities.length
  const totalSeats = availabilities.reduce((sum, a) => sum + a.available_seats, 0)
  const avgPrice = availabilities.length > 0
    ? availabilities.reduce((sum, a) => sum + Number(a.price), 0) / availabilities.length
    : 0
  const uniqueFlights = new Set(availabilities.map(a => a.flight)).size

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!flightClass) {
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
            <Link href="/travel-products/flights/flight-classes">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/flights/flight-classes/edit/${flightClass.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/flights/flight-classes/delete/${flightClass.id}`}>
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
              <h1 className="text-3xl font-bold">{flightClass.name}</h1>
              <p className="text-muted-foreground">
                Classe de vol
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
                <CardTitle className="text-sm font-medium">Vols</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueFlights}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vols différents
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la classe</CardTitle>
            <CardDescription>Détails de {flightClass.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Plane className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{flightClass.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                <p className="font-medium">{formatDateTime(flightClass.created_at)}</p>
              </div>
              {flightClass.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{flightClass.description}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disponibilités */}
        {availabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Disponibilités</CardTitle>
                    <CardDescription>
                      {availabilities.length} disponibilité{availabilities.length > 1 ? "s" : ""} pour cette classe
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingAvailabilities ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Vol</TableHead>
                          <TableHead>Compagnie</TableHead>
                          <TableHead>Itinéraire</TableHead>
                          <TableHead>Sièges</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
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
                              <Badge variant="outline" className="font-mono">
                                {availability.flight_info || availability.flight_number || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {availability.airline_name || "-"}
                            </TableCell>
                            <TableCell>
                              {availability.departure_airport && availability.arrival_airport ? (
                                <span className="text-sm">
                                  {availability.departure_airport} → {availability.arrival_airport}
                                </span>
                              ) : (
                                "-"
                              )}
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
                            <TableCell className="text-right">
                              <Link href={`/travel-products/flights/view/${availability.flight}`}>
                                <Button variant="ghost" size="icon" title="Voir le vol">
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

