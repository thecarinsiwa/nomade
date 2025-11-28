import api from '@/lib/api'
import { UserPaymentMethod, ApiResponse } from '@/types'

export const paymentMethodsService = {
  async getAllPaymentMethods(page: number = 1, search?: string, userId?: string): Promise<ApiResponse<UserPaymentMethod>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (userId) {
      params.user = userId
    }
    const response = await api.get<ApiResponse<UserPaymentMethod>>('/api/users/payment-methods/', { params })
    return response.data
  },

  async getPaymentMethodById(id: string): Promise<UserPaymentMethod> {
    const response = await api.get<UserPaymentMethod>(`/api/users/payment-methods/${id}/`)
    return response.data
  },

  async createPaymentMethod(paymentData: Partial<UserPaymentMethod>): Promise<UserPaymentMethod> {
    const response = await api.post<UserPaymentMethod>('/api/users/payment-methods/', paymentData)
    return response.data
  },

  async updatePaymentMethod(id: string, paymentData: Partial<UserPaymentMethod>): Promise<UserPaymentMethod> {
    const response = await api.patch<UserPaymentMethod>(`/api/users/payment-methods/${id}/`, paymentData)
    return response.data
  },

  async deletePaymentMethod(id: string): Promise<void> {
    await api.delete(`/api/users/payment-methods/${id}/`)
  },
}

