"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AddressForm } from "@/components/addresses/address-form"
import { addressesService } from "@/lib/services/addresses"
import { UserAddress } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAddressPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [address, setAddress] = useState<UserAddress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const addressId = params.id as string

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setIsLoading(true)
        const data = await addressesService.getAddressById(addressId)
        setAddress(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'adresse",
          variant: "destructive",
        })
        router.push("/users/addresses")
      } finally {
        setIsLoading(false)
      }
    }

    if (addressId) {
      fetchAddress()
    }
  }, [addressId, router, toast])

  const handleSuccess = () => {
    router.push("/users/addresses")
  }

  const handleCancel = () => {
    router.push("/users/addresses")
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

  if (!address) {
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
          <Link href="/users/addresses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier l'adresse</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de l'adresse
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'adresse</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddressForm address={address} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

