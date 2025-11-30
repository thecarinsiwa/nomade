"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  StarOff,
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
import { cruiseImagesService } from "@/lib/services/cruises"
import { CruiseImage } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CruiseImageGalleryProps {
  cruiseId: string
  readonly?: boolean
}

const IMAGE_TYPES = [
  { value: 'main', label: 'Principale' },
  { value: 'itinerary', label: 'Itinéraire' },
  { value: 'destination', label: 'Destination' },
  { value: 'excursion', label: 'Excursion' },
  { value: 'other', label: 'Autre' },
] as const

export function CruiseImageGallery({ cruiseId, readonly = false }: CruiseImageGalleryProps) {
  const [images, setImages] = useState<CruiseImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageType, setNewImageType] = useState<CruiseImage['image_type']>('main')
  const [newImageAlt, setNewImageAlt] = useState("")
  const [newImageCaption, setNewImageCaption] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (cruiseId) {
      fetchImages()
    }
  }, [cruiseId])

  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const data = await cruiseImagesService.getAll(cruiseId)
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
      const newImage = await cruiseImagesService.create({
        cruise: cruiseId,
        image_url: newImageUrl.trim(),
        image_type: newImageType,
        alt_text: newImageAlt.trim() || undefined,
        caption: newImageCaption.trim() || undefined,
        display_order: images.length,
        is_primary: images.length === 0, // Première image = principale par défaut
      })
      setImages([...images, newImage])
      setNewImageUrl("")
      setNewImageAlt("")
      setNewImageCaption("")
      setNewImageType('main')
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
      await cruiseImagesService.delete(id)
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

  const handleSetPrimary = async (id: string) => {
    try {
      // Désactiver toutes les images principales
      const updates = images
        .filter(img => img.is_primary && img.id !== id)
        .map(img => cruiseImagesService.update(img.id, { is_primary: false }))
      
      // Activer la nouvelle image principale
      await Promise.all([
        ...updates,
        cruiseImagesService.update(id, { is_primary: true })
      ])
      
      setImages(images.map(img => ({
        ...img,
        is_primary: img.id === id
      })))
      
      toast({
        title: "Succès",
        description: "Image principale mise à jour",
      })
    } catch (error) {
      console.error("Error setting primary image:", error)
      toast({
        title: "Erreur",
        description: "Impossible de définir l'image principale",
        variant: "destructive",
      })
    }
  }

  const primaryImage = images.find(img => img.is_primary)
  const galleryImages = images.filter(img => !img.is_primary)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images de la croisière</CardTitle>
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
          <span>Images de la croisière</span>
        </CardTitle>
        <CardDescription>
          Gérez les images associées à cette croisière ({images.length} image{images.length > 1 ? 's' : ''})
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
                  onValueChange={(value) => setNewImageType(value as CruiseImage['image_type'])}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="image_caption">Légende (optionnel)</Label>
                <Input
                  id="image_caption"
                  placeholder="Légende de l'image"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  disabled={isAdding}
                />
              </div>
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
        {primaryImage && (
          <div className="space-y-2">
            <Label>Image principale</Label>
            <div className="relative group border rounded-lg overflow-hidden">
              <img
                src={primaryImage.image_url}
                alt={primaryImage.alt_text || "Image principale"}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Principale
                </Badge>
                <Badge variant="secondary">
                  {IMAGE_TYPES.find(t => t.value === primaryImage.image_type)?.label}
                </Badge>
              </div>
              {!readonly && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteImage(primaryImage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {primaryImage.alt_text && (
              <p className="text-sm text-muted-foreground">{primaryImage.alt_text}</p>
            )}
            {primaryImage.caption && (
              <p className="text-sm text-muted-foreground italic">{primaryImage.caption}</p>
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
                        variant="default"
                        onClick={() => handleSetPrimary(image.id)}
                        title="Définir comme image principale"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {(image.alt_text || image.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                      {image.caption || image.alt_text}
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
            <p>Aucune image pour cette croisière</p>
            {!readonly && (
              <p className="text-sm mt-2">Ajoutez une image ci-dessus pour commencer</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

