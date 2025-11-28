"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyRewardsService } from "@/lib/services/onekey-rewards"
import { OneKeyReward } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewRewardPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [reward, setReward] = useState<OneKeyReward | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const rewardId = params.id as string

  useEffect(() => {
    const fetchReward = async () => {
      try {
        setIsLoading(true)
        const data = await onekeyRewardsService.getRewardById(rewardId)
        setReward(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la récompense",
          variant: "destructive",
        })
        router.push("/loyalty/rewards")
      } finally {
        setIsLoading(false)
      }
    }

    if (rewardId) {
      fetchReward()
    }
  }, [rewardId, router, toast])

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!reward) {
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
            <Link href="/loyalty/rewards">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/loyalty/rewards/edit/${reward.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/loyalty/rewards/delete/${reward.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la récompense</h1>
          <p className="text-muted-foreground">
            Informations complètes de la récompense
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la récompense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Compte OneKey</p>
                <p className="font-medium">{reward.onekey_account_number || reward.onekey_account}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-primary">{reward.points.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                {getRewardTypeBadge(reward.reward_type)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date d'expiration</p>
                <p className="font-medium">{reward.expires_at ? formatDate(reward.expires_at) : "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(reward.created_at)}</p>
              </div>
              {reward.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{reward.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

