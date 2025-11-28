"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CarForm } from "@/components/car-rentals/car-form"
import { CarImageGallery } from "@/components/car-rentals/car-image-gallery"
import { carsService } from "@/lib/services/car-rentals"
import { Car } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCarPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const carId = params.id as string

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true)
        const data = await carsService.getById(carId)
        setCar(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le véhicule",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals")
      } finally {
        setIsLoading(false)
      }
    }

    if (carId) {
      fetchCar()
    }
  }, [carId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/car-rentals")
  }

  const handleCancel = () => {
    router.push("/travel-products/car-rentals")
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

  if (!car) {
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
          <Link href="/travel-products/car-rentals">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier le véhicule</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {car.make} {car.model}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du véhicule</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarForm car={car} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CarImageGallery carId={carId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

