"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { FlightClassForm } from "@/components/flights/flight-class-form"
import { flightClassesService } from "@/lib/services/flights"
import { FlightClass } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditFlightClassPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [flightClass, setFlightClass] = useState<FlightClass | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const flightClassId = params.id as string

  useEffect(() => {
    const fetchFlightClass = async () => {
      try {
        setIsLoading(true)
        const data = await flightClassesService.getById(flightClassId)
        setFlightClass(data)
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
      fetchFlightClass()
    }
  }, [flightClassId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/flights/flight-classes")
  }

  const handleCancel = () => {
    router.push("/travel-products/flights/flight-classes")
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
          <Link href="/travel-products/flights/flight-classes">
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
              <h1 className="text-3xl font-bold">Modifier la classe</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {flightClass.name}
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="h-5 w-5" />
              <span>Informations de la classe</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FlightClassForm
              flightClass={flightClass}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

