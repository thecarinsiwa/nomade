"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { sessionsService, UserSession } from "@/lib/services/sessions"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sessionId = params.id as string

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
        const data = await sessionsService.getSessionById(sessionId)
        setSession(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la session",
          variant: "destructive",
        })
        router.push("/users/sessions")
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!session) {
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
          <Link href="/users/sessions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détails de la session</h1>
          <p className="text-muted-foreground">
            Informations complètes de la session utilisateur
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Email utilisateur</p>
                <p className="font-medium">{session.user_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {session.is_expired ? (
                  <Badge variant="destructive">Expirée</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Token de session</p>
                <p className="font-mono text-xs bg-muted p-2 rounded break-all">{session.session_token}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Adresse IP</p>
                <p className="font-medium">{session.ip_address || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expire le</p>
                <p className="font-medium">{formatDateTime(session.expires_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <p className="font-medium">{formatDateTime(session.created_at)}</p>
              </div>
              {session.user_agent && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">User Agent</p>
                  <p className="text-sm bg-muted p-2 rounded break-all">{session.user_agent}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

