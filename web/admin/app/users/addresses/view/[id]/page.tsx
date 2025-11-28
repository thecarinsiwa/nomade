"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { addressesService } from "@/lib/services/addresses"
import { UserAddress } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewAddressPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [address, setAddress] = useState<UserAddress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const addressId = params.id as string

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true)
        const data = await addressesService.getAddressById(addressId)
        setAddress(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'adresse",
          variant: "destructive",
        })
        router.push("/users/addresses")
      } finally {
        setIsLoading(false)
      }
    }

    if (addressId) {
      fetchAddress()
    }
  }, [addressId, router, toast])

  const getAddressTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      billing: "Facturation",
      shipping: "Livraison",
      home: "Domicile",
      work: "Travail",
      other: "Autre",
    }
    return labels[type] || type
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

  if (!address) {
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
            <Link href="/users/addresses">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/users/addresses/edit/${address.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/users/addresses/delete/${address.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de l'adresse</h1>
          <p className="text-muted-foreground">
            Informations complètes de l'adresse
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email utilisateur</p>
                <p className="font-medium">{address.user_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type d'adresse</p>
                <Badge variant="outline">{getAddressTypeLabel(address.address_type)}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rue</p>
                <p className="font-medium">{address.street || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ville</p>
                <p className="font-medium">{address.city || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Code postal</p>
                <p className="font-medium">{address.postal_code || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pays</p>
                <p className="font-medium">{address.country || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse par défaut</p>
                {address.is_default ? (
                  <Badge variant="default">Oui</Badge>
                ) : (
                  <Badge variant="secondary">Non</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(address.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(address.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

