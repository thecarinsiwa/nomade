"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, X } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/lib/services/users"
import { profilesService } from "@/lib/services/profiles"
import { addressesService } from "@/lib/services/addresses"
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { User, UserProfile, UserAddress, UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"

const userSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended", "deleted"]),
})

type UserFormData = z.infer<typeof userSchema>

interface EnhancedUserFormProps {
  user: User | null
  onSuccess: () => void
  onCancel: () => void
}

export function EnhancedUserForm({ user, onSuccess, onCancel }: EnhancedUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("user")
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    user?.profile
      ? {
          preferred_language: user.profile.preferred_language,
          preferred_currency: user.profile.preferred_currency,
          timezone: user.profile.timezone || "",
        }
      : {
          preferred_language: "fr",
          preferred_currency: "EUR",
          timezone: "",
        }
  )
  const [addresses, setAddresses] = useState<Partial<UserAddress>[]>(
    user?.addresses ? [...user.addresses] : []
  )
  const [paymentMethods, setPaymentMethods] = useState<Partial<UserPaymentMethod>[]>(
    user?.payment_methods ? [...user.payment_methods] : []
  )
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
      date_of_birth: user?.date_of_birth || "",
      status: user?.status || "active",
    },
  })

  const status = watch("status")

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        address_type: "home",
        street: "",
        city: "",
        postal_code: "",
        country: "",
        is_default: false,
      },
    ])
  }

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index))
  }

  const updateAddress = (index: number, field: keyof UserAddress, value: any) => {
    const updated = [...addresses]
    updated[index] = { ...updated[index], [field]: value }
    setAddresses(updated)
  }

  const addPaymentMethod = () => {
    setPaymentMethods([
      ...paymentMethods,
      {
        payment_type: "credit_card",
        card_last_four: "",
        card_brand: "",
        expiry_date: "",
        is_default: false,
        is_active: true,
      },
    ])
  }

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index))
  }

  const updatePaymentMethod = (index: number, field: keyof UserPaymentMethod, value: any) => {
    const updated = [...paymentMethods]
    updated[index] = { ...updated[index], [field]: value }
    setPaymentMethods(updated)
  }

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      let createdUserId = user?.id

      if (user) {
        // Update user
        const updateData: any = { ...data }
        if (!updateData.password) {
          delete updateData.password
        }
        await usersService.updateUser(user.id, updateData)
        createdUserId = user.id
      } else {
        // Create user
        if (!data.password) {
          toast({
            title: "Erreur",
            description: "Le mot de passe est requis pour créer un utilisateur",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        const newUser = await usersService.createUser(data)
        createdUserId = newUser.id
      }

      // Gérer le profil
      if (createdUserId) {
        try {
          const existingProfile = user?.profile
          if (existingProfile) {
            await profilesService.updateProfile(existingProfile.id, {
              ...profile,
              user: createdUserId,
            })
          } else {
            await profilesService.createProfile({
              ...profile,
              user: createdUserId,
            })
          }
        } catch (error) {
          console.error("Error managing profile:", error)
        }

        // Gérer les adresses
        if (addresses.length > 0) {
          for (const address of addresses) {
            try {
              if (address.id) {
                await addressesService.updateAddress(address.id, {
                  ...address,
                  user: createdUserId,
                } as any)
              } else if (address.street || address.city || address.country) {
                await addressesService.createAddress({
                  ...address,
                  user: createdUserId,
                } as any)
              }
            } catch (error) {
              console.error("Error managing address:", error)
            }
          }
        }

        // Gérer les méthodes de paiement
        if (paymentMethods.length > 0) {
          for (const method of paymentMethods) {
            try {
              if (method.id) {
                await paymentMethodsService.updatePaymentMethod(method.id, {
                  ...method,
                  user: createdUserId,
                } as any)
              } else if (method.payment_type) {
                await paymentMethodsService.createPaymentMethod({
                  ...method,
                  user: createdUserId,
                } as any)
              }
            } catch (error) {
              console.error("Error managing payment method:", error)
            }
          }
        }
      }

      toast({
        title: "Succès",
        description: user ? "Utilisateur mis à jour avec succès" : "Utilisateur créé avec succès",
      })
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.email?.[0] || error.response?.data?.password?.[0] || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user">Utilisateur</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="addresses">Adresses</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        {/* Onglet Utilisateur */}
        <TabsContent value="user" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={!!user}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe {user ? "(laisser vide pour ne pas changer)" : "*"}
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" {...register("first_name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" {...register("last_name")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register("phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register("date_of_birth")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut *</Label>
            <Select value={status} onValueChange={(value) => setValue("status", value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="deleted">Supprimé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Langue préférée</Label>
              <Select
                value={profile.preferred_language}
                onValueChange={(value) => setProfile({ ...profile, preferred_language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Devise préférée</Label>
              <Select
                value={profile.preferred_currency}
                onValueChange={(value) => setProfile({ ...profile, preferred_currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fuseau horaire</Label>
            <Input
              value={profile.timezone || ""}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              placeholder="Europe/Paris"
            />
          </div>
        </TabsContent>

        {/* Onglet Adresses */}
        <TabsContent value="addresses" className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Adresses</Label>
            <Button type="button" variant="outline" size="sm" onClick={addAddress}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une adresse
            </Button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune adresse ajoutée
            </p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Adresse {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAddress(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type d'adresse</Label>
                      <Select
                        value={address.address_type || "home"}
                        onValueChange={(value) => updateAddress(index, "address_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label>Rue</Label>
                      <Input
                        value={address.street || ""}
                        onChange={(e) => updateAddress(index, "street", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ville</Label>
                        <Input
                          value={address.city || ""}
                          onChange={(e) => updateAddress(index, "city", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Code postal</Label>
                        <Input
                          value={address.postal_code || ""}
                          onChange={(e) => updateAddress(index, "postal_code", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Input
                        value={address.country || ""}
                        onChange={(e) => updateAddress(index, "country", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={address.is_default || false}
                        onChange={(e) => updateAddress(index, "is_default", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label className="cursor-pointer">Adresse par défaut</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Méthodes de paiement */}
        <TabsContent value="payments" className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Méthodes de paiement</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPaymentMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une méthode
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune méthode de paiement ajoutée
            </p>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Méthode {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePaymentMethod(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de paiement</Label>
                      <Select
                        value={method.payment_type || "credit_card"}
                        onValueChange={(value) => updatePaymentMethod(index, "payment_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
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

                    {(method.payment_type === "credit_card" || method.payment_type === "debit_card") && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Marque de carte</Label>
                            <Input
                              value={method.card_brand || ""}
                              onChange={(e) => updatePaymentMethod(index, "card_brand", e.target.value)}
                              placeholder="Visa, Mastercard..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>4 derniers chiffres</Label>
                            <Input
                              value={method.card_last_four || ""}
                              onChange={(e) => updatePaymentMethod(index, "card_last_four", e.target.value)}
                              placeholder="1234"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Date d'expiration</Label>
                          <Input
                            type="date"
                            value={method.expiry_date || ""}
                            onChange={(e) => updatePaymentMethod(index, "expiry_date", e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={method.is_default || false}
                          onChange={(e) => updatePaymentMethod(index, "is_default", e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label className="cursor-pointer">Par défaut</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={method.is_active ?? true}
                          onChange={(e) => updatePaymentMethod(index, "is_active", e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label className="cursor-pointer">Active</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {user ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            user ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

