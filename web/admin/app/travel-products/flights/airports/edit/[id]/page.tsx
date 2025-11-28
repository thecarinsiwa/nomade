"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AirportForm } from "@/components/flights/airport-form"
import { AirportImageGallery } from "@/components/flights/airport-image-gallery"
import { airportsService } from "@/lib/services/flights"
import { Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAirportPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [airport, setAirport] = useState<Airport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const airportId = params.id as string

  useEffect(() => {
    const fetchAirport = async () => {
      try {
        setIsLoading(true)
        const data = await airportsService.getById(airportId)
        setAirport(data)
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
      fetchAirport()
    }
  }, [airportId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/flights/airports")
  }

  const handleCancel = () => {
    router.push("/travel-products/flights/airports")
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
          <Link href="/travel-products/flights/airports">
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
              <h1 className="text-3xl font-bold">Modifier l'aéroport</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {airport.name} ({airport.iata_code})
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Informations de l'aéroport</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AirportForm airport={airport} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AirportImageGallery airportId={airportId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

