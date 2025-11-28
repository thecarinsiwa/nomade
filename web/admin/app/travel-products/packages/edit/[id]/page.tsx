"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { PackageForm } from "@/components/packages/package-form"
import { packagesService } from "@/lib/services/packages"
import { Package } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditPackagePage() {
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

  const handleSuccess = () => {
    router.push("/travel-products/packages")
  }

  const handleCancel = () => {
    router.push("/travel-products/packages")
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
          <Link href="/travel-products/packages">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier le forfait</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de {packageItem.name}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du forfait</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackageForm packageItem={packageItem} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

