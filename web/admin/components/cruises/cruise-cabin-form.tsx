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
import { cruiseCabinsService, cruisesService, cruiseCabinTypesService } from "@/lib/services/cruises"
import { CruiseCabin, Cruise, CruiseCabinType } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruiseCabinSchema = z.object({
  cruise: z.string().uuid().optional().or(z.literal("")),
  cabin_type: z.string().uuid().optional().or(z.literal("")),
  cabin_number: z.string().min(1, "Le numéro de cabine est requis"),
  capacity: z.coerce.number().min(1, "La capacité doit être supérieure à 0"),
  price: z.coerce.number().min(0, "Le prix doit être positif"),
  is_available: z.boolean(),
})

type CruiseCabinFormData = z.infer<typeof cruiseCabinSchema>

interface CruiseCabinFormProps {
  cruiseCabin: CruiseCabin | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseCabinForm({ cruiseCabin, onSuccess, onCancel }: CruiseCabinFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cruises, setCruises] = useState<Cruise[]>([])
  const [cabinTypes, setCabinTypes] = useState<CruiseCabinType[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CruiseCabinFormData>({
    resolver: zodResolver(cruiseCabinSchema),
    defaultValues: {
      cruise: cruiseCabin?.cruise || "",
      cabin_type: cruiseCabin?.cabin_type || "",
      cabin_number: cruiseCabin?.cabin_number || "",
      capacity: cruiseCabin?.capacity || 2,
      price: cruiseCabin?.price || 0,
      is_available: cruiseCabin?.is_available ?? true,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cruisesData, typesData] = await Promise.all([
          cruisesService.getAll(1),
          cruiseCabinTypesService.getAll(1),
        ])
        setCruises(cruisesData.results || [])
        setCabinTypes(typesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: CruiseCabinFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        cruise: data.cruise || undefined,
        cabin_type: data.cabin_type || undefined,
      }
      
      if (cruiseCabin) {
        await cruiseCabinsService.update(cruiseCabin.id, submitData)
        toast({
          title: "Succès",
          description: "Cabine mise à jour avec succès",
        })
      } else {
        await cruiseCabinsService.create(submitData)
        toast({
          title: "Succès",
          description: "Cabine créée avec succès",
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
          <Label htmlFor="cruise">Croisière</Label>
          <Select
            value={watch("cruise") || undefined}
            onValueChange={(value) => setValue("cruise", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une croisière" />
            </SelectTrigger>
            <SelectContent>
              {cruises.map((cruise) => (
                <SelectItem key={cruise.id} value={cruise.id}>
                  {cruise.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cabin_type">Type de cabine</Label>
          <Select
            value={watch("cabin_type") || undefined}
            onValueChange={(value) => setValue("cabin_type", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {cabinTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cabin_number">Numéro de cabine *</Label>
        <Input
          id="cabin_number"
          placeholder="Ex: 101, A12, etc."
          {...register("cabin_number")}
        />
        {errors.cabin_number && (
          <p className="text-sm text-destructive">{errors.cabin_number.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacité *</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            placeholder="Ex: 2"
            {...register("capacity")}
          />
          {errors.capacity && (
            <p className="text-sm text-destructive">{errors.capacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Prix (€) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ex: 500.00"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_available"
          checked={watch("is_available")}
          onChange={(e) => setValue("is_available", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="is_available" className="cursor-pointer">
          Disponible
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {cruiseCabin ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruiseCabin ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

