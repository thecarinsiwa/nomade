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
import { onekeyRewardsService } from "@/lib/services/onekey-rewards"
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { OneKeyReward, OneKeyAccount } from "@/types"
import { useToast } from "@/hooks/use-toast"

const rewardSchema = z.object({
  onekey_account: z.string().uuid("Sélectionnez un compte"),
  points: z.number().min(1, "Les points doivent être positifs"),
  reward_type: z.enum(["earned", "redeemed", "expired", "bonus"]),
  description: z.string().optional(),
  expires_at: z.string().optional(),
})

type RewardFormData = z.infer<typeof rewardSchema>

interface RewardFormProps {
  reward: OneKeyReward | null
  onSuccess: () => void
  onCancel: () => void
}

export function RewardForm({ reward, onSuccess, onCancel }: RewardFormProps) {
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
  } = useForm<RewardFormData>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      onekey_account: reward?.onekey_account || "",
      points: reward?.points || 0,
      reward_type: reward?.reward_type || "earned",
      description: reward?.description || "",
      expires_at: reward?.expires_at || "",
    },
  })

  const account = watch("onekey_account")
  const rewardType = watch("reward_type")

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

  const onSubmit = async (data: RewardFormData) => {
    setIsLoading(true)
    try {
      if (reward) {
        await onekeyRewardsService.updateReward(reward.id, data)
        toast({
          title: "Succès",
          description: "Récompense mise à jour avec succès",
        })
      } else {
        await onekeyRewardsService.createReward(data)
        toast({
          title: "Succès",
          description: "Récompense créée avec succès",
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
          <Label htmlFor="reward_type">Type *</Label>
          <Select
            value={rewardType}
            onValueChange={(value) => setValue("reward_type", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earned">Gagné</SelectItem>
              <SelectItem value="redeemed">Utilisé</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description de la récompense..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expires_at">Date d'expiration</Label>
        <Input
          id="expires_at"
          type="date"
          {...register("expires_at")}
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
              {reward ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            reward ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

