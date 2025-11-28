"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ActivityForm } from "@/components/activities/activity-form"
import Link from "next/link"

export default function AddActivityPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/travel-products/activities")
  }

  const handleCancel = () => {
    router.push("/travel-products/activities")
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/travel-products/activities">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Créer une nouvelle activité</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle activité touristique
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'activité</CardTitle>
            <CardDescription>
              Tous les champs marqués d'un astérisque (*) sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityForm activity={null} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

