"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Building2,
  Bed,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
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
import { propertiesService, propertyTypesService, propertyCategoriesService } from "@/lib/services/accommodations"
import { Property, PropertyType, PropertyCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface AccommodationStats {
  total: number
  active: number
  inactive: number
  pending: number
  suspended: number
  averageRating: number
}

export default function AccommodationsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [propertyCategories, setPropertyCategories] = useState<PropertyCategory[]>([])
  const [stats, setStats] = useState<AccommodationStats>({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    suspended: 0,
    averageRating: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [propertiesData, typesData, categoriesData] = await Promise.all([
          propertiesService.getAll(1, searchTerm || undefined),
          propertyTypesService.getAll(1),
          propertyCategoriesService.getAll(1),
        ])
        
        const propertiesList = propertiesData.results || []
        setProperties(propertiesList)
        setPropertyTypes(typesData.results || [])
        setPropertyCategories(categoriesData.results || [])

        // Calculer les statistiques
        const total = propertiesData.count || propertiesList.length
        const active = propertiesList.filter((p) => p.status === "active").length
        const inactive = propertiesList.filter((p) => p.status === "inactive").length
        const pending = propertiesList.filter((p) => p.status === "pending").length
        const suspended = propertiesList.filter((p) => p.status === "suspended").length
        
        const ratings = propertiesList
          .map((p) => p.rating)
          .filter((r) => r !== undefined && r !== null) as number[]
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0

        setStats({
          total,
          active,
          inactive,
          pending,
          suspended,
          averageRating: Math.round(averageRating * 100) / 100,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les hébergements",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, toast])

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success" as const,
      inactive: "secondary" as const,
      pending: "warning" as const,
      suspended: "destructive" as const,
    }
    const labels: Record<string, string> = {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      suspended: "Suspendu",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  // Filtrer les propriétés
  const filteredProperties = properties.filter((property) => {
    if (statusFilter !== "all" && property.status !== statusFilter) return false
    if (typeFilter !== "all" && property.property_type !== typeFilter) return false
    if (categoryFilter !== "all" && property.property_category !== categoryFilter) return false
    return true
  })

  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all"

  const clearFilters = () => {
    setStatusFilter("all")
    setTypeFilter("all")
    setCategoryFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Actifs",
      value: stats.active,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Note moyenne",
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
            <h1 className="text-3xl font-bold">Hébergements</h1>
            <p className="text-muted-foreground">
              Gestion des propriétés et hébergements
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/accommodations/property-types">
              <Button variant="outline">
                Types
              </Button>
            </Link>
            <Link href="/travel-products/accommodations/property-categories">
              <Button variant="outline">
                Catégories
              </Button>
            </Link>
            <Link href="/travel-products/accommodations/rooms">
              <Button variant="outline">
                <Bed className="mr-2 h-4 w-4" />
                Chambres
              </Button>
            </Link>
            <Link href="/travel-products/accommodations/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvel hébergement
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
              Recherchez et filtrez les hébergements
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
                      {propertyCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                    {filteredProperties.length} résultat{filteredProperties.length > 1 ? "s" : ""} trouvé{filteredProperties.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des hébergements */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des hébergements</CardTitle>
            <CardDescription>
              {filteredProperties.length} hébergement{filteredProperties.length > 1 ? "s" : ""} affiché{filteredProperties.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {hasActiveFilters
                          ? "Aucun hébergement ne correspond aux filtres"
                          : "Aucun hébergement trouvé"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.name}</TableCell>
                        <TableCell>
                          {property.property_type_name ? (
                            <Badge variant="outline">{property.property_type_name}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {property.property_category_name ? (
                            <Badge variant="outline">{property.property_category_name}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {property.city || property.country ? (
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {property.city || ""}
                                {property.city && property.country ? ", " : ""}
                                {property.country || ""}
                              </span>
                            </div>
                          ) : property.address_details ? (
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {property.address_details.city || ""}
                                {property.address_details.city && property.address_details.country ? ", " : ""}
                                {property.address_details.country || ""}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {property.rating ? (
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{property.rating}</span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {property.total_reviews && property.total_reviews > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ({property.total_reviews})
                                </span>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(property.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(property.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/accommodations/view/${property.id}`}>
                              <Button variant="ghost" size="icon" title="Voir">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/accommodations/edit/${property.id}`}>
                              <Button variant="ghost" size="icon" title="Modifier">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/accommodations/delete/${property.id}`}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
