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
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseLinesService } from "@/lib/services/cruises"
import { CruiseLine } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function CruiseLinesPage() {
  const [cruiseLines, setCruiseLines] = useState<CruiseLine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchCruiseLines = async () => {
    try {
      setIsLoading(true)
      const data = await cruiseLinesService.getAll(1, searchTerm || undefined)
      setCruiseLines(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les compagnies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCruiseLines()
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
            <h1 className="text-3xl font-bold">Compagnies de croisières</h1>
            <p className="text-muted-foreground">
              Gestion des compagnies de croisières
            </p>
          </div>
          <Link href="/travel-products/cruises/cruise-lines/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle compagnie
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des compagnies</CardTitle>
            <CardDescription>
              Recherchez et gérez les compagnies de croisières
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
                  {cruiseLines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Aucune compagnie trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    cruiseLines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-medium">{line.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{line.description || "-"}</TableCell>
                        <TableCell>{formatDateTime(line.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/travel-products/cruises/cruise-lines/view/${line.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/cruise-lines/edit/${line.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/travel-products/cruises/cruise-lines/delete/${line.id}`}>
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

