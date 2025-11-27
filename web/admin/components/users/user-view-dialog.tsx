"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"
import { formatDate, formatDateTime } from "@/lib/utils"

interface UserViewDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserViewDialog({ user, open, onOpenChange }: UserViewDialogProps) {
  const [fullUser, setFullUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && user) {
      const fetchFullUser = async () => {
        try {
          setIsLoading(true)
          const data = await usersService.getUserById(user.id)
          setFullUser(data)
        } catch (error) {
          console.error("Error fetching user:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchFullUser()
    }
  }, [open, user])

  if (!user) return null

  const displayUser = fullUser || user

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      active: "default",
      inactive: "secondary",
      suspended: "warning",
      deleted: "destructive",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status === "active" ? "Actif" : status === "inactive" ? "Inactif" : status === "suspended" ? "Suspendu" : "Supprimé"}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
          <DialogDescription>
            Informations complètes de l'utilisateur
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{displayUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    {getStatusBadge(displayUser.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{displayUser.first_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{displayUser.last_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{displayUser.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                    <p className="font-medium">
                      {displayUser.date_of_birth ? formatDate(displayUser.date_of_birth) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email vérifié</p>
                    {displayUser.email_verified ? (
                      <Badge variant="success">Oui</Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">{formatDateTime(displayUser.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profil */}
            {displayUser.profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Langue préférée</p>
                      <p className="font-medium">{displayUser.profile.preferred_language}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Devise préférée</p>
                      <p className="font-medium">{displayUser.profile.preferred_currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fuseau horaire</p>
                      <p className="font-medium">{displayUser.profile.timezone || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Adresses */}
            {displayUser.addresses && displayUser.addresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Adresses ({displayUser.addresses.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayUser.addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{address.address_type}</Badge>
                        {address.is_default && <Badge variant="default">Par défaut</Badge>}
                      </div>
                      <p className="text-sm">
                        {address.street && `${address.street}, `}
                        {address.postal_code && `${address.postal_code} `}
                        {address.city && `${address.city}, `}
                        {address.country}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Méthodes de paiement */}
            {displayUser.payment_methods && displayUser.payment_methods.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement ({displayUser.payment_methods.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayUser.payment_methods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{method.payment_type}</Badge>
                        <div className="flex space-x-2">
                          {method.is_default && <Badge variant="default">Par défaut</Badge>}
                          {method.is_active ? (
                            <Badge variant="success">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </div>
                      </div>
                      {method.card_last_four && (
                        <p className="text-sm">
                          {method.card_brand} •••• {method.card_last_four}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

