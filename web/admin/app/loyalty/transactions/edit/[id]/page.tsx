"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { TransactionForm } from "@/components/onekey/transaction-form"
import { onekeyTransactionsService } from "@/lib/services/onekey-transactions"
import { OneKeyTransaction } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditTransactionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [transaction, setTransaction] = useState<OneKeyTransaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const transactionId = params.id as string

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setIsLoading(true)
        const data = await onekeyTransactionsService.getTransactionById(transactionId)
        setTransaction(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la transaction",
          variant: "destructive",
        })
        router.push("/loyalty/transactions")
      } finally {
        setIsLoading(false)
      }
    }

    if (transactionId) {
      fetchTransaction()
    }
  }, [transactionId, router, toast])

  const handleSuccess = () => {
    router.push("/loyalty/transactions")
  }

  const handleCancel = () => {
    router.push("/loyalty/transactions")
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

  if (!transaction) {
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
          <Link href="/loyalty/transactions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la transaction</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la transaction
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la transaction</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm transaction={transaction} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

