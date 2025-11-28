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
import { flightsService, airlinesService, airportsService } from "@/lib/services/flights"
import { Flight, Airline, Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"

const flightSchema = z.object({
  flight_number: z.string().min(1, "Le numéro de vol est requis").max(20, "Le numéro de vol ne peut pas dépasser 20 caractères"),
  airline: z.string().uuid("La compagnie aérienne est requise"),
  departure_airport: z.string().uuid("L'aéroport de départ est requis"),
  arrival_airport: z.string().uuid("L'aéroport d'arrivée est requis"),
  duration_minutes: z.number().int().min(0, "La durée doit être positive").optional().nullable(),
  aircraft_type: z.string().max(100, "Le type d'avion ne peut pas dépasser 100 caractères").optional().nullable(),
  status: z.enum(["scheduled", "delayed", "cancelled", "completed"], {
    required_error: "Le statut est requis",
  }),
}).refine((data) => data.departure_airport !== data.arrival_airport, {
  message: "L'aéroport de départ et d'arrivée doivent être différents",
  path: ["arrival_airport"],
})

type FlightFormData = z.infer<typeof flightSchema>

interface FlightFormProps {
  flight: Flight | null
  onSuccess: () => void
  onCancel: () => void
}

export function FlightForm({ flight, onSuccess, onCancel }: FlightFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [airports, setAirports] = useState<Airport[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FlightFormData>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      flight_number: flight?.flight_number || "",
      airline: typeof flight?.airline === 'string' ? flight.airline : (typeof flight?.airline === 'object' ? flight.airline.id : ""),
      departure_airport: typeof flight?.departure_airport === 'string' ? flight.departure_airport : (typeof flight?.departure_airport === 'object' ? flight.departure_airport.id : ""),
      arrival_airport: typeof flight?.arrival_airport === 'string' ? flight.arrival_airport : (typeof flight?.arrival_airport === 'object' ? flight.arrival_airport.id : ""),
      duration_minutes: flight?.duration_minutes || undefined,
      aircraft_type: flight?.aircraft_type || "",
      status: flight?.status || "scheduled",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airlinesData, airportsData] = await Promise.all([
          airlinesService.getAll(1),
          airportsService.getAll(1),
        ])
        setAirlines(airlinesData.results || [])
        setAirports(airportsData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FlightFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        flight_number: data.flight_number,
        airline: data.airline,
        departure_airport: data.departure_airport,
        arrival_airport: data.arrival_airport,
        status: data.status,
      }
      
      // Ajouter les champs optionnels seulement s'ils sont définis
      if (data.duration_minutes !== undefined && data.duration_minutes !== null) {
        submitData.duration_minutes = data.duration_minutes
      }
      if (data.aircraft_type && data.aircraft_type.trim() !== "") {
        submitData.aircraft_type = data.aircraft_type
      }
      
      if (flight) {
        await flightsService.update(flight.id, submitData)
        toast({
          title: "Succès",
          description: "Vol mis à jour avec succès",
        })
      } else {
        await flightsService.create(submitData)
        toast({
          title: "Succès",
          description: "Vol créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting flight:", error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          Object.values(error.response?.data || {}).flat().join(", ") ||
                          "Une erreur est survenue"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations de base</h3>
        
        <div className="space-y-2">
          <Label htmlFor="flight_number">
            Numéro de vol <span className="text-destructive">*</span>
          </Label>
          <Input
            id="flight_number"
            {...register("flight_number")}
            placeholder="Ex: AF123, BA456"
            className="font-mono"
          />
          {errors.flight_number && (
            <p className="text-sm text-destructive">{errors.flight_number.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Format: Code compagnie suivi du numéro (max 20 caractères)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="airline">
            Compagnie aérienne <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch("airline") || undefined}
            onValueChange={(value) => setValue("airline", value)}
          >
            <SelectTrigger className={errors.airline ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionner une compagnie" />
            </SelectTrigger>
            <SelectContent>
              {airlines.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Aucune compagnie disponible
                </div>
              ) : (
                airlines.map((airline) => (
                  <SelectItem key={airline.id} value={airline.id}>
                    {airline.code} - {airline.name}
                    {airline.country && ` (${airline.country})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.airline && (
            <p className="text-sm text-destructive">{errors.airline.message}</p>
          )}
        </div>
      </div>

      {/* Itinéraire */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Itinéraire</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departure_airport">
              Aéroport de départ <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("departure_airport") || undefined}
              onValueChange={(value) => setValue("departure_airport", value)}
            >
              <SelectTrigger className={errors.departure_airport ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un aéroport" />
              </SelectTrigger>
              <SelectContent>
                {airports.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Aucun aéroport disponible
                  </div>
                ) : (
                  airports.map((airport) => (
                    <SelectItem key={airport.id} value={airport.id}>
                      {airport.iata_code} - {airport.name}
                      {airport.city && ` (${airport.city}${airport.country ? `, ${airport.country}` : ""})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.departure_airport && (
              <p className="text-sm text-destructive">{errors.departure_airport.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrival_airport">
              Aéroport d'arrivée <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("arrival_airport") || undefined}
              onValueChange={(value) => setValue("arrival_airport", value)}
            >
              <SelectTrigger className={errors.arrival_airport ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un aéroport" />
              </SelectTrigger>
              <SelectContent>
                {airports.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Aucun aéroport disponible
                  </div>
                ) : (
                  airports.map((airport) => (
                    <SelectItem key={airport.id} value={airport.id}>
                      {airport.iata_code} - {airport.name}
                      {airport.city && ` (${airport.city}${airport.country ? `, ${airport.country}` : ""})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.arrival_airport && (
              <p className="text-sm text-destructive">
                {errors.arrival_airport.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Détails du vol */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails du vol</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Durée (minutes)</Label>
            <Input
              id="duration_minutes"
              type="number"
              min="0"
              step="1"
              placeholder="Ex: 120"
              {...register("duration_minutes", { valueAsNumber: true })}
            />
            {errors.duration_minutes && (
              <p className="text-sm text-destructive">{errors.duration_minutes.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Durée du vol en minutes (optionnel)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aircraft_type">Type d'avion</Label>
            <Input
              id="aircraft_type"
              {...register("aircraft_type")}
              placeholder="Ex: Boeing 737, Airbus A320"
              maxLength={100}
            />
            {errors.aircraft_type && (
              <p className="text-sm text-destructive">{errors.aircraft_type.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Modèle d'avion utilisé (optionnel, max 100 caractères)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Statut <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger className={errors.status ? "border-destructive" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Programmé</SelectItem>
              <SelectItem value="delayed">Retardé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {flight ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            flight ? "Mettre à jour" : "Créer le vol"
          )}
        </Button>
      </div>
    </form>
  )
}

