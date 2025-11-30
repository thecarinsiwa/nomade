"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { CruisePortForm } from "@/components/cruises/cruise-port-form"
import { cruisePortsService } from "@/lib/services/cruises"
import { CruisePort } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditCruisePortPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [cruisePort, setCruisePort] = useState<CruisePort | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const cruisePortId = params.id as string

  useEffect(() => {
    const fetchCruisePort = async () => {
      try {
        setIsLoading(true)
        const data = await cruisePortsService.getById(cruisePortId)
        setCruisePort(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le port",
          variant: "destructive",
        })
        router.push("/travel-products/cruises/cruise-ports")
      } finally {
        setIsLoading(false)
      }
    }

    if (cruisePortId) {
      fetchCruisePort()
    }
  }, [cruisePortId, router, toast])

  const handleSuccess = () => {
    router.push("/travel-products/cruises/cruise-ports")
  }

  const handleCancel = () => {
    router.push("/travel-products/cruises/cruise-ports")
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

  if (!cruisePort) {
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
          <Link href="/travel-products/cruises/cruise-ports">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-cyan-100 p-2 rounded-lg">
              <Edit className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier le port</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de {cruisePort.name}
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Anchor className="h-5 w-5" />
              <span>Informations du port</span>
            </CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CruisePortForm cruisePort={cruisePort} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

