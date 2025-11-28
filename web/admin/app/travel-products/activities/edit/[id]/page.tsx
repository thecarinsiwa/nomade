"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ActivityForm } from "@/components/activities/activity-form"
import { activitiesService } from "@/lib/services/activities"
import { Activity } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditActivityPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const activityId = params.id as string

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true)
        const data = await activitiesService.getById(activityId)
        setActivity(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'activité",
          variant: "destructive",
        })
        router.push("/travel-products/activities")
      } finally {
        setIsLoading(false)
      }
    }

    if (activityId) {
      fetchActivity()
    }
  }, [activityId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/activities")
  }

  const handleCancel = () => {
    router.push("/travel-products/activities")
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

  if (!activity) {
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
          <Link href="/travel-products/activities">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier l'activité</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {activity.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'activité</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityForm activity={activity} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

