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
import { useToast } from "@/hooks/use-toast"

const simpleSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
})

type SimpleFormData = z.infer<typeof simpleSchema>

interface SimpleFormProps {
  item: { id: string; name: string; description?: string } | null
  onSuccess: () => void
  onCancel: () => void
  onSubmit: (data: SimpleFormData) => Promise<void>
  title?: string
}

export function SimpleForm({ item, onSuccess, onCancel, onSubmit, title }: SimpleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
    },
  })

  const handleFormSubmit = async (data: SimpleFormData) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      toast({
        title: "Succès",
        description: item ? "Élément mis à jour avec succès" : "Élément créé avec succès",
      })
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} placeholder="Nom" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description..."
          rows={4}
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
              {item ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            item ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

