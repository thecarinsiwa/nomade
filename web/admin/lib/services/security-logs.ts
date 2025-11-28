import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface AuditLog {
  id: string
  user?: string
  user_email?: string
  action: string
  table_name?: string
  record_id?: string
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  created_at: string
}

export const securityLogsService = {
  async getAllLogs(
    page: number = 1,
    userId?: string,
    action?: string,
    tableName?: string
  ): Promise<ApiResponse<AuditLog>> {
    const params: any = { page }
    if (userId) {
      params.user_id = userId
    }
    if (action) {
      params.action = action
    }
    if (tableName) {
      params.table_name = tableName
    }
    const response = await api.get<ApiResponse<AuditLog>>('/api/security/audit-logs/', { params })
    return response.data
  },

  async getLogById(id: string): Promise<AuditLog> {
    const response = await api.get<AuditLog>(`/api/security/audit-logs/${id}/`)
    return response.data
  },
}

