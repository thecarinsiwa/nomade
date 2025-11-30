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
  cruise_line: z.string().uuid("La compagnie de croisière est requise").refine((val) => val && val.length > 0, {
    message: "La compagnie de croisière est requise"
  }),
  ship: z.union([z.string().uuid(), z.literal("")]).optional(),
  departure_port: z.union([z.string().uuid(), z.literal("")]).optional(),
  arrival_port: z.union([z.string().uuid(), z.literal("")]).optional(),
  departure_date: z.string().optional(),
  arrival_date: z.string().optional(),
  duration_days: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined
      const num = typeof val === "string" ? parseInt(val, 10) : Number(val)
      return isNaN(num) ? undefined : num
    },
    z.number().min(1, "La durée doit être supérieure à 0").optional()
  ),
  status: z.enum(["scheduled", "completed", "cancelled"]),
})

type CruiseFormData = z.infer<typeof cruiseSchema>

interface CruiseFormProps {
  cruise: Cruise | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseForm({ cruise, onSuccess, onCancel }: CruiseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
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
      cruise_line: cruise?.cruise_line || undefined,
      ship: cruise?.ship || "",
      departure_port: cruise?.departure_port || "",
      arrival_port: cruise?.arrival_port || "",
      departure_date: cruise?.start_date ? cruise.start_date.split('T')[0] : "",
      arrival_date: cruise?.end_date ? cruise.end_date.split('T')[0] : "",
      duration_days: cruise?.duration_days?.toString() || "",
      status: cruise?.status || "scheduled",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        const [linesData, shipsData, portsData] = await Promise.all([
          cruiseLinesService.getAll(1),
          cruiseShipsService.getAll(1),
          cruisePortsService.getAll(1),
        ])
        setCruiseLines(linesData.results || [])
        setShips(shipsData.results || [])
        setPorts(portsData.results || [])
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données pour les sélections",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [toast])

  const onSubmit = async (data: CruiseFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        name: data.name,
        cruise_line: data.cruise_line,
        status: data.status,
      }
      
      // Dates - format YYYY-MM-DD (le champ date HTML envoie déjà le format YYYY-MM-DD)
      if (data.departure_date) {
        submitData.start_date = data.departure_date
      }
      
      if (data.arrival_date) {
        submitData.end_date = data.arrival_date
      }
      
      // Champs optionnels - seulement si ils ont une valeur (ne pas envoyer null)
      if (data.ship && data.ship !== "") {
        submitData.ship = data.ship
      }
      
      if (data.departure_port && data.departure_port !== "") {
        submitData.departure_port = data.departure_port
      }
      
      if (data.arrival_port && data.arrival_port !== "") {
        submitData.arrival_port = data.arrival_port
      }
      
      if (data.duration_days !== null && data.duration_days !== undefined && data.duration_days > 0) {
        submitData.duration_days = data.duration_days
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
      console.error("Erreur lors de la soumission:", error)
      const errorMessage = error.response?.data?.detail 
        || error.response?.data?.message
        || (error.response?.data && typeof error.response.data === 'object' 
            ? JSON.stringify(error.response.data) 
            : null)
        || error.message 
        || "Une erreur est survenue"
      
      toast({
        title: "Erreur",
        description: errorMessage,
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
          <Label htmlFor="cruise_line">Compagnie de croisière *</Label>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-10 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Select
              value={watch("cruise_line") || undefined}
              onValueChange={(value) => setValue("cruise_line", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une compagnie" />
              </SelectTrigger>
              <SelectContent>
                {cruiseLines.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucune compagnie disponible</div>
                ) : (
                  cruiseLines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
          {errors.cruise_line && (
            <p className="text-sm text-destructive">{errors.cruise_line.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ship">Navire</Label>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-10 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Select
              value={watch("ship") || ""}
              onValueChange={(value) => setValue("ship", value || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un navire" />
              </SelectTrigger>
              <SelectContent>
                {ships.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucun navire disponible</div>
                ) : (
                  ships.map((ship) => (
                    <SelectItem key={ship.id} value={ship.id}>
                      {ship.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure_port">Port de départ</Label>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-10 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Select
              value={watch("departure_port") || ""}
              onValueChange={(value) => setValue("departure_port", value || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un port" />
              </SelectTrigger>
              <SelectContent>
                {ports.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucun port disponible</div>
                ) : (
                  ports.map((port) => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrival_port">Port d'arrivée</Label>
          {isLoadingData ? (
            <div className="flex items-center justify-center h-10 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Select
              value={watch("arrival_port") || ""}
              onValueChange={(value) => setValue("arrival_port", value || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un port" />
              </SelectTrigger>
              <SelectContent>
                {ports.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">Aucun port disponible</div>
                ) : (
                  ports.map((port) => (
                    <SelectItem key={port.id} value={port.id}>
                      {port.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure_date">Date de départ</Label>
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
          <Label htmlFor="arrival_date">Date d'arrivée</Label>
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

