"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  Building2,
  Hash,
  Calendar,
  MapPin,
  Car,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { carRentalCompaniesService } from "@/lib/services/car-rentals"
import { CarRentalCompany } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import Link from "next/link"

export default function ViewCarRentalCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [company, setCompany] = useState<CarRentalCompany | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const companyId = params.id as string

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true)
        const data = await carRentalCompaniesService.getById(companyId)
        setCompany(data)
      } catch (error) {
        console.error("Error fetching company:", error)
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Impossible de charger l'agence",
          variant: "destructive",
        })
        router.push("/travel-products/car-rentals/companies")
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchCompany()
    }
  }, [companyId, router, toast])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  if (!company) {
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
            <Link href="/travel-products/car-rentals/companies">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Link href={`/travel-products/car-rentals/companies/edit/${company.id}`}>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </Link>
              <Link href={`/travel-products/car-rentals/companies/delete/${company.id}`}>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-16 w-16 object-contain rounded-lg border"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <div className="bg-blue-100 p-4 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">
                Agence de location de voitures
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locations</CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {company.locations_count ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Points de location
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Car className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {company.cars_count ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Véhicules disponibles
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Date de création</CardTitle>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {formatDateTime(company.created_at)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Date d'ajout
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Logo</CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {company.logo_url ? "Configuré" : "Non configuré"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  État du logo
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations principales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'agence</CardTitle>
            <CardDescription>Détails de {company.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                  <Building2 className="h-4 w-4" />
                  <span>Nom</span>
                </p>
                <p className="font-medium text-lg">{company.name}</p>
              </div>
              {company.code && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-1">
                    <Hash className="h-4 w-4" />
                    <span>Code</span>
                  </p>
                  <Badge variant="outline" className="font-mono text-base">
                    {company.code}
                  </Badge>
                </div>
              )}
              {company.logo_url && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground flex items-center space-x-2 mb-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Logo</span>
                  </p>
                  <div className="flex items-center space-x-4">
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="h-20 w-20 object-contain rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <a
                      href={company.logo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Voir l'image</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

