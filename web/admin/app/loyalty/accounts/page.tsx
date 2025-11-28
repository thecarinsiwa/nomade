"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, CreditCard, TrendingUp, Users, Award } from "lucide-react"
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
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { OneKeyAccount } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<OneKeyAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    total: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
    totalPoints: 0,
  })
  const { toast } = useToast()

  const fetchAccounts = async () => {
    try {
      setIsLoading(true)
      const data = await onekeyAccountsService.getAllAccounts(1, searchTerm || undefined)
      const accountsList = data.results || []
      setAccounts(accountsList)

      const total = data.count || accountsList.length
      const silver = accountsList.filter((a) => a.tier === "silver").length
      const gold = accountsList.filter((a) => a.tier === "gold").length
      const platinum = accountsList.filter((a) => a.tier === "platinum").length
      const diamond = accountsList.filter((a) => a.tier === "diamond").length
      const totalPoints = accountsList.reduce((sum, a) => sum + a.total_points, 0)

      setStats({ total, silver, gold, platinum, diamond, totalPoints })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les comptes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [searchTerm])

  const getTierBadge = (tier: string) => {
    const variants: Record<string, "default" | "secondary" | "warning" | "success"> = {
      silver: "secondary",
      gold: "warning",
      platinum: "default",
      diamond: "success",
    }
    const labels: Record<string, string> = {
      silver: "Argent",
      gold: "Or",
      platinum: "Platine",
      diamond: "Diamant",
    }
    return (
      <Badge variant={variants[tier] || "secondary"}>
        {labels[tier] || tier}
      </Badge>
    )
  }

  const statCards = [
    {
      title: "Total Comptes",
      value: stats.total,
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Points Totaux",
      value: stats.totalPoints.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Membres Diamant",
      value: stats.diamond,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Membres Platine",
      value: stats.platinum,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

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
            <h1 className="text-3xl font-bold">Comptes OneKey</h1>
            <p className="text-muted-foreground">
              Gestion des comptes du programme de fidélité
            </p>
          </div>
          <Link href="/loyalty/accounts/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau compte
            </Button>
          </Link>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : stat.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Liste des comptes */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des comptes</CardTitle>
            <CardDescription>
              Recherchez et gérez les comptes OneKey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email, numéro OneKey..."
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
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Numéro OneKey</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Points totaux</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun compte trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.user_email || account.user}</TableCell>
                        <TableCell className="font-mono text-sm">{account.onekey_number}</TableCell>
                        <TableCell>{getTierBadge(account.tier)}</TableCell>
                        <TableCell className="font-medium">{account.total_points.toLocaleString()}</TableCell>
                        <TableCell>{formatDateTime(account.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/loyalty/accounts/view/${account.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/accounts/edit/${account.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/accounts/delete/${account.id}`}>
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

