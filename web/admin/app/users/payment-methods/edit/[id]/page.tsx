"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PaymentMethodForm } from "@/components/payment-methods/payment-method-form"
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPaymentMethodPage() {
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

  const handleSuccess = () => {
    router.push("/users/payment-methods")
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
          <h1 className="text-3xl font-bold">Modifier la méthode de paiement</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la méthode de paiement
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la méthode de paiement</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm paymentMethod={paymentMethod} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

