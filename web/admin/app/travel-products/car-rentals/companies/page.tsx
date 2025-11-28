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
  Building2,
  MapPin,
  Car,
  TrendingUp,
  Filter,
  X,
  Image,
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
import { carRentalCompaniesService } from "@/lib/services/car-rentals"
import { CarRentalCompany } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface CompanyStats {
  total: number
  withLogos: number
  withLocations: number
  withCars: number
}

export default function CarRentalCompaniesPage() {
  const [companies, setCompanies] = useState<CarRentalCompany[]>([])
  const [allCompanies, setAllCompanies] = useState<CarRentalCompany[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasLogoFilter, setHasLogoFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const fetchCompanies = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await carRentalCompaniesService.getAll(page, search || undefined)
      setCompanies(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      
      // Charger toutes les compagnies pour les statistiques et filtres
      if (page === 1 && !search) {
        const allData = await carRentalCompaniesService.getAll(1)
        setAllCompanies(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les agences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: CompanyStats = useMemo(() => {
    const data = searchTerm || hasLogoFilter !== "all" ? companies : allCompanies.length > 0 ? allCompanies : companies
    return {
      total: data.length,
      withLogos: data.filter((c) => c.logo_url).length,
      withLocations: data.filter((c) => (c.locations_count || 0) > 0).length,
      withCars: data.filter((c) => (c.cars_count || 0) > 0).length,
    }
  }, [companies, allCompanies, searchTerm, hasLogoFilter])

  // Filtrer les compagnies
  const filteredCompanies = useMemo(() => {
    let filtered = companies

    if (hasLogoFilter === "with") {
      filtered = filtered.filter((c) => c.logo_url)
    } else if (hasLogoFilter === "without") {
      filtered = filtered.filter((c) => !c.logo_url)
    }

    return filtered
  }, [companies, hasLogoFilter])

  const hasActiveFilters = hasLogoFilter !== "all"

  const clearFilters = () => {
    setHasLogoFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Agences de location",
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
      title: "Avec locations",
      value: stats.withLocations,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Points de location",
    },
    {
      title: "Avec véhicules",
      value: stats.withCars,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Agences actives",
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
            <Link href="/travel-products/car-rentals">
              <Button variant="ghost" className="mb-4">
                ← Retour aux véhicules
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Agences de location</h1>
            <p className="text-muted-foreground">
              Gestion et suivi des agences de location de voitures
            </p>
          </div>
          <Link href="/travel-products/car-rentals/companies/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle agence
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
              Recherchez et filtrez les agences de location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code, nom..."
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
                  <label className="text-sm font-medium">Logo</label>
                  <Select value={hasLogoFilter} onValueChange={setHasLogoFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les agences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les agences</SelectItem>
                      <SelectItem value="with">Avec logo</SelectItem>
                      <SelectItem value="without">Sans logo</SelectItem>
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
                    {filteredCompanies.length} résultat{filteredCompanies.length > 1 ? "s" : ""} trouvé{filteredCompanies.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des agences */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des agences</CardTitle>
            <CardDescription>
              {filteredCompanies.length} agence{filteredCompanies.length > 1 ? "s" : ""} affichée{filteredCompanies.length > 1 ? "s" : ""}
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
                      <TableHead>Locations</TableHead>
                      <TableHead>Véhicules</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Building2 className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucune agence ne correspond aux critères de recherche"
                                : "Aucune agence de location trouvée"}
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
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id} className="hover:bg-muted/50">
                          <TableCell>
                            {company.logo_url ? (
                              <div className="flex items-center justify-center">
                                <img
                                  src={company.logo_url}
                                  alt={`Logo ${company.name}`}
                                  className="h-10 w-10 object-contain rounded border bg-white p-1"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-10 w-10 rounded border bg-muted">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {company.code ? (
                              <Badge variant="outline" className="font-mono font-medium">
                                {company.code}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>
                            {company.locations_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{company.locations_count}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {company.cars_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                <Car className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{company.cars_count}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(company.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/car-rentals/companies/view/${company.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/companies/edit/${company.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/companies/delete/${company.id}`}>
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
            {!isLoading && filteredCompanies.length > 0 && totalPages > 1 && (
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

