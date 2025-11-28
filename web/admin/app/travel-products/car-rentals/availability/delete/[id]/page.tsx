"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Trash2, Loader2, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { carAvailabilityService } from "@/lib/services/car-rentals"
import { CarAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DeleteAvailabilityPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [availability, setAvailability] = useState<CarAvailability | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!availability) return

    setIsDeleting(true)
    try {
      await carAvailabilityService.delete(availability.id)
      toast({
        title: "Succès",
        description: "Disponibilité supprimée avec succès",
      })
      router.push("/travel-products/car-rentals/availability")
    } catch (error: any) {
      console.error("Error deleting availability:", error)
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Impossible de supprimer la disponibilité",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
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

  const isAvailable = availability.is_available !== undefined ? availability.is_available : (availability as any)?.available

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
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Supprimer la disponibilité</h1>
              <p className="text-muted-foreground mt-1">
                Confirmez la suppression de cette disponibilité
              </p>
            </div>
          </div>
        </motion.div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Attention
            </CardTitle>
            <CardDescription>
              Cette action est irréversible. La disponibilité sera définitivement supprimée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Véhicule</p>
                <p className="text-lg font-semibold">
                  {availability.car_model || typeof availability.car === 'string' ? availability.car : (availability.car as any)?.make ? `${(availability.car as any).make} ${(availability.car as any).model}` : "-"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Point de location</p>
                <p className="text-lg font-semibold">
                  {availability.location_name || typeof availability.location === 'string' ? availability.location : (availability.location as any)?.name || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Date de début</p>
                  <p className="text-lg font-semibold flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(availability.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Date de fin</p>
                  <p className="text-lg font-semibold flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(availability.end_date)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Statut</p>
                <p className="text-lg font-semibold">
                  {isAvailable ? "Disponible" : "Indisponible"}
                </p>
              </div>

              {availability.price_per_day && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Prix par jour</p>
                  <p className="text-lg font-semibold">{availability.price_per_day} €</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Link href="/travel-products/car-rentals/availability">
                <Button variant="outline" disabled={isDeleting}>
                  Annuler
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Confirmer la suppression
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

