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
import { cruisesService, cruiseLinesService, cruiseShipsService, cruisePortsService } from "@/lib/services/cruises"
import { Cruise, CruiseLine, CruiseShip, CruisePort } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruiseSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  cruise_line: z.string().uuid().optional(),
  ship: z.string().uuid().optional(),
  departure_port: z.string().uuid().optional(),
  arrival_port: z.string().uuid().optional(),
  departure_date: z.string().min(1, "La date de départ est requise"),
  arrival_date: z.string().min(1, "La date d'arrivée est requise"),
  duration_days: z.number().min(1).optional(),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
})

type CruiseFormData = z.infer<typeof cruiseSchema>

interface CruiseFormProps {
  cruise: Cruise | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseForm({ cruise, onSuccess, onCancel }: CruiseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cruiseLines, setCruiseLines] = useState<CruiseLine[]>([])
  const [ships, setShips] = useState<CruiseShip[]>([])
  const [ports, setPorts] = useState<CruisePort[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CruiseFormData>({
    resolver: zodResolver(cruiseSchema),
    defaultValues: {
      name: cruise?.name || "",
      cruise_line: cruise?.cruise_line || "",
      ship: cruise?.ship || "",
      departure_port: cruise?.departure_port || "",
      arrival_port: cruise?.arrival_port || "",
      departure_date: cruise?.departure_date ? cruise.departure_date.split('T')[0] : "",
      arrival_date: cruise?.arrival_date ? cruise.arrival_date.split('T')[0] : "",
      duration_days: cruise?.duration_days || undefined,
      status: cruise?.status || "scheduled",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linesData, shipsData, portsData] = await Promise.all([
          cruiseLinesService.getAll(1),
          cruiseShipsService.getAll(1),
          cruisePortsService.getAll(1),
        ])
        setCruiseLines(linesData.results || [])
        setShips(shipsData.results || [])
        setPorts(portsData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: CruiseFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        departure_date: new Date(data.departure_date).toISOString(),
        arrival_date: new Date(data.arrival_date).toISOString(),
      }
      
      if (cruise) {
        await cruisesService.update(cruise.id, submitData)
        toast({
          title: "Succès",
          description: "Croisière mise à jour avec succès",
        })
      } else {
        await cruisesService.create(submitData)
        toast({
          title: "Succès",
          description: "Croisière créée avec succès",
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
        <Input id="name" {...register("name")} placeholder="Nom de la croisière" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cruise_line">Compagnie de croisière</Label>
          <Select
            value={watch("cruise_line") || undefined}
            onValueChange={(value) => setValue("cruise_line", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
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

        <div className="space-y-2">
          <Label htmlFor="ship">Navire</Label>
          <Select
            value={watch("ship") || undefined}
            onValueChange={(value) => setValue("ship", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {ships.map((ship) => (
                <SelectItem key={ship.id} value={ship.id}>
                  {ship.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure_port">Port de départ</Label>
          <Select
            value={watch("departure_port") || undefined}
            onValueChange={(value) => setValue("departure_port", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {ports.map((port) => (
                <SelectItem key={port.id} value={port.id}>
                  {port.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrival_port">Port d'arrivée</Label>
          <Select
            value={watch("arrival_port") || undefined}
            onValueChange={(value) => setValue("arrival_port", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {ports.map((port) => (
                <SelectItem key={port.id} value={port.id}>
                  {port.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure_date">Date de départ *</Label>
          <Input
            id="departure_date"
            type="date"
            {...register("departure_date")}
          />
          {errors.departure_date && (
            <p className="text-sm text-destructive">{errors.departure_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrival_date">Date d'arrivée *</Label>
          <Input
            id="arrival_date"
            type="date"
            {...register("arrival_date")}
          />
          {errors.arrival_date && (
            <p className="text-sm text-destructive">{errors.arrival_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_days">Durée (jours)</Label>
          <Input
            id="duration_days"
            type="number"
            min="1"
            {...register("duration_days", { valueAsNumber: true })}
            placeholder="7"
          />
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
            <SelectItem value="scheduled">Programmée</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
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
              {cruise ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruise ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

