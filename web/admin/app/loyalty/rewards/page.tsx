"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Gift } from "lucide-react"
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
import { onekeyRewardsService } from "@/lib/services/onekey-rewards"
import { OneKeyReward } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function RewardsPage() {
  const [rewards, setRewards] = useState<OneKeyReward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchRewards = async () => {
    try {
      setIsLoading(true)
      const data = await onekeyRewardsService.getAllRewards(1, searchTerm || undefined)
      setRewards(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les récompenses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [searchTerm])

  const getRewardTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      earned: "success",
      redeemed: "destructive",
      expired: "secondary",
      bonus: "warning",
    }
    const labels: Record<string, string> = {
      earned: "Gagné",
      redeemed: "Utilisé",
      expired: "Expiré",
      bonus: "Bonus",
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
            <h1 className="text-3xl font-bold">Récompenses OneKey</h1>
            <p className="text-muted-foreground">
              Gestion des récompenses et points accumulés
            </p>
          </div>
          <Link href="/loyalty/rewards/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle récompense
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des récompenses</CardTitle>
            <CardDescription>
              Recherchez et gérez les récompenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par compte, description..."
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
                    <TableHead>Points</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune récompense trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell className="font-medium">{reward.onekey_account_number || reward.onekey_account}</TableCell>
                        <TableCell className="font-bold text-primary">{reward.points.toLocaleString()}</TableCell>
                        <TableCell>{getRewardTypeBadge(reward.reward_type)}</TableCell>
                        <TableCell className="max-w-xs truncate">{reward.description || "-"}</TableCell>
                        <TableCell>{reward.expires_at ? formatDate(reward.expires_at) : "-"}</TableCell>
                        <TableCell>{formatDateTime(reward.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/loyalty/rewards/view/${reward.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/rewards/edit/${reward.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/rewards/delete/${reward.id}`}>
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

