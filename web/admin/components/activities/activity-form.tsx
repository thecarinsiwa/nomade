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
import { activitiesService, activityCategoriesService } from "@/lib/services/activities"
import { Activity, ActivityCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"

const activitySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  category: z.string().uuid().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  duration_minutes: z.number().min(1).optional(),
  rating: z.number().min(0).max(5).optional(),
})

type ActivityFormData = z.infer<typeof activitySchema>

interface ActivityFormProps {
  activity: Activity | null
  onSuccess: () => void
  onCancel: () => void
}

export function ActivityForm({ activity, onSuccess, onCancel }: ActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<ActivityCategory[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: activity?.name || "",
      category: activity?.category || "",
      description: activity?.description || "",
      location: activity?.location || "",
      duration_minutes: activity?.duration_minutes || undefined,
      rating: activity?.rating || undefined,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await activityCategoriesService.getAll(1)
        setCategories(categoriesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: ActivityFormData) => {
    setIsLoading(true)
    try {
      if (activity) {
        await activitiesService.update(activity.id, data)
        toast({
          title: "Succès",
          description: "Activité mise à jour avec succès",
        })
      } else {
        await activitiesService.create(data)
        toast({
          title: "Succès",
          description: "Activité créée avec succès",
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
        <Input id="name" {...register("name")} placeholder="Nom de l'activité" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input id="location" {...register("location")} placeholder="Ex: Paris, France" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description de l'activité..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration_minutes">Durée (minutes)</Label>
          <Input
            id="duration_minutes"
            type="number"
            min="1"
            {...register("duration_minutes", { valueAsNumber: true })}
            placeholder="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Note (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            {...register("rating", { valueAsNumber: true })}
            placeholder="4.5"
          />
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
              {activity ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            activity ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

