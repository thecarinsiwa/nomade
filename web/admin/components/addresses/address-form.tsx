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
import { addressesService } from "@/lib/services/addresses"
import { UserAddress } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"

const addressSchema = z.object({
  user: z.string().uuid("Sélectionnez un utilisateur"),
  address_type: z.enum(["billing", "shipping", "home", "work", "other"]),
  street: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  is_default: z.boolean(),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormProps {
  address: UserAddress | null
  onSuccess: () => void
  onCancel: () => void
}

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
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
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      user: address?.user || "",
      address_type: address?.address_type || "home",
      street: address?.street || "",
      city: address?.city || "",
      postal_code: address?.postal_code || "",
      country: address?.country || "",
      is_default: address?.is_default || false,
    },
  })

  const addressType = watch("address_type")
  const isDefault = watch("is_default")

  useEffect(() => {
    if (!address) {
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
  }, [address])

  const onSubmit = async (data: AddressFormData) => {
    setIsLoading(true)
    try {
      if (address) {
        await addressesService.updateAddress(address.id, data)
        toast({
          title: "Succès",
          description: "Adresse mise à jour avec succès",
        })
      } else {
        await addressesService.createAddress(data)
        toast({
          title: "Succès",
          description: "Adresse créée avec succès",
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
      {!address && (
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
        <Label htmlFor="address_type">Type d'adresse *</Label>
        <Select
          value={addressType}
          onValueChange={(value) => setValue("address_type", value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="billing">Facturation</SelectItem>
            <SelectItem value="shipping">Livraison</SelectItem>
            <SelectItem value="home">Domicile</SelectItem>
            <SelectItem value="work">Travail</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street">Rue</Label>
        <Input id="street" {...register("street")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" {...register("city")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input id="postal_code" {...register("postal_code")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Pays</Label>
        <Input id="country" {...register("country")} />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_default"
          checked={isDefault}
          onChange={(e) => setValue("is_default", e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_default" className="cursor-pointer">
          Adresse par défaut
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
              {address ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            address ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

