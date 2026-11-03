import type { Studio } from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function fetchStudios(): Promise<Studio[]> {
  const response = await fetch(`${API_BASE_URL}/studios`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Unable to load studios (status ${response.status}).`)
  }

  const data = (await response.json()) as Array<Studio & { _id?: string }>

  if (!Array.isArray(data)) {
    throw new Error('The studios API returned an invalid response.')
  }

  return data.map((item) => ({
    ...item,
    id: item.id || (item._id ? String(item._id) : ''),
  })).filter((studio) => studio.id)
}

export async function fetchFeaturedStudios(): Promise<Studio[]> {
  const response = await fetch(`${API_BASE_URL}/featured-studios`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Unable to load featured studios (status ${response.status}).`)
  }

  const data = (await response.json()) as Array<Studio & { _id?: string }>
  if (!Array.isArray(data)) {
    throw new Error('The featured studios API returned an invalid response.')
  }

  return data.map((item) => ({
    ...item,
    id: item.id || (item._id ? String(item._id) : ''),
  })).filter((studio) => studio.id)
}

export async function fetchStudio(id: string): Promise<Studio | null> {
  const response = await fetch(`${API_BASE_URL}/studio/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  })

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`Unable to load studio details (status ${response.status}).`)
  }

  const item = (await response.json()) as Studio & { _id?: string }
  const normalized = {
    ...item,
    id: item.id || (item._id ? String(item._id) : ''),
  }

  return normalized.id ? normalized : null
}
