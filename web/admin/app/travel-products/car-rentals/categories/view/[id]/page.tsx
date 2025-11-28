"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Tag,
  Calendar,
  Car,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { carCategoriesService } from "@/lib/services/car-rentals"
import { CarCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCarCategoryPage() {
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/car-rentals/categories">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/car-rentals/categories/edit/${category.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/car-rentals/categories/delete/${category.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Tag className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">
                Catégorie de véhicule
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Car className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {category.cars_count ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Véhicules dans cette catégorie
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Description</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {category.description ? "Configurée" : "Non configurée"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  État de la description
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Date de création</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDateTime(category.created_at)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Date d'ajout
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la catégorie</CardTitle>
            <CardDescription>Détails de {category.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Tag className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{category.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Car className="h-4 w-4" />
                  <span>Véhicules</span>
                </p>
                {category.cars_count !== undefined ? (
                  <Badge variant={category.cars_count > 0 ? "default" : "secondary"}>
                    {category.cars_count} véhicule{category.cars_count > 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </div>
              {category.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{category.description}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

