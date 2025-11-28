"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PointForm } from "@/components/onekey/point-form"
import { onekeyPointsService } from "@/lib/services/onekey-points"
import { OneKeyPoint } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPointPage() {
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

  const handleSuccess = () => {
    router.push("/loyalty/points")
  }

  const handleCancel = () => {
    router.push("/loyalty/points")
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
          <Link href="/loyalty/points">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier les points</h1>
          <p className="text-muted-foreground">
            Modifiez les informations des points
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations des points</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PointForm point={point} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

