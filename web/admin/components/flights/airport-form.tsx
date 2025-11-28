"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, MapPin, Globe, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { airportsService } from "@/lib/services/flights"
import { Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"

const airportSchema = z.object({
  iata_code: z.string()
    .min(3, "Le code IATA doit contenir exactement 3 caractères")
    .max(3, "Le code IATA doit contenir exactement 3 caractères")
    .regex(/^[A-Z]{3}$/, "Le code IATA doit contenir 3 lettres majuscules"),
  icao_code: z.string()
    .max(4, "Le code ICAO ne peut pas dépasser 4 caractères")
    .regex(/^[A-Z0-9]{0,4}$/, "Le code ICAO doit contenir uniquement des lettres majuscules et chiffres")
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, "Le nom est requis").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  city: z.string().max(100, "La ville ne peut pas dépasser 100 caractères").optional().or(z.literal("")),
  country: z.string().max(100, "Le pays ne peut pas dépasser 100 caractères").optional().or(z.literal("")),
  latitude: z.number()
    .min(-90, "La latitude doit être entre -90 et 90")
    .max(90, "La latitude doit être entre -90 et 90")
    .optional()
    .or(z.nan()),
  longitude: z.number()
    .min(-180, "La longitude doit être entre -180 et 180")
    .max(180, "La longitude doit être entre -180 et 180")
    .optional()
    .or(z.nan()),
  timezone: z.string().max(50, "Le fuseau horaire ne peut pas dépasser 50 caractères").optional().or(z.literal("")),
})

type AirportFormData = z.infer<typeof airportSchema>

interface AirportFormProps {
  airport: Airport | null
  onSuccess: () => void
  onCancel: () => void
}

export function AirportForm({ airport, onSuccess, onCancel }: AirportFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AirportFormData>({
    resolver: zodResolver(airportSchema),
    defaultValues: {
      iata_code: airport?.iata_code || "",
      icao_code: airport?.icao_code || "",
      name: airport?.name || "",
      city: airport?.city || "",
      country: airport?.country || "",
      latitude: airport?.latitude || undefined,
      longitude: airport?.longitude || undefined,
      timezone: airport?.timezone || "",
    },
  })

  const onSubmit = async (data: AirportFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        iata_code: data.iata_code.toUpperCase(),
        name: data.name,
      }
      
      // Ajouter les champs optionnels seulement s'ils sont définis
      if (data.icao_code && data.icao_code.trim() !== "") {
        submitData.icao_code = data.icao_code.toUpperCase()
      }
      if (data.city && data.city.trim() !== "") {
        submitData.city = data.city
      }
      if (data.country && data.country.trim() !== "") {
        submitData.country = data.country
      }
      if (data.latitude !== undefined && !isNaN(data.latitude as number)) {
        submitData.latitude = data.latitude
      }
      if (data.longitude !== undefined && !isNaN(data.longitude as number)) {
        submitData.longitude = data.longitude
      }
      if (data.timezone && data.timezone.trim() !== "") {
        submitData.timezone = data.timezone
      }
      
      if (airport) {
        await airportsService.update(airport.id, submitData)
        toast({
          title: "Succès",
          description: "Aéroport mis à jour avec succès",
        })
      } else {
        await airportsService.create(submitData)
        toast({
          title: "Succès",
          description: "Aéroport créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting airport:", error)
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
      {/* Codes de l'aéroport */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Codes de l'aéroport</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iata_code">
              Code IATA <span className="text-destructive">*</span>
            </Label>
            <Input
              id="iata_code"
              placeholder="Ex: CDG, JFK, LHR"
              maxLength={3}
              className="font-mono uppercase"
              {...register("iata_code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                }
              })}
            />
            {errors.iata_code && (
              <p className="text-sm text-destructive">{errors.iata_code.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              3 lettres majuscules (ex: CDG pour Charles de Gaulle)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icao_code">Code ICAO</Label>
            <Input
              id="icao_code"
              placeholder="Ex: LFPG, KJFK, EGLL"
              maxLength={4}
              className="font-mono uppercase"
              {...register("icao_code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase()
                }
              })}
            />
            {errors.icao_code && (
              <p className="text-sm text-destructive">{errors.icao_code.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              4 caractères alphanumériques (optionnel)
            </p>
          </div>
        </div>
      </div>

      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations de base</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom de l'aéroport <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Aéroport Charles de Gaulle"
            maxLength={255}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nom complet de l'aéroport (max 255 caractères)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Ville</span>
            </Label>
            <Input
              id="city"
              placeholder="Ex: Paris"
              maxLength={100}
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Ville où se trouve l'aéroport (optionnel)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Pays</span>
            </Label>
            <Input
              id="country"
              placeholder="Ex: France"
              maxLength={100}
              {...register("country")}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Pays où se trouve l'aéroport (optionnel)
            </p>
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Localisation géographique</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Latitude</span>
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.00000001"
              min="-90"
              max="90"
              placeholder="Ex: 49.009722"
              {...register("latitude", { valueAsNumber: true })}
            />
            {errors.latitude && (
              <p className="text-sm text-destructive">{errors.latitude.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Coordonnée latitude (-90 à 90, optionnel)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Longitude</span>
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.00000001"
              min="-180"
              max="180"
              placeholder="Ex: 2.547778"
              {...register("longitude", { valueAsNumber: true })}
            />
            {errors.longitude && (
              <p className="text-sm text-destructive">{errors.longitude.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Coordonnée longitude (-180 à 180, optionnel)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Fuseau horaire</span>
          </Label>
          <Input
            id="timezone"
            placeholder="Ex: Europe/Paris, America/New_York"
            maxLength={50}
            {...register("timezone")}
          />
          {errors.timezone && (
            <p className="text-sm text-destructive">{errors.timezone.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Fuseau horaire IANA (ex: Europe/Paris, optionnel, max 50 caractères)
          </p>
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
              {airport ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            airport ? "Mettre à jour" : "Créer l'aéroport"
          )}
        </Button>
      </div>
    </form>
  )
}

