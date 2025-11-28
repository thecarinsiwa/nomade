"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Plane, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { FlightForm } from "@/components/flights/flight-form"
import { FlightImageGallery } from "@/components/flights/flight-image-gallery"
import { flightsService } from "@/lib/services/flights"
import { Flight } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditFlightPage() {
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

  const handleSuccess = () => {
    router.push("/travel-products/flights")
  }

  const handleCancel = () => {
    router.push("/travel-products/flights")
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
          <Link href="/travel-products/flights">
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
              <h1 className="text-3xl font-bold">Modifier le vol</h1>
              <p className="text-muted-foreground">
                Modifiez les informations du vol {flight.flight_number}
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="h-5 w-5" />
              <span>Informations du vol</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FlightForm flight={flight} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FlightImageGallery flightId={flightId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

