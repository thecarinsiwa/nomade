"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { cruiseCabinTypesService } from "@/lib/services/cruises"
import { CruiseCabinType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DeleteCruiseCabinTypePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cabinType, setCabinType] = useState<CruiseCabinType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const cabinTypeId = params.id as string

  useEffect(() => {
    const fetchCabinType = async () => {
      try {
        setIsLoading(true)
        const data = await cruiseCabinTypesService.getById(cabinTypeId)
        setCabinType(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le type de cabine",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cabin-types")
      } finally {
        setIsLoading(false)
      }
    }

    if (cabinTypeId) {
      fetchCabinType()
    }
  }, [cabinTypeId, router, toast])

  const handleDelete = async () => {
    if (!cabinType) return

    try {
      setIsDeleting(true)
      await cruiseCabinTypesService.delete(cabinType.id)
      toast({
        title: "Succès",
        description: "Type de cabine supprimé avec succès",
      })
      router.push("/travel-products/cruises/cabin-types")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de cabine",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.push("/travel-products/cruises/cabin-types")
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!cabinType) {
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
          <Link href="/travel-products/cruises/cabin-types">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-destructive">Supprimer le type de cabine</h1>
          <p className="text-muted-foreground">
            Confirmez la suppression du type de cabine
          </p>
        </motion.div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Attention</CardTitle>
            </div>
            <CardDescription>
              Cette action est irréversible. Le type de cabine et toutes ses données associées seront définitivement supprimés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Vous êtes sur le point de supprimer :</p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="font-medium">{cabinType.name}</p>
                {cabinType.description && (
                  <p className="text-sm text-muted-foreground">
                    {cabinType.description}
                  </p>
                )}
                {cabinType.cabins_count !== undefined && cabinType.cabins_count > 0 && (
                  <p className="text-sm text-destructive">
                    ⚠️ Ce type est utilisé par {cabinType.cabins_count} cabine{cabinType.cabins_count > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

