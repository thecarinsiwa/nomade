"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, CreditCard } from "lucide-react"
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
import { paymentMethodsService } from "@/lib/services/payment-methods"
import { UserPaymentMethod } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true)
      const data = await paymentMethodsService.getAllPaymentMethods(1, searchTerm || undefined)
      setPaymentMethods(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les méthodes de paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [searchTerm])

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
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Méthodes de Paiement</h1>
            <p className="text-muted-foreground">
              Gestion des méthodes de paiement des utilisateurs
            </p>
          </div>
          <Link href="/users/payment-methods/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle méthode
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des méthodes de paiement</CardTitle>
            <CardDescription>
              Recherchez et gérez les méthodes de paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email..."
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
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Par défaut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune méthode de paiement trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell className="font-medium">{method.user_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getPaymentTypeLabel(method.payment_type)}</Badge>
                        </TableCell>
                        <TableCell>
                          {method.card_last_four
                            ? `${method.card_brand || ""} •••• ${method.card_last_four}`.trim()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {method.is_active ? (
                            <Badge variant="success">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {method.is_default ? (
                            <Badge variant="default">Oui</Badge>
                          ) : (
                            <Badge variant="secondary">Non</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(method.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/users/payment-methods/view/${method.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/users/payment-methods/edit/${method.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/users/payment-methods/delete/${method.id}`}>
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

