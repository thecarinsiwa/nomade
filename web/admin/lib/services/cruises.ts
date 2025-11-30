import api from '@/lib/api'
import { 
  CruiseLine, CruiseShip, CruisePort, Cruise, CruiseCabinType, CruiseCabin,
  CruiseShipImage, CruiseImage,
  ApiResponse 
} from '@/types'

// Cruise Lines
export const cruiseLinesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<CruiseLine>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<CruiseLine>>('/api/cruises/cruise-lines/', { params })
    return response.data
  },
  async getById(id: string): Promise<CruiseLine> {
    const response = await api.get<CruiseLine>(`/api/cruises/cruise-lines/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseLine>): Promise<CruiseLine> {
    const response = await api.post<CruiseLine>('/api/cruises/cruise-lines/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseLine>): Promise<CruiseLine> {
    const response = await api.patch<CruiseLine>(`/api/cruises/cruise-lines/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/cruise-lines/${id}/`)
  },
}

// Cruise Ships
export const cruiseShipsService = {
  async getAll(page: number = 1, search?: string, cruiseLineId?: string): Promise<ApiResponse<CruiseShip>> {
    const params: any = { page }
    if (search) params.search = search
    if (cruiseLineId) params.cruise_line_id = cruiseLineId
    const response = await api.get<ApiResponse<CruiseShip>>('/api/cruises/ships/', { params })
    return response.data
  },
  async getById(id: string): Promise<CruiseShip> {
    const response = await api.get<CruiseShip>(`/api/cruises/ships/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseShip>): Promise<CruiseShip> {
    const response = await api.post<CruiseShip>('/api/cruises/ships/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseShip>): Promise<CruiseShip> {
    const response = await api.patch<CruiseShip>(`/api/cruises/ships/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/ships/${id}/`)
  },
}

// Cruise Ports
export const cruisePortsService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<CruisePort>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<CruisePort>>('/api/cruises/ports/', { params })
    return response.data
  },
  async getById(id: string): Promise<CruisePort> {
    const response = await api.get<CruisePort>(`/api/cruises/ports/${id}/`)
    return response.data
  },
  async create(data: Partial<CruisePort>): Promise<CruisePort> {
    const response = await api.post<CruisePort>('/api/cruises/ports/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruisePort>): Promise<CruisePort> {
    const response = await api.patch<CruisePort>(`/api/cruises/ports/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/ports/${id}/`)
  },
}

// Cruises
export const cruisesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Cruise>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Cruise>>('/api/cruises/cruises/', { params })
    return response.data
  },
  async getById(id: string): Promise<Cruise> {
    const response = await api.get<Cruise>(`/api/cruises/cruises/${id}/`)
    return response.data
  },
  async create(data: Partial<Cruise>): Promise<Cruise> {
    const response = await api.post<Cruise>('/api/cruises/cruises/', data)
    return response.data
  },
  async update(id: string, data: Partial<Cruise>): Promise<Cruise> {
    const response = await api.patch<Cruise>(`/api/cruises/cruises/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/cruises/${id}/`)
  },
}

// Cruise Cabin Types
export const cruiseCabinTypesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<CruiseCabinType>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<CruiseCabinType>>('/api/cruises/cabin-types/', { params })
    return response.data
  },
  async getById(id: string): Promise<CruiseCabinType> {
    const response = await api.get<CruiseCabinType>(`/api/cruises/cabin-types/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseCabinType>): Promise<CruiseCabinType> {
    const response = await api.post<CruiseCabinType>('/api/cruises/cabin-types/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseCabinType>): Promise<CruiseCabinType> {
    const response = await api.patch<CruiseCabinType>(`/api/cruises/cabin-types/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/cabin-types/${id}/`)
  },
}

// Cruise Cabins
export const cruiseCabinsService = {
  async getAll(page: number = 1, search?: string, cruiseId?: string): Promise<ApiResponse<CruiseCabin>> {
    const params: any = { page }
    if (search) params.search = search
    if (cruiseId) params.cruise = cruiseId
    const response = await api.get<ApiResponse<CruiseCabin>>('/api/cruises/cabins/', { params })
    return response.data
  },
  async getById(id: string): Promise<CruiseCabin> {
    const response = await api.get<CruiseCabin>(`/api/cruises/cabins/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseCabin>): Promise<CruiseCabin> {
    const response = await api.post<CruiseCabin>('/api/cruises/cabins/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseCabin>): Promise<CruiseCabin> {
    const response = await api.patch<CruiseCabin>(`/api/cruises/cabins/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/cruises/cabins/${id}/`)
  },
}

// Cruise Ship Images
export const cruiseShipImagesService = {
  async getAll(cruiseShipId?: string, imageType?: string): Promise<CruiseShipImage[]> {
    const params: any = {}
    if (cruiseShipId) params.cruise_ship_id = cruiseShipId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<CruiseShipImage>>('/api/images/cruise-ship-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<CruiseShipImage> {
    const response = await api.get<CruiseShipImage>(`/api/images/cruise-ship-images/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseShipImage>): Promise<CruiseShipImage> {
    const response = await api.post<CruiseShipImage>('/api/images/cruise-ship-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseShipImage>): Promise<CruiseShipImage> {
    const response = await api.patch<CruiseShipImage>(`/api/images/cruise-ship-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/cruise-ship-images/${id}/`)
  },
}

// Cruise Images
export const cruiseImagesService = {
  async getAll(cruiseId?: string, imageType?: string): Promise<CruiseImage[]> {
    const params: any = {}
    if (cruiseId) params.cruise_id = cruiseId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<CruiseImage>>('/api/images/cruise-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<CruiseImage> {
    const response = await api.get<CruiseImage>(`/api/images/cruise-images/${id}/`)
    return response.data
  },
  async create(data: Partial<CruiseImage>): Promise<CruiseImage> {
    const response = await api.post<CruiseImage>('/api/images/cruise-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<CruiseImage>): Promise<CruiseImage> {
    const response = await api.patch<CruiseImage>(`/api/images/cruise-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/cruise-images/${id}/`)
  },
}

