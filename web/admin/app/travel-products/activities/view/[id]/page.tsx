"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { activitiesService } from "@/lib/services/activities"
import { Activity } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewActivityPage() {
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/activities">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/activities/edit/${activity.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/activities/delete/${activity.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails de l'activité</h1>
          <p className="text-muted-foreground">
            Informations complètes de {activity.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'activité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{activity.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Catégorie</p>
                <p className="font-medium">{activity.category_name || "-"}</p>
              </div>
              {activity.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Lieu</p>
                  <p className="font-medium">{activity.location}</p>
                </div>
              )}
              {activity.duration_minutes && (
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-medium">
                    {Math.floor(activity.duration_minutes / 60)}h{activity.duration_minutes % 60}min
                  </p>
                </div>
              )}
              {activity.rating && (
                <div>
                  <p className="text-sm text-muted-foreground">Note</p>
                  <div className="flex items-center">
                    <span className="font-medium text-lg">{activity.rating}</span>
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(activity.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(activity.updated_at)}</p>
              </div>
              {activity.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{activity.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

