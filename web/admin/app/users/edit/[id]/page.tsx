"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { EnhancedUserForm } from "@/components/users/enhanced-user-form"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleSuccess = () => {
    router.push("/users")
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
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier l'utilisateur</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de l'utilisateur {user.email} et ses données complémentaires
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations complètes de l'utilisateur</CardTitle>
            <CardDescription>
              Utilisez les onglets pour modifier toutes les informations. Laissez le mot de passe vide pour ne pas le changer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedUserForm user={user} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

