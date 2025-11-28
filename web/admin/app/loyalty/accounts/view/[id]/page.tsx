"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { OneKeyAccount } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewAccountPage() {
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

  const getTierBadge = (tier: string) => {
    const variants: Record<string, "default" | "secondary" | "warning" | "success"> = {
      silver: "secondary",
      gold: "warning",
      platinum: "default",
      diamond: "success",
    }
    const labels: Record<string, string> = {
      silver: "Argent",
      gold: "Or",
      platinum: "Platine",
      diamond: "Diamant",
    }
    return (
      <Badge variant={variants[tier] || "secondary"}>
        {labels[tier] || tier}
      </Badge>
    )
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
          <div className="flex items-center justify-between mb-4">
            <Link href="/loyalty/accounts">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/loyalty/accounts/edit/${account.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/loyalty/accounts/delete/${account.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Détails du compte OneKey</h1>
          <p className="text-muted-foreground">
            Informations complètes du compte {account.onekey_number}
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Utilisateur</p>
                <p className="font-medium">{account.user_email || account.user}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Numéro OneKey</p>
                <p className="font-mono font-medium">{account.onekey_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                {getTierBadge(account.tier)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points totaux</p>
                <p className="text-2xl font-bold text-primary">{account.total_points.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(account.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                <p className="font-medium">{formatDateTime(account.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

