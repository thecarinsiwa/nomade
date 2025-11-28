"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, Package } from "lucide-react"
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
import { packageComponentsService } from "@/lib/services/packages"
import { PackageComponent } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function PackageComponentsPage() {
  const [components, setComponents] = useState<PackageComponent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchComponents = async () => {
    try {
      setIsLoading(true)
      const data = await packageComponentsService.getAll(1, searchTerm || undefined)
      setComponents(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les composants",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComponents()
  }, [searchTerm])

  const getComponentTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary"> = {
      hotel: "default",
      flight: "secondary",
      car: "default",
      activity: "secondary",
      cruise: "default",
    }
    const labels: Record<string, string> = {
      hotel: "Hôtel",
      flight: "Vol",
      car: "Voiture",
      activity: "Activité",
      cruise: "Croisière",
    }
    return (
      <Badge variant={variants[type] || "secondary"}>
        {labels[type] || type}
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
            <Link href="/travel-products/packages">
              <Button variant="ghost" className="mb-4">
                ← Retour aux forfaits
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Composants des forfaits</h1>
            <p className="text-muted-foreground">
              Gestion des composants (hôtel, vol, voiture, activité, croisière)
            </p>
          </div>
          <Link href="/travel-products/packages/components/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau composant
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des composants</CardTitle>
            <CardDescription>
              Recherchez et gérez les composants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par forfait, type..."
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
                    <TableHead>Forfait</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>ID Composant</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun composant trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    components.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell className="font-medium">{component.package_name || "-"}</TableCell>
                        <TableCell>{getComponentTypeBadge(component.component_type)}</TableCell>
                        <TableCell className="font-mono text-sm">{component.component_id}</TableCell>
                        <TableCell>{formatDateTime(component.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/packages/components/view/${component.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/components/edit/${component.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/components/delete/${component.id}`}>
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

