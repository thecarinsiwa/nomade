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
  FileText,
  Calendar,
  Tag,
  ArrowLeft,
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
import { propertyTypesService, propertiesService } from "@/lib/services/accommodations"
import { PropertyType, Property } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface PropertyTypeStats {
  total: number
  withDescription: number
  withoutDescription: number
  totalProperties: number
}

export default function PropertyTypesPage() {
  const [types, setTypes] = useState<PropertyType[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<PropertyTypeStats>({
    total: 0,
    withDescription: 0,
    withoutDescription: 0,
    totalProperties: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [typesData, propertiesData] = await Promise.all([
          propertyTypesService.getAll(1, searchTerm || undefined),
          propertiesService.getAll(1),
        ])

        const typesList = typesData.results || []
        const propertiesList = propertiesData.results || []
        setTypes(typesList)
        setProperties(propertiesList)

        // Calculer les statistiques
        const total = typesData.count || typesList.length
        const withDescription = typesList.filter((t) => t.description && t.description.trim() !== "").length
        const withoutDescription = total - withDescription

        setStats({
          total,
          withDescription,
          withoutDescription,
          totalProperties: propertiesData.count || propertiesList.length,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les types",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, toast])

  // Compter le nombre de propriétés par type
  const getPropertyCountForType = (typeId: string) => {
    return properties.filter((p) => p.property_type === typeId).length
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
      title: "Avec description",
      value: stats.withDescription,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sans description",
      value: stats.withoutDescription,
      icon: Tag,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Propriétés totales",
      value: stats.totalProperties,
      icon: Building2,
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
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux hébergements
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Types de propriétés</h1>
            <p className="text-muted-foreground">
              Gestion des types de propriétés (hôtel, appartement, villa, etc.)
            </p>
          </div>
          <Link href="/travel-products/accommodations/property-types/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
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

        {/* Liste des types */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des types</CardTitle>
            <CardDescription>
              Recherchez et gérez les types de propriétés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Propriétés</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {types.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun type trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      types.map((type) => {
                        const propertyCount = getPropertyCountForType(type.id)
                        return (
                          <TableRow key={type.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{type.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {type.description ? (
                                <div className="max-w-md">
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {type.description}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {propertyCount > 0 ? (
                                <Badge variant="outline" className="font-medium">
                                  {propertyCount} propriété{propertyCount > 1 ? "s" : ""}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Aucune</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDateTime(type.created_at)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Link href={`/travel-products/accommodations/property-types/view/${type.id}`}>
                                  <Button variant="ghost" size="icon" title="Voir">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/travel-products/accommodations/property-types/edit/${type.id}`}>
                                  <Button variant="ghost" size="icon" title="Modifier">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/travel-products/accommodations/property-types/delete/${type.id}`}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Supprimer"
                                    disabled={propertyCount > 0}
                                  >
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
