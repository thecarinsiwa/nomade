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
  Tag,
  Car,
  TrendingUp,
  FileText,
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
import { carCategoriesService } from "@/lib/services/car-rentals"
import { CarCategory } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CarCategoriesPage() {
  const [categories, setCategories] = useState<CarCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  const fetchCategories = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await carCategoriesService.getAll(page, search || undefined)
      const categoriesList = data.results || []
      setCategories(categoriesList)
      
      // Gestion de la pagination
      const total = data.count || 0
      setTotalCount(total)
      const pageSize = categoriesList.length || 1
      setTotalPages(Math.ceil(total / pageSize) || 1)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les catégories",
        variant: "destructive",
      })
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats = useMemo(() => {
    return {
      total: categories.length,
      withDescription: categories.filter((c) => c.description).length,
      withCars: categories.filter((c) => (c.cars_count || 0) > 0).length,
      totalCars: categories.reduce((sum, c) => sum + (c.cars_count || 0), 0),
    }
  }, [categories])

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Tag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Catégories",
    },
    {
      title: "Avec description",
      value: stats.withDescription,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Catégories décrites",
    },
    {
      title: "Avec véhicules",
      value: stats.withCars,
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Catégories actives",
    },
    {
      title: "Véhicules totaux",
      value: stats.totalCars,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Véhicules au total",
    },
  ]

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
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Catégories de véhicules</h1>
                <p className="text-muted-foreground mt-1">
                  Gestion des catégories (compacte, SUV, berline, etc.)
                </p>
              </div>
            </div>
          </div>
          <Link href="/travel-products/car-rentals/categories/add">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle catégorie
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

        {/* Liste des catégories améliorée */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Liste des catégories</CardTitle>
                <CardDescription className="mt-1">
                  {categories.length} catégorie{categories.length > 1 ? "s" : ""} affichée{categories.length > 1 ? "s" : ""}
                  {totalCount > categories.length && ` sur ${totalCount} au total`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom..."
                  className="pl-10 h-11 shadow-sm border-2 focus:border-primary/50"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
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
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Véhicules</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Tag className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {searchTerm
                                ? "Aucune catégorie ne correspond à la recherche"
                                : "Aucune catégorie trouvée"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow 
                          key={category.id} 
                          className="hover:bg-muted/50 transition-colors border-b"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 bg-blue-100 rounded-md">
                                <Tag className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-semibold text-base">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {category.description ? (
                              <p className="max-w-xs truncate text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            ) : (
                              <span className="text-muted-foreground text-sm italic">Aucune description</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            {category.cars_count !== undefined ? (
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                {category.cars_count > 0 ? (
                                  <Badge variant="default" className="bg-green-500 text-white hover:bg-green-600 shadow-sm">
                                    {category.cars_count}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="shadow-sm">Aucun</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-sm text-muted-foreground">
                            {formatDateTime(category.created_at)}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end space-x-1">
                              <Link href={`/travel-products/car-rentals/categories/view/${category.id}`}>
                                <Button variant="ghost" size="icon" title="Voir" className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/categories/edit/${category.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier" className="h-9 w-9 hover:bg-orange-50 hover:text-orange-600">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/car-rentals/categories/delete/${category.id}`}>
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
            {!isLoading && categories.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <div className="text-sm font-medium text-muted-foreground">
                  Page <span className="font-bold text-foreground">{currentPage}</span> sur <span className="font-bold text-foreground">{totalPages}</span> 
                  <span className="ml-2">({totalCount} catégorie{totalCount > 1 ? "s" : ""} au total)</span>
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

