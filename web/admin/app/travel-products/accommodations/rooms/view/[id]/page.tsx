"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { RoomImageGallery } from "@/components/accommodations/room-image-gallery"
import { roomsService } from "@/lib/services/accommodations"
import { Room } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewRoomPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const roomId = params.id as string

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true)
        const data = await roomsService.getById(roomId)
        setRoom(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la chambre",
          variant: "destructive",
        })
        router.push("/travel-products/accommodations/rooms")
      } finally {
        setIsLoading(false)
      }
    }

    if (roomId) {
      fetchRoom()
    }
  }, [roomId, router, toast])

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "success" as const,
      unavailable: "secondary" as const,
      maintenance: "warning" as const,
    }
    const labels: Record<string, string> = {
      available: "Disponible",
      unavailable: "Indisponible",
      maintenance: "En maintenance",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
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

  if (!room) {
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
            <Link href="/travel-products/accommodations/rooms">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/accommodations/rooms/edit/${room.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/accommodations/rooms/delete/${room.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la chambre</h1>
          <p className="text-muted-foreground">
            Informations complètes de {room.name || room.room_number || "la chambre"}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la chambre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{room.name || room.room_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {room.status ? getStatusBadge(room.status) : <p className="font-medium">-</p>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Propriété</p>
                <p className="font-medium">{room.property_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type de chambre</p>
                <p className="font-medium">{room.room_type_name || "-"}</p>
              </div>
              {room.room_number && (
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de chambre</p>
                  <p className="font-medium font-mono">{room.room_number}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Capacité</p>
                <p className="font-medium">{room.max_guests || room.capacity || "-"} personnes</p>
              </div>
              {room.size_sqm && (
                <div>
                  <p className="text-sm text-muted-foreground">Taille</p>
                  <p className="font-medium">{room.size_sqm} m²</p>
                </div>
              )}
              {room.bed_type && (
                <div>
                  <p className="text-sm text-muted-foreground">Type de lit</p>
                  <p className="font-medium">{room.bed_type}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(room.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(room.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RoomImageGallery roomId={roomId} readonly={false} />
        </motion.div>
      </div>
    </AdminLayout>
  )
}

