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
import { cruiseLinesService } from "@/lib/services/cruises"
import { CruiseLine } from "@/types"
import { useToast } from "@/hooks/use-toast"

const cruiseLineSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  logo_url: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "URL invalide",
  }).optional().or(z.literal("")),
  description: z.string().optional(),
})

type CruiseLineFormData = z.infer<typeof cruiseLineSchema>

interface CruiseLineFormProps {
  cruiseLine: CruiseLine | null
  onSuccess: () => void
  onCancel: () => void
}

export function CruiseLineForm({ cruiseLine, onSuccess, onCancel }: CruiseLineFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CruiseLineFormData>({
    resolver: zodResolver(cruiseLineSchema),
    defaultValues: {
      name: cruiseLine?.name || "",
      logo_url: cruiseLine?.logo_url || "",
      description: cruiseLine?.description || "",
    },
  })

  const onSubmit = async (data: CruiseLineFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        logo_url: data.logo_url || undefined,
        description: data.description || undefined,
      }
      
      if (cruiseLine) {
        await cruiseLinesService.update(cruiseLine.id, submitData)
        toast({
          title: "Succès",
          description: "Compagnie de croisière mise à jour avec succès",
        })
      } else {
        await cruiseLinesService.create(submitData)
        toast({
          title: "Succès",
          description: "Compagnie de croisière créée avec succès",
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
          placeholder="Ex: MSC Croisières"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">URL du logo</Label>
        <Input
          id="logo_url"
          type="url"
          placeholder="https://example.com/logo.png"
          {...register("logo_url")}
        />
        {errors.logo_url && (
          <p className="text-sm text-destructive">{errors.logo_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de la compagnie..."
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
              {cruiseLine ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            cruiseLine ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

