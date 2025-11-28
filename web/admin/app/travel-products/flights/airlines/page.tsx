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
  Globe,
  Image,
  Calendar,
  Filter,
  X,
  TrendingUp,
  Building2,
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
import { airlinesService } from "@/lib/services/flights"
import { Airline } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface AirlineStats {
  total: number
  withLogos: number
  countriesCount: number
  withFlights: number
}

export default function AirlinesPage() {
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [allAirlines, setAllAirlines] = useState<Airline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchAirlines = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await airlinesService.getAll(page, search || undefined)
      setAirlines(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger toutes les compagnies pour les statistiques et filtres
      if (page === 1 && !search) {
        const allData = await airlinesService.getAll(1)
        setAllAirlines(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les compagnies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAirlines(currentPage, searchTerm || undefined)
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: AirlineStats = useMemo(() => {
    const data = searchTerm || countryFilter !== "all" ? airlines : allAirlines.length > 0 ? allAirlines : airlines
    return {
      total: data.length,
      withLogos: data.filter((a) => a.logo_url).length,
      countriesCount: new Set(data.filter((a) => a.country).map((a) => a.country)).size,
      withFlights: data.filter((a) => (a.flights_count || 0) > 0).length,
    }
  }, [airlines, allAirlines, searchTerm, countryFilter])

  // Obtenir la liste unique des pays
  const countries = useMemo(() => {
    const data = allAirlines.length > 0 ? allAirlines : airlines
    const countryList = data
      .map((a) => a.country)
      .filter((c): c is string => Boolean(c))
    return Array.from(new Set(countryList)).sort()
  }, [allAirlines, airlines])

  // Filtrer les compagnies
  const filteredAirlines = useMemo(() => {
    let filtered = airlines

    if (countryFilter !== "all") {
      filtered = filtered.filter((a) => a.country === countryFilter)
    }

    return filtered
  }, [airlines, countryFilter])

  const hasActiveFilters = countryFilter !== "all"

  const clearFilters = () => {
    setCountryFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Compagnies aériennes",
    },
    {
      title: "Avec logos",
      value: stats.withLogos,
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: `${Math.round((stats.withLogos / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Pays",
      value: stats.countriesCount,
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Pays représentés",
    },
    {
      title: "Avec vols",
      value: stats.withFlights,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Compagnies actives",
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
            <h1 className="text-3xl font-bold">Compagnies aériennes</h1>
            <p className="text-muted-foreground">
              Gestion et suivi des compagnies aériennes
            </p>
          </div>
          <Link href="/travel-products/flights/airlines/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle compagnie
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
              Recherchez et filtrez les compagnies aériennes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code, nom, pays..."
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
                  <label className="text-sm font-medium">Pays</label>
                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
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
                    {filteredAirlines.length} résultat{filteredAirlines.length > 1 ? "s" : ""} trouvé{filteredAirlines.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des compagnies */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des compagnies</CardTitle>
            <CardDescription>
              {filteredAirlines.length} compagnie{filteredAirlines.length > 1 ? "s" : ""} affichée{filteredAirlines.length > 1 ? "s" : ""}
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
                      <TableHead className="w-[80px]">Logo</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Vols</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAirlines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Plane className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucune compagnie ne correspond aux critères de recherche"
                                : "Aucune compagnie aérienne trouvée"}
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
                      filteredAirlines.map((airline) => (
                        <TableRow key={airline.id} className="hover:bg-muted/50">
                          <TableCell>
                            {airline.logo_url ? (
                              <div className="flex items-center justify-center">
                                <img
                                  src={airline.logo_url}
                                  alt={`Logo ${airline.name}`}
                                  className="h-10 w-10 object-contain rounded border bg-white p-1"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-10 w-10 rounded border bg-muted">
                                <Plane className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono font-medium">
                              {airline.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{airline.name}</TableCell>
                          <TableCell>
                            {airline.country ? (
                              <div className="flex items-center space-x-1">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <span>{airline.country}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {airline.flights_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <Plane className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{airline.flights_count}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(airline.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/flights/airlines/view/${airline.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/airlines/edit/${airline.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/airlines/delete/${airline.id}`}>
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
            {!isLoading && filteredAirlines.length > 0 && totalPages > 1 && (
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

