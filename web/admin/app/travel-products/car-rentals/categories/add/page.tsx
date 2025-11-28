"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CategoryForm } from "@/components/car-rentals/category-form"
import Link from "next/link"

export default function AddCarCategoryPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/travel-products/car-rentals/categories")
  }

  const handleCancel = () => {
    router.push("/travel-products/car-rentals/categories")
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
            <div className="bg-green-100 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Créer une nouvelle catégorie</h1>
              <p className="text-muted-foreground">
                Ajoutez une nouvelle catégorie de véhicule à la base de données
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
              Remplissez tous les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={null}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

