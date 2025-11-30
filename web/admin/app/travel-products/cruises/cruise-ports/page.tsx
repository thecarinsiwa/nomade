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
  Anchor,
  ArrowLeft,
  MapPin,
  Globe,
  Calendar,
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
import { cruisePortsService } from "@/lib/services/cruises"
import { CruisePort } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface CruisePortStats {
  total: number
  withCity: number
  withCountry: number
  withCruises: number
}

export default function CruisePortsPage() {
  const [ports, setPorts] = useState<CruisePort[]>([])
  const [allPorts, setAllPorts] = useState<CruisePort[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasCityFilter, setHasCityFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchPorts = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await cruisePortsService.getAll(page, search || undefined)
      setPorts(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger tous les ports pour les statistiques et filtres
      if (page === 1 && !search) {
        const allData = await cruisePortsService.getAll(1)
        setAllPorts(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les ports",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPorts(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: CruisePortStats = useMemo(() => {
    const data = searchTerm || hasCityFilter !== "all" ? ports : allPorts.length > 0 ? allPorts : ports
    return {
      total: data.length,
      withCity: data.filter((p) => p.city).length,
      withCountry: data.filter((p) => p.country).length,
      withCruises: data.filter((p) => ((p.departure_cruises_count || 0) + (p.arrival_cruises_count || 0)) > 0).length,
    }
  }, [ports, allPorts, searchTerm, hasCityFilter])

  // Filtrer les ports
  const filteredPorts = useMemo(() => {
    let filtered = ports

    if (hasCityFilter === "with") {
      filtered = filtered.filter((p) => p.city)
    } else if (hasCityFilter === "without") {
      filtered = filtered.filter((p) => !p.city)
    }

    return filtered
  }, [ports, hasCityFilter])

  const hasActiveFilters = hasCityFilter !== "all"

  const clearFilters = () => {
    setHasCityFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Anchor,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Ports de croisière",
    },
    {
      title: "Avec ville",
      value: stats.withCity,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `${Math.round((stats.withCity / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Avec pays",
      value: stats.withCountry,
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Ports localisés",
    },
    {
      title: "Avec croisières",
      value: stats.withCruises,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Ports opérationnels",
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
            <h1 className="text-3xl font-bold">Ports de croisière</h1>
            <p className="text-muted-foreground">
              Gestion et suivi des ports d'embarquement et de débarquement
            </p>
          </div>
          <Link href="/travel-products/cruises/cruise-ports/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau port
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
              Recherchez et filtrez les ports de croisière
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, ville, pays..."
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
                  <label className="text-sm font-medium">Ville</label>
                  <Select value={hasCityFilter} onValueChange={setHasCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les ports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les ports</SelectItem>
                      <SelectItem value="with">Avec ville</SelectItem>
                      <SelectItem value="without">Sans ville</SelectItem>
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
                    {filteredPorts.length} résultat{filteredPorts.length > 1 ? "s" : ""} trouvé{filteredPorts.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des ports */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des ports</CardTitle>
            <CardDescription>
              {filteredPorts.length} port{filteredPorts.length > 1 ? "s" : ""} affiché{filteredPorts.length > 1 ? "s" : ""}
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
                      <TableHead>Ville</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Croisières</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPorts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Anchor className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucun port ne correspond aux critères de recherche"
                                : "Aucun port de croisière trouvé"}
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
                      filteredPorts.map((port) => (
                        <TableRow key={port.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{port.name}</TableCell>
                          <TableCell>
                            {port.city ? (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span>{port.city}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {port.country ? (
                              <div className="flex items-center space-x-1">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <span>{port.country}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {port.departure_cruises_count !== undefined || port.arrival_cruises_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">
                                  {(port.departure_cruises_count || 0) + (port.arrival_cruises_count || 0)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(port.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/cruises/cruise-ports/view/${port.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cruise-ports/edit/${port.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/cruises/cruise-ports/delete/${port.id}`}>
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
            {!isLoading && filteredPorts.length > 0 && totalPages > 1 && (
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

