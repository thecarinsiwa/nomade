"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Building2, Hash, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { carRentalCompaniesService } from "@/lib/services/car-rentals"
import { CarRentalCompany } from "@/types"
import { useToast } from "@/hooks/use-toast"

const companySchema = z.object({
  name: z.string()
    .min(1, "Le nom est requis")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  code: z.string()
    .max(20, "Le code ne peut pas dépasser 20 caractères")
    .optional()
    .or(z.literal("")),
  logo_url: z.string()
    .url("L'URL du logo doit être valide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyFormProps {
  company: CarRentalCompany | null
  onSuccess: () => void
  onCancel: () => void
}

export function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || "",
      code: company?.code || "",
      logo_url: company?.logo_url || "",
    },
  })

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = {
        name: data.name.trim(),
      }
      
      // Ajouter le code seulement s'il est défini et non vide
      if (data.code && data.code.trim() !== "") {
        submitData.code = data.code.trim()
      }
      
      // Ajouter l'URL du logo seulement s'elle est définie et non vide
      if (data.logo_url && data.logo_url.trim() !== "") {
        submitData.logo_url = data.logo_url.trim()
      }
      
      if (company) {
        await carRentalCompaniesService.update(company.id, submitData)
        toast({
          title: "Succès",
          description: "Agence mise à jour avec succès",
        })
      } else {
        await carRentalCompaniesService.create(submitData)
        toast({
          title: "Succès",
          description: "Agence créée avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting company:", error)
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
        <h3 className="text-lg font-semibold">Informations de l'agence</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>
              Nom de l'agence <span className="text-destructive">*</span>
            </span>
          </Label>
          <Input
            id="name"
            placeholder="Ex: Hertz, Avis, Europcar"
            maxLength={255}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Nom complet de l'agence de location (max 255 caractères)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="code" className="flex items-center space-x-2">
            <Hash className="h-4 w-4" />
            <span>Code</span>
          </Label>
          <Input
            id="code"
            placeholder="Ex: HRT, AVS, EUR"
            maxLength={20}
            className="font-mono"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Code unique de l'agence (optionnel, max 20 caractères, ex: HRT, AVS)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>URL du logo</span>
          </Label>
          <Input
            id="logo_url"
            type="url"
            placeholder="https://example.com/logo.png"
            maxLength={500}
            {...register("logo_url")}
          />
          {errors.logo_url && (
            <p className="text-sm text-destructive">{errors.logo_url.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            URL complète du logo de l'agence (optionnel, max 500 caractères)
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
              {company ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            company ? "Mettre à jour" : "Créer l'agence"
          )}
        </Button>
      </div>
    </form>
  )
}

