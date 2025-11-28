"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { roomsService, propertiesService, roomTypesService } from "@/lib/services/accommodations"
import { Room, Property, RoomType } from "@/types"
import { useToast } from "@/hooks/use-toast"

const roomSchema = z.object({
  property: z.string().uuid().min(1, "La propriété est requise"),
  room_type: z.string().uuid().optional(),
  name: z.string().min(1, "Le nom est requis"),
  max_guests: z.number().min(1, "La capacité doit être au moins 1"),
  size_sqm: z.number().min(0).optional(),
  bed_type: z.string().optional(),
  status: z.enum(["available", "unavailable", "maintenance"]),
})

type RoomFormData = z.infer<typeof roomSchema>

interface RoomFormProps {
  room: Room | null
  onSuccess: () => void
  onCancel: () => void
}

export function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      property: room?.property || "",
      room_type: room?.room_type || undefined,
      name: room?.name || room?.room_number || "",
      max_guests: room?.max_guests || room?.capacity || 2,
      size_sqm: room?.size_sqm || undefined,
      bed_type: room?.bed_type || "",
      status: (room?.status as any) || "available",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesData, roomTypesData] = await Promise.all([
          propertiesService.getAll(1),
          roomTypesService.getAll(1),
        ])
        setProperties(propertiesData.results || [])
        setRoomTypes(roomTypesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: RoomFormData) => {
    setIsLoading(true)
    try {
      if (room) {
        await roomsService.update(room.id, data)
        toast({
          title: "Succès",
          description: "Chambre mise à jour avec succès",
        })
      } else {
        await roomsService.create(data)
        toast({
          title: "Succès",
          description: "Chambre créée avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property">Propriété *</Label>
          <Select
            value={watch("property") || undefined}
            onValueChange={(value) => setValue("property", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une propriété" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.property && (
            <p className="text-sm text-destructive">{errors.property.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_type">Type de chambre</Label>
          <Select
            value={watch("room_type") || undefined}
            onValueChange={(value) => setValue("room_type", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} placeholder="Ex: Chambre 101" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_guests">Capacité (personnes) *</Label>
          <Input
            id="max_guests"
            type="number"
            min="1"
            {...register("max_guests", { valueAsNumber: true })}
            placeholder="2"
          />
          {errors.max_guests && (
            <p className="text-sm text-destructive">{errors.max_guests.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="size_sqm">Taille (m²)</Label>
          <Input
            id="size_sqm"
            type="number"
            min="0"
            step="0.01"
            {...register("size_sqm", { valueAsNumber: true })}
            placeholder="25.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bed_type">Type de lit</Label>
          <Input id="bed_type" {...register("bed_type")} placeholder="Ex: 1 lit double" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut *</Label>
        <Select
          value={watch("status")}
          onValueChange={(value) => setValue("status", value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="unavailable">Indisponible</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {room ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            room ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

