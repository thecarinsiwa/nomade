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
  Plane,
  Calendar,
  Clock,
  MapPin,
  Filter,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
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
import { flightsService, airlinesService, airportsService } from "@/lib/services/flights"
import { Flight, Airline, Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, formatDate } from "@/lib/utils"
import Link from "next/link"

interface FlightStats {
  total: number
  scheduled: number
  delayed: number
  cancelled: number
  completed: number
  todayFlights: number
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [airports, setAirports] = useState<Airport[]>([])
  const [stats, setStats] = useState<FlightStats>({
    total: 0,
    scheduled: 0,
    delayed: 0,
    cancelled: 0,
    completed: 0,
    todayFlights: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [airlineFilter, setAirlineFilter] = useState<string>("all")
  const [departureAirportFilter, setDepartureAirportFilter] = useState<string>("all")
  const [arrivalAirportFilter, setArrivalAirportFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [flightsData, airlinesData, airportsData] = await Promise.all([
          flightsService.getAll(currentPage, searchTerm || undefined),
          airlinesService.getAll(1),
          airportsService.getAll(1),
        ])

        const flightsList = flightsData.results || []
        setFlights(flightsList)
        setAirlines(airlinesData.results || [])
        setAirports(airportsData.results || [])

        // Gestion de la pagination
        const total = flightsData.count || 0
        setTotalCount(total)
        const pageSize = flightsList.length || 1
        setTotalPages(Math.ceil(total / pageSize) || 1)

        // Calculer les statistiques sur les vols de la page actuelle
        const scheduled = flightsList.filter((f) => f.status === "scheduled").length
        const delayed = flightsList.filter((f) => f.status === "delayed").length
        const cancelled = flightsList.filter((f) => f.status === "cancelled").length
        const completed = flightsList.filter((f) => f.status === "completed").length

        // Vols du jour - utiliser created_at si departure_time n'est pas disponible
        const today = new Date().toISOString().split("T")[0]
        const todayFlights = flightsList.filter((f) => {
          if (f.departure_time) {
            try {
              const flightDate = new Date(f.departure_time).toISOString().split("T")[0]
              return flightDate === today
            } catch {
              return false
            }
          }
          // Si pas de departure_time, utiliser created_at
          if (f.created_at) {
            try {
              const createdDate = new Date(f.created_at).toISOString().split("T")[0]
              return createdDate === today
            } catch {
              return false
            }
          }
          return false
        }).length

        setStats({
          total,
          scheduled,
          delayed,
          cancelled,
          completed,
          todayFlights,
        })
      } catch (error) {
        console.error("Error fetching flights:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger les vols",
          variant: "destructive",
        })
        // Réinitialiser les données en cas d'erreur
        setFlights([])
        setStats({
          total: 0,
          scheduled: 0,
          delayed: 0,
          cancelled: 0,
          completed: 0,
          todayFlights: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, currentPage, toast])

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default" as const,
      delayed: "warning" as const,
      cancelled: "destructive" as const,
      completed: "success" as const,
    }
    const labels: Record<string, string> = {
      scheduled: "Programmé",
      delayed: "Retardé",
      cancelled: "Annulé",
      completed: "Terminé",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  // Filtrer les vols
  const filteredFlights = flights.filter((flight) => {
    if (statusFilter !== "all" && flight.status !== statusFilter) return false
    if (airlineFilter !== "all" && flight.airline !== airlineFilter) return false
    if (departureAirportFilter !== "all" && flight.departure_airport !== departureAirportFilter)
      return false
    if (arrivalAirportFilter !== "all" && flight.arrival_airport !== arrivalAirportFilter)
      return false
    return true
  })

  const hasActiveFilters =
    statusFilter !== "all" ||
    airlineFilter !== "all" ||
    departureAirportFilter !== "all" ||
    arrivalAirportFilter !== "all"

  const clearFilters = () => {
    setStatusFilter("all")
    setAirlineFilter("all")
    setDepartureAirportFilter("all")
    setArrivalAirportFilter("all")
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins > 0 ? `${mins}min` : ""}`
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Programmés",
      value: stats.scheduled,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Aujourd'hui",
      value: stats.todayFlights,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Retardés",
      value: stats.delayed,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
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
            <h1 className="text-3xl font-bold">Vols</h1>
            <p className="text-muted-foreground">
              Gestion des vols et compagnies aériennes
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/flights/airlines">
              <Button variant="outline">
                Compagnies
              </Button>
            </Link>
            <Link href="/travel-products/flights/airports">
              <Button variant="outline">
                Aéroports
              </Button>
            </Link>
            <Link href="/travel-products/flights/flight-classes">
              <Button variant="outline">
                Classes
              </Button>
            </Link>
            <Link href="/travel-products/flights/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau vol
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
              Recherchez et filtrez les vols
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro de vol, compagnie, aéroport..."
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
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="scheduled">Programmé</SelectItem>
                      <SelectItem value="delayed">Retardé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Compagnie</label>
                  <Select value={airlineFilter} onValueChange={setAirlineFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les compagnies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les compagnies</SelectItem>
                      {airlines.map((airline) => (
                        <SelectItem key={airline.id} value={airline.id}>
                          {airline.name} ({airline.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aéroport départ</label>
                  <Select value={departureAirportFilter} onValueChange={setDepartureAirportFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les aéroports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les aéroports</SelectItem>
                      {airports.map((airport) => (
                        <SelectItem key={airport.id} value={airport.id}>
                          {airport.iata_code} - {airport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aéroport arrivée</label>
                  <Select value={arrivalAirportFilter} onValueChange={setArrivalAirportFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les aéroports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les aéroports</SelectItem>
                      {airports.map((airport) => (
                        <SelectItem key={airport.id} value={airport.id}>
                          {airport.iata_code} - {airport.name}
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
                    {filteredFlights.length} résultat{filteredFlights.length > 1 ? "s" : ""} trouvé{filteredFlights.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des vols */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des vols</CardTitle>
            <CardDescription>
              {filteredFlights.length} vol{filteredFlights.length > 1 ? "s" : ""} affiché{filteredFlights.length > 1 ? "s" : ""}
              {totalCount > filteredFlights.length && ` sur ${totalCount} au total`}
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
                      <TableHead>Numéro de vol</TableHead>
                      <TableHead>Compagnie</TableHead>
                      <TableHead>Départ</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlights.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {hasActiveFilters
                            ? "Aucun vol ne correspond aux filtres"
                            : "Aucun vol trouvé"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFlights.map((flight) => (
                        <TableRow key={flight.id}>
                          <TableCell className="font-medium font-mono">
                            {flight.flight_number}
                          </TableCell>
                          <TableCell>
                            {flight.airline_name ? (
                              <Badge variant="outline">{flight.airline_name}</Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">
                                  {flight.departure_airport_name || "-"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <div>
                                <div className="font-medium text-sm">
                                  {flight.arrival_airport_name || "-"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {flight.departure_time ? (
                              <div className="text-sm">
                                <div className="font-medium">
                                  {formatDate(flight.departure_time)}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {new Date(flight.departure_time).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                <div className="font-medium">
                                  {formatDate(flight.created_at)}
                                </div>
                                <div className="text-xs">Créé le</div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {flight.duration_minutes ? (
                              <div className="flex items-center space-x-1 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{formatDuration(flight.duration_minutes)}</span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(flight.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/flights/view/${flight.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/edit/${flight.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/delete/${flight.id}`}>
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
            {!isLoading && filteredFlights.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages} ({totalCount} vol{totalCount > 1 ? "s" : ""} au total)
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
