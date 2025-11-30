"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CruiseShipForm } from "@/components/cruises/cruise-ship-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddCruiseShipPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/travel-products/cruises/cruise-ships")
  }

  const handleCancel = () => {
    router.push("/travel-products/cruises/cruise-ships")
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/travel-products/cruises/cruise-ships">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nouveau navire</h1>
              <p className="text-muted-foreground">
                Créez un nouveau navire de croisière
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ship className="h-5 w-5" />
              <span>Informations du navire</span>
            </CardTitle>
            <CardDescription>
              Remplissez les champs ci-dessous. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CruiseShipForm cruiseShip={null} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

