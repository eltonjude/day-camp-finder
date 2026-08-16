import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { braveSearch } from './braveSearch.js'
import { fetchAll } from './crawl.js'
import { gradeCamps } from './grade.js'
import { labelFor } from './tags.js'
import { sessionLabel } from './campPrompt.js'
import { previewSearch } from './sampleCamps.js'
import type { CampSource, SearchCampsRequest, SearchCampsResponse } from './types.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787
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

app.post('/api/search-camps', async (req, res) => {
  const request = normalizeRequest(req.body as Partial<SearchCampsRequest> & { town?: string })
  if (!request) {
    res.status(400).json({
      error: 'A city, ZIP, or state helps us look in the right place — whenever you’re ready.',
    })
    return
  }

  const keysReady = Boolean(process.env.BRAVE_API_KEY && process.env.ANTHROPIC_API_KEY)
  if (!keysReady) {
    res.json(previewSearch(request))
    return
  }

  const warnings: string[] = []

  try {
    const queries = buildQueries(request)
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
      const preview = previewSearch(request)
      res.json({
        ...preview,
        warnings: [
          'We could not read camp pages just now, so we’re sharing a careful preview instead. You’re not doing anything wrong.',
          ...(preview.warnings ?? []),
        ],
      })
      return
    }

    const sources: CampSource[] = pages.map((p, i) => ({
      id: `S${i + 1}`,
      url: p.url,
      title: p.title || toFetch.find((c) => c.url === p.url)?.title,
    }))

    const graded = await gradeCamps(request, request.children, sources, pages)

    const response: SearchCampsResponse = {
      area: request.area,
      session: request.session,
      year: request.year,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
      generatedAt: new Date().toISOString(),
      sources,
      camps: graded.camps,
      bestPickName: graded.bestPickName,
      bestPickReason: graded.bestPickReason,
      warnings: warnings.length ? warnings : undefined,
    }
    res.json(response)
  } catch (err) {
    const preview = previewSearch(request)
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.json({
      ...preview,
      warnings: [
        'Something got in the way of the live search, so we’re showing a kind preview instead. You’re not doing anything wrong.',
        message,
        ...(preview.warnings ?? []),
      ],
    })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'CampQuest',
    braveConfigured: Boolean(process.env.BRAVE_API_KEY),
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  })
})

app.listen(PORT, () => {
  console.log(`CampQuest server listening on http://localhost:${PORT}`)
})
