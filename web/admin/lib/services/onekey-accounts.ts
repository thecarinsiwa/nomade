import api from '@/lib/api'
import { OneKeyAccount, ApiResponse } from '@/types'

export const onekeyAccountsService = {
  async getAllAccounts(page: number = 1, search?: string): Promise<ApiResponse<OneKeyAccount>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    const response = await api.get<ApiResponse<OneKeyAccount>>('/api/onekey/accounts/', { params })
    return response.data
  },

  async getAccountById(id: string): Promise<OneKeyAccount> {
    const response = await api.get<OneKeyAccount>(`/api/onekey/accounts/${id}/`)
    return response.data
  },

  async createAccount(accountData: Partial<OneKeyAccount>): Promise<OneKeyAccount> {
    const response = await api.post<OneKeyAccount>('/api/onekey/accounts/', accountData)
    return response.data
  },

  async updateAccount(id: string, accountData: Partial<OneKeyAccount>): Promise<OneKeyAccount> {
    const response = await api.patch<OneKeyAccount>(`/api/onekey/accounts/${id}/`, accountData)
    return response.data
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/api/onekey/accounts/${id}/`)
  },
}

