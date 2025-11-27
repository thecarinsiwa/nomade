export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended' | 'deleted'
  email_verified: boolean
  created_at: string
  updated_at: string
  profile?: UserProfile
  addresses?: UserAddress[]
  payment_methods?: UserPaymentMethod[]
}

export interface UserProfile {
  id: string
  user: string
  user_email: string
  preferred_language: string
  preferred_currency: string
  timezone?: string
  notification_preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user: string
  user_email: string
  address_type: 'billing' | 'shipping' | 'home' | 'work' | 'other'
  street?: string
  city?: string
  postal_code?: string
  country?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface UserPaymentMethod {
  id: string
  user: string
  user_email: string
  payment_type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'other'
  card_last_four?: string
  card_brand?: string
  expiry_date?: string
  is_default: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  count?: number
  next?: string | null
  previous?: string | null
  results?: T[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  session_token?: string
}

