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

// OneKey Loyalty Program Types
export interface OneKeyAccount {
  id: string
  user: string
  user_email?: string
  onekey_number: string
  tier: 'silver' | 'gold' | 'platinum' | 'diamond'
  total_points: number
  created_at: string
  updated_at: string
}

export interface OneKeyReward {
  id: string
  onekey_account: string
  onekey_account_number?: string
  points: number
  reward_type: 'earned' | 'redeemed' | 'expired' | 'bonus'
  description?: string
  expires_at?: string
  created_at: string
}

export interface OneKeyTransaction {
  id: string
  onekey_account: string
  onekey_account_number?: string
  transaction_type: 'earn' | 'redeem' | 'expire' | 'adjustment'
  points: number
  booking_id?: string
  description?: string
  created_at: string
}

export interface OneKeyPoint {
  id: string
  onekey_account: string
  onekey_account_number?: string
  points: number
  status: 'active' | 'expired' | 'redeemed'
  earned_at: string
  expires_at?: string
  redeemed_at?: string
  description?: string
  created_at: string
}

export interface OneKeyPromotion {
  id: string
  title: string
  description?: string
  promotion_type: 'bonus_points' | 'tier_upgrade' | 'discount' | 'special_offer'
  points_multiplier?: number
  discount_percentage?: number
  discount_amount?: number
  min_purchase?: number
  valid_from: string
  valid_until: string
  is_active: boolean
  target_tier?: 'silver' | 'gold' | 'platinum' | 'diamond' | 'all'
  created_at: string
  updated_at: string
}

// Travel Products - Accommodations Types
export interface PropertyType {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface PropertyCategory {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface PropertyAddress {
  id: string
  street?: string
  city: string
  postal_code?: string
  country: string
  region?: string
  latitude?: number
  longitude?: number
  created_at: string
}

export interface Property {
  id: string
  name: string
  property_type?: string
  property_type_name?: string
  property_category?: string
  property_category_name?: string
  address?: string
  address_details?: PropertyAddress
  city?: string // From address.city (API serializer)
  country?: string // From address.country (API serializer)
  rating?: number
  total_reviews?: number
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  check_in_time?: string
  check_out_time?: string
  created_at: string
  updated_at: string
}

export interface PropertyAmenity {
  id: string
  name: string
  icon?: string
  created_at: string
}

export interface PropertyAmenityLink {
  id: string
  property: string
  amenity: string
  amenity_name?: string
  created_at: string
}

export interface PropertyImage {
  id: string
  property: string
  property_name?: string
  image_url: string
  image_type: 'main' | 'gallery' | 'room' | 'amenity' | 'other'
  display_order: number
  alt_text?: string
  created_at: string
}

export interface RoomImage {
  id: string
  room: string
  room_name?: string
  image_url: string
  image_type: 'main' | 'gallery' | 'bathroom' | 'bedroom' | 'view' | 'amenity' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  width?: number
  height?: number
  file_size?: number
  created_at: string
  updated_at: string
}

export interface PropertyDescription {
  id: string
  property: string
  language: string
  title?: string
  description?: string
  short_description?: string
  created_at: string
  updated_at: string
}

export interface RoomType {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Room {
  id: string
  property: string
  property_name?: string
  room_type?: string
  room_type_name?: string
  name: string
  room_number?: string
  capacity?: number
  max_guests?: number
  size_sqm?: number
  bed_type?: string
  status?: 'available' | 'unavailable' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface RoomAmenity {
  id: string
  name: string
  icon?: string
  created_at: string
}

export interface RoomAmenityLink {
  id: string
  room: string
  amenity: string
  amenity_name?: string
  created_at: string
}

export interface RoomAvailability {
  id: string
  room: string
  room_number?: string
  date: string
  is_available: boolean
  price?: number
  created_at: string
  updated_at: string
}

export interface RoomPricing {
  id: string
  room: string
  season: 'low' | 'mid' | 'high' | 'peak'
  price_per_night: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

// Travel Products - Flights Types
export interface Airline {
  id: string
  code: string
  name: string
  logo_url?: string
  country?: string
  flights_count?: number
  created_at: string
}

export interface Airport {
  id: string
  iata_code: string
  icao_code?: string
  name: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  timezone?: string
  departure_flights_count?: number
  arrival_flights_count?: number
  created_at: string
}

export interface FlightClass {
  id: string
  name: string
  description?: string
  availabilities_count?: number
  created_at: string
}

export interface Flight {
  id: string
  flight_number: string
  airline?: string | Airline
  airline_name?: string
  airline_code?: string
  departure_airport?: string | Airport
  departure_airport_name?: string
  departure_airport_code?: string
  departure_city?: string
  arrival_airport?: string | Airport
  arrival_airport_name?: string
  arrival_airport_code?: string
  arrival_city?: string
  departure_time?: string
  arrival_time?: string
  duration_minutes?: number
  duration_hours?: number
  aircraft_type?: string
  status: 'scheduled' | 'delayed' | 'cancelled' | 'completed'
  availabilities_count?: number
  availabilities?: FlightAvailability[]
  created_at: string
  updated_at: string
}

export interface FlightAvailability {
  id: string
  flight: string
  flight_info?: string
  flight_number?: string
  flight_class?: string
  flight_class_name?: string
  airline_name?: string
  departure_airport?: string
  arrival_airport?: string
  date: string
  available_seats: number
  price: number
  currency?: string
  created_at: string
  updated_at: string
}

export interface FlightImage {
  id: string
  flight: string
  flight_number?: string
  image_url: string
  image_type: 'aircraft' | 'cabin_economy' | 'cabin_business' | 'cabin_first' | 'meal' | 'service' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface AirlineImage {
  id: string
  airline: string
  airline_name?: string
  airline_code?: string
  image_url: string
  image_type: 'logo' | 'aircraft' | 'cabin' | 'service' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface AirportImage {
  id: string
  airport: string
  airport_name?: string
  airport_code?: string
  image_url: string
  image_type: 'main' | 'terminal' | 'gate' | 'lounge' | 'facility' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// Travel Products - Car Rentals Types
export interface CarRentalCompany {
  id: string
  name: string
  code?: string
  logo_url?: string
  locations_count?: number
  cars_count?: number
  created_at: string
}

export interface CarRentalLocation {
  id: string
  company: string
  company_name?: string
  company_code?: string
  name: string
  address?: string
  city?: string
  country?: string
  location_type: 'airport' | 'city' | 'station' | 'other'
  latitude?: number
  longitude?: number
  availabilities_count?: number
  created_at: string
}

export interface CarCategory {
  id: string
  name: string
  description?: string
  cars_count?: number
  created_at: string
}

export interface Car {
  id: string
  company?: string | CarRentalCompany
  company_name?: string
  company_code?: string
  category?: string | CarCategory
  category_name?: string
  make: string
  model: string
  year?: number
  transmission: 'manual' | 'automatic'
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'petrol'
  seats: number
  luggage_capacity?: number
  availabilities_count?: number
  availabilities?: CarAvailability[]
  status?: 'available' | 'rented' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface CarAvailability {
  id: string
  car: string
  car_model?: string
  car_info?: string
  location?: string
  location_name?: string
  location_city?: string
  company_name?: string
  start_date: string
  end_date: string
  available?: boolean
  is_available?: boolean
  price_per_day?: number
  currency?: string
  created_at: string
  updated_at: string
}

export interface CarImage {
  id: string
  car: string
  car_display?: string
  image_url: string
  image_type: 'main' | 'exterior' | 'interior' | 'dashboard' | 'trunk' | 'engine' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  angle?: string
  created_at: string
  updated_at: string
}

export interface GenericImage {
  id: string
  image_url: string
  image_type: 'logo' | 'icon' | 'background' | 'placeholder' | 'banner' | 'other'
  category?: string
  display_name?: string
  alt_text?: string
  target_url?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface CarRentalLocationImage {
  id: string
  location: string
  image_url: string
  image_type: 'main' | 'exterior' | 'interior' | 'facility' | 'parking' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// Travel Products - Cruises Types
export interface CruiseLine {
  id: string
  name: string
  logo_url?: string
  description?: string
  ships_count?: number
  cruises_count?: number
  created_at: string
}

export interface CruiseShip {
  id: string
  cruise_line?: string
  cruise_line_name?: string
  name: string
  capacity?: number
  year_built?: number
  cruises_count?: number
  created_at: string
}

export interface CruiseShipImage {
  id: string
  cruise_ship: string
  cruise_ship_name?: string
  image_url: string
  image_type: 'main' | 'exterior' | 'deck' | 'pool' | 'restaurant' | 'cabin' | 'entertainment' | 'spa' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  caption?: string
  created_at: string
  updated_at: string
}

export interface CruisePort {
  id: string
  name: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  departure_cruises_count?: number
  arrival_cruises_count?: number
  created_at: string
}

export interface Cruise {
  id: string
  name: string
  cruise_line?: string
  cruise_line_name?: string
  ship?: string
  ship_name?: string
  departure_port?: string
  departure_port_name?: string
  arrival_port?: string
  arrival_port_name?: string
  start_date?: string
  end_date?: string
  departure_date?: string
  arrival_date?: string
  duration_days?: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface CruiseImage {
  id: string
  cruise: string
  cruise_name?: string
  image_url: string
  image_type: 'main' | 'itinerary' | 'destination' | 'excursion' | 'other'
  display_order: number
  alt_text?: string
  is_primary: boolean
  caption?: string
  created_at: string
  updated_at: string
}

export interface CruiseCabinType {
  id: string
  name: string
  description?: string
  cabins_count?: number
  created_at: string
}

export interface CruiseCabin {
  id: string
  cruise?: string
  cruise_name?: string
  cabin_type?: string
  cabin_type_name?: string
  cabin_number: string
  capacity: number
  price: number
  is_available: boolean
  created_at: string
  updated_at: string
}

// Travel Products - Activities Types
export interface ActivityCategory {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Activity {
  id: string
  name: string
  category?: string
  category_name?: string
  description?: string
  location?: string
  duration_minutes?: number
  rating?: number
  created_at: string
  updated_at: string
}

export interface ActivitySchedule {
  id: string
  activity: string
  activity_name?: string
  start_date: string
  start_time: string
  available_spots: number
  price: number
  created_at: string
  updated_at: string
}

// Travel Products - Packages Types
export interface PackageType {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Package {
  id: string
  package_type?: string
  package_type_name?: string
  name: string
  description?: string
  discount_percent?: number
  status: 'active' | 'inactive'
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface PackageComponent {
  id: string
  package: string
  package_name?: string
  component_type: 'hotel' | 'flight' | 'car' | 'activity' | 'cruise'
  component_id: string
  created_at: string
}

