"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { securityLogsService, AuditLog } from "@/lib/services/security-logs"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewSecurityLogPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [log, setLog] = useState<AuditLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logId = params.id as string

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setIsLoading(true)
        const data = await securityLogsService.getLogById(logId)
        setLog(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le log",
          variant: "destructive",
        })
        router.push("/users/security-logs")
      } finally {
        setIsLoading(false)
      }
    }

    if (logId) {
      fetchLog()
    }
  }, [logId, router, toast])

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "warning"> = {
      create: "default",
      update: "secondary",
      delete: "destructive",
      login: "default",
      logout: "secondary",
      view: "secondary",
    }
    return (
      <Badge variant={variants[action] || "secondary"}>
        {action}
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

  if (!log) {
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
          <Link href="/users/security-logs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détails du log de sécurité</h1>
          <p className="text-muted-foreground">
            Informations complètes du log d'audit
          </p>
        </motion.div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateur</p>
                  <p className="font-medium">{log.user_email || "Système"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  {getActionBadge(log.action)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Table</p>
                  <p className="font-medium">{log.table_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Enregistrement</p>
                  <p className="font-mono text-xs">{log.record_id || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse IP</p>
                  <p className="font-medium">{log.ip_address || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDateTime(log.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {log.old_values && Object.keys(log.old_values).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Valeurs avant modification</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(log.old_values, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {log.new_values && Object.keys(log.new_values).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Valeurs après modification</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(log.new_values, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

