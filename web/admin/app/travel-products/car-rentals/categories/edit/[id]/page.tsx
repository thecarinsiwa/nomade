"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CategoryForm } from "@/components/car-rentals/category-form"
import { carCategoriesService } from "@/lib/services/car-rentals"
import { CarCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCarCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [category, setCategory] = useState<CarCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const categoryId = params.id as string

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true)
        const data = await carCategoriesService.getById(categoryId)
        setCategory(data)
      } catch (error) {
        console.error("Error fetching category:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger la catégorie",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals/categories")
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/car-rentals/categories")
  }

  const handleCancel = () => {
    router.push("/travel-products/car-rentals/categories")
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
          <Link href="/travel-products/car-rentals/categories">
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
              <h1 className="text-3xl font-bold">Modifier la catégorie</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {category.name}
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Informations de la catégorie</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={category}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

