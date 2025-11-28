"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { activitiesService } from "@/lib/services/activities"
import { Activity } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DeleteActivityPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    if (!activity) return

    try {
      setIsDeleting(true)
      await activitiesService.delete(activity.id)
      toast({
        title: "Succès",
        description: "Activité supprimée avec succès",
      })
      router.push("/travel-products/activities")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'activité",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
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
          <h1 className="text-3xl font-bold text-destructive">Supprimer l'activité</h1>
          <p className="text-muted-foreground">
            Confirmez la suppression de l'activité
          </p>
        </motion.div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Attention</CardTitle>
            </div>
            <CardDescription>
              Cette action est irréversible. L'activité et toutes ses données associées seront définitivement supprimées.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Vous êtes sur le point de supprimer :</p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium">{activity.name}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.category_name || ""} | {activity.location || ""}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

