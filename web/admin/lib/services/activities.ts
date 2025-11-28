import api from '@/lib/api'
import { ActivityCategory, Activity, ActivitySchedule, ApiResponse } from '@/types'

// Activity Categories
export const activityCategoriesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<ActivityCategory>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<ActivityCategory>>('/api/activities/categories/', { params })
    return response.data
  },
  async getById(id: string): Promise<ActivityCategory> {
    const response = await api.get<ActivityCategory>(`/api/activities/categories/${id}/`)
    return response.data
  },
  async create(data: Partial<ActivityCategory>): Promise<ActivityCategory> {
    const response = await api.post<ActivityCategory>('/api/activities/categories/', data)
    return response.data
  },
  async update(id: string, data: Partial<ActivityCategory>): Promise<ActivityCategory> {
    const response = await api.patch<ActivityCategory>(`/api/activities/categories/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/activities/categories/${id}/`)
  },
}

// Activities
export const activitiesService = {
  async getAll(page: number = 1, search?: string): Promise<ApiResponse<Activity>> {
    const params: any = { page }
    if (search) params.search = search
    const response = await api.get<ApiResponse<Activity>>('/api/activities/activities/', { params })
    return response.data
  },
  async getById(id: string): Promise<Activity> {
    const response = await api.get<Activity>(`/api/activities/activities/${id}/`)
    return response.data
  },
  async create(data: Partial<Activity>): Promise<Activity> {
    const response = await api.post<Activity>('/api/activities/activities/', data)
    return response.data
  },
  async update(id: string, data: Partial<Activity>): Promise<Activity> {
    const response = await api.patch<Activity>(`/api/activities/activities/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/activities/activities/${id}/`)
  },
}

// Activity Schedules
export const activitySchedulesService = {
  async getAll(page: number = 1, search?: string, activityId?: string): Promise<ApiResponse<ActivitySchedule>> {
    const params: any = { page }
    if (search) params.search = search
    if (activityId) params.activity = activityId
    const response = await api.get<ApiResponse<ActivitySchedule>>('/api/activities/schedules/', { params })
    return response.data
  },
  async getById(id: string): Promise<ActivitySchedule> {
    const response = await api.get<ActivitySchedule>(`/api/activities/schedules/${id}/`)
    return response.data
  },
  async create(data: Partial<ActivitySchedule>): Promise<ActivitySchedule> {
    const response = await api.post<ActivitySchedule>('/api/activities/schedules/', data)
    return response.data
  },
  async update(id: string, data: Partial<ActivitySchedule>): Promise<ActivitySchedule> {
    const response = await api.patch<ActivitySchedule>(`/api/activities/schedules/${id}/`, data)
    return response.data
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/activities/schedules/${id}/`)
  },
}

