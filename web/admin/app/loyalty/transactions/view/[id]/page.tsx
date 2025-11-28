"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyTransactionsService } from "@/lib/services/onekey-transactions"
import { OneKeyTransaction } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewTransactionPage() {
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

  const getTransactionTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      earn: "success",
      redeem: "destructive",
      expire: "secondary",
      adjustment: "warning",
    }
    const labels: Record<string, string> = {
      earn: "Gain",
      redeem: "Utilisation",
      expire: "Expiration",
      adjustment: "Ajustement",
    }
    return (
      <Badge variant={variants[type] || "secondary"}>
        {labels[type] || type}
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/loyalty/transactions">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/loyalty/transactions/edit/${transaction.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/loyalty/transactions/delete/${transaction.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la transaction</h1>
          <p className="text-muted-foreground">
            Informations complètes de la transaction
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Compte OneKey</p>
                <p className="font-medium">{transaction.onekey_account_number || transaction.onekey_account}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                {getTransactionTypeBadge(transaction.transaction_type)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className={`text-2xl font-bold ${transaction.transaction_type === 'earn' ? 'text-green-600' : transaction.transaction_type === 'redeem' ? 'text-red-600' : ''}`}>
                  {transaction.transaction_type === 'earn' ? '+' : transaction.transaction_type === 'redeem' ? '-' : ''}
                  {transaction.points.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Réservation</p>
                <p className="font-mono text-xs">{transaction.booking_id || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDateTime(transaction.created_at)}</p>
              </div>
              {transaction.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{transaction.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

