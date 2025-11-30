"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CruiseShipForm } from "@/components/cruises/cruise-ship-form"
import { CruiseShipImageGallery } from "@/components/cruises/cruise-ship-image-gallery"
import { cruiseShipsService } from "@/lib/services/cruises"
import { CruiseShip } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCruiseShipPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruiseShip, setCruiseShip] = useState<CruiseShip | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruiseShipId = params.id as string

  useEffect(() => {
    const fetchCruiseShip = async () => {
      try {
        setIsLoading(true)
        const data = await cruiseShipsService.getById(cruiseShipId)
        setCruiseShip(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le navire",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cruise-ships")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruiseShipId) {
      fetchCruiseShip()
    }
  }, [cruiseShipId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/cruises/cruise-ships")
  }

  const handleCancel = () => {
    router.push("/travel-products/cruises/cruise-ships")
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

  if (!cruiseShip) {
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
          <Link href="/travel-products/cruises/cruise-ships">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Edit className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier le navire</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {cruiseShip.name}
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
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CruiseShipForm cruiseShip={cruiseShip} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>

        {/* Galerie d'images */}
        <CruiseShipImageGallery cruiseShipId={cruiseShip.id} readonly={false} />
      </div>
    </AdminLayout>
  )
}

