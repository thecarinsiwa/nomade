"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { LocationForm } from "@/components/car-rentals/location-form"
import { CarRentalLocationImageGallery } from "@/components/car-rentals/car-rental-location-image-gallery"
import { carRentalLocationsService } from "@/lib/services/car-rentals"
import { CarRentalLocation } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCarRentalLocationPage() {
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

  const handleSuccess = () => {
    router.push("/travel-products/car-rentals/locations")
  }

  const handleCancel = () => {
    router.push("/travel-products/car-rentals/locations")
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/travel-products/car-rentals/locations">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier le point de location</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {location.name}
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Informations du point de location</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationForm
              location={location}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CarRentalLocationImageGallery locationId={locationId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

