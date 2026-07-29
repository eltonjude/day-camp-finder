import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { braveSearch } from '../braveSearch'
import { fetchAll } from '../crawl'
import { gradeCamps } from '../grade'
import { labelFor } from '../tags'
import type { CampSource, Child, SearchCampsRequest, SearchCampsResponse } from '../types'

const MAX_SOURCES = 12
const RESULTS_PER_QUERY = 5

function buildQueries(town: string, children: Child[]): string[] {
  const queries = [
    `${town} summer day camps for kids`,
    `day camps near ${town} bus transportation`,
  ]

  const interestTags = new Set<string>()
  for (const child of children) {
    for (const trait of child.traits) {
      interestTags.add(trait)
    }
  }
  const activityTraits = [...interestTags].slice(0, 2)
  for (const trait of activityTraits) {
    queries.push(`${town} area ${labelFor(trait)} summer camp for kids`)
  }

  return queries.slice(0, 4)
}

export async function searchCampsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  let body: Partial<SearchCampsRequest>
  try {
    body = (await request.json()) as Partial<SearchCampsRequest>
  } catch {
    return { status: 400, jsonBody: { error: 'Invalid JSON body' } }
  }

  const town = body.town?.trim()
  const children = body.children ?? []

  if (!town) {
    return { status: 400, jsonBody: { error: 'town is required' } }
  }
  if (!process.env.BRAVE_API_KEY || !process.env.ANTHROPIC_API_KEY) {
    return {
      status: 503,
      jsonBody: {
        error:
          'Camp search is not configured. Set BRAVE_API_KEY and ANTHROPIC_API_KEY as Application Settings on this Static Web App.',
      },
    }
  }

  const warnings: string[] = []

  try {
    const queries = buildQueries(town, children)
    const searchResults = await Promise.allSettled(queries.map((q) => braveSearch(q, RESULTS_PER_QUERY)))

    const seen = new Set<string>()
    const candidates: { url: string; title: string }[] = []
    for (const result of searchResults) {
      if (result.status === 'rejected') {
        warnings.push(`A search request failed: ${result.reason?.message ?? result.reason}`)
        continue
      }
      for (const r of result.value) {
        if (!seen.has(r.url)) {
          seen.add(r.url)
          candidates.push({ url: r.url, title: r.title })
        }
      }
    }

    const toFetch = candidates.slice(0, MAX_SOURCES)
    const pages = await fetchAll(toFetch.map((c) => c.url))

    if (pages.length === 0) {
      warnings.push('No camp web pages could be read. Try a more specific town name.')
    }

    const sources: CampSource[] = pages.map((p, i) => ({
      id: `S${i + 1}`,
      url: p.url,
      title: p.title || toFetch.find((c) => c.url === p.url)?.title,
    }))

    const camps = await gradeCamps(town, children, sources, pages)

    const response: SearchCampsResponse = {
      town,
      generatedAt: new Date().toISOString(),
      sources,
      camps,
      warnings: warnings.length ? warnings : undefined,
    }
    return { status: 200, jsonBody: response }
  } catch (err) {
    context.error(err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { status: 500, jsonBody: { error: message } }
  }
}

app.http('searchCamps', {
  route: 'search-camps',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: searchCampsHandler,
})
