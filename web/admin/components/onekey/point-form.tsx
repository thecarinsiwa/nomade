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
import { onekeyPointsService } from "@/lib/services/onekey-points"
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { OneKeyPoint, OneKeyAccount } from "@/types"
import { useToast } from "@/hooks/use-toast"

const pointSchema = z.object({
  onekey_account: z.string().uuid("Sélectionnez un compte"),
  points: z.number().min(1, "Les points doivent être positifs"),
  status: z.enum(["active", "expired", "redeemed"]),
  earned_at: z.string().min(1, "La date d'acquisition est requise"),
  expires_at: z.string().optional(),
  redeemed_at: z.string().optional(),
  description: z.string().optional(),
})

type PointFormData = z.infer<typeof pointSchema>

interface PointFormProps {
  point: OneKeyPoint | null
  onSuccess: () => void
  onCancel: () => void
}

export function PointForm({ point, onSuccess, onCancel }: PointFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<OneKeyAccount[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PointFormData>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      onekey_account: point?.onekey_account || "",
      points: point?.points || 0,
      status: point?.status || "active",
      earned_at: point?.earned_at ? point.earned_at.split('T')[0] : "",
      expires_at: point?.expires_at ? point.expires_at.split('T')[0] : "",
      redeemed_at: point?.redeemed_at ? point.redeemed_at.split('T')[0] : "",
      description: point?.description || "",
    },
  })

  const account = watch("onekey_account")
  const status = watch("status")

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoadingAccounts(true)
        const data = await onekeyAccountsService.getAllAccounts(1)
        setAccounts(data.results || [])
      } catch (error) {
        console.error("Error fetching accounts:", error)
      } finally {
        setIsLoadingAccounts(false)
      }
    }
    fetchAccounts()
  }, [])

  const onSubmit = async (data: PointFormData) => {
    setIsLoading(true)
    try {
      const submitData: any = { ...data }
      // Convertir les dates en format ISO
      if (submitData.earned_at) {
        submitData.earned_at = new Date(submitData.earned_at).toISOString()
      }
      if (submitData.expires_at) {
        submitData.expires_at = new Date(submitData.expires_at).toISOString()
      }
      if (submitData.redeemed_at) {
        submitData.redeemed_at = new Date(submitData.redeemed_at).toISOString()
      }
      
      if (point) {
        await onekeyPointsService.updatePoint(point.id, submitData)
        toast({
          title: "Succès",
          description: "Point mis à jour avec succès",
        })
      } else {
        await onekeyPointsService.createPoint(submitData)
        toast({
          title: "Succès",
          description: "Point créé avec succès",
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
        <Label htmlFor="onekey_account">Compte OneKey *</Label>
        <Select value={account} onValueChange={(value) => setValue("onekey_account", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un compte" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingAccounts ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : (
              accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.onekey_number} - {acc.user_email || acc.user}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.onekey_account && (
          <p className="text-sm text-destructive">{errors.onekey_account.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="points">Points *</Label>
          <Input
            id="points"
            type="number"
            min="1"
            {...register("points", { valueAsNumber: true })}
          />
          {errors.points && (
            <p className="text-sm text-destructive">{errors.points.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut *</Label>
          <Select
            value={status}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
              <SelectItem value="redeemed">Utilisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="earned_at">Gagné le *</Label>
          <Input
            id="earned_at"
            type="date"
            {...register("earned_at")}
          />
          {errors.earned_at && (
            <p className="text-sm text-destructive">{errors.earned_at.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expires_at">Expire le</Label>
          <Input
            id="expires_at"
            type="date"
            {...register("expires_at")}
          />
        </div>
      </div>

      {status === "redeemed" && (
        <div className="space-y-2">
          <Label htmlFor="redeemed_at">Utilisé le</Label>
          <Input
            id="redeemed_at"
            type="date"
            {...register("redeemed_at")}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description des points..."
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
              {point ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            point ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

