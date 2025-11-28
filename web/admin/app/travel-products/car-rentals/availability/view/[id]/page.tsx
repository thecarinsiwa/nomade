"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Car as CarIcon, MapPin, Calendar, DollarSign, CheckCircle, XCircle, Building2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { carAvailabilityService } from "@/lib/services/car-rentals"
import { CarAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewAvailabilityPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [availability, setAvailability] = useState<CarAvailability | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const availabilityId = params.id as string

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true)
        const data = await carAvailabilityService.getById(availabilityId)
        setAvailability(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la disponibilité",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals/availability")
      } finally {
        setIsLoading(false)
      }
    }

    if (availabilityId) {
      fetchAvailability()
    }
  }, [availabilityId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!availability) {
    return null
  }

  const isAvailable = availability.is_available !== undefined ? availability.is_available : (availability as any)?.available
  const carInfo = availability.car_info || availability.car_model
  const locationName = availability.location_name
  const locationCity = (availability as any)?.location_city
  const companyName = (availability as any)?.company_name
  const carId = typeof availability.car === 'string' ? availability.car : (availability.car as any)?.id
  const locationId = typeof availability.location === 'string' ? availability.location : (availability.location as any)?.id

  // Calculer la durée en jours
  const startDate = new Date(availability.start_date)
  const endDate = new Date(availability.end_date)
  const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <Link href="/travel-products/car-rentals/availability">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Détails de la disponibilité</h1>
                <p className="text-muted-foreground mt-1">
                  Informations complètes sur la disponibilité
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/travel-products/car-rentals/availability/edit/${availability.id}`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </Link>
            <Link href={`/travel-products/car-rentals/availability/delete/${availability.id}`}>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut</CardTitle>
                {isAvailable ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAvailable ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Disponible
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Indisponible</Badge>
                  )}
                </div>
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
                <CardTitle className="text-sm font-medium">Prix par jour</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {availability.price_per_day ? `${availability.price_per_day} €` : "-"}
                </div>
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
                <CardTitle className="text-sm font-medium">Date de début</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatDate(availability.start_date)}
                </div>
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
                <CardTitle className="text-sm font-medium">Date de fin</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatDate(availability.end_date)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations détaillées */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CarIcon className="mr-2 h-5 w-5" />
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Véhicule</p>
                  <p className="font-semibold text-lg">
                    {carInfo || "-"}
                  </p>
                </div>
                {companyName && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Agence</p>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{companyName}</p>
                    </div>
                  </div>
                )}
                {carId && (
                  <Link href={`/travel-products/car-rentals/view/${carId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir le véhicule
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Point de location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nom</p>
                  <p className="font-semibold text-lg">
                    {locationName || "-"}
                  </p>
                </div>
                {locationCity && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ville</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{locationCity}</p>
                    </div>
                  </div>
                )}
                {locationId && (
                  <Link href={`/travel-products/car-rentals/locations/view/${locationId}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir le point de location
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Période et prix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Période et tarification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date de début</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{formatDate(availability.start_date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date de fin</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{formatDate(availability.end_date)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Durée</p>
                  <p className="font-semibold text-lg">{durationDays} jour{durationDays > 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Prix par jour</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold text-lg">
                      {availability.price_per_day 
                        ? `${availability.price_per_day} ${availability.currency || 'EUR'}` 
                        : "Non défini"}
                    </p>
                  </div>
                </div>
                {availability.price_per_day && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Prix total estimé</p>
                    <p className="font-semibold text-lg text-blue-600">
                      {(availability.price_per_day * durationDays).toFixed(2)} {availability.currency || 'EUR'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">{formatDateTime(availability.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dernière modification</p>
                  <p className="font-medium">{formatDateTime(availability.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

