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
  Bed,
  Building,
  Users,
  Ruler,
  Filter,
  X,
  CheckCircle,
  XCircle,
  Wrench,
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
import { roomsService, propertiesService, roomTypesService } from "@/lib/services/accommodations"
import { Room, Property, RoomType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface RoomStats {
  total: number
  available: number
  unavailable: number
  maintenance: number
  averageCapacity: number
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [stats, setStats] = useState<RoomStats>({
    total: 0,
    available: 0,
    unavailable: 0,
    maintenance: 0,
    averageCapacity: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [roomsData, propertiesData, roomTypesData] = await Promise.all([
          roomsService.getAll(1, searchTerm || undefined),
          propertiesService.getAll(1),
          roomTypesService.getAll(1),
        ])

        const roomsList = roomsData.results || []
        setRooms(roomsList)
        setProperties(propertiesData.results || [])
        setRoomTypes(roomTypesData.results || [])

        // Calculer les statistiques
        const total = roomsData.count || roomsList.length
        const available = roomsList.filter((r) => r.status === "available").length
        const unavailable = roomsList.filter((r) => r.status === "unavailable").length
        const maintenance = roomsList.filter((r) => r.status === "maintenance").length

        const capacities = roomsList
          .map((r) => r.max_guests || r.capacity)
          .filter((c) => c !== undefined && c !== null) as number[]
        const averageCapacity =
          capacities.length > 0
            ? Math.round(
                (capacities.reduce((sum, c) => sum + c, 0) / capacities.length) * 10
              ) / 10
            : 0

        setStats({
          total,
          available,
          unavailable,
          maintenance,
          averageCapacity,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les chambres",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, toast])

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">-</Badge>
    
    const variants = {
      available: "success" as const,
      unavailable: "secondary" as const,
      maintenance: "warning" as const,
    }
    const labels: Record<string, string> = {
      available: "Disponible",
      unavailable: "Indisponible",
      maintenance: "En maintenance",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  // Filtrer les chambres
  const filteredRooms = rooms.filter((room) => {
    if (statusFilter !== "all" && room.status !== statusFilter) return false
    if (propertyFilter !== "all" && room.property !== propertyFilter) return false
    if (roomTypeFilter !== "all" && room.room_type !== roomTypeFilter) return false
    return true
  })

  const hasActiveFilters =
    statusFilter !== "all" || propertyFilter !== "all" || roomTypeFilter !== "all"

  const clearFilters = () => {
    setStatusFilter("all")
    setPropertyFilter("all")
    setRoomTypeFilter("all")
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Bed,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Disponibles",
      value: stats.available,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Indisponibles",
      value: stats.unavailable,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Capacité moyenne",
      value: stats.averageCapacity > 0 ? stats.averageCapacity.toFixed(1) : "-",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
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
            <Link href="/travel-products/accommodations">
              <Button variant="ghost" className="mb-4">
                ← Retour aux hébergements
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Chambres</h1>
            <p className="text-muted-foreground">
              Gestion des chambres et suites
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/accommodations/room-types">
              <Button variant="outline">
                Types de chambres
              </Button>
            </Link>
            <Link href="/travel-products/accommodations/rooms/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle chambre
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
              Recherchez et filtrez les chambres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par propriété, nom, numéro..."
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
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="unavailable">Indisponible</SelectItem>
                      <SelectItem value="maintenance">En maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Propriété</label>
                  <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les propriétés" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les propriétés</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de chambre</label>
                  <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {roomTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
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
                    {filteredRooms.length} résultat{filteredRooms.length > 1 ? "s" : ""} trouvé{filteredRooms.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des chambres */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des chambres</CardTitle>
            <CardDescription>
              {filteredRooms.length} chambre{filteredRooms.length > 1 ? "s" : ""} affichée{filteredRooms.length > 1 ? "s" : ""}
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
                      <TableHead>Propriété</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Nom/Numéro</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Type de lit</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {hasActiveFilters
                            ? "Aucune chambre ne correspond aux filtres"
                            : "Aucune chambre trouvée"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{room.property_name || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {room.room_type_name ? (
                              <Badge variant="outline">{room.room_type_name}</Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {room.name || room.room_number || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{room.max_guests || room.capacity || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {room.size_sqm ? (
                              <div className="flex items-center space-x-1">
                                <Ruler className="h-3 w-3 text-muted-foreground" />
                                <span>{room.size_sqm} m²</span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {room.bed_type ? (
                              <div className="flex items-center space-x-1">
                                <Bed className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{room.bed_type}</span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(room.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/travel-products/accommodations/rooms/view/${room.id}`}>
                                <Button variant="ghost" size="icon" title="Voir">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/accommodations/rooms/edit/${room.id}`}>
                                <Button variant="ghost" size="icon" title="Modifier">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/travel-products/accommodations/rooms/delete/${room.id}`}>
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
