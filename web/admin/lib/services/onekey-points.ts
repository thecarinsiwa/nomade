import api from '@/lib/api'
import { OneKeyPoint, ApiResponse } from '@/types'

export const onekeyPointsService = {
  async getAllPoints(page: number = 1, search?: string, accountId?: string): Promise<ApiResponse<OneKeyPoint>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (accountId) {
      params.account = accountId
    }
    const response = await api.get<ApiResponse<OneKeyPoint>>('/api/onekey/points/', { params })
    return response.data
  },

  async getPointById(id: string): Promise<OneKeyPoint> {
    const response = await api.get<OneKeyPoint>(`/api/onekey/points/${id}/`)
    return response.data
  },

  async createPoint(pointData: Partial<OneKeyPoint>): Promise<OneKeyPoint> {
    const response = await api.post<OneKeyPoint>('/api/onekey/points/', pointData)
    return response.data
  },

  async updatePoint(id: string, pointData: Partial<OneKeyPoint>): Promise<OneKeyPoint> {
    const response = await api.patch<OneKeyPoint>(`/api/onekey/points/${id}/`, pointData)
    return response.data
  },

  async deletePoint(id: string): Promise<void> {
    await api.delete(`/api/onekey/points/${id}/`)
  },
}

