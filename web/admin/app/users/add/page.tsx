"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"
import { EnhancedUserForm } from "@/components/users/enhanced-user-form"
import Link from "next/link"

export default function AddUserPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/users")
  }

  const handleCancel = () => {
    router.push("/users")
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
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Créer un nouvel utilisateur</h1>
              <p className="text-muted-foreground">
                Créez un utilisateur avec ses informations complémentaires (profil, adresses, méthodes de paiement)
              </p>
            </div>
          </div>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Informations complètes de l'utilisateur</CardTitle>
            <CardDescription>
              Utilisez les onglets pour remplir toutes les informations. Les champs marqués d'un astérisque (*) sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedUserForm user={null} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

