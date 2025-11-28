import api from '@/lib/api'
import { OneKeyPromotion, ApiResponse } from '@/types'

export const onekeyPromotionsService = {
  async getAllPromotions(page: number = 1, search?: string): Promise<ApiResponse<OneKeyPromotion>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    const response = await api.get<ApiResponse<OneKeyPromotion>>('/api/onekey/promotions/', { params })
    return response.data
  },

  async getPromotionById(id: string): Promise<OneKeyPromotion> {
    const response = await api.get<OneKeyPromotion>(`/api/onekey/promotions/${id}/`)
    return response.data
  },

  async createPromotion(promotionData: Partial<OneKeyPromotion>): Promise<OneKeyPromotion> {
    const response = await api.post<OneKeyPromotion>('/api/onekey/promotions/', promotionData)
    return response.data
  },

  async updatePromotion(id: string, promotionData: Partial<OneKeyPromotion>): Promise<OneKeyPromotion> {
    const response = await api.patch<OneKeyPromotion>(`/api/onekey/promotions/${id}/`, promotionData)
    return response.data
  },

  async deletePromotion(id: string): Promise<void> {
    await api.delete(`/api/onekey/promotions/${id}/`)
  },
}

