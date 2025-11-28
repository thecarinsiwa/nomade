"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AirlineForm } from "@/components/flights/airline-form"
import Link from "next/link"

export default function AddAirlinePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/travel-products/flights/airlines")
  }

  const handleCancel = () => {
    router.push("/travel-products/flights/airlines")
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/travel-products/flights/airlines">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Créer une nouvelle compagnie aérienne</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle compagnie aérienne
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la compagnie</CardTitle>
            <CardDescription>
              Tous les champs marqués d'un astérisque (*) sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AirlineForm airline={null} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

