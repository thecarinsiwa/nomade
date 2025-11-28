"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Calendar, TrendingUp, DollarSign, CheckCircle, XCircle, Car as CarIcon, MapPin, Building2 } from "lucide-react"
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
import { carAvailabilityService } from "@/lib/services/car-rentals"
import { CarAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface AvailabilityStats {
  total: number
  available: number
  unavailable: number
  withPrice: number
}

export default function CarAvailabilityPage() {
  const [availability, setAvailability] = useState<CarAvailability[]>([])
  const [allAvailability, setAllAvailability] = useState<CarAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  const fetchAvailability = async (page: number = 1, search?: string) => {
    try {
      setIsLoading(true)
      const data = await carAvailabilityService.getAll(page, search || undefined)
      setAvailability(data.results || [])
      setTotalPages(Math.ceil((data.count || 0) / (data.results?.length || 1)))
      setTotalCount(data.count || 0)
      
      // Charger toutes les disponibilités pour les statistiques
      if (page === 1 && !search) {
        const allData = await carAvailabilityService.getAll(1)
        setAllAvailability(allData.results || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les disponibilités",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability(currentPage, searchTerm || undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm])

  // Calculer les statistiques
  const stats: AvailabilityStats = useMemo(() => {
    const data = searchTerm ? availability : allAvailability.length > 0 ? allAvailability : availability
    return {
      total: data.length,
      available: data.filter((a) => {
        const isAvailable = a.is_available !== undefined ? a.is_available : (a as any)?.available
        return isAvailable
      }).length,
      unavailable: data.filter((a) => {
        const isAvailable = a.is_available !== undefined ? a.is_available : (a as any)?.available
        return !isAvailable
      }).length,
      withPrice: data.filter((a) => a.price_per_day && a.price_per_day > 0).length,
    }
  }, [availability, allAvailability, searchTerm])

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Disponibilités",
    },
    {
      title: "Disponibles",
      value: stats.available,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: `${Math.round((stats.available / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Indisponibles",
      value: stats.unavailable,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: `${Math.round((stats.unavailable / stats.total) * 100) || 0}% du total`,
    },
    {
      title: "Avec prix",
      value: stats.withPrice,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Prix définis",
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
            <h1 className="text-3xl font-bold">Disponibilités des véhicules</h1>
            <p className="text-muted-foreground">
              Gestion des disponibilités par période
            </p>
          </div>
          <Link href="/travel-products/car-rentals/availability/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle disponibilité
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
              Recherchez et filtrez les disponibilités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par véhicule, lieu..."
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

        {/* Liste des disponibilités */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des disponibilités</CardTitle>
            <CardDescription>
              {availability.length} disponibilité{availability.length > 1 ? "s" : ""} affichée{availability.length > 1 ? "s" : ""}
              {totalCount > availability.length && ` sur ${totalCount} au total`}
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
                      <TableHead>Agence</TableHead>
                      <TableHead>Point de location</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Début</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Prix/jour</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availability.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-3">
                            <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
                            <div className="text-muted-foreground">
                              {searchTerm
                                ? "Aucune disponibilité ne correspond aux critères de recherche"
                                : "Aucune disponibilité trouvée"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      availability.map((item) => {
                        const carInfo = item.car_info || item.car_model
                        const locationName = item.location_name
                        const locationCity = (item as any)?.location_city
                        const companyName = (item as any)?.company_name
                        const isAvailable = item.is_available !== undefined ? item.is_available : (item as any)?.available
                        const startDate = new Date(item.start_date)
                        const endDate = new Date(item.end_date)
                        const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                        const carId = typeof item.car === 'string' ? item.car : (item.car as any)?.id
                        
                        return (
                          <TableRow key={item.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <CarIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    {carInfo || "-"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {companyName ? (
                                <div className="flex items-center space-x-1">
                                  <Building2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{companyName}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{locationName || "-"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {locationCity ? (
                                <Badge variant="outline" className="text-xs">
                                  {locationCity}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(item.start_date)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(item.end_date)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {durationDays}j
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {item.price_per_day ? (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                                  <span className="font-semibold">
                                    {item.price_per_day} {item.currency || 'EUR'}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isAvailable ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Disponible
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Indisponible</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Link href={`/travel-products/car-rentals/availability/view/${item.id}`}>
                                  <Button variant="ghost" size="icon" title="Voir">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/travel-products/car-rentals/availability/edit/${item.id}`}>
                                  <Button variant="ghost" size="icon" title="Modifier">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/travel-products/car-rentals/availability/delete/${item.id}`}>
                                  <Button variant="ghost" size="icon" title="Supprimer">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && availability.length > 0 && totalPages > 1 && (
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

