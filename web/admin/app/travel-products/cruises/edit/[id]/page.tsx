"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CruiseForm } from "@/components/cruises/cruise-form"
import { cruisesService } from "@/lib/services/cruises"
import { Cruise } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCruisePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruise, setCruise] = useState<Cruise | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruiseId = params.id as string

  useEffect(() => {
    const fetchCruise = async () => {
      try {
        setIsLoading(true)
        const data = await cruisesService.getById(cruiseId)
        setCruise(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la croisière",
          variant: "destructive",
        })
        router.push("/travel-products/cruises")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruiseId) {
      fetchCruise()
    }
  }, [cruiseId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/cruises")
  }

  const handleCancel = () => {
    router.push("/travel-products/cruises")
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

  if (!cruise) {
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
          <Link href="/travel-products/cruises">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la croisière</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {cruise.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la croisière</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CruiseForm cruise={cruise} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

