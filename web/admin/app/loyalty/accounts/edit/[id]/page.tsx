"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { AccountForm } from "@/components/onekey/account-form"
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { OneKeyAccount } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditAccountPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [account, setAccount] = useState<OneKeyAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const accountId = params.id as string

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setIsLoading(true)
        const data = await onekeyAccountsService.getAccountById(accountId)
        setAccount(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le compte",
          variant: "destructive",
        })
        router.push("/loyalty/accounts")
      } finally {
        setIsLoading(false)
      }
    }

    if (accountId) {
      fetchAccount()
    }
  }, [accountId, router, toast])

  const handleSuccess = () => {
    router.push("/loyalty/accounts")
  }

  const handleCancel = () => {
    router.push("/loyalty/accounts")
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

  if (!account) {
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
          <Link href="/loyalty/accounts">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier le compte OneKey</h1>
          <p className="text-muted-foreground">
            Modifiez les informations du compte {account.onekey_number}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Modifiez les champs nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm account={account} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

