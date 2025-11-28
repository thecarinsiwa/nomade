"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, MapPin } from "lucide-react"
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
import { AdminLayout } from "@/components/layout/admin-layout"
import { activitiesService } from "@/lib/services/activities"
import { Activity } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      const data = await activitiesService.getAll(1, searchTerm || undefined)
      setActivities(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les activités",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [searchTerm])

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
            <h1 className="text-3xl font-bold">Activités</h1>
            <p className="text-muted-foreground">
              Gestion des activités touristiques
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/activities/categories">
              <Button variant="outline">
                Catégories
              </Button>
            </Link>
            <Link href="/travel-products/activities/schedules">
              <Button variant="outline">
                Horaires
              </Button>
            </Link>
            <Link href="/travel-products/activities/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle activité
              </Button>
            </Link>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des activités</CardTitle>
            <CardDescription>
              Recherchez et gérez les activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, lieu..."
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
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune activité trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{activity.category_name || "-"}</TableCell>
                        <TableCell>{activity.location || "-"}</TableCell>
                        <TableCell>
                          {activity.duration_minutes 
                            ? `${Math.floor(activity.duration_minutes / 60)}h${activity.duration_minutes % 60}min`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {activity.rating ? (
                            <div className="flex items-center">
                              <span className="font-medium">{activity.rating}</span>
                              <span className="text-yellow-500 ml-1">★</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(activity.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/activities/view/${activity.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/activities/edit/${activity.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/activities/delete/${activity.id}`}>
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

