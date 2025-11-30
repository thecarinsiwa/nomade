"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Ship, Calendar, Users, Wrench, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseShipsService } from "@/lib/services/cruises"
import { CruiseShip } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { CruiseShipImageGallery } from "@/components/cruises/cruise-ship-image-gallery"
import Link from "next/link"

export default function ViewCruiseShipPage() {
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/cruises/cruise-ships">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/cruise-ships/edit/${cruiseShip.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/cruise-ships/delete/${cruiseShip.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Ship className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{cruiseShip.name}</h1>
              <p className="text-muted-foreground">
                Navire de croisière
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du navire</CardTitle>
            <CardDescription>
              Détails de {cruiseShip.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Ship className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{cruiseShip.name}</p>
              </div>
              {cruiseShip.cruise_line_name && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Anchor className="h-4 w-4" />
                    <span>Compagnie</span>
                  </p>
                  <Badge variant="outline">{cruiseShip.cruise_line_name}</Badge>
                </div>
              )}
              {cruiseShip.capacity && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Users className="h-4 w-4" />
                    <span>Capacité</span>
                  </p>
                  <p className="font-medium">{cruiseShip.capacity} passagers</p>
                </div>
              )}
              {cruiseShip.year_built && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Wrench className="h-4 w-4" />
                    <span>Année de construction</span>
                  </p>
                  <Badge variant="secondary">{cruiseShip.year_built}</Badge>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date de création</span>
                </p>
                <p className="font-medium">{formatDateTime(cruiseShip.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Galerie d'images */}
        <CruiseShipImageGallery cruiseShipId={cruiseShip.id} readonly={true} />
      </div>
    </AdminLayout>
  )
}

