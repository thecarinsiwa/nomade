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
import { Textarea } from "@/components/ui/textarea"
import { packagesService, packageTypesService } from "@/lib/services/packages"
import { Package, PackageType } from "@/types"
import { useToast } from "@/hooks/use-toast"

const packageSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  package_type: z.string().uuid().optional(),
  description: z.string().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  status: z.enum(["active", "inactive"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

type PackageFormData = z.infer<typeof packageSchema>

interface PackageFormProps {
  packageItem: Package | null
  onSuccess: () => void
  onCancel: () => void
}

export function PackageForm({ packageItem, onSuccess, onCancel }: PackageFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: packageItem?.name || "",
      package_type: packageItem?.package_type || "",
      description: packageItem?.description || "",
      discount_percent: packageItem?.discount_percent || undefined,
      status: packageItem?.status || "active",
      start_date: packageItem?.start_date ? packageItem.start_date.split('T')[0] : "",
      end_date: packageItem?.end_date ? packageItem.end_date.split('T')[0] : "",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesData = await packageTypesService.getAll(1)
        setPackageTypes(typesData.results || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: PackageFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
        end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
      }
      
      if (packageItem) {
        await packagesService.update(packageItem.id, submitData)
        toast({
          title: "Succès",
          description: "Forfait mis à jour avec succès",
        })
      } else {
        await packagesService.create(submitData)
        toast({
          title: "Succès",
          description: "Forfait créé avec succès",
        })
      }
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.detail || "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input id="name" {...register("name")} placeholder="Nom du forfait" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="package_type">Type de forfait</Label>
          <Select
            value={watch("package_type") || undefined}
            onValueChange={(value) => setValue("package_type", value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {packageTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount_percent">Réduction (%)</Label>
          <Input
            id="discount_percent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            {...register("discount_percent", { valueAsNumber: true })}
            placeholder="10.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Description du forfait..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Date de début</Label>
          <Input
            id="start_date"
            type="date"
            {...register("start_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input
            id="end_date"
            type="date"
            {...register("end_date")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut *</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {packageItem ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            packageItem ? "Mettre à jour" : "Créer"
          )}
        </Button>
      </div>
    </form>
  )
}

