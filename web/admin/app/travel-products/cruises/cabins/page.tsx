"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Bed, ArrowLeft, Users, DollarSign, CheckCircle2, XCircle, Layers } from "lucide-react"
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
import { cruiseCabinsService } from "@/lib/services/cruises"
import { CruiseCabin } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CruiseCabinsPage() {
  const [cabins, setCabins] = useState<CruiseCabin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchCabins = async () => {
    try {
      setIsLoading(true)
      const data = await cruiseCabinsService.getAll(1, searchTerm || undefined)
      setCabins(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les cabines",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCabins()
  }, [searchTerm])

  // Calcul des statistiques
  const stats = {
    total: cabins.length,
    available: cabins.filter(c => c.is_available).length,
    unavailable: cabins.filter(c => !c.is_available).length,
    averagePrice: cabins.length > 0
      ? Math.round(cabins.reduce((sum, c) => sum + (c.price || 0), 0) / cabins.length)
      : 0,
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header avec icône */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/travel-products/cruises">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux croisières
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <Bed className="h-8 w-8 text-teal-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Cabines</h1>
              <p className="text-muted-foreground">
                Gérez les cabines individuelles et leurs disponibilités
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/travel-products/cruises/cabin-types">
                <Button variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  Types de cabines
                </Button>
              </Link>
              <Link href="/travel-products/cruises/cabins/add">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle cabine
                </Button>
              </Link>
            </div>
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
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Bed className="h-4 w-4 text-teal-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cabines enregistrées
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
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.available}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cabines libres
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
                <CardTitle className="text-sm font-medium">Indisponibles</CardTitle>
                <div className="bg-red-100 p-2 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unavailable}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cabines occupées
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
                <CardTitle className="text-sm font-medium">Prix moyen</CardTitle>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <DollarSign className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averagePrice} €</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Par cabine
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Liste des cabines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bed className="h-5 w-5" />
                    <span>Liste des cabines</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Recherchez et gérez vos cabines ({cabins.length} résultat{cabins.length > 1 ? 's' : ''})
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par croisière, numéro..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Croisière</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Numéro</TableHead>
                        <TableHead className="font-semibold">Capacité</TableHead>
                        <TableHead className="font-semibold">Prix</TableHead>
                        <TableHead className="font-semibold">Disponible</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cabins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Bed className="h-12 w-12 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground font-medium">Aucune cabine trouvée</p>
                              <p className="text-sm text-muted-foreground">
                                {searchTerm ? "Essayez une autre recherche" : "Commencez par ajouter une cabine"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        cabins.map((cabin, index) => (
                          <motion.div
                            key={cabin.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TableRow className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">{cabin.cruise_name || "-"}</TableCell>
                              <TableCell>
                                {cabin.cabin_type_name ? (
                                  <Badge variant="outline">{cabin.cabin_type_name}</Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-mono">
                                  {cabin.cabin_number}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <span>{cabin.capacity}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                                  <span>{cabin.price} €</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {cabin.is_available ? (
                                  <Badge variant="default" className="bg-green-500">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Disponible
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Indisponible
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Link href={`/travel-products/cruises/cabins/view/${cabin.id}`}>
                                    <Button variant="ghost" size="icon" title="Voir">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/travel-products/cruises/cabins/edit/${cabin.id}`}>
                                    <Button variant="ghost" size="icon" title="Modifier">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/travel-products/cruises/cabins/delete/${cabin.id}`}>
                                    <Button variant="ghost" size="icon" title="Supprimer" className="text-destructive hover:text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          </motion.div>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

