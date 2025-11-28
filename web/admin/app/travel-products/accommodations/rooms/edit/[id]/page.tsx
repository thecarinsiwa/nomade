"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { RoomForm } from "@/components/accommodations/room-form"
import { RoomImageGallery } from "@/components/accommodations/room-image-gallery"
import { roomsService } from "@/lib/services/accommodations"
import { Room } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditRoomPage() {
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

  const handleSuccess = () => {
    router.push("/travel-products/accommodations/rooms")
  }

  const handleCancel = () => {
    router.push("/travel-products/accommodations/rooms")
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
          <Link href="/travel-products/accommodations/rooms">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la chambre</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {room.name || room.room_number || "la chambre"}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la chambre</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoomForm room={room} onSuccess={handleSuccess} onCancel={handleCancel} />
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

