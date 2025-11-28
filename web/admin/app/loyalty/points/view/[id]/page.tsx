"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyPointsService } from "@/lib/services/onekey-points"
import { OneKeyPoint } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewPointPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [point, setPoint] = useState<OneKeyPoint | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const pointId = params.id as string

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        setIsLoading(true)
        const data = await onekeyPointsService.getPointById(pointId)
        setPoint(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le point",
          variant: "destructive",
        })
        router.push("/loyalty/points")
      } finally {
        setIsLoading(false)
      }
    }

    if (pointId) {
      fetchPoint()
    }
  }, [pointId, router, toast])

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!point) {
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
            <Link href="/loyalty/points">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/loyalty/points/edit/${point.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/loyalty/points/delete/${point.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails des points</h1>
          <p className="text-muted-foreground">
            Informations complètes des points
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations des points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Compte OneKey</p>
                <p className="font-medium">{point.onekey_account_number || point.onekey_account}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-primary">{point.points.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {getStatusBadge(point.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gagné le</p>
                <p className="font-medium">{formatDateTime(point.earned_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expire le</p>
                <p className="font-medium">{point.expires_at ? formatDate(point.expires_at) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisé le</p>
                <p className="font-medium">{point.redeemed_at ? formatDateTime(point.redeemed_at) : "-"}</p>
              </div>
              {point.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{point.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

