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
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { usersService } from "@/lib/services/users"
import { OneKeyAccount, User } from "@/types"
import { useToast } from "@/hooks/use-toast"

const accountSchema = z.object({
  user: z.string().uuid("Sélectionnez un utilisateur"),
  onekey_number: z.string().optional(),
  tier: z.enum(["silver", "gold", "platinum", "diamond"]),
  total_points: z.number().min(0, "Les points doivent être positifs"),
})

type AccountFormData = z.infer<typeof accountSchema>

interface AccountFormProps {
  account: OneKeyAccount | null
  onSuccess: () => void
  onCancel: () => void
}

export function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      user: account?.user || "",
      onekey_number: account?.onekey_number || "",
      tier: account?.tier || "silver",
      total_points: account?.total_points || 0,
    },
  })

  const user = watch("user")
  const tier = watch("tier")

  useEffect(() => {
    if (!account) {
      const fetchUsers = async () => {
        try {
          setIsLoadingUsers(true)
          const data = await usersService.getAllUsers(1)
          setUsers(data.results || [])
        } catch (error) {
          console.error("Error fetching users:", error)
        } finally {
          setIsLoadingUsers(false)
        }
      }
      fetchUsers()
    }
  }, [account])

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true)
    try {
      if (account) {
        await onekeyAccountsService.updateAccount(account.id, data)
        toast({
          title: "Succès",
          description: "Compte mis à jour avec succès",
        })
      } else {
        await onekeyAccountsService.createAccount(data)
        toast({
          title: "Succès",
          description: "Compte créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || error.response?.data?.user?.[0] || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!account && (
        <div className="space-y-2">
          <Label htmlFor="user">Utilisateur *</Label>
          <Select value={user} onValueChange={(value) => setValue("user", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingUsers ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : (
                users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.user && (
            <p className="text-sm text-destructive">{errors.user.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="onekey_number">Numéro OneKey</Label>
          <Input
            id="onekey_number"
            placeholder="Généré automatiquement si vide"
            {...register("onekey_number")}
            disabled={!!account}
          />
          {errors.onekey_number && (
            <p className="text-sm text-destructive">{errors.onekey_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tier">Niveau *</Label>
          <Select
            value={tier}
            onValueChange={(value) => setValue("tier", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="silver">Argent</SelectItem>
              <SelectItem value="gold">Or</SelectItem>
              <SelectItem value="platinum">Platine</SelectItem>
              <SelectItem value="diamond">Diamant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_points">Points totaux *</Label>
        <Input
          id="total_points"
          type="number"
          min="0"
          {...register("total_points", { valueAsNumber: true })}
        />
        {errors.total_points && (
          <p className="text-sm text-destructive">{errors.total_points.message}</p>
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
              {account ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            account ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

