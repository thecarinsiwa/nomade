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
  Ship,
  ArrowLeft,
  Users,
  Calendar,
  Wrench,
  Anchor,
  TrendingUp,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseShipsService } from "@/lib/services/cruises"
import { CruiseShip } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface CruiseShipStats {
  total: number
  withCapacity: number
  withYear: number
  withCruises: number
}

export default function CruiseShipsPage() {
  const [ships, setShips] = useState<CruiseShip[]>([])
  const [allShips, setAllShips] = useState<CruiseShip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasCapacityFilter, setHasCapacityFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchShips = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await cruiseShipsService.getAll(page, search || undefined)
      setShips(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger tous les navires pour les statistiques et filtres
      if (page === 1 && !search) {
        const allData = await cruiseShipsService.getAll(1)
        setAllShips(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les navires",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShips(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: CruiseShipStats = useMemo(() => {
    const data = searchTerm || hasCapacityFilter !== "all" ? ships : allShips.length > 0 ? allShips : ships
    return {
      total: data.length,
      withCapacity: data.filter((s) => s.capacity).length,
      withYear: data.filter((s) => s.year_built).length,
      withCruises: data.filter((s) => (s.cruises_count || 0) > 0).length,
    }
  }, [ships, allShips, searchTerm, hasCapacityFilter])

  // Filtrer les navires
  const filteredShips = useMemo(() => {
    let filtered = ships

    if (hasCapacityFilter === "with") {
      filtered = filtered.filter((s) => s.capacity)
    } else if (hasCapacityFilter === "without") {
      filtered = filtered.filter((s) => !s.capacity)
    }

    return filtered
  }, [ships, hasCapacityFilter])

  const hasActiveFilters = hasCapacityFilter !== "all"

  const clearFilters = () => {
    setHasCapacityFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Ship,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Navires de croisière",
    },
    {
      title: "Avec capacité",
      value: stats.withCapacity,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `${Math.round((stats.withCapacity / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Avec année",
      value: stats.withYear,
      icon: Wrench,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Navires documentés",
    },
    {
      title: "Avec croisières",
      value: stats.withCruises,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Navires opérationnels",
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
            <Link href="/travel-products/cruises">
              <Button variant="ghost" className="mb-4">
                ← Retour aux croisières
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Navires de croisière</h1>
            <p className="text-muted-foreground">
              Gestion et suivi des navires de croisière
            </p>
          </div>
          <Link href="/travel-products/cruises/cruise-ships/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau navire
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

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Recherchez et filtrez les navires de croisière
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, compagnie..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacité</label>
                  <Select value={hasCapacityFilter} onValueChange={setHasCapacityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les navires" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les navires</SelectItem>
                      <SelectItem value="with">Avec capacité</SelectItem>
                      <SelectItem value="without">Sans capacité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>
                    {filteredShips.length} résultat{filteredShips.length > 1 ? "s" : ""} trouvé{filteredShips.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des navires */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des navires</CardTitle>
            <CardDescription>
              {filteredShips.length} navire{filteredShips.length > 1 ? "s" : ""} affiché{filteredShips.length > 1 ? "s" : ""}
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
                      <TableHead>Compagnie</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Année</TableHead>
                      <TableHead>Croisières</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShips.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Ship className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucun navire ne correspond aux critères de recherche"
                                : "Aucun navire de croisière trouvé"}
                            </div>
                            {hasActiveFilters && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Réinitialiser les filtres
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShips.map((ship) => (
                        <TableRow key={ship.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{ship.name}</TableCell>
                          <TableCell>
                            {ship.cruise_line_name ? (
                              <Badge variant="outline">{ship.cruise_line_name}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ship.capacity ? (
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{ship.capacity}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ship.year_built ? (
                              <Badge variant="secondary">{ship.year_built}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ship.cruises_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{ship.cruises_count}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(ship.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/cruises/cruise-ships/view/${ship.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cruise-ships/edit/${ship.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cruise-ships/delete/${ship.id}`}>
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
            {!isLoading && filteredShips.length > 0 && totalPages > 1 && (
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

