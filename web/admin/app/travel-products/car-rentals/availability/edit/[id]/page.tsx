"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { carAvailabilityService } from "@/lib/services/car-rentals"
import { CarAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { AvailabilityForm } from "@/components/car-rentals/availability-form"
import Link from "next/link"

export default function EditAvailabilityPage() {
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
        console.error("Error fetching availability:", error)
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

  const handleSuccess = () => {
    router.push("/travel-products/car-rentals/availability")
  }

  const handleCancel = () => {
    router.push("/travel-products/car-rentals/availability")
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

  if (!availability) {
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
          <Link href="/travel-products/car-rentals/availability">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier la disponibilité</h1>
              <p className="text-muted-foreground mt-1">
                Modifiez les informations de la disponibilité
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la disponibilité</CardTitle>
            <CardDescription>
              Tous les champs marqués d'un astérisque (*) sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilityForm availability={availability} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

