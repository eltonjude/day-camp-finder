import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { braveSearch } from '../braveSearch'
import { fetchAll } from '../crawl'
import { gradeCamps } from '../grade'
import { labelFor } from '../tags'
import { sessionLabel } from '../campPrompt'
import { previewSearch } from '../sampleCamps'
import type { CampSource, SearchCampsRequest, SearchCampsResponse } from '../types'

const MAX_SOURCES = 12
const RESULTS_PER_QUERY = 5

function buildQueries(request: SearchCampsRequest): string[] {
  const session = sessionLabel(request.session)
  const queries = [
    `${request.area} ${session} ${request.year} day camp for kids`,
    `${request.area} kids camp ${request.year} ${request.dateFrom} ${request.dateTo} registration`,
    `${request.area} ${session} camp ${request.year} ages price`,
  ]

  const interestTags = new Set<string>()
  for (const child of request.children) {
    for (const trait of child.traits) {
      interestTags.add(trait)
    }
  }
  const activityTraits = [...interestTags].slice(0, 2)
  for (const trait of activityTraits) {
    queries.push(`${request.area} ${labelFor(trait)} ${session} camp ${request.year}`)
  }

  return queries.slice(0, 4)
}

function normalizeRequest(body: Partial<SearchCampsRequest> & { town?: string }): SearchCampsRequest | null {
  const area = (body.area ?? body.town)?.trim()
  if (!area) return null
  return {
    area,
    session: body.session?.trim() || 'summer-break',
    year: Number(body.year) || new Date().getFullYear(),
    dateFrom: body.dateFrom?.trim() || `${body.year || new Date().getFullYear()}-06-01`,
    dateTo: body.dateTo?.trim() || `${body.year || new Date().getFullYear()}-06-29`,
    children: body.children ?? [],
  }
}

export async function searchCampsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  let body: Partial<SearchCampsRequest> & { town?: string }
  try {
    body = (await request.json()) as Partial<SearchCampsRequest> & { town?: string }
  } catch {
    return {
      status: 400,
      jsonBody: { error: 'We could not read that request. Would you mind trying the search once more?' },
    }
  }

  const searchRequest = normalizeRequest(body)
  if (!searchRequest) {
    return {
      status: 400,
      jsonBody: { error: 'A city, ZIP, or state helps us look in the right place — whenever you’re ready.' },
    }
  }

  const keysReady = Boolean(process.env.BRAVE_API_KEY && process.env.ANTHROPIC_API_KEY)
  if (!keysReady) {
    return { status: 200, jsonBody: previewSearch(searchRequest) }
  }

  const warnings: string[] = []

  try {
    const queries = buildQueries(searchRequest)
    const searchResults = await Promise.allSettled(queries.map((q) => braveSearch(q, RESULTS_PER_QUERY)))

    const seen = new Set<string>()
    const candidates: { url: string; title: string }[] = []
    for (const result of searchResults) {
      if (result.status === 'rejected') {
        warnings.push('One of our web searches needed a second try. We kept going with the pages we could reach.')
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
      const preview = previewSearch(searchRequest)
      return {
        status: 200,
        jsonBody: {
          ...preview,
          warnings: [
            'We could not read camp pages just now, so we’re sharing a careful preview instead. You’re not doing anything wrong.',
            ...(preview.warnings ?? []),
          ],
        },
      }
    }

    const sources: CampSource[] = pages.map((p, i) => ({
      id: `S${i + 1}`,
      url: p.url,
      title: p.title || toFetch.find((c) => c.url === p.url)?.title,
    }))

    const graded = await gradeCamps(searchRequest, searchRequest.children, sources, pages)

    const response: SearchCampsResponse = {
      area: searchRequest.area,
      session: searchRequest.session,
      year: searchRequest.year,
      dateFrom: searchRequest.dateFrom,
      dateTo: searchRequest.dateTo,
      generatedAt: new Date().toISOString(),
      sources,
      camps: graded.camps,
      bestPickName: graded.bestPickName,
      bestPickReason: graded.bestPickReason,
      warnings: warnings.length ? warnings : undefined,
    }
    return { status: 200, jsonBody: response }
  } catch (err) {
    context.error(err)
    const preview = previewSearch(searchRequest)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      status: 200,
      jsonBody: {
        ...preview,
        warnings: [
          'Something got in the way of the live search, so we’re showing a kind preview instead. You’re not doing anything wrong.',
          message,
          ...(preview.warnings ?? []),
        ],
      },
    }
  }
}

app.http('searchCamps', {
  route: 'search-camps',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: searchCampsHandler,
})
