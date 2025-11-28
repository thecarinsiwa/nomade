"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyTransactionsService } from "@/lib/services/onekey-transactions"
import { OneKeyTransaction } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<OneKeyTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const data = await onekeyTransactionsService.getAllTransactions(1, searchTerm || undefined)
      setTransactions(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les transactions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [searchTerm])

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Transactions OneKey</h1>
            <p className="text-muted-foreground">
              Historique des transactions de points
            </p>
          </div>
          <Link href="/loyalty/transactions/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle transaction
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des transactions</CardTitle>
            <CardDescription>
              Recherchez et gérez les transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par compte, réservation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compte</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Réservation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune transaction trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.onekey_account_number || transaction.onekey_account}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction.transaction_type)}</TableCell>
                        <TableCell className={`font-bold ${transaction.transaction_type === 'earn' ? 'text-green-600' : transaction.transaction_type === 'redeem' ? 'text-red-600' : ''}`}>
                          {transaction.transaction_type === 'earn' ? '+' : transaction.transaction_type === 'redeem' ? '-' : ''}
                          {transaction.points.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{transaction.booking_id || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{transaction.description || "-"}</TableCell>
                        <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/loyalty/transactions/view/${transaction.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/transactions/edit/${transaction.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/transactions/delete/${transaction.id}`}>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

