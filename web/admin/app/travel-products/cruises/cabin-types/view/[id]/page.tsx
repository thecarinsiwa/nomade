"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Bed, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseCabinTypesService } from "@/lib/services/cruises"
import { CruiseCabinType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCruiseCabinTypePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cabinType, setCabinType] = useState<CruiseCabinType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cabinTypeId = params.id as string

  useEffect(() => {
    const fetchCabinType = async () => {
      try {
        setIsLoading(true)
        const data = await cruiseCabinTypesService.getById(cabinTypeId)
        setCabinType(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le type de cabine",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cabin-types")
      } finally {
        setIsLoading(false)
      }
    }

    if (cabinTypeId) {
      fetchCabinType()
    }
  }, [cabinTypeId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!cabinType) {
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
            <Link href="/travel-products/cruises/cabin-types">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/cabin-types/edit/${cabinType.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/cabin-types/delete/${cabinType.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bed className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{cabinType.name}</h1>
              <p className="text-muted-foreground">
                Type de cabine
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du type de cabine</CardTitle>
            <CardDescription>
              Détails de {cabinType.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Bed className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{cabinType.name}</p>
              </div>
              {cabinType.cabins_count !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre de cabines</p>
                  <Badge variant="secondary" className="text-lg">
                    {cabinType.cabins_count} cabine{cabinType.cabins_count > 1 ? "s" : ""}
                  </Badge>
                </div>
              )}
              {cabinType.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{cabinType.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date de création</span>
                </p>
                <p className="font-medium">{formatDateTime(cabinType.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

