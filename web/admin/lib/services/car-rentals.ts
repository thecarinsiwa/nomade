import api from '@/lib/api'
import { 
  CarRentalCompany, CarRentalLocation, CarCategory, Car, CarAvailability, CarImage, GenericImage,
  ApiResponse 
} from '@/types'

// Car Rental Companies
export const carRentalCompaniesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<CarRentalCompany>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<CarRentalCompany>>('/api/car-rentals/companies/', { params })
    return response.data
  },
  async getById(id: string): Promise<CarRentalCompany> {
    const response = await api.get<CarRentalCompany>(`/api/car-rentals/companies/${id}/`)
    return response.data
  },
  async create(data: Partial<CarRentalCompany>): Promise<CarRentalCompany> {
    const response = await api.post<CarRentalCompany>('/api/car-rentals/companies/', data)
    return response.data
  },
  async update(id: string, data: Partial<CarRentalCompany>): Promise<CarRentalCompany> {
    const response = await api.patch<CarRentalCompany>(`/api/car-rentals/companies/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/car-rentals/companies/${id}/`)
  },
}

// Car Rental Locations
export const carRentalLocationsService = {
  async getAll(page: number = 1, search?: string, companyId?: string): Promise<ApiResponse<CarRentalLocation>> {
    const params: any = { page }
    if (search) params.search = search
    if (companyId) params.company = companyId
    const response = await api.get<ApiResponse<CarRentalLocation>>('/api/car-rentals/locations/', { params })
    return response.data
  },
  async getById(id: string): Promise<CarRentalLocation> {
    const response = await api.get<CarRentalLocation>(`/api/car-rentals/locations/${id}/`)
    return response.data
  },
  async create(data: Partial<CarRentalLocation>): Promise<CarRentalLocation> {
    const response = await api.post<CarRentalLocation>('/api/car-rentals/locations/', data)
    return response.data
  },
  async update(id: string, data: Partial<CarRentalLocation>): Promise<CarRentalLocation> {
    const response = await api.patch<CarRentalLocation>(`/api/car-rentals/locations/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/car-rentals/locations/${id}/`)
  },
}

// Car Categories
export const carCategoriesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<CarCategory>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<CarCategory>>('/api/car-rentals/categories/', { params })
    return response.data
  },
  async getById(id: string): Promise<CarCategory> {
    const response = await api.get<CarCategory>(`/api/car-rentals/categories/${id}/`)
    return response.data
  },
  async create(data: Partial<CarCategory>): Promise<CarCategory> {
    const response = await api.post<CarCategory>('/api/car-rentals/categories/', data)
    return response.data
  },
  async update(id: string, data: Partial<CarCategory>): Promise<CarCategory> {
    const response = await api.patch<CarCategory>(`/api/car-rentals/categories/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/car-rentals/categories/${id}/`)
  },
}

// Cars
export const carsService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Car>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Car>>('/api/car-rentals/cars/', { params })
    return response.data
  },
  async getById(id: string): Promise<Car> {
    const response = await api.get<Car>(`/api/car-rentals/cars/${id}/`)
    return response.data
  },
  async create(data: Partial<Car>): Promise<Car> {
    const response = await api.post<Car>('/api/car-rentals/cars/', data)
    return response.data
  },
  async update(id: string, data: Partial<Car>): Promise<Car> {
    const response = await api.patch<Car>(`/api/car-rentals/cars/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/car-rentals/cars/${id}/`)
  },
}

// Car Availability
export const carAvailabilityService = {
  async getAll(page: number = 1, search?: string, carId?: string): Promise<ApiResponse<CarAvailability>> {
    const params: any = { page }
    if (search) params.search = search
    if (carId) params.car = carId
    const response = await api.get<ApiResponse<CarAvailability>>('/api/car-rentals/availability/', { params })
    return response.data
  },
  async getById(id: string): Promise<CarAvailability> {
    const response = await api.get<CarAvailability>(`/api/car-rentals/availability/${id}/`)
    return response.data
  },
  async create(data: Partial<CarAvailability>): Promise<CarAvailability> {
    const response = await api.post<CarAvailability>('/api/car-rentals/availability/', data)
    return response.data
  },
  async update(id: string, data: Partial<CarAvailability>): Promise<CarAvailability> {
    const response = await api.patch<CarAvailability>(`/api/car-rentals/availability/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/car-rentals/availability/${id}/`)
  },
}

// Car Images
export const carImagesService = {
  async getAll(carId?: string, imageType?: string): Promise<CarImage[]> {
    const params: any = {}
    if (carId) params.car_id = carId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<CarImage>>('/api/images/car-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<CarImage> {
    const response = await api.get<CarImage>(`/api/images/car-images/${id}/`)
    return response.data
  },
  async create(data: Partial<CarImage>): Promise<CarImage> {
    const response = await api.post<CarImage>('/api/images/car-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<CarImage>): Promise<CarImage> {
    const response = await api.patch<CarImage>(`/api/images/car-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/car-images/${id}/`)
  },
}

// Car Rental Location Images (using GenericImage with category)
export const carRentalLocationImagesService = {
  async getAll(locationId: string): Promise<GenericImage[]> {
    const category = `car_rental_location_${locationId}`
    const response = await api.get<ApiResponse<GenericImage>>('/api/images/generic-images/', { 
      params: { category, is_active: 'true' } 
    })
    return response.data.results || []
  },
  async getById(id: string): Promise<GenericImage> {
    const response = await api.get<GenericImage>(`/api/images/generic-images/${id}/`)
    return response.data
  },
  async create(locationId: string, data: Partial<GenericImage>): Promise<GenericImage> {
    const category = `car_rental_location_${locationId}`
    const response = await api.post<GenericImage>('/api/images/generic-images/', {
      ...data,
      category,
      image_type: data.image_type || 'other',
      is_active: true,
    })
    return response.data
  },
  async update(id: string, data: Partial<GenericImage>): Promise<GenericImage> {
    const response = await api.patch<GenericImage>(`/api/images/generic-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/generic-images/${id}/`)
  },
}

