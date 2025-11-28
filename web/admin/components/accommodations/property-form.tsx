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
import { Textarea } from "@/components/ui/textarea"
import { propertiesService, propertyTypesService, propertyCategoriesService } from "@/lib/services/accommodations"
import { Property, PropertyType, PropertyCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"

const propertySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  property_type: z.string().uuid().optional(),
  property_category: z.string().uuid().optional(),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(["active", "inactive", "pending", "suspended"]),
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface PropertyFormProps {
  property: Property | null
  onSuccess: () => void
  onCancel: () => void
}

export function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [propertyCategories, setPropertyCategories] = useState<PropertyCategory[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property?.name || "",
      property_type: property?.property_type || "",
      property_category: property?.property_category || "",
      rating: property?.rating || undefined,
      status: property?.status || "active",
      check_in_time: property?.check_in_time || "",
      check_out_time: property?.check_out_time || "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, categoriesData] = await Promise.all([
          propertyTypesService.getAll(1),
          propertyCategoriesService.getAll(1),
        ])
        setPropertyTypes(typesData.results || [])
        setPropertyCategories(categoriesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: PropertyFormData) => {
    setIsLoading(true)
    try {
      if (property) {
        await propertiesService.update(property.id, data)
        toast({
          title: "Succès",
          description: "Propriété mise à jour avec succès",
        })
      } else {
        await propertiesService.create(data)
        toast({
          title: "Succès",
          description: "Propriété créée avec succès",
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
        <Input id="name" {...register("name")} placeholder="Nom de la propriété" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property_type">Type de propriété</Label>
          <Select
            value={watch("property_type") || undefined}
            onValueChange={(value) => setValue("property_type", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="property_category">Catégorie</Label>
          <Select
            value={watch("property_category") || undefined}
            onValueChange={(value) => setValue("property_category", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {propertyCategories.map((category) => (
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
          <Label htmlFor="rating">Note (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            {...register("rating", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check_in_time">Heure check-in</Label>
          <Input id="check_in_time" type="time" {...register("check_in_time")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check_out_time">Heure check-out</Label>
          <Input id="check_out_time" type="time" {...register("check_out_time")} />
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
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
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
              {property ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            property ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

