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
  Car,
  Calendar,
  TrendingUp,
  Filter,
  X,
  Users,
  Fuel,
  Settings,
  Building2,
  Tag,
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
import {
  carsService,
  carRentalCompaniesService,
  carCategoriesService,
} from "@/lib/services/car-rentals"
import { Car as CarType, CarRentalCompany, CarCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface CarStats {
  total: number
  automatic: number
  manual: number
  electric: number
  withAvailability: number
}

export default function CarRentalsPage() {
  const [cars, setCars] = useState<CarType[]>([])
  const [allCars, setAllCars] = useState<CarType[]>([])
  const [companies, setCompanies] = useState<CarRentalCompany[]>([])
  const [categories, setCategories] = useState<CarCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [transmissionFilter, setTransmissionFilter] = useState<string>("all")
  const [fuelFilter, setFuelFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  const fetchCars = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const [carsData, companiesData, categoriesData] = await Promise.all([
        carsService.getAll(page, search || undefined),
        carRentalCompaniesService.getAll(1),
        carCategoriesService.getAll(1),
      ])

      const carsList = carsData.results || []
      setCars(carsList)
      setCompanies(companiesData.results || [])
      setCategories(categoriesData.results || [])

      // Gestion de la pagination
      const total = carsData.count || 0
      setTotalCount(total)
      const pageSize = carsList.length || 1
      setTotalPages(Math.ceil(total / pageSize) || 1)

      // Charger toutes les voitures pour les statistiques
      if (page === 1 && !search) {
        const allData = await carsService.getAll(1)
        setAllCars(allData.results || [])
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les véhicules",
        variant: "destructive",
      })
      setCars([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCars(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: CarStats = useMemo(() => {
    const data = searchTerm || companyFilter !== "all" || categoryFilter !== "all" || transmissionFilter !== "all" || fuelFilter !== "all"
      ? cars
      : allCars.length > 0
      ? allCars
      : cars
    return {
      total: data.length,
      automatic: data.filter((c) => c.transmission === "automatic").length,
      manual: data.filter((c) => c.transmission === "manual").length,
      electric: data.filter((c) => c.fuel_type === "electric" || c.fuel_type === "hybrid").length,
      withAvailability: data.filter((c) => (c.availabilities_count || 0) > 0).length,
    }
  }, [cars, allCars, searchTerm, companyFilter, categoryFilter, transmissionFilter, fuelFilter])

  // Filtrer les voitures
  const filteredCars = useMemo(() => {
    let filtered = cars

    if (companyFilter !== "all") {
      filtered = filtered.filter((c) => c.company === companyFilter)
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((c) => c.category === categoryFilter)
    }
    if (transmissionFilter !== "all") {
      filtered = filtered.filter((c) => c.transmission === transmissionFilter)
    }
    if (fuelFilter !== "all") {
      filtered = filtered.filter((c) => c.fuel_type === fuelFilter)
    }

    return filtered
  }, [cars, companyFilter, categoryFilter, transmissionFilter, fuelFilter])

  const hasActiveFilters =
    companyFilter !== "all" ||
    categoryFilter !== "all" ||
    transmissionFilter !== "all" ||
    fuelFilter !== "all"

  const clearFilters = () => {
    setCompanyFilter("all")
    setCategoryFilter("all")
    setTransmissionFilter("all")
    setFuelFilter("all")
  }

  const getTransmissionLabel = (transmission: string) => {
    return transmission === "automatic" ? "Automatique" : "Manuelle"
  }

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: Record<string, string> = {
      gasoline: "Essence",
      petrol: "Essence",
      diesel: "Diesel",
      electric: "Électrique",
      hybrid: "Hybride",
    }
    return labels[fuelType] || fuelType
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Véhicules",
    },
    {
      title: "Automatique",
      value: stats.automatic,
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: `${Math.round((stats.automatic / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Électrique/Hybride",
      value: stats.electric,
      icon: Fuel,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Véhicules écologiques",
    },
    {
      title: "Avec disponibilités",
      value: stats.withAvailability,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Véhicules actifs",
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
            <h1 className="text-3xl font-bold">Locations de voitures</h1>
            <p className="text-muted-foreground">
              Gestion des véhicules et agences de location
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/car-rentals/companies">
              <Button variant="outline">
                Agences
              </Button>
            </Link>
            <Link href="/travel-products/car-rentals/locations">
              <Button variant="outline">
                Points de location
              </Button>
            </Link>
            <Link href="/travel-products/car-rentals/categories">
              <Button variant="outline">
                Catégories
              </Button>
            </Link>
            <Link href="/travel-products/car-rentals/availability">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Disponibilités
              </Button>
            </Link>
            <Link href="/travel-products/car-rentals/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau véhicule
              </Button>
            </Link>
          </div>
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
              Recherchez et filtrez les véhicules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par marque, modèle, année..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Compagnie</label>
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les compagnies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les compagnies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmission</label>
                  <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="automatic">Automatique</SelectItem>
                      <SelectItem value="manual">Manuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Carburant</label>
                  <Select value={fuelFilter} onValueChange={setFuelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="gasoline">Essence</SelectItem>
                      <SelectItem value="petrol">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Électrique</SelectItem>
                      <SelectItem value="hybrid">Hybride</SelectItem>
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
                    {filteredCars.length} résultat{filteredCars.length > 1 ? "s" : ""} trouvé{filteredCars.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des véhicules */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des véhicules</CardTitle>
            <CardDescription>
              {filteredCars.length} véhicule{filteredCars.length > 1 ? "s" : ""} affiché{filteredCars.length > 1 ? "s" : ""}
              {totalCount > filteredCars.length && ` sur ${totalCount} au total`}
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
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Compagnie</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Année</TableHead>
                      <TableHead>Transmission</TableHead>
                      <TableHead>Carburant</TableHead>
                      <TableHead>Places</TableHead>
                      <TableHead>Disponibilités</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCars.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Car className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {hasActiveFilters || searchTerm
                                ? "Aucun véhicule ne correspond aux critères de recherche"
                                : "Aucun véhicule trouvé"}
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
                      filteredCars.map((car) => (
                        <TableRow key={car.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">
                                  {car.make} {car.model}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {car.company_name ? (
                              <Badge variant="outline">{car.company_name}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {car.category_name ? (
                              <Badge variant="secondary">{car.category_name}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>{car.year || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={car.transmission === "automatic" ? "default" : "outline"}
                            >
                              {getTransmissionLabel(car.transmission)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Fuel className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{getFuelTypeLabel(car.fuel_type)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{car.seats}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {car.availabilities_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                {car.availabilities_count > 0 ? (
                                  <>
                                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                      {car.availabilities_count}
                                    </Badge>
                                  </>
                                ) : (
                                  <Badge variant="secondary">Aucune</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/car-rentals/view/${car.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/edit/${car.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/delete/${car.id}`}>
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
            {!isLoading && filteredCars.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages} ({totalCount} véhicule{totalCount > 1 ? "s" : ""} au total)
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
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

