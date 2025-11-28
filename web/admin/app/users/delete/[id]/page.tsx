"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DeleteUserPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const userId = params.id as string

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const data = await usersService.getUserById(userId)
        setUser(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'utilisateur",
          variant: "destructive",
        })
        router.push("/users")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, router, toast])

  const handleDelete = async () => {
    if (!user) return

    try {
      setIsDeleting(true)
      await usersService.deleteUser(user.id)
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      })
      router.push("/users")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    router.push("/users")
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

  if (!user) {
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
          <Link href="/users">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-destructive">Supprimer l'utilisateur</h1>
          <p className="text-muted-foreground">
            Confirmez la suppression de l'utilisateur
          </p>
        </motion.div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Attention</CardTitle>
            </div>
            <CardDescription>
              Cette action est irréversible. L'utilisateur sera définitivement supprimé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Informations de l'utilisateur :</p>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium">{user.email}</p>
                  {(user.first_name || user.last_name) && (
                    <p className="text-sm text-muted-foreground">
                      {user.first_name} {user.last_name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Statut: {user.status}
                  </p>
                </div>
              </div>

              {/* Afficher les relations */}
              <div className="space-y-3">
                {user.profile && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      ⚠️ Profil associé
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Un profil utilisateur sera également supprimé
                    </p>
                  </div>
                )}

                {user.addresses && user.addresses.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      ⚠️ {user.addresses.length} adresse(s) associée(s)
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Toutes les adresses seront également supprimées
                    </p>
                  </div>
                )}

                {user.payment_methods && user.payment_methods.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      ⚠️ {user.payment_methods.length} méthode(s) de paiement associée(s)
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Toutes les méthodes de paiement seront également supprimées
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

