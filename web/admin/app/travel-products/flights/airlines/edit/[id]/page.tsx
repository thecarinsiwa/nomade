"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AirlineForm } from "@/components/flights/airline-form"
import { AirlineImageGallery } from "@/components/flights/airline-image-gallery"
import { airlinesService } from "@/lib/services/flights"
import { Airline } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAirlinePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [airline, setAirline] = useState<Airline | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const airlineId = params.id as string

  useEffect(() => {
    const fetchAirline = async () => {
      try {
        setIsLoading(true)
        const data = await airlinesService.getById(airlineId)
        setAirline(data)
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
      fetchAirline()
    }
  }, [airlineId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/flights/airlines")
  }

  const handleCancel = () => {
    router.push("/travel-products/flights/airlines")
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
          <Link href="/travel-products/flights/airlines">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la compagnie aérienne</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {airline.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la compagnie</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AirlineForm airline={airline} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AirlineImageGallery airlineId={airlineId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

