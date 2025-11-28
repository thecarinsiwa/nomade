import api from '@/lib/api'
import { UserProfile, ApiResponse } from '@/types'

export const profilesService = {
  async getAllProfiles(page: number = 1, search?: string): Promise<ApiResponse<UserProfile>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    const response = await api.get<ApiResponse<UserProfile>>('/api/users/profiles/', { params })
    return response.data
  },

  async getProfileById(id: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/api/users/profiles/${id}/`)
    return response.data
  },

  async createProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.post<UserProfile>('/api/users/profiles/', profileData)
    return response.data
  },

  async updateProfile(id: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<UserProfile>(`/api/users/profiles/${id}/`, profileData)
    return response.data
  },

  async deleteProfile(id: string): Promise<void> {
    await api.delete(`/api/users/profiles/${id}/`)
  },
}

