"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyPromotionsService } from "@/lib/services/onekey-promotions"
import { OneKeyPromotion } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewPromotionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [promotion, setPromotion] = useState<OneKeyPromotion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const promotionId = params.id as string

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setIsLoading(true)
        const data = await onekeyPromotionsService.getPromotionById(promotionId)
        setPromotion(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la promotion",
          variant: "destructive",
        })
        router.push("/loyalty/promotions")
      } finally {
        setIsLoading(false)
      }
    }

    if (promotionId) {
      fetchPromotion()
    }
  }, [promotionId, router, toast])

  const getPromotionTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      bonus_points: "success",
      tier_upgrade: "default",
      discount: "warning",
      special_offer: "secondary",
    }
    const labels: Record<string, string> = {
      bonus_points: "Points bonus",
      tier_upgrade: "Montée de niveau",
      discount: "Réduction",
      special_offer: "Offre spéciale",
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

  if (!promotion) {
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
            <Link href="/loyalty/promotions">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/loyalty/promotions/edit/${promotion.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/loyalty/promotions/delete/${promotion.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de la promotion</h1>
          <p className="text-muted-foreground">
            Informations complètes de la promotion {promotion.title}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la promotion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Titre</p>
                <p className="font-medium text-lg">{promotion.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                {getPromotionTypeBadge(promotion.promotion_type)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau cible</p>
                <Badge variant="outline">{promotion.target_tier || "Tous"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {promotion.is_active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              {promotion.points_multiplier && (
                <div>
                  <p className="text-sm text-muted-foreground">Multiplicateur de points</p>
                  <p className="font-medium">{promotion.points_multiplier}x</p>
                </div>
              )}
              {promotion.discount_percentage && (
                <div>
                  <p className="text-sm text-muted-foreground">Réduction (%)</p>
                  <p className="font-medium">{promotion.discount_percentage}%</p>
                </div>
              )}
              {promotion.discount_amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Montant de réduction</p>
                  <p className="font-medium">{promotion.discount_amount}€</p>
                </div>
              )}
              {promotion.min_purchase && (
                <div>
                  <p className="text-sm text-muted-foreground">Achat minimum</p>
                  <p className="font-medium">{promotion.min_purchase}€</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Valide du</p>
                <p className="font-medium">{formatDate(promotion.valid_from)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valide jusqu'au</p>
                <p className="font-medium">{formatDate(promotion.valid_until)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(promotion.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(promotion.updated_at)}</p>
              </div>
              {promotion.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{promotion.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

