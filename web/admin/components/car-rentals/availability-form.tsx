"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Car as CarIcon, MapPin, Calendar, DollarSign } from "lucide-react"
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
import {
  carAvailabilityService,
  carsService,
  carRentalLocationsService,
} from "@/lib/services/car-rentals"
import { CarAvailability, Car, CarRentalLocation } from "@/types"
import { useToast } from "@/hooks/use-toast"

const availabilitySchema = z.object({
  car: z.string().uuid("Le véhicule est requis"),
  location: z.string().uuid("Le point de location est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().min(1, "La date de fin est requise"),
  available: z.boolean(),
  price_per_day: z.number().min(0, "Le prix doit être positif").optional().nullable(),
  currency: z.string().length(3, "La devise doit contenir 3 caractères").optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) >= new Date(data.start_date)
  }
  return true
}, {
  message: "La date de fin doit être après la date de début",
  path: ["end_date"],
})

type AvailabilityFormData = z.infer<typeof availabilitySchema>

interface AvailabilityFormProps {
  availability: CarAvailability | null
  onSuccess: () => void
  onCancel: () => void
}

export function AvailabilityForm({ availability, onSuccess, onCancel }: AvailabilityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cars, setCars] = useState<Car[]>([])
  const [locations, setLocations] = useState<CarRentalLocation[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      car: typeof availability?.car === 'string' ? availability.car : (typeof availability?.car === 'object' && availability?.car?.id ? availability.car.id : ""),
      location: typeof availability?.location === 'string' ? availability.location : (typeof availability?.location === 'object' && availability?.location?.id ? availability.location.id : ""),
      start_date: availability?.start_date ? availability.start_date.split('T')[0] : "",
      end_date: availability?.end_date ? availability.end_date.split('T')[0] : "",
      available: availability?.is_available !== undefined ? availability.is_available : (availability as any)?.available !== undefined ? (availability as any).available : true,
      price_per_day: availability?.price_per_day ? Number(availability.price_per_day) : undefined,
      currency: availability?.currency || "EUR",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, locationsData] = await Promise.all([
          carsService.getAll(1),
          carRentalLocationsService.getAll(1),
        ])
        setCars(carsData.results || [])
        setLocations(locationsData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        })
      }
    }
    fetchData()
  }, [toast])

  const onSubmit = async (data: AvailabilityFormData) => {
    setIsLoading(true)
    try {
      // Validation supplémentaire
      if (!data.car || data.car.trim() === "") {
        toast({
          title: "Erreur",
          description: "Le véhicule est requis",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!data.location || data.location.trim() === "") {
        toast({
          title: "Erreur",
          description: "Le point de location est requis",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const submitData: any = {
        car: data.car.trim(),
        location: data.location.trim(),
        start_date: data.start_date,
        end_date: data.end_date,
        available: data.available,
        currency: data.currency || "EUR",
      }

      if (data.price_per_day !== undefined && data.price_per_day !== null && !isNaN(data.price_per_day)) {
        submitData.price_per_day = data.price_per_day
      }

      if (availability) {
        await carAvailabilityService.update(availability.id, submitData)
        toast({
          title: "Succès",
          description: "Disponibilité mise à jour avec succès",
        })
      } else {
        await carAvailabilityService.create(submitData)
        toast({
          title: "Succès",
          description: "Disponibilité créée avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting availability:", error)
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

  const selectedCar = watch("car")
  const selectedLocation = watch("location")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <CarIcon className="mr-2 h-5 w-5" />
          Informations de base
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="car">Véhicule *</Label>
            <Select
              value={selectedCar || undefined}
              onValueChange={(value) => setValue("car", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {cars.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Aucun véhicule disponible
                  </div>
                ) : (
                  cars.map((car) => {
                    const carName = `${car.make || ''} ${car.model || ''}`.trim()
                    const displayName = car.year ? `${carName} (${car.year})` : carName
                    return (
                      <SelectItem key={car.id} value={car.id}>
                        {displayName || `Véhicule ${car.id}`}
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
            {errors.car && (
              <p className="text-sm text-destructive">{errors.car.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Point de location *</Label>
            <Select
              value={selectedLocation || undefined}
              onValueChange={(value) => setValue("location", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un point de location" />
              </SelectTrigger>
              <SelectContent>
                {locations.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Aucun point de location disponible
                  </div>
                ) : (
                  locations.map((location) => {
                    const displayName = location.city 
                      ? `${location.name} - ${location.city}` 
                      : location.name
                    return (
                      <SelectItem key={location.id} value={location.id}>
                        {displayName}
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Période */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Période
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Date de début *</Label>
            <Input
              id="start_date"
              type="date"
              {...register("start_date")}
            />
            {errors.start_date && (
              <p className="text-sm text-destructive">{errors.start_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Date de fin *</Label>
            <Input
              id="end_date"
              type="date"
              {...register("end_date")}
            />
            {errors.end_date && (
              <p className="text-sm text-destructive">{errors.end_date.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Prix et disponibilité */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Prix et disponibilité
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_day">Prix par jour (€)</Label>
            <Input
              id="price_per_day"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("price_per_day", { valueAsNumber: true })}
            />
            {errors.price_per_day && (
              <p className="text-sm text-destructive">{errors.price_per_day.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Laissez vide si le prix n'est pas encore défini
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="available">Disponibilité</Label>
            <Select
              value={watch("available") ? "true" : "false"}
              onValueChange={(value) => setValue("available", value === "true")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Disponible</SelectItem>
                <SelectItem value="false">Indisponible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {availability ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            availability ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

