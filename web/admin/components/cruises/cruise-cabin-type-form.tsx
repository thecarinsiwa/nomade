"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cruiseCabinTypesService } from "@/lib/services/cruises"
import { CruiseCabinType } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruiseCabinTypeSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
})

type CruiseCabinTypeFormData = z.infer<typeof cruiseCabinTypeSchema>

interface CruiseCabinTypeFormProps {
  cruiseCabinType: CruiseCabinType | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseCabinTypeForm({ cruiseCabinType, onSuccess, onCancel }: CruiseCabinTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CruiseCabinTypeFormData>({
    resolver: zodResolver(cruiseCabinTypeSchema),
    defaultValues: {
      name: cruiseCabinType?.name || "",
      description: cruiseCabinType?.description || "",
    },
  })

  const onSubmit = async (data: CruiseCabinTypeFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        description: data.description || undefined,
      }
      
      if (cruiseCabinType) {
        await cruiseCabinTypesService.update(cruiseCabinType.id, submitData)
        toast({
          title: "Succès",
          description: "Type de cabine mis à jour avec succès",
        })
      } else {
        await cruiseCabinTypesService.create(submitData)
        toast({
          title: "Succès",
          description: "Type de cabine créé avec succès",
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
        <Input
          id="name"
          placeholder="Ex: Intérieure, Extérieure, Suite"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du type de cabine..."
          rows={4}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {cruiseCabinType ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruiseCabinType ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

