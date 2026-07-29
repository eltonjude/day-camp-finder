import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { braveSearch } from './braveSearch.js'
import { fetchAll } from './crawl.js'
import { gradeCamps } from './grade.js'
import { labelFor } from './tags.js'
import type { CampSource, Child, SearchCampsRequest, SearchCampsResponse } from './types.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787
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
  // Only activity-like tags make good search terms; cap to keep the request fast/cheap.
  const activityTraits = [...interestTags].slice(0, 2)
  for (const trait of activityTraits) {
    queries.push(`${town} area ${labelFor(trait)} summer camp for kids`)
  }

  return queries.slice(0, 4)
}

app.post('/api/search-camps', async (req, res) => {
  const body = req.body as Partial<SearchCampsRequest>
  const town = body.town?.trim()
  const children = body.children ?? []

  if (!town) {
    res.status(400).json({ error: 'town is required' })
    return
  }
  if (!process.env.BRAVE_API_KEY || !process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({
      error:
        'Camp search is not configured on the server. Set BRAVE_API_KEY and ANTHROPIC_API_KEY environment variables (see server/.env.example).',
    })
    return
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
    res.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    braveConfigured: Boolean(process.env.BRAVE_API_KEY),
    anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
  })
})

app.listen(PORT, () => {
  console.log(`day-camp-finder server listening on http://localhost:${PORT}`)
})
