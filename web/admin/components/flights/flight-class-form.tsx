"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plane, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { flightClassesService } from "@/lib/services/flights"
import { FlightClass } from "@/types"
import { useToast } from "@/hooks/use-toast"

const flightClassSchema = z.object({
  name: z.string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  description: z.string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional()
    .or(z.literal("")),
})

type FlightClassFormData = z.infer<typeof flightClassSchema>

interface FlightClassFormProps {
  flightClass: FlightClass | null
  onSuccess: () => void
  onCancel: () => void
}

export function FlightClassForm({ flightClass, onSuccess, onCancel }: FlightClassFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlightClassFormData>({
    resolver: zodResolver(flightClassSchema),
    defaultValues: {
      name: flightClass?.name || "",
      description: flightClass?.description || "",
    },
  })

  const onSubmit = async (data: FlightClassFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        name: data.name.trim(),
      }
      
      // Ajouter la description seulement si elle est définie
      if (data.description && data.description.trim() !== "") {
        submitData.description = data.description.trim()
      }
      
      if (flightClass) {
        await flightClassesService.update(flightClass.id, submitData)
        toast({
          title: "Succès",
          description: "Classe de vol mise à jour avec succès",
        })
      } else {
        await flightClassesService.create(submitData)
        toast({
          title: "Succès",
          description: "Classe de vol créée avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting flight class:", error)
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
        <h3 className="text-lg font-semibold">Informations de la classe</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center space-x-2">
            <Plane className="h-4 w-4" />
            <span>
              Nom de la classe <span className="text-destructive">*</span>
            </span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Économique, Business, Première classe"
            maxLength={50}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nom de la classe de vol (max 50 caractères, ex: Économique, Business, Première classe)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Description</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Décrivez les caractéristiques de cette classe de vol..."
            rows={6}
            maxLength={1000}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Description détaillée de la classe (optionnel, max 1000 caractères)
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
              {flightClass ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            flightClass ? "Mettre à jour" : "Créer la classe"
          )}
        </Button>
      </div>
    </form>
  )
}

