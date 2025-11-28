import api from '@/lib/api'
import { OneKeyReward, ApiResponse } from '@/types'

export const onekeyRewardsService = {
  async getAllRewards(page: number = 1, search?: string, accountId?: string): Promise<ApiResponse<OneKeyReward>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (accountId) {
      params.account = accountId
    }
    const response = await api.get<ApiResponse<OneKeyReward>>('/api/onekey/rewards/', { params })
    return response.data
  },

  async getRewardById(id: string): Promise<OneKeyReward> {
    const response = await api.get<OneKeyReward>(`/api/onekey/rewards/${id}/`)
    return response.data
  },

  async createReward(rewardData: Partial<OneKeyReward>): Promise<OneKeyReward> {
    const response = await api.post<OneKeyReward>('/api/onekey/rewards/', rewardData)
    return response.data
  },

  async updateReward(id: string, rewardData: Partial<OneKeyReward>): Promise<OneKeyReward> {
    const response = await api.patch<OneKeyReward>(`/api/onekey/rewards/${id}/`, rewardData)
    return response.data
  },

  async deleteReward(id: string): Promise<void> {
    await api.delete(`/api/onekey/rewards/${id}/`)
  },
}

