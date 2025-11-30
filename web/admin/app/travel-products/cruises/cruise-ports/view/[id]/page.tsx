"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2, Anchor, Calendar, MapPin, Globe, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruisePortsService } from "@/lib/services/cruises"
import { CruisePort } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCruisePortPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruisePort, setCruisePort] = useState<CruisePort | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruisePortId = params.id as string

  useEffect(() => {
    const fetchCruisePort = async () => {
      try {
        setIsLoading(true)
        const data = await cruisePortsService.getById(cruisePortId)
        setCruisePort(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le port",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cruise-ports")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruisePortId) {
      fetchCruisePort()
    }
  }, [cruisePortId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!cruisePort) {
    return null
  }

  const getGoogleMapsUrl = (lat?: number, lng?: number) => {
    if (lat && lng) {
      return `https://www.google.com/maps?q=${lat},${lng}`
    }
    return null
  }

  const googleMapsUrl = getGoogleMapsUrl(cruisePort.latitude, cruisePort.longitude)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/cruises/cruise-ports">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/cruises/cruise-ports/edit/${cruisePort.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/cruises/cruise-ports/delete/${cruisePort.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-100 p-3 rounded-lg">
              <Anchor className="h-8 w-8 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{cruisePort.name}</h1>
              <p className="text-muted-foreground">
                Port de croisière
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du port</CardTitle>
            <CardDescription>
              Détails de {cruisePort.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Anchor className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{cruisePort.name}</p>
              </div>
              {cruisePort.city && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>Ville</span>
                  </p>
                  <p className="font-medium">{cruisePort.city}</p>
                </div>
              )}
              {cruisePort.country && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Globe className="h-4 w-4" />
                    <span>Pays</span>
                  </p>
                  <p className="font-medium">{cruisePort.country}</p>
                </div>
              )}
              {cruisePort.latitude && cruisePort.longitude && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <Navigation className="h-4 w-4" />
                    <span>Coordonnées GPS</span>
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-mono mb-2">
                      Latitude: {cruisePort.latitude}<br />
                      Longitude: {cruisePort.longitude}
                    </p>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Voir sur Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date de création</span>
                </p>
                <p className="font-medium">{formatDateTime(cruisePort.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

