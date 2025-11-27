"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function BookingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Réservations</h1>
          <p className="text-muted-foreground">
            Gestion des réservations
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
            <CardDescription>
              Module de gestion des réservations (à implémenter)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mr-2" />
              <span>Module en cours de développement</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

