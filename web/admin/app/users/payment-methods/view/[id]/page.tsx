"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewPaymentMethodPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<UserPaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentMethodId = params.id as string

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        setIsLoading(true)
        const data = await paymentMethodsService.getPaymentMethodById(paymentMethodId)
        setPaymentMethod(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la méthode de paiement",
          variant: "destructive",
        })
        router.push("/users/payment-methods")
      } finally {
        setIsLoading(false)
      }
    }

    if (paymentMethodId) {
      fetchPaymentMethod()
    }
  }, [paymentMethodId, router, toast])

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      credit_card: "Carte de crédit",
      debit_card: "Carte de débit",
      paypal: "PayPal",
      bank_transfer: "Virement bancaire",
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

  if (!paymentMethod) {
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
            <Link href="/users/payment-methods">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/users/payment-methods/edit/${paymentMethod.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/users/payment-methods/delete/${paymentMethod.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la méthode de paiement</h1>
          <p className="text-muted-foreground">
            Informations complètes de la méthode de paiement
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la méthode de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email utilisateur</p>
                <p className="font-medium">{paymentMethod.user_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type de paiement</p>
                <Badge variant="outline">{getPaymentTypeLabel(paymentMethod.payment_type)}</Badge>
              </div>
              {paymentMethod.card_brand && (
                <div>
                  <p className="text-sm text-muted-foreground">Marque de carte</p>
                  <p className="font-medium">{paymentMethod.card_brand}</p>
                </div>
              )}
              {paymentMethod.card_last_four && (
                <div>
                  <p className="text-sm text-muted-foreground">4 derniers chiffres</p>
                  <p className="font-medium">•••• {paymentMethod.card_last_four}</p>
                </div>
              )}
              {paymentMethod.expiry_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Date d'expiration</p>
                  <p className="font-medium">{formatDate(paymentMethod.expiry_date)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Méthode par défaut</p>
                {paymentMethod.is_default ? (
                  <Badge variant="default">Oui</Badge>
                ) : (
                  <Badge variant="secondary">Non</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {paymentMethod.is_active ? (
                  <Badge variant="success">Actif</Badge>
                ) : (
                  <Badge variant="secondary">Inactif</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(paymentMethod.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(paymentMethod.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

