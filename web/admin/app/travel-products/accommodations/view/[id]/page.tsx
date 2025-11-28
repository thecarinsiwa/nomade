"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PropertyImageGallery } from "@/components/accommodations/property-image-gallery"
import { propertiesService } from "@/lib/services/accommodations"
import { Property } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewAccommodationPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const propertyId = params.id as string

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true)
        const data = await propertiesService.getById(propertyId)
        setProperty(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la propriété",
          variant: "destructive",
        })
        router.push("/travel-products/accommodations")
      } finally {
        setIsLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId, router, toast])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      active: "success",
      inactive: "secondary",
      pending: "warning",
      suspended: "destructive",
    }
    const labels: Record<string, string> = {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      suspended: "Suspendu",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
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

  if (!property) {
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/accommodations">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/accommodations/edit/${property.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/accommodations/delete/${property.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de l'hébergement</h1>
          <p className="text-muted-foreground">
            Informations complètes de {property.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'hébergement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{property.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {getStatusBadge(property.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{property.property_type_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Catégorie</p>
                <p className="font-medium">{property.property_category_name || "-"}</p>
              </div>
              {property.rating && (
                <div>
                  <p className="text-sm text-muted-foreground">Note</p>
                  <div className="flex items-center">
                    <span className="font-medium text-lg">{property.rating}</span>
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                </div>
              )}
              {property.check_in_time && (
                <div>
                  <p className="text-sm text-muted-foreground">Heure check-in</p>
                  <p className="font-medium">{property.check_in_time}</p>
                </div>
              )}
              {property.check_out_time && (
                <div>
                  <p className="text-sm text-muted-foreground">Heure check-out</p>
                  <p className="font-medium">{property.check_out_time}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(property.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(property.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PropertyImageGallery propertyId={propertyId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

