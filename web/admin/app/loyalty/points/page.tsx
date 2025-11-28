"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Coins } from "lucide-react"
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
import { onekeyPointsService } from "@/lib/services/onekey-points"
import { OneKeyPoint } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function PointsPage() {
  const [points, setPoints] = useState<OneKeyPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchPoints = async () => {
    try {
      setIsLoading(true)
      const data = await onekeyPointsService.getAllPoints(1, searchTerm || undefined)
      setPoints(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les points",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPoints()
  }, [searchTerm])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      active: "success",
      expired: "secondary",
      redeemed: "destructive",
    }
    const labels: Record<string, string> = {
      active: "Actif",
      expired: "Expiré",
      redeemed: "Utilisé",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
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
            <h1 className="text-3xl font-bold">Points OneKey</h1>
            <p className="text-muted-foreground">
              Gestion des points individuels
            </p>
          </div>
          <Link href="/loyalty/points/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des points
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des points</CardTitle>
            <CardDescription>
              Recherchez et gérez les points
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
                    <TableHead>Statut</TableHead>
                    <TableHead>Gagné le</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Utilisé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {points.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun point trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    points.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="font-medium">{point.onekey_account_number || point.onekey_account}</TableCell>
                        <TableCell className="font-bold text-primary">{point.points.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(point.status)}</TableCell>
                        <TableCell>{formatDateTime(point.earned_at)}</TableCell>
                        <TableCell>{point.expires_at ? formatDate(point.expires_at) : "-"}</TableCell>
                        <TableCell>{point.redeemed_at ? formatDateTime(point.redeemed_at) : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/loyalty/points/view/${point.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/points/edit/${point.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/loyalty/points/delete/${point.id}`}>
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

