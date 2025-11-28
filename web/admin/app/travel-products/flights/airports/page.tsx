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
  MapPin,
  Globe,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
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
import { airportsService } from "@/lib/services/flights"
import { Airport } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface AirportStats {
  total: number
  withCoordinates: number
  withTimezone: number
  totalFlights: number
}

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [stats, setStats] = useState<AirportStats>({
    total: 0,
    withCoordinates: 0,
    withTimezone: 0,
    totalFlights: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setIsLoading(true)
        const data = await airportsService.getAll(1, searchTerm || undefined)
        const airportsList = data.results || []
        setAirports(airportsList)

        // Calculer les statistiques
        const total = data.count || airportsList.length
        const withCoordinates = airportsList.filter(
          (a) => a.latitude && a.longitude
        ).length
        const withTimezone = airportsList.filter((a) => a.timezone).length
        const totalFlights =
          airportsList.reduce(
            (sum, a) =>
              sum +
              (a.departure_flights_count || 0) +
              (a.arrival_flights_count || 0),
            0
          ) / 2 // Diviser par 2 car chaque vol compte pour départ et arrivée

        setStats({
          total,
          withCoordinates,
          withTimezone,
          totalFlights: Math.round(totalFlights),
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les aéroports",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAirports()
  }, [searchTerm, toast])

  // Extraire les pays et villes uniques pour les filtres
  const uniqueCountries = Array.from(
    new Set(airports.map((a) => a.country).filter(Boolean))
  ).sort()
  const uniqueCities = Array.from(
    new Set(airports.map((a) => a.city).filter(Boolean))
  ).sort()

  // Filtrer les aéroports
  const filteredAirports = airports.filter((airport) => {
    if (countryFilter !== "all" && airport.country !== countryFilter) return false
    if (cityFilter !== "all" && airport.city !== cityFilter) return false
    return true
  })

  const hasActiveFilters = countryFilter !== "all" || cityFilter !== "all"

  const clearFilters = () => {
    setCountryFilter("all")
    setCityFilter("all")
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
      title: "Avec coordonnées",
      value: stats.withCoordinates,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avec fuseau horaire",
      value: stats.withTimezone,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Vols totaux",
      value: stats.totalFlights,
      icon: TrendingUp,
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
            <Link href="/travel-products/flights">
              <Button variant="ghost" className="mb-4">
                ← Retour aux vols
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Aéroports</h1>
            <p className="text-muted-foreground">
              Gestion des aéroports
            </p>
          </div>
          <Link href="/travel-products/flights/airports/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel aéroport
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
              Recherchez et filtrez les aéroports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code IATA, ICAO, nom, ville, pays..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                      {uniqueCountries.map((country) => (
                        <SelectItem key={country} value={country || ""}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ville</label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city || ""}>
                          {city}
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
                    {filteredAirports.length} résultat{filteredAirports.length > 1 ? "s" : ""} trouvé{filteredAirports.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des aéroports */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des aéroports</CardTitle>
            <CardDescription>
              {filteredAirports.length} aéroport{filteredAirports.length > 1 ? "s" : ""} affiché{filteredAirports.length > 1 ? "s" : ""}
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
                      <TableHead>Code IATA</TableHead>
                      <TableHead>Code ICAO</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Vols</TableHead>
                      <TableHead>Fuseau horaire</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAirports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {hasActiveFilters
                            ? "Aucun aéroport ne correspond aux filtres"
                            : "Aucun aéroport trouvé"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAirports.map((airport) => (
                        <TableRow key={airport.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Plane className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono font-medium">{airport.iata_code}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {airport.icao_code ? (
                              <span className="font-mono text-sm">{airport.icao_code}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{airport.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {airport.city || ""}
                                {airport.city && airport.country ? ", " : ""}
                                {airport.country || ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(airport.departure_flights_count || 0) > 0 ||
                            (airport.arrival_flights_count || 0) > 0 ? (
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {airport.departure_flights_count || 0}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                  {airport.arrival_flights_count || 0}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Aucun</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {airport.timezone ? (
                              <div className="flex items-center space-x-1 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{airport.timezone}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/flights/airports/view/${airport.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/airports/edit/${airport.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/flights/airports/delete/${airport.id}`}>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
