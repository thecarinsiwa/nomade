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
  MapPin,
  Building2,
  TrendingUp,
  Car,
  Filter,
  X,
  Plane,
  Train,
  Navigation,
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
import { carRentalLocationsService } from "@/lib/services/car-rentals"
import { CarRentalLocation } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CarRentalLocationsPage() {
  const [locations, setLocations] = useState<CarRentalLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  const fetchLocations = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await carRentalLocationsService.getAll(page, search || undefined)
      const locationsList = data.results || []
      setLocations(locationsList)
      
      // Gestion de la pagination
      const total = data.count || 0
      setTotalCount(total)
      const pageSize = locationsList.length || 1
      setTotalPages(Math.ceil(total / pageSize) || 1)
    } catch (error) {
      console.error("Error fetching locations:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les points de location",
        variant: "destructive",
      })
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Filtrer les locations
  const filteredLocations = useMemo(() => {
    let filtered = locations

    if (locationTypeFilter !== "all") {
      filtered = filtered.filter((l) => l.location_type === locationTypeFilter)
    }

    return filtered
  }, [locations, locationTypeFilter])

  // Calculer les statistiques
  const stats = useMemo(() => {
    return {
      total: filteredLocations.length,
      airports: filteredLocations.filter((l) => l.location_type === "airport").length,
      cities: filteredLocations.filter((l) => l.location_type === "city").length,
      withAvailability: filteredLocations.filter((l) => (l.availabilities_count || 0) > 0).length,
    }
  }, [filteredLocations])

  const hasActiveFilters = locationTypeFilter !== "all"

  const clearFilters = () => {
    setLocationTypeFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Points de location",
    },
    {
      title: "Aéroports",
      value: stats.airports,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Points aéroports",
    },
    {
      title: "Villes",
      value: stats.cities,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Points villes",
    },
    {
      title: "Avec disponibilités",
      value: stats.withAvailability,
      icon: Car,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Points actifs",
    },
  ]

  const getLocationTypeBadge = (type: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary"; icon: any; color: string }> = {
      airport: {
        label: "Aéroport",
        variant: "default",
        icon: Plane,
        color: "bg-blue-500",
      },
      city: {
        label: "Ville",
        variant: "secondary",
        icon: Building2,
        color: "bg-purple-500",
      },
      station: {
        label: "Gare",
        variant: "default",
        icon: Train,
        color: "bg-green-500",
      },
      other: {
        label: "Autre",
        variant: "secondary",
        icon: MapPin,
        color: "bg-gray-500",
      },
    }
    const configItem = config[type] || { label: type, variant: "secondary" as const, icon: MapPin, color: "bg-gray-500" }
    const Icon = configItem.icon
    return (
      <Badge variant={configItem.variant} className="flex items-center space-x-1.5 shadow-sm">
        <Icon className="h-3 w-3" />
        <span>{configItem.label}</span>
      </Badge>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header amélioré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b"
        >
          <div className="space-y-2">
            <Link href="/travel-products/car-rentals">
              <Button variant="ghost" size="sm" className="mb-2">
                ← Retour aux véhicules
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Points de location</h1>
                <p className="text-muted-foreground mt-1">
                  Gestion des points de location (aéroports, villes, gares)
                </p>
              </div>
            </div>
          </div>
          <Link href="/travel-products/car-rentals/locations/add">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau point
            </Button>
          </Link>
        </motion.div>

        {/* Statistiques améliorées */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2.5 rounded-lg shadow-sm`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight mb-1">
                      {isLoading ? (
                        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Liste des points de location améliorée */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Liste des points de location</CardTitle>
                <CardDescription className="mt-1">
                  {filteredLocations.length} point{filteredLocations.length > 1 ? "s" : ""} affiché{filteredLocations.length > 1 ? "s" : ""}
                  {totalCount > filteredLocations.length && ` sur ${totalCount} au total`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, ville, pays..."
                    className="pl-10 h-11 shadow-sm border-2 focus:border-primary/50"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative min-w-[180px]">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={locationTypeFilter} onValueChange={setLocationTypeFilter}>
                      <SelectTrigger className="pl-10 h-11 shadow-sm border-2">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="airport">Aéroport</SelectItem>
                        <SelectItem value="city">Ville</SelectItem>
                        <SelectItem value="station">Gare</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-11 shadow-sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                  <Filter className="h-4 w-4" />
                  <span>
                    {filteredLocations.length} résultat{filteredLocations.length > 1 ? "s" : ""} trouvé{filteredLocations.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agence</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Pays</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Disponibilités</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-16">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-muted/50 rounded-full">
                              <MapPin className="h-16 w-16 text-muted-foreground opacity-50" />
                            </div>
                            <div className="space-y-2 text-center">
                              <p className="text-lg font-semibold text-foreground">
                                {searchTerm || hasActiveFilters
                                  ? "Aucun point de location ne correspond aux critères"
                                  : "Aucun point de location trouvé"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {searchTerm || hasActiveFilters
                                  ? "Essayez de modifier vos critères de recherche ou de filtrage"
                                  : "Commencez par créer votre premier point de location"}
                              </p>
                            </div>
                            {(searchTerm || hasActiveFilters) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Réinitialiser les filtres
                              </Button>
                            )}
                            {!searchTerm && !hasActiveFilters && (
                              <Link href="/travel-products/car-rentals/locations/add">
                                <Button size="sm" className="mt-2">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Créer un point de location
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLocations.map((location) => (
                        <TableRow 
                          key={location.id} 
                          className="hover:bg-muted/50 transition-colors border-b"
                        >
                          <TableCell className="py-4">
                            {location.company_name ? (
                              <Badge variant="outline" className="shadow-sm">
                                {location.company_name}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm italic">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 bg-green-100 rounded-md shadow-sm">
                                <MapPin className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-base block">{location.name}</span>
                                {location.latitude && location.longitude && (
                                  <span className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
                                    <Navigation className="h-3 w-3" />
                                    <span>GPS disponible</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {location.city ? (
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                <span>{location.city}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            {location.country ? (
                              <Badge variant="outline" className="text-xs shadow-sm">
                                {location.country}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground italic">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">{getLocationTypeBadge(location.location_type)}</TableCell>
                          <TableCell className="py-4">
                            {location.availabilities_count !== undefined ? (
                              <div className="flex items-center space-x-1">
                                {location.availabilities_count > 0 ? (
                                  <Badge variant="default" className="bg-green-500 text-white hover:bg-green-600 shadow-sm">
                                    {location.availabilities_count}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="shadow-sm">Aucune</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-muted-foreground">
                            {formatDateTime(location.created_at)}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end space-x-1">
                              <Link href={`/travel-products/car-rentals/locations/view/${location.id}`}>
                                <Button variant="ghost" size="icon" title="Voir" className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/locations/edit/${location.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier" className="h-9 w-9 hover:bg-orange-50 hover:text-orange-600">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/locations/delete/${location.id}`}>
                                <Button variant="ghost" size="icon" title="Supprimer" className="h-9 w-9 hover:bg-red-50 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
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

            {/* Pagination améliorée */}
            {!isLoading && filteredLocations.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <div className="text-sm font-medium text-muted-foreground">
                  Page <span className="font-bold text-foreground">{currentPage}</span> sur <span className="font-bold text-foreground">{totalPages}</span> 
                  <span className="ml-2">({totalCount} point{totalCount > 1 ? "s" : ""} au total)</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="shadow-sm"
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || isLoading}
                    className="shadow-sm"
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

