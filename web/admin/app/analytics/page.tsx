"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/layout/admin-layout"

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Analytiques</h1>
          <p className="text-muted-foreground">
            Statistiques et analyses de la plateforme
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Analytiques</CardTitle>
            <CardDescription>
              Module d'analytiques (à implémenter)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <BarChart3 className="h-8 w-8 mr-2" />
              <span>Module en cours de développement</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

