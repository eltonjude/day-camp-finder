import type { SearchCampsRequest, SearchCampsResponse } from './types'

export async function searchCamps(payload: SearchCampsRequest): Promise<SearchCampsResponse> {
  const res = await fetch('/api/search-camps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error ?? `Search failed (${res.status})`)
  }

  return data as SearchCampsResponse
}
