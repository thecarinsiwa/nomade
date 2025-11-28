import api from '@/lib/api'
import { 
  PropertyType, PropertyCategory, PropertyAddress, Property, 
  PropertyAmenity, PropertyAmenityLink, PropertyImage, PropertyDescription,
  RoomType, Room, RoomAmenity, RoomAmenityLink, RoomAvailability, RoomPricing, RoomImage,
  ApiResponse 
} from '@/types'

// Property Types
export const propertyTypesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<PropertyType>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<PropertyType>>('/api/accommodations/property-types/', { params })
    return response.data
  },
  async getById(id: string): Promise<PropertyType> {
    const response = await api.get<PropertyType>(`/api/accommodations/property-types/${id}/`)
    return response.data
  },
  async create(data: Partial<PropertyType>): Promise<PropertyType> {
    const response = await api.post<PropertyType>('/api/accommodations/property-types/', data)
    return response.data
  },
  async update(id: string, data: Partial<PropertyType>): Promise<PropertyType> {
    const response = await api.patch<PropertyType>(`/api/accommodations/property-types/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/property-types/${id}/`)
  },
}

// Property Categories
export const propertyCategoriesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<PropertyCategory>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<PropertyCategory>>('/api/accommodations/property-categories/', { params })
    return response.data
  },
  async getById(id: string): Promise<PropertyCategory> {
    const response = await api.get<PropertyCategory>(`/api/accommodations/property-categories/${id}/`)
    return response.data
  },
  async create(data: Partial<PropertyCategory>): Promise<PropertyCategory> {
    const response = await api.post<PropertyCategory>('/api/accommodations/property-categories/', data)
    return response.data
  },
  async update(id: string, data: Partial<PropertyCategory>): Promise<PropertyCategory> {
    const response = await api.patch<PropertyCategory>(`/api/accommodations/property-categories/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/property-categories/${id}/`)
  },
}

// Properties (main table)
export const propertiesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Property>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Property>>('/api/accommodations/properties/', { params })
    return response.data
  },
  async getById(id: string): Promise<Property> {
    const response = await api.get<Property>(`/api/accommodations/properties/${id}/`)
    return response.data
  },
  async create(data: Partial<Property>): Promise<Property> {
    const response = await api.post<Property>('/api/accommodations/properties/', data)
    return response.data
  },
  async update(id: string, data: Partial<Property>): Promise<Property> {
    const response = await api.patch<Property>(`/api/accommodations/properties/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/properties/${id}/`)
  },
}

// Rooms
export const roomsService = {
  async getAll(page: number = 1, search?: string, propertyId?: string): Promise<ApiResponse<Room>> {
    const params: any = { page }
    if (search) params.search = search
    if (propertyId) params.property = propertyId
    const response = await api.get<ApiResponse<Room>>('/api/accommodations/rooms/', { params })
    return response.data
  },
  async getById(id: string): Promise<Room> {
    const response = await api.get<Room>(`/api/accommodations/rooms/${id}/`)
    return response.data
  },
  async create(data: Partial<Room>): Promise<Room> {
    const response = await api.post<Room>('/api/accommodations/rooms/', data)
    return response.data
  },
  async update(id: string, data: Partial<Room>): Promise<Room> {
    const response = await api.patch<Room>(`/api/accommodations/rooms/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/rooms/${id}/`)
  },
}

// Room Types
export const roomTypesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<RoomType>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<RoomType>>('/api/accommodations/room-types/', { params })
    return response.data
  },
  async getById(id: string): Promise<RoomType> {
    const response = await api.get<RoomType>(`/api/accommodations/room-types/${id}/`)
    return response.data
  },
  async create(data: Partial<RoomType>): Promise<RoomType> {
    const response = await api.post<RoomType>('/api/accommodations/room-types/', data)
    return response.data
  },
  async update(id: string, data: Partial<RoomType>): Promise<RoomType> {
    const response = await api.patch<RoomType>(`/api/accommodations/room-types/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/room-types/${id}/`)
  },
}

// Room Availability
export const roomAvailabilityService = {
  async getAll(page: number = 1, search?: string, roomId?: string): Promise<ApiResponse<RoomAvailability>> {
    const params: any = { page }
    if (search) params.search = search
    if (roomId) params.room = roomId
    const response = await api.get<ApiResponse<RoomAvailability>>('/api/accommodations/room-availability/', { params })
    return response.data
  },
  async getById(id: string): Promise<RoomAvailability> {
    const response = await api.get<RoomAvailability>(`/api/accommodations/room-availability/${id}/`)
    return response.data
  },
  async create(data: Partial<RoomAvailability>): Promise<RoomAvailability> {
    const response = await api.post<RoomAvailability>('/api/accommodations/room-availability/', data)
    return response.data
  },
  async update(id: string, data: Partial<RoomAvailability>): Promise<RoomAvailability> {
    const response = await api.patch<RoomAvailability>(`/api/accommodations/room-availability/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/room-availability/${id}/`)
  },
}

// Property Images
export const propertyImagesService = {
  async getAll(propertyId?: string, imageType?: string): Promise<PropertyImage[]> {
    const params: any = {}
    if (propertyId) params.property_id = propertyId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<PropertyImage>>('/api/accommodations/property-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<PropertyImage> {
    const response = await api.get<PropertyImage>(`/api/accommodations/property-images/${id}/`)
    return response.data
  },
  async create(data: Partial<PropertyImage>): Promise<PropertyImage> {
    const response = await api.post<PropertyImage>('/api/accommodations/property-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<PropertyImage>): Promise<PropertyImage> {
    const response = await api.patch<PropertyImage>(`/api/accommodations/property-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/accommodations/property-images/${id}/`)
  },
}

// Room Images
export const roomImagesService = {
  async getAll(roomId?: string, imageType?: string): Promise<RoomImage[]> {
    const params: any = {}
    if (roomId) params.room_id = roomId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<RoomImage>>('/api/images/room-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<RoomImage> {
    const response = await api.get<RoomImage>(`/api/images/room-images/${id}/`)
    return response.data
  },
  async create(data: Partial<RoomImage>): Promise<RoomImage> {
    const response = await api.post<RoomImage>('/api/images/room-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<RoomImage>): Promise<RoomImage> {
    const response = await api.patch<RoomImage>(`/api/images/room-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/room-images/${id}/`)
  },
}

