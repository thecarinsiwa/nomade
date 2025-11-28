"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { securityLogsService, AuditLog } from "@/lib/services/security-logs"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function SecurityLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const data = await securityLogsService.getAllLogs(1)
      setLogs(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les logs de sécurité",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Logs de Sécurité</h1>
          <p className="text-muted-foreground">
            Historique des actions et événements de sécurité
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des logs d'audit</CardTitle>
            <CardDescription>
              Consultez l'historique des actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email, action, table..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>ID Enregistrement</TableHead>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.filter(
                    (l) =>
                      !searchTerm ||
                      l.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      l.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun log trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs
                      .filter(
                        (l) =>
                          !searchTerm ||
                          l.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user_email || "Système"}</TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>{log.table_name || "-"}</TableCell>
                        <TableCell className="font-mono text-xs">{log.record_id || "-"}</TableCell>
                        <TableCell>{log.ip_address || "-"}</TableCell>
                        <TableCell>{formatDateTime(log.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/users/security-logs/view/${log.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

