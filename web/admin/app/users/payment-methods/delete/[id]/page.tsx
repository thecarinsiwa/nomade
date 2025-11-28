"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DeletePaymentMethodPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<UserPaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!paymentMethod) return

    try {
      setIsDeleting(true)
      await paymentMethodsService.deletePaymentMethod(paymentMethod.id)
      toast({
        title: "Succès",
        description: "Méthode de paiement supprimée avec succès",
      })
      router.push("/users/payment-methods")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la méthode de paiement",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.push("/users/payment-methods")
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/users/payment-methods">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-destructive">Supprimer la méthode de paiement</h1>
          <p className="text-muted-foreground">
            Confirmez la suppression de la méthode de paiement
          </p>
        </motion.div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Attention</CardTitle>
            </div>
            <CardDescription>
              Cette action est irréversible. La méthode de paiement sera définitivement supprimée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Vous êtes sur le point de supprimer :</p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium">{paymentMethod.user_email}</p>
                <p className="text-sm text-muted-foreground">
                  Type: {getPaymentTypeLabel(paymentMethod.payment_type)}
                  {paymentMethod.card_last_four && ` •••• ${paymentMethod.card_last_four}`}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

