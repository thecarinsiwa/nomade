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
import { carsService, carRentalCompaniesService, carCategoriesService } from "@/lib/services/car-rentals"
import { Car, CarRentalCompany, CarCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"

const carSchema = z.object({
  company: z.string().uuid("L'agence de location est requise"),
  category: z.string().uuid().optional().or(z.literal("")),
  make: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.number().min(1900).max(2100).optional().nullable(),
  transmission: z.enum(["manual", "automatic"]),
  fuel_type: z.enum(["petrol", "diesel", "electric", "hybrid"]),
  seats: z.number().min(1, "Le nombre de places est requise"),
  luggage_capacity: z.number().min(0).optional().nullable(),
})

type CarFormData = z.infer<typeof carSchema>

interface CarFormProps {
  car: Car | null
  onSuccess: () => void
  onCancel: () => void
}

export function CarForm({ car, onSuccess, onCancel }: CarFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<CarRentalCompany[]>([])
  const [categories, setCategories] = useState<CarCategory[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      company: typeof car?.company === 'string' ? car.company : (typeof car?.company === 'object' && car?.company?.id ? car.company.id : ""),
      category: typeof car?.category === 'string' ? car.category : (typeof car?.category === 'object' && car?.category?.id ? car.category.id : ""),
      make: car?.make || "",
      model: car?.model || "",
      year: car?.year || undefined,
      transmission: car?.transmission || "automatic",
      fuel_type: car?.fuel_type || "petrol",
      seats: car?.seats || 5,
      luggage_capacity: car?.luggage_capacity || undefined,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, categoriesData] = await Promise.all([
          carRentalCompaniesService.getAll(1),
          carCategoriesService.getAll(1),
        ])
        setCompanies(companiesData.results || [])
        setCategories(categoriesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: CarFormData) => {
    setIsLoading(true)
    try {
      // Nettoyer les données avant l'envoi
      const submitData: any = {
        company: data.company.trim(),
        make: data.make.trim(),
        model: data.model.trim(),
        transmission: data.transmission,
        fuel_type: data.fuel_type,
        seats: data.seats,
      }
      
      // Ajouter category seulement si elle est définie et non vide
      if (data.category && data.category.trim() !== "") {
        submitData.category = data.category.trim()
      }
      
      // Ajouter year seulement s'il est défini
      if (data.year !== undefined && data.year !== null) {
        submitData.year = data.year
      }
      
      // Ajouter luggage_capacity seulement s'il est défini
      if (data.luggage_capacity !== undefined && data.luggage_capacity !== null) {
        submitData.luggage_capacity = data.luggage_capacity
      }
      
      if (car) {
        await carsService.update(car.id, submitData)
        toast({
          title: "Succès",
          description: "Véhicule mis à jour avec succès",
        })
      } else {
        await carsService.create(submitData)
        toast({
          title: "Succès",
          description: "Véhicule créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting car:", error)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Agence de location *</Label>
          <Select
            value={watch("company") || undefined}
            onValueChange={(value) => setValue("company", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une agence" />
            </SelectTrigger>
            <SelectContent>
              {companies.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={watch("category") || undefined}
            onValueChange={(value) => setValue("category", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Marque *</Label>
          <Input id="make" {...register("make")} placeholder="Ex: Toyota" />
          {errors.make && (
            <p className="text-sm text-destructive">{errors.make.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modèle *</Label>
          <Input id="model" {...register("model")} placeholder="Ex: Corolla" />
          {errors.model && (
            <p className="text-sm text-destructive">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            type="number"
            min="1900"
            max="2100"
            {...register("year", { valueAsNumber: true })}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission *</Label>
          <Select
            value={watch("transmission")}
            onValueChange={(value) => setValue("transmission", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatique</SelectItem>
              <SelectItem value="manual">Manuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Type de carburant *</Label>
          <Select
            value={watch("fuel_type")}
            onValueChange={(value) => setValue("fuel_type", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Essence</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Électrique</SelectItem>
              <SelectItem value="hybrid">Hybride</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Nombre de places *</Label>
          <Input
            id="seats"
            type="number"
            min="1"
            {...register("seats", { valueAsNumber: true })}
            placeholder="5"
          />
          {errors.seats && (
            <p className="text-sm text-destructive">{errors.seats.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="luggage_capacity">Capacité bagages (valises)</Label>
        <Input
          id="luggage_capacity"
          type="number"
          min="0"
          {...register("luggage_capacity", { valueAsNumber: true })}
          placeholder="2"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {car ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            car ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

