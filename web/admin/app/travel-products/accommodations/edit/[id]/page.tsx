"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PropertyForm } from "@/components/accommodations/property-form"
import { PropertyImageGallery } from "@/components/accommodations/property-image-gallery"
import { propertiesService } from "@/lib/services/accommodations"
import { Property } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAccommodationPage() {
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

  const handleSuccess = () => {
    router.push("/travel-products/accommodations")
  }

  const handleCancel = () => {
    router.push("/travel-products/accommodations")
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
          <Link href="/travel-products/accommodations">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier l'hébergement</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {property.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'hébergement</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyForm property={property} onSuccess={handleSuccess} onCancel={handleCancel} />
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

