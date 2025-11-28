import api from '@/lib/api'
import { PackageType, Package, PackageComponent, ApiResponse } from '@/types'

// Package Types
export const packageTypesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<PackageType>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<PackageType>>('/api/packages/package-types/', { params })
    return response.data
  },
  async getById(id: string): Promise<PackageType> {
    const response = await api.get<PackageType>(`/api/packages/package-types/${id}/`)
    return response.data
  },
  async create(data: Partial<PackageType>): Promise<PackageType> {
    const response = await api.post<PackageType>('/api/packages/package-types/', data)
    return response.data
  },
  async update(id: string, data: Partial<PackageType>): Promise<PackageType> {
    const response = await api.patch<PackageType>(`/api/packages/package-types/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/packages/package-types/${id}/`)
  },
}

// Packages
export const packagesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Package>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Package>>('/api/packages/packages/', { params })
    return response.data
  },
  async getById(id: string): Promise<Package> {
    const response = await api.get<Package>(`/api/packages/packages/${id}/`)
    return response.data
  },
  async create(data: Partial<Package>): Promise<Package> {
    const response = await api.post<Package>('/api/packages/packages/', data)
    return response.data
  },
  async update(id: string, data: Partial<Package>): Promise<Package> {
    const response = await api.patch<Package>(`/api/packages/packages/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/packages/packages/${id}/`)
  },
}

// Package Components
export const packageComponentsService = {
  async getAll(page: number = 1, search?: string, packageId?: string): Promise<ApiResponse<PackageComponent>> {
    const params: any = { page }
    if (search) params.search = search
    if (packageId) params.package = packageId
    const response = await api.get<ApiResponse<PackageComponent>>('/api/packages/components/', { params })
    return response.data
  },
  async getById(id: string): Promise<PackageComponent> {
    const response = await api.get<PackageComponent>(`/api/packages/components/${id}/`)
    return response.data
  },
  async create(data: Partial<PackageComponent>): Promise<PackageComponent> {
    const response = await api.post<PackageComponent>('/api/packages/components/', data)
    return response.data
  },
  async update(id: string, data: Partial<PackageComponent>): Promise<PackageComponent> {
    const response = await api.patch<PackageComponent>(`/api/packages/components/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/packages/components/${id}/`)
  },
}

