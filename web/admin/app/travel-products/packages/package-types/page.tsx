"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react"
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
import { AdminLayout } from "@/components/layout/admin-layout"
import { packageTypesService } from "@/lib/services/packages"
import { PackageType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function PackageTypesPage() {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchPackageTypes = async () => {
    try {
      setIsLoading(true)
      const data = await packageTypesService.getAll(1, searchTerm || undefined)
      setPackageTypes(data.results || [])
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

  useEffect(() => {
    fetchPackageTypes()
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
            <Link href="/travel-products/packages">
              <Button variant="ghost" className="mb-4">
                ← Retour aux forfaits
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Types de forfaits</h1>
            <p className="text-muted-foreground">
              Gestion des types de forfaits
            </p>
          </div>
          <Link href="/travel-products/packages/package-types/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau type
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des types</CardTitle>
            <CardDescription>
              Recherchez et gérez les types de forfaits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom..."
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
                    <TableHead>Description</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageTypes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucun type trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    packageTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{type.description || "-"}</TableCell>
                        <TableCell>{formatDateTime(type.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/packages/package-types/view/${type.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/package-types/edit/${type.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/packages/package-types/delete/${type.id}`}>
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

