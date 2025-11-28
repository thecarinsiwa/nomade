"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { RewardForm } from "@/components/onekey/reward-form"
import { onekeyRewardsService } from "@/lib/services/onekey-rewards"
import { OneKeyReward } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditRewardPage() {
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

  const handleSuccess = () => {
    router.push("/loyalty/rewards")
  }

  const handleCancel = () => {
    router.push("/loyalty/rewards")
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
          <Link href="/loyalty/rewards">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la récompense</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de la récompense
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la récompense</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RewardForm reward={reward} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

