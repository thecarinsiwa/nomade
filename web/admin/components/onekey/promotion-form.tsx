"use client"

import { useState } from "react"
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
import { onekeyPromotionsService } from "@/lib/services/onekey-promotions"
import { OneKeyPromotion } from "@/types"
import { useToast } from "@/hooks/use-toast"

const promotionSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  promotion_type: z.enum(["bonus_points", "tier_upgrade", "discount", "special_offer"]),
  points_multiplier: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  min_purchase: z.number().optional(),
  valid_from: z.string().min(1, "La date de début est requise"),
  valid_until: z.string().min(1, "La date de fin est requise"),
  is_active: z.boolean(),
  target_tier: z.enum(["silver", "gold", "platinum", "diamond", "all"]).optional(),
})

type PromotionFormData = z.infer<typeof promotionSchema>

interface PromotionFormProps {
  promotion: OneKeyPromotion | null
  onSuccess: () => void
  onCancel: () => void
}

export function PromotionForm({ promotion, onSuccess, onCancel }: PromotionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: promotion?.title || "",
      description: promotion?.description || "",
      promotion_type: promotion?.promotion_type || "bonus_points",
      points_multiplier: promotion?.points_multiplier || undefined,
      discount_percentage: promotion?.discount_percentage || undefined,
      discount_amount: promotion?.discount_amount || undefined,
      min_purchase: promotion?.min_purchase || undefined,
      valid_from: promotion?.valid_from ? promotion.valid_from.split('T')[0] : "",
      valid_until: promotion?.valid_until ? promotion.valid_until.split('T')[0] : "",
      is_active: promotion?.is_active ?? true,
      target_tier: promotion?.target_tier || "all",
    },
  })

  const promotionType = watch("promotion_type")
  const isActive = watch("is_active")

  const onSubmit = async (data: PromotionFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = { ...data }
      // Convertir les dates en format ISO
      if (submitData.valid_from) {
        submitData.valid_from = new Date(submitData.valid_from).toISOString()
      }
      if (submitData.valid_until) {
        submitData.valid_until = new Date(submitData.valid_until).toISOString()
      }
      
      if (promotion) {
        await onekeyPromotionsService.updatePromotion(promotion.id, submitData)
        toast({
          title: "Succès",
          description: "Promotion mise à jour avec succès",
        })
      } else {
        await onekeyPromotionsService.createPromotion(submitData)
        toast({
          title: "Succès",
          description: "Promotion créée avec succès",
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
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Titre de la promotion"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description de la promotion..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="promotion_type">Type *</Label>
          <Select
            value={promotionType}
            onValueChange={(value) => setValue("promotion_type", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bonus_points">Points bonus</SelectItem>
              <SelectItem value="tier_upgrade">Montée de niveau</SelectItem>
              <SelectItem value="discount">Réduction</SelectItem>
              <SelectItem value="special_offer">Offre spéciale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_tier">Niveau cible</Label>
          <Select
            value={watch("target_tier") || "all"}
            onValueChange={(value) => setValue("target_tier", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="silver">Argent</SelectItem>
              <SelectItem value="gold">Or</SelectItem>
              <SelectItem value="platinum">Platine</SelectItem>
              <SelectItem value="diamond">Diamant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {promotionType === "bonus_points" && (
        <div className="space-y-2">
          <Label htmlFor="points_multiplier">Multiplicateur de points</Label>
          <Input
            id="points_multiplier"
            type="number"
            step="0.1"
            min="1"
            {...register("points_multiplier", { valueAsNumber: true })}
            placeholder="Ex: 1.5 pour 50% de bonus"
          />
        </div>
      )}

      {promotionType === "discount" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discount_percentage">Pourcentage de réduction</Label>
            <Input
              id="discount_percentage"
              type="number"
              min="0"
              max="100"
              {...register("discount_percentage", { valueAsNumber: true })}
              placeholder="Ex: 10 pour 10%"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount_amount">Montant de réduction</Label>
            <Input
              id="discount_amount"
              type="number"
              min="0"
              {...register("discount_amount", { valueAsNumber: true })}
              placeholder="Montant fixe"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="min_purchase">Achat minimum</Label>
        <Input
          id="min_purchase"
          type="number"
          min="0"
          {...register("min_purchase", { valueAsNumber: true })}
          placeholder="Montant minimum d'achat"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valid_from">Date de début *</Label>
          <Input
            id="valid_from"
            type="date"
            {...register("valid_from")}
          />
          {errors.valid_from && (
            <p className="text-sm text-destructive">{errors.valid_from.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valid_until">Date de fin *</Label>
          <Input
            id="valid_until"
            type="date"
            {...register("valid_until")}
          />
          {errors.valid_until && (
            <p className="text-sm text-destructive">{errors.valid_until.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setValue("is_active", e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_active" className="cursor-pointer">
          Promotion active
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {promotion ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            promotion ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

