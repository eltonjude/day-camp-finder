export interface WebResult {
  title: string
  url: string
  description?: string
}

export async function braveSearch(query: string, count = 6): Promise<WebResult[]> {
  const apiKey = process.env.BRAVE_API_KEY
  if (!apiKey) {
    throw new Error('BRAVE_API_KEY is not set')
  }

  const url = new URL('https://api.search.brave.com/res/v1/web/search')
  url.searchParams.set('q', query)
  url.searchParams.set('count', String(count))

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
  })

  if (!res.ok) {
    throw new Error(`Brave Search request failed (${res.status}) for query "${query}"`)
  }

  const data = (await res.json()) as {
    web?: { results?: { title: string; url: string; description?: string }[] }
  }

  return (data.web?.results ?? []).map((r) => ({
    title: r.title,
    url: r.url,
    description: r.description,
  }))
}
