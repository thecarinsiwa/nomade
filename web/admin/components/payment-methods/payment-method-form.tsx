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
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"

const paymentMethodSchema = z.object({
  user: z.string().uuid("Sélectionnez un utilisateur"),
  payment_type: z.enum(["credit_card", "debit_card", "paypal", "bank_transfer", "other"]),
  card_last_four: z.string().max(4).optional(),
  card_brand: z.string().optional(),
  expiry_date: z.string().optional(),
  is_default: z.boolean(),
  is_active: z.boolean(),
})

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>

interface PaymentMethodFormProps {
  paymentMethod: UserPaymentMethod | null
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentMethodForm({ paymentMethod, onSuccess, onCancel }: PaymentMethodFormProps) {
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
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      user: paymentMethod?.user || "",
      payment_type: paymentMethod?.payment_type || "credit_card",
      card_last_four: paymentMethod?.card_last_four || "",
      card_brand: paymentMethod?.card_brand || "",
      expiry_date: paymentMethod?.expiry_date || "",
      is_default: paymentMethod?.is_default || false,
      is_active: paymentMethod?.is_active ?? true,
    },
  })

  const paymentType = watch("payment_type")
  const isDefault = watch("is_default")
  const isActive = watch("is_active")

  useEffect(() => {
    if (!paymentMethod) {
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
  }, [paymentMethod])

  const onSubmit = async (data: PaymentMethodFormData) => {
    setIsLoading(true)
    try {
      if (paymentMethod) {
        await paymentMethodsService.updatePaymentMethod(paymentMethod.id, data)
        toast({
          title: "Succès",
          description: "Méthode de paiement mise à jour avec succès",
        })
      } else {
        await paymentMethodsService.createPaymentMethod(data)
        toast({
          title: "Succès",
          description: "Méthode de paiement créée avec succès",
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
      {!paymentMethod && (
        <div className="space-y-2">
          <Label htmlFor="user">Utilisateur *</Label>
          <Select value={watch("user")} onValueChange={(value) => setValue("user", value)}>
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

      <div className="space-y-2">
        <Label htmlFor="payment_type">Type de paiement *</Label>
        <Select
          value={paymentType}
          onValueChange={(value) => setValue("payment_type", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_card">Carte de crédit</SelectItem>
            <SelectItem value="debit_card">Carte de débit</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(paymentType === "credit_card" || paymentType === "debit_card") && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card_brand">Marque de carte</Label>
              <Input id="card_brand" placeholder="Visa, Mastercard..." {...register("card_brand")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card_last_four">4 derniers chiffres</Label>
              <Input
                id="card_last_four"
                placeholder="1234"
                maxLength={4}
                {...register("card_last_four")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Date d'expiration</Label>
            <Input
              id="expiry_date"
              type="date"
              {...register("expiry_date")}
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_default"
          checked={isDefault}
          onChange={(e) => setValue("is_default", e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_default" className="cursor-pointer">
          Méthode par défaut
        </Label>
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
          Active
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
              {paymentMethod ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            paymentMethod ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

