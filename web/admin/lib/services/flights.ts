import api from '@/lib/api'
import { 
  Airline, Airport, FlightClass, Flight, FlightAvailability, FlightImage, AirlineImage, AirportImage,
  ApiResponse 
} from '@/types'

// Airlines
export const airlinesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Airline>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Airline>>('/api/flights/airlines/', { params })
    return response.data
  },
  async getById(id: string): Promise<Airline> {
    const response = await api.get<Airline>(`/api/flights/airlines/${id}/`)
    return response.data
  },
  async create(data: Partial<Airline>): Promise<Airline> {
    const response = await api.post<Airline>('/api/flights/airlines/', data)
    return response.data
  },
  async update(id: string, data: Partial<Airline>): Promise<Airline> {
    const response = await api.patch<Airline>(`/api/flights/airlines/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/flights/airlines/${id}/`)
  },
}

// Airports
export const airportsService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Airport>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Airport>>('/api/flights/airports/', { params })
    return response.data
  },
  async getById(id: string): Promise<Airport> {
    const response = await api.get<Airport>(`/api/flights/airports/${id}/`)
    return response.data
  },
  async create(data: Partial<Airport>): Promise<Airport> {
    const response = await api.post<Airport>('/api/flights/airports/', data)
    return response.data
  },
  async update(id: string, data: Partial<Airport>): Promise<Airport> {
    const response = await api.patch<Airport>(`/api/flights/airports/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/flights/airports/${id}/`)
  },
}

// Flight Classes
export const flightClassesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<FlightClass>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<FlightClass>>('/api/flights/flight-classes/', { params })
    return response.data
  },
  async getById(id: string): Promise<FlightClass> {
    const response = await api.get<FlightClass>(`/api/flights/flight-classes/${id}/`)
    return response.data
  },
  async create(data: Partial<FlightClass>): Promise<FlightClass> {
    const response = await api.post<FlightClass>('/api/flights/flight-classes/', data)
    return response.data
  },
  async update(id: string, data: Partial<FlightClass>): Promise<FlightClass> {
    const response = await api.patch<FlightClass>(`/api/flights/flight-classes/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/flights/flight-classes/${id}/`)
  },
}

// Flights
export const flightsService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Flight>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Flight>>('/api/flights/flights/', { params })
    return response.data
  },
  async getById(id: string): Promise<Flight> {
    const response = await api.get<Flight>(`/api/flights/flights/${id}/`)
    return response.data
  },
  async create(data: Partial<Flight>): Promise<Flight> {
    const response = await api.post<Flight>('/api/flights/flights/', data)
    return response.data
  },
  async update(id: string, data: Partial<Flight>): Promise<Flight> {
    const response = await api.patch<Flight>(`/api/flights/flights/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/flights/flights/${id}/`)
  },
}

// Flight Availability
export const flightAvailabilityService = {
  async getAll(page: number = 1, search?: string, flightId?: string, flightClassId?: string): Promise<ApiResponse<FlightAvailability>> {
    const params: any = { page }
    if (search) params.search = search
    if (flightId) params.flight_id = flightId
    if (flightClassId) params.flight_class_id = flightClassId
    const response = await api.get<ApiResponse<FlightAvailability>>('/api/flights/flight-availability/', { params })
    return response.data
  },
  async getById(id: string): Promise<FlightAvailability> {
    const response = await api.get<FlightAvailability>(`/api/flights/flight-availability/${id}/`)
    return response.data
  },
  async create(data: Partial<FlightAvailability>): Promise<FlightAvailability> {
    const response = await api.post<FlightAvailability>('/api/flights/flight-availability/', data)
    return response.data
  },
  async update(id: string, data: Partial<FlightAvailability>): Promise<FlightAvailability> {
    const response = await api.patch<FlightAvailability>(`/api/flights/flight-availability/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/flights/flight-availability/${id}/`)
  },
}

// Flight Images
export const flightImagesService = {
  async getAll(flightId?: string, imageType?: string): Promise<FlightImage[]> {
    const params: any = {}
    if (flightId) params.flight_id = flightId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<FlightImage>>('/api/images/flight-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<FlightImage> {
    const response = await api.get<FlightImage>(`/api/images/flight-images/${id}/`)
    return response.data
  },
  async create(data: Partial<FlightImage>): Promise<FlightImage> {
    const response = await api.post<FlightImage>('/api/images/flight-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<FlightImage>): Promise<FlightImage> {
    const response = await api.patch<FlightImage>(`/api/images/flight-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/flight-images/${id}/`)
  },
}

// Airline Images
export const airlineImagesService = {
  async getAll(airlineId?: string, imageType?: string): Promise<AirlineImage[]> {
    const params: any = {}
    if (airlineId) params.airline_id = airlineId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<AirlineImage>>('/api/images/airline-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<AirlineImage> {
    const response = await api.get<AirlineImage>(`/api/images/airline-images/${id}/`)
    return response.data
  },
  async create(data: Partial<AirlineImage>): Promise<AirlineImage> {
    const response = await api.post<AirlineImage>('/api/images/airline-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<AirlineImage>): Promise<AirlineImage> {
    const response = await api.patch<AirlineImage>(`/api/images/airline-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/airline-images/${id}/`)
  },
}

// Airport Images
export const airportImagesService = {
  async getAll(airportId?: string, imageType?: string): Promise<AirportImage[]> {
    const params: any = {}
    if (airportId) params.airport_id = airportId
    if (imageType) params.image_type = imageType
    const response = await api.get<ApiResponse<AirportImage>>('/api/images/airport-images/', { params })
    return response.data.results || []
  },
  async getById(id: string): Promise<AirportImage> {
    const response = await api.get<AirportImage>(`/api/images/airport-images/${id}/`)
    return response.data
  },
  async create(data: Partial<AirportImage>): Promise<AirportImage> {
    const response = await api.post<AirportImage>('/api/images/airport-images/', data)
    return response.data
  },
  async update(id: string, data: Partial<AirportImage>): Promise<AirportImage> {
    const response = await api.patch<AirportImage>(`/api/images/airport-images/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/images/airport-images/${id}/`)
  },
}

