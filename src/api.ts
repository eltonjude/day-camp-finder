import { copy } from './copy'
import type { SearchCampsRequest, SearchCampsResponse } from './types'

export async function searchCamps(payload: SearchCampsRequest): Promise<SearchCampsResponse> {
  const res = await fetch('/api/search-camps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : copy.errors.generic)
  }

  return data as SearchCampsResponse
}
