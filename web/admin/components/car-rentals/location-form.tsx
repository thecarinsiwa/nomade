"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, MapPin, Building2, Hash, Map, Globe, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  carRentalLocationsService,
  carRentalCompaniesService,
} from "@/lib/services/car-rentals"
import { CarRentalLocation, CarRentalCompany } from "@/types"
import { useToast } from "@/hooks/use-toast"

const locationSchema = z.object({
  company: z.string().uuid("L'agence est requise"),
  name: z.string()
    .min(1, "Le nom est requis")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  address: z.string()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  city: z.string()
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  country: z.string()
    .max(100, "Le pays ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  location_type: z.enum(["airport", "city", "station", "other"], {
    required_error: "Le type de location est requis",
  }),
  latitude: z.number()
    .min(-90, "La latitude doit être entre -90 et 90")
    .max(90, "La latitude doit être entre -90 et 90")
    .optional()
    .nullable(),
  longitude: z.number()
    .min(-180, "La longitude doit être entre -180 et 180")
    .max(180, "La longitude doit être entre -180 et 180")
    .optional()
    .nullable(),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationFormProps {
  location: CarRentalLocation | null
  onSuccess: () => void
  onCancel: () => void
}

export function LocationForm({ location, onSuccess, onCancel }: LocationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<CarRentalCompany[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      company: location?.company || "",
      name: location?.name || "",
      address: location?.address || "",
      city: location?.city || "",
      country: location?.country || "",
      location_type: location?.location_type || "city",
      latitude: location?.latitude ? Number(location.latitude) : undefined,
      longitude: location?.longitude ? Number(location.longitude) : undefined,
    },
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await carRentalCompaniesService.getAll(1)
        setCompanies(data.results || [])
      } catch (error) {
        console.error("Error fetching companies:", error)
      }
    }
    fetchCompanies()
  }, [])

  const onSubmit = async (data: LocationFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        company: data.company,
        name: data.name.trim(),
        location_type: data.location_type,
      }
      
      if (data.address && data.address.trim() !== "") {
        submitData.address = data.address.trim()
      }
      if (data.city && data.city.trim() !== "") {
        submitData.city = data.city.trim()
      }
      if (data.country && data.country.trim() !== "") {
        submitData.country = data.country.trim()
      }
      if (data.latitude !== undefined && data.latitude !== null && !isNaN(data.latitude)) {
        submitData.latitude = data.latitude
      }
      if (data.longitude !== undefined && data.longitude !== null && !isNaN(data.longitude)) {
        submitData.longitude = data.longitude
      }
      
      if (location) {
        await carRentalLocationsService.update(location.id, submitData)
        toast({
          title: "Succès",
          description: "Point de location mis à jour avec succès",
        })
      } else {
        await carRentalLocationsService.create(submitData)
        toast({
          title: "Succès",
          description: "Point de location créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting location:", error)
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

  const locationTypeLabels: Record<string, string> = {
    airport: "Aéroport",
    city: "Ville",
    station: "Gare",
    other: "Autre",
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations de base</h3>
        
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>
              Agence de location <span className="text-destructive">*</span>
            </span>
          </Label>
          <Select
            value={watch("company") || undefined}
            onValueChange={(value) => setValue("company", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une agence" />
            </SelectTrigger>
            <SelectContent>
              {companies.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  Aucune agence disponible
                </div>
              ) : (
                companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Agence de location propriétaire de ce point
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>
              Nom du point <span className="text-destructive">*</span>
            </span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Aéroport Charles de Gaulle, Gare du Nord"
            maxLength={255}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nom du point de location (max 255 caractères)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location_type" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>
              Type de location <span className="text-destructive">*</span>
            </span>
          </Label>
          <Select
            value={watch("location_type")}
            onValueChange={(value) => setValue("location_type", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(locationTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location_type && (
            <p className="text-sm text-destructive">{errors.location_type.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Type de point de location
          </p>
        </div>
      </div>

      {/* Adresse */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Adresse</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <Textarea
            id="address"
            placeholder="Ex: 1 Rue de la Gare, 75001 Paris"
            rows={3}
            maxLength={500}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Adresse complète du point de location (optionnel, max 500 caractères)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Ex: Paris, Lyon"
              maxLength={100}
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Pays</span>
            </Label>
            <Input
              id="country"
              placeholder="Ex: France, Espagne"
              maxLength={100}
              {...register("country")}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Coordonnées GPS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Coordonnées GPS</h3>
        <p className="text-xs text-muted-foreground">
          Coordonnées géographiques du point de location (optionnel)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude" className="flex items-center space-x-2">
              <Navigation className="h-4 w-4" />
              <span>Latitude</span>
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="Ex: 48.8566"
              {...register("latitude", { valueAsNumber: true })}
            />
            {errors.latitude && (
              <p className="text-sm text-destructive">{errors.latitude.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Entre -90 et 90
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
              step="any"
              placeholder="Ex: 2.3522"
              {...register("longitude", { valueAsNumber: true })}
            />
            {errors.longitude && (
              <p className="text-sm text-destructive">{errors.longitude.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Entre -180 et 180
            </p>
          </div>
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
              {location ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            location ? "Mettre à jour" : "Créer le point"
          )}
        </Button>
      </div>
    </form>
  )
}

