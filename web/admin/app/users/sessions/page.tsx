"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Loader2, Shield, XCircle } from "lucide-react"
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
import { sessionsService, UserSession } from "@/lib/services/sessions"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const data = await sessionsService.getAllSessions(1)
      setSessions(data.results || [])
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Sessions Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gestion des sessions actives des utilisateurs
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des sessions</CardTitle>
            <CardDescription>
              Visualisez les sessions actives et expirées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par email, IP..."
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
                    <TableHead>Email</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Adresse IP</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.filter(
                    (s) =>
                      !searchTerm ||
                      s.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.ip_address?.includes(searchTerm)
                  ).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune session trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions
                      .filter(
                        (s) =>
                          !searchTerm ||
                          s.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.ip_address?.includes(searchTerm)
                      )
                      .map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.user_email}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {session.session_token.substring(0, 16)}...
                        </TableCell>
                        <TableCell>{session.ip_address || "-"}</TableCell>
                        <TableCell>{formatDateTime(session.expires_at)}</TableCell>
                        <TableCell>
                          {session.is_expired ? (
                            <Badge variant="destructive">Expirée</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDateTime(session.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/users/sessions/view/${session.id}`}>
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

