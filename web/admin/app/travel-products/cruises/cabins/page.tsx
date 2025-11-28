"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Bed } from "lucide-react"
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
            <Link href="/travel-products/cruises">
              <Button variant="ghost" className="mb-4">
                ← Retour aux croisières
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Cabines</h1>
            <p className="text-muted-foreground">
              Gestion des cabines individuelles
            </p>
          </div>
          <Link href="/travel-products/cruises/cabins/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle cabine
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des cabines</CardTitle>
            <CardDescription>
              Recherchez et gérez les cabines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par croisière, numéro..."
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
                    <TableHead>Croisière</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Disponible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cabins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune cabine trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    cabins.map((cabin) => (
                      <TableRow key={cabin.id}>
                        <TableCell className="font-medium">{cabin.cruise_name || "-"}</TableCell>
                        <TableCell>{cabin.cabin_type_name || "-"}</TableCell>
                        <TableCell className="font-mono">{cabin.cabin_number}</TableCell>
                        <TableCell>{cabin.capacity}</TableCell>
                        <TableCell className="font-medium">{cabin.price} €</TableCell>
                        <TableCell>
                          {cabin.is_available ? (
                            <Badge variant="success">Disponible</Badge>
                          ) : (
                            <Badge variant="secondary">Indisponible</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/cruises/cabins/view/${cabin.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/cabins/edit/${cabin.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/cabins/delete/${cabin.id}`}>
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

