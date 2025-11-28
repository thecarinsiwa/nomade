"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { SimpleForm } from "@/components/common/simple-form"
import { propertyCategoriesService } from "@/lib/services/accommodations"
import Link from "next/link"

export default function AddPropertyCategoryPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/travel-products/accommodations/property-categories")
  }

  const handleCancel = () => {
    router.push("/travel-products/accommodations/property-categories")
  }

  const handleSubmit = async (data: { name: string; description?: string }) => {
    await propertyCategoriesService.create(data)
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
          <h1 className="text-3xl font-bold">Créer une nouvelle catégorie</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle catégorie de propriété
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la catégorie</CardTitle>
            <CardDescription>
              Tous les champs marqués d'un astérisque (*) sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleForm
              item={null}
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

