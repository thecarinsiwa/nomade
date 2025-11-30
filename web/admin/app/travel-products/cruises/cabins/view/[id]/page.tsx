"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Bed, Calendar, Users, DollarSign, CheckCircle2, XCircle, Ship } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseCabinsService } from "@/lib/services/cruises"
import { CruiseCabin } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCruiseCabinPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruiseCabin, setCruiseCabin] = useState<CruiseCabin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruiseCabinId = params.id as string

  useEffect(() => {
    const fetchCruiseCabin = async () => {
      try {
        setIsLoading(true)
        const data = await cruiseCabinsService.getById(cruiseCabinId)
        setCruiseCabin(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la cabine",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cabins")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruiseCabinId) {
      fetchCruiseCabin()
    }
  }, [cruiseCabinId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!cruiseCabin) {
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
            <Link href="/travel-products/cruises/cabins">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/cabins/edit/${cruiseCabin.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/cabins/delete/${cruiseCabin.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Bed className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cabine {cruiseCabin.cabin_number}</h1>
              <p className="text-muted-foreground">
                Détails de la cabine
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la cabine</CardTitle>
            <CardDescription>
              Détails de la cabine {cruiseCabin.cabin_number}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Bed className="h-4 w-4" />
                  <span>Numéro de cabine</span>
                </p>
                <Badge variant="secondary" className="font-mono text-lg">
                  {cruiseCabin.cabin_number}
                </Badge>
              </div>
              {cruiseCabin.cruise_name && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Ship className="h-4 w-4" />
                    <span>Croisière</span>
                  </p>
                  <p className="font-medium">{cruiseCabin.cruise_name}</p>
                </div>
              )}
              {cruiseCabin.cabin_type_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type de cabine</p>
                  <Badge variant="outline">{cruiseCabin.cabin_type_name}</Badge>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4" />
                  <span>Capacité</span>
                </p>
                <p className="font-medium">{cruiseCabin.capacity} personne{cruiseCabin.capacity > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Prix</span>
                </p>
                <p className="font-medium text-lg">{cruiseCabin.price} €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Disponibilité</p>
                {cruiseCabin.is_available ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Disponible
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="mr-1 h-3 w-3" />
                    Indisponible
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date de création</span>
                </p>
                <p className="font-medium">{formatDateTime(cruiseCabin.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

