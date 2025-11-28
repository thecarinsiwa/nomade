"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Loader2, MapPin } from "lucide-react"
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
import { addressesService } from "@/lib/services/addresses"
import { UserAddress } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const data = await addressesService.getAllAddresses(1, searchTerm || undefined)
      setAddresses(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les adresses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [searchTerm])

  const getAddressTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      billing: "Facturation",
      shipping: "Livraison",
      home: "Domicile",
      work: "Travail",
      other: "Autre",
    }
    return labels[type] || type
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
            <h1 className="text-3xl font-bold">Adresses Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gestion des adresses et coordonnées des utilisateurs
            </p>
          </div>
          <Link href="/users/addresses/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle adresse
            </Button>
          </Link>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des adresses</CardTitle>
            <CardDescription>
              Recherchez et gérez les adresses utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email, ville..."
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
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Par défaut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addresses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucune adresse trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    addresses.map((address) => (
                      <TableRow key={address.id}>
                        <TableCell className="font-medium">{address.user_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getAddressTypeLabel(address.address_type)}</Badge>
                        </TableCell>
                        <TableCell>
                          {address.street && `${address.street}, `}
                          {address.postal_code && `${address.postal_code} `}
                          {address.city && `${address.city}, `}
                          {address.country || "-"}
                        </TableCell>
                        <TableCell>
                          {address.is_default ? (
                            <Badge variant="default">Oui</Badge>
                          ) : (
                            <Badge variant="secondary">Non</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(address.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link href={`/users/addresses/view/${address.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/users/addresses/edit/${address.id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/users/addresses/delete/${address.id}`}>
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

