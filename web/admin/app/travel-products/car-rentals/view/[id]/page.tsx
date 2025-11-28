"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Car as CarIcon,
  Building2,
  Tag,
  Calendar,
  Settings,
  Fuel,
  Users,
  Luggage,
  TrendingUp,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Wrench,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CarImageGallery } from "@/components/car-rentals/car-image-gallery"
import { carsService } from "@/lib/services/car-rentals"
import { Car, CarAvailability } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function ViewCarPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const carId = params.id as string

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setIsLoading(true)
        const data = await carsService.getById(carId)
        setCar(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le véhicule",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals")
      } finally {
        setIsLoading(false)
      }
    }

    if (carId) {
      fetchCar()
    }
  }, [carId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!car) {
    return null
  }

  // Extraire les données des objets imbriqués
  const company = typeof car.company === 'object' ? car.company : null
  const category = typeof car.category === 'object' ? car.category : null
  const availabilities = (car as any).availabilities || []

  // Calculer les statistiques
  const totalAvailabilities = availabilities.length
  const availableCount = availabilities.filter((a: CarAvailability) => {
    const isAvailable = a.is_available !== undefined ? a.is_available : a.available
    return isAvailable
  }).length
  const avgPrice = availabilities.length > 0
    ? availabilities
        .filter((a: CarAvailability) => a.price_per_day && a.price_per_day > 0)
        .reduce((sum: number, a: CarAvailability) => sum + Number(a.price_per_day || 0), 0) / 
        availabilities.filter((a: CarAvailability) => a.price_per_day && a.price_per_day > 0).length
    : 0

  const getStatusBadge = (status?: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      available: "default",
      rented: "outline",
      maintenance: "destructive",
    }
    const labels: Record<string, string> = {
      available: "Disponible",
      rented: "Louée",
      maintenance: "En maintenance",
    }
    return (
      <Badge variant={variants[status || 'available'] || "secondary"}>
        {labels[status || 'available'] || status}
      </Badge>
    )
  }

  const getFuelTypeLabel = (fuelType: string) => {
    const labels: Record<string, string> = {
      petrol: "Essence",
      gasoline: "Essence",
      diesel: "Diesel",
      electric: "Électrique",
      hybrid: "Hybride",
    }
    return labels[fuelType] || fuelType
  }

  const getTransmissionLabel = (transmission: string) => {
    return transmission === "automatic" ? "Automatique" : "Manuelle"
  }

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
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <CarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {car.make} {car.model}
                  {car.year && ` (${car.year})`}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Détails du véhicule
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/travel-products/car-rentals/edit/${car.id}`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </Link>
            <Link href={`/travel-products/car-rentals/delete/${car.id}`}>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibilités</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAvailabilities}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Périodes configurées
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Périodes actives
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgPrice > 0 ? `${avgPrice.toFixed(2)} €` : "-"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Par jour
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut</CardTitle>
                {car.status === 'available' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : car.status === 'rented' ? (
                  <XCircle className="h-4 w-4 text-orange-600" />
                ) : (
                  <Wrench className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {getStatusBadge(car.status)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations du véhicule */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CarIcon className="mr-2 h-5 w-5" />
                  Informations de base
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Marque</p>
                  <p className="font-semibold text-lg">{car.make || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Modèle</p>
                  <p className="font-semibold text-lg">{car.model || "-"}</p>
                </div>
                {car.year && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Année</p>
                    <p className="font-semibold">{car.year}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Statut</p>
                  <div>{getStatusBadge(car.status)}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Caractéristiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transmission</p>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{getTransmissionLabel(car.transmission)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type de carburant</p>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{getFuelTypeLabel(car.fuel_type)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre de places</p>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="font-semibold">{car.seats}</p>
                  </div>
                </div>
                {car.luggage_capacity && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Capacité bagages</p>
                    <div className="flex items-center space-x-2">
                      <Luggage className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{car.luggage_capacity} valises</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Agence et catégorie */}
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Agence de location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nom</p>
                  <p className="font-semibold">
                    {company?.name || car.company_name || "-"}
                  </p>
                </div>
                {company?.code && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Code</p>
                    <Badge variant="outline" className="font-mono">
                      {company.code}
                    </Badge>
                  </div>
                )}
                {typeof car.company === 'string' && (
                  <Link href={`/travel-products/car-rentals/companies/view/${car.company}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Voir l'agence →
                    </Button>
                  </Link>
                )}
                {company?.id && (
                  <Link href={`/travel-products/car-rentals/companies/view/${company.id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Voir l'agence →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Catégorie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nom</p>
                  <p className="font-semibold">
                    {category?.name || car.category_name || "-"}
                  </p>
                </div>
                {category?.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{category.description}</p>
                  </div>
                )}
                {typeof car.category === 'string' && (
                  <Link href={`/travel-products/car-rentals/categories/view/${car.category}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Voir la catégorie →
                    </Button>
                  </Link>
                )}
                {category?.id && (
                  <Link href={`/travel-products/car-rentals/categories/view/${category.id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Voir la catégorie →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Disponibilités */}
        {availabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Disponibilités
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {availabilities.length} période{availabilities.length > 1 ? "s" : ""} configurée{availabilities.length > 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <Link href={`/travel-products/car-rentals/availability/add?car=${car.id}`}>
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ajouter une disponibilité
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Point de location</TableHead>
                        <TableHead>Date de début</TableHead>
                        <TableHead>Date de fin</TableHead>
                        <TableHead>Prix/jour</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availabilities.map((availability: CarAvailability) => {
                        const isAvailable = availability.is_available !== undefined 
                          ? availability.is_available 
                          : availability.available
                        return (
                          <TableRow key={availability.id}>
                            <TableCell className="font-medium">
                              {availability.location_name || typeof availability.location === 'string' 
                                ? availability.location 
                                : (availability.location as any)?.name || "-"}
                              {availability.location_city && (
                                <span className="text-muted-foreground text-sm ml-2">
                                  ({availability.location_city})
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(availability.start_date)}</TableCell>
                            <TableCell>{formatDate(availability.end_date)}</TableCell>
                            <TableCell>
                              {availability.price_per_day 
                                ? `${availability.price_per_day} ${availability.currency || 'EUR'}` 
                                : "-"}
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
                                <Link href={`/travel-products/car-rentals/availability/view/${availability.id}`}>
                                  <Button variant="ghost" size="icon" title="Voir">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/travel-products/car-rentals/availability/edit/${availability.id}`}>
                                  <Button variant="ghost" size="icon" title="Modifier">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Images du véhicule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <CarImageGallery carId={carId} readonly={false} />
        </motion.div>

        {/* Informations système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informations système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                  <p className="font-medium">{formatDateTime(car.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dernière modification</p>
                  <p className="font-medium">{formatDateTime(car.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

