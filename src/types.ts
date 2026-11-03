export type Category = 'Photo Studio' | 'Film Stage' | 'Podcast Lounge' | 'Music Suite' | 'Workshop'

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

export interface Review {
  id: string
  author: string
  role: string
  rating: number
  date: string
  text: string
}

export interface Studio {
  id: string
  title: string
  category: Category
  rate: number
  deposit: number
  capacity: number
  location: string
  address: string
  images: string[]
  amenities: string[]
  overview: string
  rating: number
  reviewsCount: number
  size: number
  ownerEmail: string
  ownerName: string
  createdAt: string
  featured: boolean
  hostSince: string
  responseTime: string
  rules: string[]
  reviews: Review[]
}

export interface StudioDraft {
  title: string
  category: Category
  rate: number
  deposit: number
  capacity: number
  location: string
  address: string
  images: string[]
  amenities: string[]
  overview: string
  size: number
  rules: string[]
}

export interface User {
  name: string
  email: string
  photoURL?: string
}

interface StoredUser extends User {
  password: string
}

export type AuthUser = StoredUser

export interface Booking {
  id: string
  studioId: string
  userEmail: string
  userName: string
  date: string
  startTime: string
  endTime: string
  hours: number
  guests: number
  subtotal: number
  serviceFee: number
  deposit: number
  total: number
  status: BookingStatus
  notes: string
  createdAt: string
}

export interface BookingInput {
  studioId: string
  date: string
  startTime: string
  endTime: string
  guests: number
  notes: string
}

export interface ActionResult {
  ok: boolean
  message: string
  id?: string
}
