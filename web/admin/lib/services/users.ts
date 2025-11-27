import api from '@/lib/api'
import { User, ApiResponse, LoginCredentials, LoginResponse } from '@/types'

export const usersService = {
  // Authentification
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/users/users/login/', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/api/users/users/logout/')
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/users/users/me/')
    return response.data
  },

  // CRUD Users
  async getAllUsers(page: number = 1, search?: string): Promise<ApiResponse<User>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    const response = await api.get<ApiResponse<User>>('/api/users/users/', { params })
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/api/users/users/${id}/`)
    return response.data
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await api.post<User>('/api/users/users/register/', userData)
    return response.data
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.patch<User>(`/api/users/users/${id}/`, userData)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/users/users/${id}/`)
  },
}

