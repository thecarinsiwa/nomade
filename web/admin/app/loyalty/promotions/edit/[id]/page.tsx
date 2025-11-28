"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PromotionForm } from "@/components/onekey/promotion-form"
import { onekeyPromotionsService } from "@/lib/services/onekey-promotions"
import { OneKeyPromotion } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPromotionPage() {
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

  const handleSuccess = () => {
    router.push("/loyalty/promotions")
  }

  const handleCancel = () => {
    router.push("/loyalty/promotions")
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
          <Link href="/loyalty/promotions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la promotion</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la promotion {promotion.title}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la promotion</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromotionForm promotion={promotion} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

