"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Calendar,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Building,
  Plane,
  Car,
  Ship,
  Ticket,
  Award,
  ArrowRight,
  Loader2,
  UserCheck,
  UserX,
  Mail,
  Shield,
  CreditCard,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/layout/admin-layout"
import { usersService } from "@/lib/services/users"
import { propertiesService } from "@/lib/services/accommodations"
import { flightsService } from "@/lib/services/flights"
import { carsService } from "@/lib/services/car-rentals"
import { cruisesService } from "@/lib/services/cruises"
import { activitiesService } from "@/lib/services/activities"
import { packagesService } from "@/lib/services/packages"
import { onekeyAccountsService } from "@/lib/services/onekey-accounts"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface DashboardStats {
  // Users
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedUsers: number
  
  // Travel Products
  totalProperties: number
  totalFlights: number
  totalCars: number
  totalCruises: number
  totalActivities: number
  totalPackages: number
  
  // Loyalty
  totalOneKeyAccounts: number
  
  // Recent activity
  recentUsers: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0,
    totalProperties: 0,
    totalFlights: 0,
    totalCars: 0,
    totalCruises: 0,
    totalActivities: 0,
    totalPackages: 0,
    totalOneKeyAccounts: 0,
    recentUsers: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all statistics in parallel
        const [
          usersData,
          propertiesData,
          flightsData,
          carsData,
          cruisesData,
          activitiesData,
          packagesData,
          onekeyData,
        ] = await Promise.allSettled([
          usersService.getAllUsers(1),
          propertiesService.getAll(1),
          flightsService.getAll(1),
          carsService.getAll(1),
          cruisesService.getAll(1),
          activitiesService.getAll(1),
          packagesService.getAll(1),
          onekeyAccountsService.getAllAccounts(1),
        ])

        // Process users data
        const users = usersData.status === 'fulfilled' ? usersData.value : null
        const usersList = users?.results || []
        const totalUsers = users?.count || 0
        const activeUsers = usersList.filter((u: any) => u.status === 'active').length
        const inactiveUsers = usersList.filter((u: any) => u.status === 'inactive').length
        const verifiedUsers = usersList.filter((u: any) => u.email_verified).length
        const recentUsers = usersList.slice(0, 5)

        setStats({
          totalUsers,
          activeUsers,
          inactiveUsers,
          verifiedUsers,
          totalProperties: propertiesData.status === 'fulfilled' ? (propertiesData.value.count || 0) : 0,
          totalFlights: flightsData.status === 'fulfilled' ? (flightsData.value.count || 0) : 0,
          totalCars: carsData.status === 'fulfilled' ? (carsData.value.count || 0) : 0,
          totalCruises: cruisesData.status === 'fulfilled' ? (cruisesData.value.count || 0) : 0,
          totalActivities: activitiesData.status === 'fulfilled' ? (activitiesData.value.count || 0) : 0,
          totalPackages: packagesData.status === 'fulfilled' ? (packagesData.value.count || 0) : 0,
          totalOneKeyAccounts: onekeyData.status === 'fulfilled' ? (onekeyData.value.count || 0) : 0,
          recentUsers,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger certaines statistiques",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const mainStatCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      description: `${stats.activeUsers} actifs`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/users",
    },
    {
      title: "Hébergements",
      value: stats.totalProperties,
      description: "Propriétés disponibles",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/travel-products/accommodations",
    },
    {
      title: "Packages",
      value: stats.totalPackages,
      description: "Forfaits disponibles",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/travel-products/packages",
    },
    {
      title: "Comptes OneKey",
      value: stats.totalOneKeyAccounts,
      description: "Programme de fidélité",
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/loyalty/accounts",
    },
  ]

  const travelProductCards = [
    {
      title: "Vols",
      value: stats.totalFlights,
      icon: Plane,
      color: "text-blue-500",
      href: "/travel-products/flights",
    },
    {
      title: "Locations de voitures",
      value: stats.totalCars,
      icon: Car,
      color: "text-green-500",
      href: "/travel-products/car-rentals",
    },
    {
      title: "Croisières",
      value: stats.totalCruises,
      icon: Ship,
      color: "text-purple-500",
      href: "/travel-products/cruises",
    },
    {
      title: "Activités",
      value: stats.totalActivities,
      icon: Ticket,
      color: "text-orange-500",
      href: "/travel-products/activities",
    },
  ]

  const quickLinks = [
    { title: "Nouvel utilisateur", href: "/users/add", icon: Users },
    { title: "Nouvel hébergement", href: "/travel-products/accommodations/add", icon: Building },
    { title: "Nouveau package", href: "/travel-products/packages/add", icon: Package },
    { title: "Nouveau vol", href: "/travel-products/flights/add", icon: Plane },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Vue d'ensemble de votre plateforme Nomade
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
          </div>
        </motion.div>

        {/* Statistiques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mainStatCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={stat.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <div className={`${stat.bgColor} p-2 rounded-lg`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          stat.value.toLocaleString()
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Statistiques utilisateurs détaillées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Statistiques utilisateurs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Actifs</span>
                  </div>
                  <span className="font-bold">{stats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">Inactifs</span>
                  </div>
                  <span className="font-bold">{stats.inactiveUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Email vérifiés</span>
                  </div>
                  <span className="font-bold">{stats.verifiedUsers}</span>
                </div>
                <Link href="/users">
                  <Button variant="outline" className="w-full mt-4">
                    Voir tous les utilisateurs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Produits de voyage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Produits de voyage</CardTitle>
                <CardDescription>
                  Vue d'ensemble des produits disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {travelProductCards.map((product, index) => {
                    const Icon = product.icon
                    return (
                      <Link key={product.title} href={product.href}>
                        <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <Icon className={`h-6 w-6 ${product.color} mb-2`} />
                          <span className="text-sm font-medium">{product.title}</span>
                          <span className="text-2xl font-bold mt-1">
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              product.value.toLocaleString()
                            )}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Liens rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Accès rapide aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link key={link.title} href={link.href}>
                        <Button variant="outline" className="w-full h-auto flex-col py-4">
                          <Icon className="h-5 w-5 mb-2" />
                          <span className="text-xs">{link.title}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Utilisateurs récents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs récents</CardTitle>
                <CardDescription>
                  Derniers utilisateurs inscrits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : stats.recentUsers.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Activity className="h-8 w-8 mr-2" />
                    <span>Aucun utilisateur récent</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentUsers.map((user: any) => (
                      <Link
                        key={user.id}
                        href={`/users/view/${user.id}`}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {user.first_name || user.last_name
                                ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                                : user.email}
                            </p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "inactive"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {user.status === "active"
                            ? "Actif"
                            : user.status === "inactive"
                            ? "Inactif"
                            : "Suspendu"}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Modules de gestion</CardTitle>
              <CardDescription>
                Accédez rapidement aux différents modules d'administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Link href="/users">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Users className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="text-xs text-center font-medium">Utilisateurs</span>
                  </div>
                </Link>
                <Link href="/loyalty/accounts">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Award className="h-6 w-6 mb-2 text-orange-600" />
                    <span className="text-xs text-center font-medium">Loyalty</span>
                  </div>
                </Link>
                <Link href="/travel-products/accommodations">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Building className="h-6 w-6 mb-2 text-green-600" />
                    <span className="text-xs text-center font-medium">Hébergements</span>
                  </div>
                </Link>
                <Link href="/travel-products/flights">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Plane className="h-6 w-6 mb-2 text-blue-500" />
                    <span className="text-xs text-center font-medium">Vols</span>
                  </div>
                </Link>
                <Link href="/travel-products/car-rentals">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Car className="h-6 w-6 mb-2 text-green-500" />
                    <span className="text-xs text-center font-medium">Voitures</span>
                  </div>
                </Link>
                <Link href="/travel-products/cruises">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Ship className="h-6 w-6 mb-2 text-purple-500" />
                    <span className="text-xs text-center font-medium">Croisières</span>
                  </div>
                </Link>
                <Link href="/travel-products/packages">
                  <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <Package className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="text-xs text-center font-medium">Packages</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
