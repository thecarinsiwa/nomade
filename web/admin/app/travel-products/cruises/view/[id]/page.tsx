"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruisesService } from "@/lib/services/cruises"
import { CruiseImageGallery } from "@/components/cruises/cruise-image-gallery"
import { Cruise } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCruisePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruise, setCruise] = useState<Cruise | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruiseId = params.id as string

  useEffect(() => {
    const fetchCruise = async () => {
      try {
        setIsLoading(true)
        const data = await cruisesService.getById(cruiseId)
        setCruise(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la croisière",
          variant: "destructive",
        })
        router.push("/travel-products/cruises")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruiseId) {
      fetchCruise()
    }
  }, [cruiseId, router, toast])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      scheduled: "default",
      in_progress: "success",
      completed: "secondary",
      cancelled: "destructive",
    }
    const labels: Record<string, string> = {
      scheduled: "Programmée",
      in_progress: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
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

  if (!cruise) {
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
            <Link href="/travel-products/cruises">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/edit/${cruise.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/delete/${cruise.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la croisière</h1>
          <p className="text-muted-foreground">
            Informations complètes de {cruise.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la croisière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{cruise.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {getStatusBadge(cruise.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compagnie</p>
                <p className="font-medium">{cruise.cruise_line_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Navire</p>
                <p className="font-medium">{cruise.ship_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Port de départ</p>
                <p className="font-medium">{cruise.departure_port_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Port d'arrivée</p>
                <p className="font-medium">{cruise.arrival_port_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de départ</p>
                <p className="font-medium">{formatDate(cruise.departure_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'arrivée</p>
                <p className="font-medium">{formatDate(cruise.arrival_date)}</p>
              </div>
              {cruise.duration_days && (
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-medium">{cruise.duration_days} jours</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(cruise.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(cruise.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Galerie d'images */}
        <CruiseImageGallery cruiseId={cruise.id} readonly={true} />
      </div>
    </AdminLayout>
  )
}

