"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { airlinesService } from "@/lib/services/flights"
import { Airline } from "@/types"
import { useToast } from "@/hooks/use-toast"

const airlineSchema = z.object({
  code: z.string().min(2, "Le code doit contenir au moins 2 caractères").max(10, "Le code ne peut pas dépasser 10 caractères"),
  name: z.string().min(1, "Le nom est requis"),
  logo_url: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: "URL invalide",
  }).optional().or(z.literal("")),
  country: z.string().optional(),
})

type AirlineFormData = z.infer<typeof airlineSchema>

interface AirlineFormProps {
  airline: Airline | null
  onSuccess: () => void
  onCancel: () => void
}

export function AirlineForm({ airline, onSuccess, onCancel }: AirlineFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AirlineFormData>({
    resolver: zodResolver(airlineSchema),
    defaultValues: {
      code: airline?.code || "",
      name: airline?.name || "",
      logo_url: airline?.logo_url || "",
      country: airline?.country || "",
    },
  })

  const onSubmit = async (data: AirlineFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        logo_url: data.logo_url || undefined,
        country: data.country || undefined,
      }
      
      if (airline) {
        await airlinesService.update(airline.id, submitData)
        toast({
          title: "Succès",
          description: "Compagnie aérienne mise à jour avec succès",
        })
      } else {
        await airlinesService.create(submitData)
        toast({
          title: "Succès",
          description: "Compagnie aérienne créée avec succès",
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            placeholder="Ex: AF, LH, BA"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            placeholder="Ex: Air France"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
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
        <Label htmlFor="country">Pays</Label>
        <Input
          id="country"
          placeholder="Ex: France"
          {...register("country")}
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
              {airline ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            airline ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

