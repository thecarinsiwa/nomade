"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SimpleForm } from "@/components/common/simple-form"
import { propertyTypesService } from "@/lib/services/accommodations"
import { PropertyType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPropertyTypePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [type, setType] = useState<PropertyType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const typeId = params.id as string

  useEffect(() => {
    const fetchType = async () => {
      try {
        setIsLoading(true)
        const data = await propertyTypesService.getById(typeId)
        setType(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le type",
          variant: "destructive",
        })
        router.push("/travel-products/accommodations/property-types")
      } finally {
        setIsLoading(false)
      }
    }

    if (typeId) {
      fetchType()
    }
  }, [typeId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/accommodations/property-types")
  }

  const handleCancel = () => {
    router.push("/travel-products/accommodations/property-types")
  }

  const handleSubmit = async (data: { name: string; description?: string }) => {
    await propertyTypesService.update(typeId, data)
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

  if (!type) {
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
          <Link href="/travel-products/accommodations/property-types">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier le type</h1>
          <p className="text-muted-foreground">
            Modifiez les informations du type {type.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du type</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleForm
              item={type}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

