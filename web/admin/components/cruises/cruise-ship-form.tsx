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
import { cruiseShipsService, cruiseLinesService } from "@/lib/services/cruises"
import { CruiseShip, CruiseLine } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruiseShipSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  cruise_line: z.string().uuid().optional(),
  capacity: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val)
      return isNaN(num) ? undefined : num
    },
    z
      .number()
      .min(1, "La capacité doit être supérieure à 0")
      .optional()
  ),
  year_built: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val)
      return isNaN(num) ? undefined : num
    },
    z
      .number()
      .min(1800, "L'année doit être supérieure à 1800")
      .max(new Date().getFullYear() + 1, `L'année doit être inférieure à ${new Date().getFullYear() + 2}`)
      .optional()
  ),
})

type CruiseShipFormData = z.infer<typeof cruiseShipSchema>

interface CruiseShipFormProps {
  cruiseShip: CruiseShip | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseShipForm({ cruiseShip, onSuccess, onCancel }: CruiseShipFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cruiseLines, setCruiseLines] = useState<CruiseLine[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CruiseShipFormData>({
    resolver: zodResolver(cruiseShipSchema),
    defaultValues: {
      name: cruiseShip?.name || "",
      cruise_line: cruiseShip?.cruise_line || undefined,
      capacity: cruiseShip?.capacity?.toString() || "",
      year_built: cruiseShip?.year_built?.toString() || "",
    },
  })

  useEffect(() => {
    const fetchCruiseLines = async () => {
      try {
        const data = await cruiseLinesService.getAll(1)
        setCruiseLines(data.results || [])
      } catch (error) {
        console.error("Error fetching cruise lines:", error)
      }
    }
    fetchCruiseLines()
  }, [])

  const onSubmit = async (data: CruiseShipFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        name: data.name,
      }
      
      if (data.cruise_line) {
        submitData.cruise_line = data.cruise_line
      }
      
      if (data.capacity !== null && data.capacity !== undefined) {
        submitData.capacity = data.capacity
      }
      
      if (data.year_built !== null && data.year_built !== undefined) {
        submitData.year_built = data.year_built
      }
      
      if (cruiseShip) {
        await cruiseShipsService.update(cruiseShip.id, submitData)
        toast({
          title: "Succès",
          description: "Navire mis à jour avec succès",
        })
      } else {
        await cruiseShipsService.create(submitData)
        toast({
          title: "Succès",
          description: "Navire créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || error.message || "Une erreur est survenue",
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
          placeholder="Ex: MSC Grandiosa"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cruise_line">Compagnie de croisière</Label>
        <Select
          value={watch("cruise_line") || undefined}
          onValueChange={(value) => setValue("cruise_line", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une compagnie" />
          </SelectTrigger>
          <SelectContent>
            {cruiseLines.map((line) => (
              <SelectItem key={line.id} value={line.id}>
                {line.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacité (passagers)</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="Ex: 5000"
            {...register("capacity")}
          />
          {errors.capacity && (
            <p className="text-sm text-destructive">{errors.capacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_built">Année de construction</Label>
          <Input
            id="year_built"
            type="number"
            placeholder="Ex: 2019"
            {...register("year_built")}
          />
          {errors.year_built && (
            <p className="text-sm text-destructive">{errors.year_built.message}</p>
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
              {cruiseShip ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruiseShip ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

