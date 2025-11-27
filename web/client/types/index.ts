export interface Destination {
  id: string
  name: string
  location: string
  image: string
  price: number
  rating: number
  reviewCount: number
  badge?: string
}

export interface Offer {
  id: string
  title: string
  description: string
  image: string
  discount: number
  destination: string
}

export interface Booking {
  id: string
  destination: string
  location: string
  image: string
  checkIn: string
  checkOut: string
  guests: number
  price: number
  status: "confirmed" | "pending" | "cancelled"
}

export interface Review {
  id: number
  author: string
  rating: number
  date: string
  comment: string
}

