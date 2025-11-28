import api from '@/lib/api'
import { OneKeyTransaction, ApiResponse } from '@/types'

export const onekeyTransactionsService = {
  async getAllTransactions(page: number = 1, search?: string, accountId?: string): Promise<ApiResponse<OneKeyTransaction>> {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (accountId) {
      params.account = accountId
    }
    const response = await api.get<ApiResponse<OneKeyTransaction>>('/api/onekey/transactions/', { params })
    return response.data
  },

  async getTransactionById(id: string): Promise<OneKeyTransaction> {
    const response = await api.get<OneKeyTransaction>(`/api/onekey/transactions/${id}/`)
    return response.data
  },

  async createTransaction(transactionData: Partial<OneKeyTransaction>): Promise<OneKeyTransaction> {
    const response = await api.post<OneKeyTransaction>('/api/onekey/transactions/', transactionData)
    return response.data
  },

  async updateTransaction(id: string, transactionData: Partial<OneKeyTransaction>): Promise<OneKeyTransaction> {
    const response = await api.patch<OneKeyTransaction>(`/api/onekey/transactions/${id}/`, transactionData)
    return response.data
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/api/onekey/transactions/${id}/`)
  },
}

