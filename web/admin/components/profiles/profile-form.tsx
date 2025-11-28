"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { profilesService } from "@/lib/services/profiles"
import { UserProfile } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { usersService } from "@/lib/services/users"
import { User } from "@/types"

const profileSchema = z.object({
  user: z.string().uuid("Sélectionnez un utilisateur"),
  preferred_language: z.string().min(1, "La langue est requise"),
  preferred_currency: z.string().min(1, "La devise est requise"),
  timezone: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: UserProfile | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProfileForm({ profile, onSuccess, onCancel }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      user: profile?.user || "",
      preferred_language: profile?.preferred_language || "fr",
      preferred_currency: profile?.preferred_currency || "EUR",
      timezone: profile?.timezone || "",
    },
  })

  const user = watch("user")

  // Charger les utilisateurs au montage si on crée un nouveau profil
  useEffect(() => {
    if (!profile) {
      const fetchUsers = async () => {
        try {
          setIsLoadingUsers(true)
          const data = await usersService.getAllUsers(1)
          setUsers(data.results || [])
        } catch (error) {
          console.error("Error fetching users:", error)
        } finally {
          setIsLoadingUsers(false)
        }
      }
      fetchUsers()
    }
  }, [profile])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      if (profile) {
        await profilesService.updateProfile(profile.id, data)
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        })
      } else {
        await profilesService.createProfile(data)
        toast({
          title: "Succès",
          description: "Profil créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || error.response?.data?.user?.[0] || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!profile && (
        <div className="space-y-2">
          <Label htmlFor="user">Utilisateur *</Label>
          <Select value={user} onValueChange={(value) => setValue("user", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingUsers ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : (
                users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.user && (
            <p className="text-sm text-destructive">{errors.user.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preferred_language">Langue préférée *</Label>
          <Select
            value={watch("preferred_language")}
            onValueChange={(value) => setValue("preferred_language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
          {errors.preferred_language && (
            <p className="text-sm text-destructive">{errors.preferred_language.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferred_currency">Devise préférée *</Label>
          <Select
            value={watch("preferred_currency")}
            onValueChange={(value) => setValue("preferred_currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
            </SelectContent>
          </Select>
          {errors.preferred_currency && (
            <p className="text-sm text-destructive">{errors.preferred_currency.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Fuseau horaire</Label>
        <Input
          id="timezone"
          placeholder="Europe/Paris"
          {...register("timezone")}
        />
        {errors.timezone && (
          <p className="text-sm text-destructive">{errors.timezone.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {profile ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            profile ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

