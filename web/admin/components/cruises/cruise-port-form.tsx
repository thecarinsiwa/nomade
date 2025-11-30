"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cruisePortsService } from "@/lib/services/cruises"
import { CruisePort } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruisePortSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional().or(z.null()),
  longitude: z.coerce.number().min(-180).max(180).optional().or(z.null()),
})

type CruisePortFormData = z.infer<typeof cruisePortSchema>

interface CruisePortFormProps {
  cruisePort: CruisePort | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruisePortForm({ cruisePort, onSuccess, onCancel }: CruisePortFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CruisePortFormData>({
    resolver: zodResolver(cruisePortSchema),
    defaultValues: {
      name: cruisePort?.name || "",
      city: cruisePort?.city || "",
      country: cruisePort?.country || "",
      latitude: cruisePort?.latitude || null,
      longitude: cruisePort?.longitude || null,
    },
  })

  const onSubmit = async (data: CruisePortFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        city: data.city || undefined,
        country: data.country || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
      }
      
      if (cruisePort) {
        await cruisePortsService.update(cruisePort.id, submitData)
        toast({
          title: "Succès",
          description: "Port mis à jour avec succès",
        })
      } else {
        await cruisePortsService.create(submitData)
        toast({
          title: "Succès",
          description: "Port créé avec succès",
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
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          placeholder="Ex: Port de Marseille"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            placeholder="Ex: Marseille"
            {...register("city")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            placeholder="Ex: France"
            {...register("country")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="Ex: 43.2965"
            {...register("latitude")}
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">{errors.latitude.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="Ex: 5.3698"
            {...register("longitude")}
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {cruisePort ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruisePort ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

