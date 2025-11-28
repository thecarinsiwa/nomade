"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { propertyImagesService } from "@/lib/services/accommodations"
import { PropertyImage } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface PropertyImageGalleryProps {
  propertyId: string
  readonly?: boolean
}

const IMAGE_TYPES = [
  { value: 'main', label: 'Principale' },
  { value: 'gallery', label: 'Galerie' },
  { value: 'room', label: 'Chambre' },
  { value: 'amenity', label: 'Équipement' },
  { value: 'other', label: 'Autre' },
] as const

export function PropertyImageGallery({ propertyId, readonly = false }: PropertyImageGalleryProps) {
  const [images, setImages] = useState<PropertyImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageType, setNewImageType] = useState<PropertyImage['image_type']>('gallery')
  const [newImageAlt, setNewImageAlt] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (propertyId) {
      fetchImages()
    }
  }, [propertyId])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const data = await propertyImagesService.getAll(propertyId)
      // Trier par display_order puis par date de création
      const sorted = data.sort((a, b) => {
        if (a.display_order !== b.display_order) {
          return a.display_order - b.display_order
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
      setImages(sorted)
    } catch (error) {
      console.error("Error fetching images:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les images",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Erreur",
        description: "L'URL de l'image est requise",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdding(true)
      const newImage = await propertyImagesService.create({
        property: propertyId,
        image_url: newImageUrl.trim(),
        image_type: newImageType,
        alt_text: newImageAlt.trim() || undefined,
        display_order: images.length,
      })
      setImages([...images, newImage])
      setNewImageUrl("")
      setNewImageAlt("")
      setNewImageType('gallery')
      toast({
        title: "Succès",
        description: "Image ajoutée avec succès",
      })
    } catch (error: any) {
      console.error("Error adding image:", error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Impossible d'ajouter l'image"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return
    }

    try {
      await propertyImagesService.delete(id)
      setImages(images.filter(img => img.id !== id))
      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      })
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image",
        variant: "destructive",
      })
    }
  }

  const mainImage = images.find(img => img.image_type === 'main')
  const galleryImages = images.filter(img => img.image_type !== 'main')

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images de la propriété</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>Images de la propriété</span>
        </CardTitle>
        <CardDescription>
          Gérez les images associées à cette propriété ({images.length} image{images.length > 1 ? 's' : ''})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout */}
        {!readonly && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
            <h4 className="font-semibold flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Ajouter une image</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de l'image *</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_type">Type d'image *</Label>
                <Select
                  value={newImageType}
                  onValueChange={(value) => setNewImageType(value as PropertyImage['image_type'])}
                  disabled={isAdding}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_alt">Texte alternatif (optionnel)</Label>
              <Input
                id="image_alt"
                placeholder="Description de l'image"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                disabled={isAdding}
              />
            </div>
            <Button
              onClick={handleAddImage}
              disabled={isAdding || !newImageUrl.trim()}
              className="w-full md:w-auto"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter l'image
                </>
              )}
            </Button>
          </div>
        )}

        {/* Image principale */}
        {mainImage && (
          <div className="space-y-2">
            <Label>Image principale</Label>
            <div className="relative group border rounded-lg overflow-hidden">
              <img
                src={mainImage.image_url}
                alt={mainImage.alt_text || "Image principale"}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="default" className="bg-blue-500">
                  Principale
                </Badge>
              </div>
              {!readonly && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(mainImage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {mainImage.alt_text && (
              <p className="text-sm text-muted-foreground">{mainImage.alt_text}</p>
            )}
          </div>
        )}

        {/* Galerie d'images */}
        {galleryImages.length > 0 && (
          <div className="space-y-2">
            <Label>Galerie d'images ({galleryImages.length})</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text || "Image de galerie"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      {IMAGE_TYPES.find(t => t.value === image.image_type)?.label}
                    </Badge>
                  </div>
                  {!readonly && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {image.alt_text && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                      {image.alt_text}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucune image */}
        {images.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune image pour cette propriété</p>
            {!readonly && (
              <p className="text-sm mt-2">Ajoutez une image ci-dessus pour commencer</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

