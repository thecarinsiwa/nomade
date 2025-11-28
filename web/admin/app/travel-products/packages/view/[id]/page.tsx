"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { packagesService } from "@/lib/services/packages"
import { Package } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewPackagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [packageItem, setPackageItem] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const packageId = params.id as string

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setIsLoading(true)
        const data = await packagesService.getById(packageId)
        setPackageItem(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le forfait",
          variant: "destructive",
        })
        router.push("/travel-products/packages")
      } finally {
        setIsLoading(false)
      }
    }

    if (packageId) {
      fetchPackage()
    }
  }, [packageId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!packageItem) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/travel-products/packages">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/packages/edit/${packageItem.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/packages/delete/${packageItem.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails du forfait</h1>
          <p className="text-muted-foreground">
            Informations complètes de {packageItem.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du forfait</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium text-lg">{packageItem.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {packageItem.status === 'active' ? (
                  <Badge variant="success">Actif</Badge>
                ) : (
                  <Badge variant="secondary">Inactif</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{packageItem.package_type_name || "-"}</p>
              </div>
              {packageItem.discount_percent && (
                <div>
                  <p className="text-sm text-muted-foreground">Réduction</p>
                  <Badge variant="success" className="text-lg">{packageItem.discount_percent}%</Badge>
                </div>
              )}
              {packageItem.start_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">{formatDate(packageItem.start_date)}</p>
                </div>
              )}
              {packageItem.end_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{formatDate(packageItem.end_date)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(packageItem.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(packageItem.updated_at)}</p>
              </div>
              {packageItem.description && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{packageItem.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

