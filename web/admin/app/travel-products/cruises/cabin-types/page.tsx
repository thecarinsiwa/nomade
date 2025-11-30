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
  Bed,
  ArrowLeft,
  FileText,
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
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseCabinTypesService } from "@/lib/services/cruises"
import { CruiseCabinType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface CruiseCabinTypeStats {
  total: number
  withDescription: number
  withCabins: number
  averageCabins: number
}

export default function CruiseCabinTypesPage() {
  const [cabinTypes, setCabinTypes] = useState<CruiseCabinType[]>([])
  const [allCabinTypes, setAllCabinTypes] = useState<CruiseCabinType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasDescriptionFilter, setHasDescriptionFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchCabinTypes = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await cruiseCabinTypesService.getAll(page, search || undefined)
      setCabinTypes(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger tous les types pour les statistiques et filtres
      if (page === 1 && !search) {
        const allData = await cruiseCabinTypesService.getAll(1)
        setAllCabinTypes(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de cabines",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCabinTypes(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: CruiseCabinTypeStats = useMemo(() => {
    const data = searchTerm || hasDescriptionFilter !== "all" ? cabinTypes : allCabinTypes.length > 0 ? allCabinTypes : cabinTypes
    const withCabins = data.filter((t) => (t.cabins_count || 0) > 0)
    const totalCabins = data.reduce((sum, t) => sum + (t.cabins_count || 0), 0)
    return {
      total: data.length,
      withDescription: data.filter((t) => t.description).length,
      withCabins: withCabins.length,
      averageCabins: data.length > 0 ? Math.round(totalCabins / data.length) : 0,
    }
  }, [cabinTypes, allCabinTypes, searchTerm, hasDescriptionFilter])

  // Filtrer les types
  const filteredCabinTypes = useMemo(() => {
    let filtered = cabinTypes

    if (hasDescriptionFilter === "with") {
      filtered = filtered.filter((t) => t.description)
    } else if (hasDescriptionFilter === "without") {
      filtered = filtered.filter((t) => !t.description)
    }

    return filtered
  }, [cabinTypes, hasDescriptionFilter])

  const hasActiveFilters = hasDescriptionFilter !== "all"

  const clearFilters = () => {
    setHasDescriptionFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Bed,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Types de cabines",
    },
    {
      title: "Avec description",
      value: stats.withDescription,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `${Math.round((stats.withDescription / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Avec cabines",
      value: stats.withCabins,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Types utilisés",
    },
    {
      title: "Moyenne cabines",
      value: stats.averageCabins,
      icon: Bed,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Par type",
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
            <h1 className="text-3xl font-bold">Types de cabines</h1>
            <p className="text-muted-foreground">
              Gestion et suivi des types de cabines (intérieure, extérieure, suite)
            </p>
          </div>
          <Link href="/travel-products/cruises/cabin-types/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
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
              Recherchez et filtrez les types de cabines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Select value={hasDescriptionFilter} onValueChange={setHasDescriptionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="with">Avec description</SelectItem>
                      <SelectItem value="without">Sans description</SelectItem>
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
                    {filteredCabinTypes.length} résultat{filteredCabinTypes.length > 1 ? "s" : ""} trouvé{filteredCabinTypes.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des types */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des types de cabines</CardTitle>
            <CardDescription>
              {filteredCabinTypes.length} type{filteredCabinTypes.length > 1 ? "s" : ""} affiché{filteredCabinTypes.length > 1 ? "s" : ""}
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
                      <TableHead>Cabines</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCabinTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Bed className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucun type ne correspond aux critères de recherche"
                                : "Aucun type de cabine trouvé"}
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
                      filteredCabinTypes.map((cabinType) => (
                        <TableRow key={cabinType.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{cabinType.name}</TableCell>
                          <TableCell>
                            {cabinType.description ? (
                              <span className="max-w-xs truncate block">{cabinType.description}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cabinType.cabins_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{cabinType.cabins_count}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(cabinType.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/cruises/cabin-types/view/${cabinType.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cabin-types/edit/${cabinType.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cabin-types/delete/${cabinType.id}`}>
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
            {!isLoading && filteredCabinTypes.length > 0 && totalPages > 1 && (
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

