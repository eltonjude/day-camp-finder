import * as cheerio from 'cheerio'

export interface CrawledPage {
  url: string
  title: string
  text: string
}

const MAX_TEXT_LENGTH = 6000
const FETCH_TIMEOUT_MS = 8000

export async function fetchPageText(url: string): Promise<CrawledPage | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DayCampFinderBot/1.0; +https://example.com/bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })

    const contentType = res.headers.get('content-type') ?? ''
    if (!res.ok || !contentType.includes('text/html')) {
      return null
    }

    const html = await res.text()
    const $ = cheerio.load(html)
    $('script, style, nav, footer, header, aside, noscript, svg, iframe').remove()

    const title = $('title').first().text().trim()
    const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT_LENGTH)

    if (text.length < 200) return null

    return { url, title, text }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchAll(urls: string[]): Promise<CrawledPage[]> {
  const results = await Promise.allSettled(urls.map(fetchPageText))
  return results
    .filter((r): r is PromiseFulfilledResult<CrawledPage | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((page): page is CrawledPage => page !== null)
}
