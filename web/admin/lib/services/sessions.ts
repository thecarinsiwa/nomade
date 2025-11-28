import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface UserSession {
  id: string
  user: string
  user_email: string
  session_token: string
  ip_address?: string
  user_agent?: string
  expires_at: string
  is_expired: boolean
  created_at: string
}

export const sessionsService = {
  async getAllSessions(page: number = 1, userId?: string): Promise<ApiResponse<UserSession>> {
    const params: any = { page }
    if (userId) {
      params.user = userId
    }
    const response = await api.get<ApiResponse<UserSession>>('/api/users/sessions/', { params })
    return response.data
  },

  async getSessionById(id: string): Promise<UserSession> {
    const response = await api.get<UserSession>(`/api/users/sessions/${id}/`)
    return response.data
  },

  async revokeSession(id: string): Promise<void> {
    await api.delete(`/api/users/sessions/${id}/revoke/`)
  },

  async revokeAllSessions(): Promise<void> {
    await api.delete('/api/users/sessions/revoke_all/')
  },
}

