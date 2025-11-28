"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SimpleForm } from "@/components/common/simple-form"
import { propertyCategoriesService } from "@/lib/services/accommodations"
import { PropertyCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPropertyCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [category, setCategory] = useState<PropertyCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const categoryId = params.id as string

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const data = await propertyCategoriesService.getById(categoryId)
        setCategory(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la catégorie",
          variant: "destructive",
        })
        router.push("/travel-products/accommodations/property-categories")
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/accommodations/property-categories")
  }

  const handleCancel = () => {
    router.push("/travel-products/accommodations/property-categories")
  }

  const handleSubmit = async (data: { name: string; description?: string }) => {
    await propertyCategoriesService.update(categoryId, data)
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

  if (!category) {
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
          <Link href="/travel-products/accommodations/property-categories">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la catégorie</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {category.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la catégorie</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleForm
              item={category}
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

