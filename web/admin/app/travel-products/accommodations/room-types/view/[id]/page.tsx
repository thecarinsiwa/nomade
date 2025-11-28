"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { roomTypesService } from "@/lib/services/accommodations"
import { RoomType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewRoomTypePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const roomTypeId = params.id as string

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        setIsLoading(true)
        const data = await roomTypesService.getById(roomTypeId)
        setRoomType(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le type",
          variant: "destructive",
        })
        router.push("/travel-products/accommodations/room-types")
      } finally {
        setIsLoading(false)
      }
    }

    if (roomTypeId) {
      fetchRoomType()
    }
  }, [roomTypeId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!roomType) {
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
            <Link href="/travel-products/accommodations/room-types">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/accommodations/room-types/edit/${roomType.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/accommodations/room-types/delete/${roomType.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails du type</h1>
          <p className="text-muted-foreground">
            Informations complètes de {roomType.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{roomType.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(roomType.created_at)}</p>
              </div>
              {roomType.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{roomType.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

