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
  Building2,
  Calendar,
  Car,
  Navigation,
  Globe,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CarRentalLocationImageGallery } from "@/components/car-rentals/car-rental-location-image-gallery"
import { carRentalLocationsService } from "@/lib/services/car-rentals"
import { CarRentalLocation } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCarRentalLocationPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [location, setLocation] = useState<CarRentalLocation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const locationId = params.id as string

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true)
        const data = await carRentalLocationsService.getById(locationId)
        setLocation(data)
      } catch (error) {
        console.error("Error fetching location:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger le point de location",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals/locations")
      } finally {
        setIsLoading(false)
      }
    }

    if (locationId) {
      fetchLocation()
    }
  }, [locationId, router, toast])

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      airport: "Aéroport",
      city: "Ville",
      station: "Gare",
      other: "Autre",
    }
    return labels[type] || type
  }

  const getGoogleMapsUrl = (lat?: number, lng?: number) => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`
    }
    return null
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

  if (!location) {
    return null
  }

  const googleMapsUrl = getGoogleMapsUrl(location.latitude, location.longitude)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/car-rentals/locations">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/car-rentals/locations/edit/${location.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/car-rentals/locations/delete/${location.id}`}>
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
            <div>
              <h1 className="text-3xl font-bold">{location.name}</h1>
              <p className="text-muted-foreground">
                Point de location
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
                <div className="bg-green-100 p-2 rounded-lg">
                  <Car className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {location.availabilities_count ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponibilités
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
                <CardTitle className="text-sm font-medium">Type</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {getLocationTypeLabel(location.location_type)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Type de location
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
                <CardTitle className="text-sm font-medium">Date de création</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDateTime(location.created_at)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Date d'ajout
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
                <CardTitle className="text-sm font-medium">Coordonnées</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Navigation className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {location.latitude && location.longitude ? "Configurées" : "Non configurées"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  GPS
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du point</CardTitle>
            <CardDescription>Détails de {location.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{location.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span>Agence</span>
                </p>
                {location.company_name ? (
                  <Badge variant="outline">{location.company_name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <Badge variant="default">
                  {getLocationTypeLabel(location.location_type)}
                </Badge>
              </div>
              {location.address && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Adresse</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{location.address}</p>
                </div>
              )}
              {location.city && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ville</p>
                  <p className="font-medium">{location.city}</p>
                </div>
              )}
              {location.country && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Globe className="h-4 w-4" />
                    <span>Pays</span>
                  </p>
                  <p className="font-medium">{location.country}</p>
                </div>
              )}
              {location.latitude && location.longitude && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <Navigation className="h-4 w-4" />
                    <span>Coordonnées GPS</span>
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-mono mb-2">
                      Latitude: {location.latitude}<br />
                      Longitude: {location.longitude}
                    </p>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <span>Voir sur Google Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CarRentalLocationImageGallery locationId={locationId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

