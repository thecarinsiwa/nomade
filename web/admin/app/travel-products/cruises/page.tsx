"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Ship, Calendar, MapPin, Users, Anchor } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruisesService } from "@/lib/services/cruises"
import { Cruise } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CruisesPage() {
  const [cruises, setCruises] = useState<Cruise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchCruises = async () => {
    try {
      setIsLoading(true)
      const data = await cruisesService.getAll(1, searchTerm || undefined)
      setCruises(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les croisières",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCruises()
  }, [searchTerm])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "default",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
    }
    const labels: Record<string, string> = {
      scheduled: "Programmée",
      in_progress: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  // Calcul des statistiques
  const stats = {
    total: cruises.length,
    scheduled: cruises.filter(c => c.status === 'scheduled').length,
    inProgress: cruises.filter(c => c.status === 'in_progress').length,
    completed: cruises.filter(c => c.status === 'completed').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header avec icône */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Ship className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Croisières</h1>
              <p className="text-muted-foreground">
                Gérez toutes vos croisières et leurs informations
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/travel-products/cruises/cruise-lines">
                <Button variant="outline" size="sm">
                  <Anchor className="mr-2 h-4 w-4" />
                  Compagnies
                </Button>
              </Link>
              <Link href="/travel-products/cruises/cruise-ships">
                <Button variant="outline" size="sm">
                  <Ship className="mr-2 h-4 w-4" />
                  Navires
                </Button>
              </Link>
              <Link href="/travel-products/cruises/cruise-ports">
                <Button variant="outline" size="sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  Ports
                </Button>
              </Link>
              <Link href="/travel-products/cruises/cabins">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Cabines
                </Button>
              </Link>
              <Link href="/travel-products/cruises/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle croisière
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Ship className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Croisières au total
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Programmées</CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.scheduled}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  À venir
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En cours</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Ship className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Actuellement
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Complétées
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Liste des croisières */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Ship className="h-5 w-5" />
                    <span>Liste des croisières</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Recherchez et gérez vos croisières ({cruises.length} résultat{cruises.length > 1 ? 's' : ''})
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, compagnie, navire..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Nom</TableHead>
                        <TableHead className="font-semibold">Compagnie</TableHead>
                        <TableHead className="font-semibold">Navire</TableHead>
                        <TableHead className="font-semibold">Départ</TableHead>
                        <TableHead className="font-semibold">Arrivée</TableHead>
                        <TableHead className="font-semibold">Durée</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cruises.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Ship className="h-12 w-12 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground font-medium">Aucune croisière trouvée</p>
                              <p className="text-sm text-muted-foreground">
                                {searchTerm ? "Essayez une autre recherche" : "Commencez par ajouter une croisière"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        cruises.map((cruise, index) => (
                          <motion.div
                            key={cruise.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TableRow className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">{cruise.name}</TableCell>
                              <TableCell>
                                {cruise.cruise_line_name ? (
                                  <Badge variant="outline">{cruise.cruise_line_name}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>{cruise.ship_name || "-"}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>{formatDate(cruise.departure_date)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>{formatDate(cruise.arrival_date)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {cruise.duration_days ? (
                                  <Badge variant="secondary">{cruise.duration_days} jour{cruise.duration_days > 1 ? 's' : ''}</Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(cruise.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Link href={`/travel-products/cruises/view/${cruise.id}`}>
                                    <Button variant="ghost" size="icon" title="Voir">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/travel-products/cruises/edit/${cruise.id}`}>
                                    <Button variant="ghost" size="icon" title="Modifier">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/travel-products/cruises/delete/${cruise.id}`}>
                                    <Button variant="ghost" size="icon" title="Supprimer" className="text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          </motion.div>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

