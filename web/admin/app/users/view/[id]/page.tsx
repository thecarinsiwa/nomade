"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewUserPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const data = await usersService.getUserById(userId)
        setUser(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'utilisateur",
          variant: "destructive",
        })
        router.push("/users")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, router, toast])

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/users">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/users/edit/${user.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/users/delete/${user.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de l'utilisateur</h1>
          <p className="text-muted-foreground">
            Informations complètes de l'utilisateur {user.email}
          </p>
        </motion.div>

        <div className="space-y-4">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  {getStatusBadge(user.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prénom</p>
                  <p className="font-medium">{user.first_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{user.last_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{user.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p className="font-medium">
                    {user.date_of_birth ? formatDate(user.date_of_birth) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email vérifié</p>
                  {user.email_verified ? (
                    <Badge variant="success">Oui</Badge>
                  ) : (
                    <Badge variant="secondary">Non</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de création</p>
                  <p className="font-medium">{formatDateTime(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                  <p className="font-medium">{formatDateTime(user.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profil */}
          {user.profile && (
            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Langue préférée</p>
                    <p className="font-medium">{user.profile.preferred_language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Devise préférée</p>
                    <p className="font-medium">{user.profile.preferred_currency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fuseau horaire</p>
                    <p className="font-medium">{user.profile.timezone || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Adresses */}
          {user.addresses && user.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Adresses ({user.addresses.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.addresses.map((address) => (
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
          {user.payment_methods && user.payment_methods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement ({user.payment_methods.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.payment_methods.map((method) => (
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
      </div>
    </AdminLayout>
  )
}

