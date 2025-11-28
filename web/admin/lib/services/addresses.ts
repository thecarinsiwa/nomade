import api from '@/lib/api'
import { UserAddress, ApiResponse } from '@/types'

export const addressesService = {
  async getAllAddresses(page: number = 1, search?: string, userId?: string): Promise<ApiResponse<UserAddress>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (userId) {
      params.user = userId
    }
    const response = await api.get<ApiResponse<UserAddress>>('/api/users/addresses/', { params })
    return response.data
  },

  async getAddressById(id: string): Promise<UserAddress> {
    const response = await api.get<UserAddress>(`/api/users/addresses/${id}/`)
    return response.data
  },

  async createAddress(addressData: Partial<UserAddress>): Promise<UserAddress> {
    const response = await api.post<UserAddress>('/api/users/addresses/', addressData)
    return response.data
  },

  async updateAddress(id: string, addressData: Partial<UserAddress>): Promise<UserAddress> {
    const response = await api.patch<UserAddress>(`/api/users/addresses/${id}/`, addressData)
    return response.data
  },

  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/api/users/addresses/${id}/`)
  },
}

