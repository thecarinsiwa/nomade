"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Anchor, Calendar, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseLinesService } from "@/lib/services/cruises"
import { CruiseLine } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCruiseLinePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruiseLine, setCruiseLine] = useState<CruiseLine | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruiseLineId = params.id as string

  useEffect(() => {
    const fetchCruiseLine = async () => {
      try {
        setIsLoading(true)
        const data = await cruiseLinesService.getById(cruiseLineId)
        setCruiseLine(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la compagnie",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cruise-lines")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruiseLineId) {
      fetchCruiseLine()
    }
  }, [cruiseLineId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!cruiseLine) {
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
            <Link href="/travel-products/cruises/cruise-lines">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/cruise-lines/edit/${cruiseLine.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/cruise-lines/delete/${cruiseLine.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Anchor className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{cruiseLine.name}</h1>
              <p className="text-muted-foreground">
                Compagnie de croisière
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la compagnie</CardTitle>
            <CardDescription>
              Détails de {cruiseLine.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{cruiseLine.name}</p>
              </div>
              {cruiseLine.logo_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Logo</p>
                  <img
                    src={cruiseLine.logo_url}
                    alt={`Logo de ${cruiseLine.name}`}
                    className="h-16 object-contain"
                  />
                </div>
              )}
              {cruiseLine.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{cruiseLine.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date de création</span>
                </p>
                <p className="font-medium">{formatDateTime(cruiseLine.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

