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
import { packagesService } from "@/lib/services/packages"
import { Package as PackageType } from '@/types'
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const data = await packagesService.getAll(1, searchTerm || undefined)
      setPackages(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les forfaits",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
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
            <h1 className="text-3xl font-bold">Forfaits</h1>
            <p className="text-muted-foreground">
              Gestion des forfaits combinés
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/travel-products/packages/package-types">
              <Button variant="outline">
                Types
              </Button>
            </Link>
            <Link href="/travel-products/packages/components">
              <Button variant="outline">
                Composants
              </Button>
            </Link>
            <Link href="/travel-products/packages/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau forfait
              </Button>
            </Link>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des forfaits</CardTitle>
            <CardDescription>
              Recherchez et gérez les forfaits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, type..."
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
                    <TableHead>Type</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun forfait trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>{pkg.package_type_name || "-"}</TableCell>
                        <TableCell>
                          {pkg.discount_percent ? (
                            <Badge variant="success">{pkg.discount_percent}%</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {pkg.start_date && pkg.end_date 
                            ? `${formatDate(pkg.start_date)} - ${formatDate(pkg.end_date)}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {pkg.status === 'active' ? (
                            <Badge variant="success">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(pkg.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/packages/view/${pkg.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/edit/${pkg.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/delete/${pkg.id}`}>
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

