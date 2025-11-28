"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Ship } from "lucide-react"
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
import { cruisesService } from "@/lib/services/cruises"
import { Cruise } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CruisesPage() {
  const [cruises, setCruises] = useState<Cruise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchCruises = async () => {
    try {
      setIsLoading(true)
      const data = await cruisesService.getAll(1, searchTerm || undefined)
      setCruises(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les croisières",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCruises()
  }, [searchTerm])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      scheduled: "default",
      in_progress: "success",
      completed: "secondary",
      cancelled: "destructive",
    }
    const labels: Record<string, string> = {
      scheduled: "Programmée",
      in_progress: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
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
            <h1 className="text-3xl font-bold">Croisières</h1>
            <p className="text-muted-foreground">
              Gestion des croisières et navires
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/cruises/cruise-lines">
              <Button variant="outline">
                Compagnies
              </Button>
            </Link>
            <Link href="/travel-products/cruises/cruise-ships">
              <Button variant="outline">
                Navires
              </Button>
            </Link>
            <Link href="/travel-products/cruises/cruise-ports">
              <Button variant="outline">
                Ports
              </Button>
            </Link>
            <Link href="/travel-products/cruises/cabins">
              <Button variant="outline">
                Cabines
              </Button>
            </Link>
            <Link href="/travel-products/cruises/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle croisière
              </Button>
            </Link>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des croisières</CardTitle>
            <CardDescription>
              Recherchez et gérez les croisières
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, compagnie..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Compagnie</TableHead>
                    <TableHead>Navire</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Arrivée</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cruises.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Aucune croisière trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    cruises.map((cruise) => (
                      <TableRow key={cruise.id}>
                        <TableCell className="font-medium">{cruise.name}</TableCell>
                        <TableCell>{cruise.cruise_line_name || "-"}</TableCell>
                        <TableCell>{cruise.ship_name || "-"}</TableCell>
                        <TableCell>{formatDate(cruise.departure_date)}</TableCell>
                        <TableCell>{formatDate(cruise.arrival_date)}</TableCell>
                        <TableCell>{cruise.duration_days ? `${cruise.duration_days} jours` : "-"}</TableCell>
                        <TableCell>{getStatusBadge(cruise.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/cruises/view/${cruise.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/edit/${cruise.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/delete/${cruise.id}`}>
                              <Button variant="ghost" size="icon">
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

