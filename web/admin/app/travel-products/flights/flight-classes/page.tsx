"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Plane,
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  X,
} from "lucide-react"
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
import { flightClassesService } from "@/lib/services/flights"
import { FlightClass } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface FlightClassStats {
  total: number
  withDescriptions: number
  withAvailabilities: number
  active: number
}

export default function FlightClassesPage() {
  const [classes, setClasses] = useState<FlightClass[]>([])
  const [allClasses, setAllClasses] = useState<FlightClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchClasses = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await flightClassesService.getAll(page, search || undefined)
      setClasses(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger toutes les classes pour les statistiques
      if (page === 1 && !search) {
        const allData = await flightClassesService.getAll(1)
        setAllClasses(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les classes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses(currentPage, searchTerm || undefined)
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: FlightClassStats = useMemo(() => {
    const data = searchTerm ? classes : allClasses.length > 0 ? allClasses : classes
    return {
      total: data.length,
      withDescriptions: data.filter((c) => c.description && c.description.trim() !== "").length,
      withAvailabilities: data.filter((c) => (c.availabilities_count || 0) > 0).length,
      active: data.filter((c) => (c.availabilities_count || 0) > 0).length,
    }
  }, [classes, allClasses, searchTerm])

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Classes de vol",
    },
    {
      title: "Avec descriptions",
      value: stats.withDescriptions,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `${Math.round((stats.withDescriptions / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Avec disponibilités",
      value: stats.withAvailabilities,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Classes actives",
    },
    {
      title: "Actives",
      value: stats.active,
      icon: CheckCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "En utilisation",
    },
  ]

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
            <Link href="/travel-products/flights">
              <Button variant="ghost" className="mb-4">
                ← Retour aux vols
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Classes de vol</h1>
            <p className="text-muted-foreground">
              Gestion des classes de vol (économique, business, première classe)
            </p>
          </div>
          <Link href="/travel-products/flights/flight-classes/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle classe
            </Button>
          </Link>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading ? "..." : stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
            <CardDescription>
              Recherchez les classes de vol par nom ou description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des classes */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des classes</CardTitle>
            <CardDescription>
              {classes.length} classe{classes.length > 1 ? "s" : ""} affichée{classes.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Disponibilités</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Plane className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {searchTerm
                                ? "Aucune classe ne correspond à votre recherche"
                                : "Aucune classe de vol trouvée"}
                            </div>
                            {searchTerm && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSearchTerm("")
                                  setCurrentPage(1)
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Réinitialiser la recherche
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      classes.map((flightClass) => (
                        <TableRow key={flightClass.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Plane className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{flightClass.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {flightClass.description ? (
                              <div className="max-w-md">
                                <p className="text-sm line-clamp-2">{flightClass.description}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {flightClass.availabilities_count !== undefined ? (
                              <div className="flex items-center space-x-2">
                                {flightClass.availabilities_count > 0 ? (
                                  <>
                                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                      {flightClass.availabilities_count}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">disponibilités</span>
                                  </>
                                ) : (
                                  <Badge variant="secondary">Aucune</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDateTime(flightClass.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/flights/flight-classes/view/${flightClass.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/flight-classes/edit/${flightClass.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/flight-classes/delete/${flightClass.id}`}>
                                <Button variant="ghost" size="icon" title="Supprimer">
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
              </div>
            )}

            {/* Pagination */}
            {!isLoading && classes.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

