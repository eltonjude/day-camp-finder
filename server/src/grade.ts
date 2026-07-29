import Anthropic from '@anthropic-ai/sdk'
import type { Child, CampResult, CampSource } from './types.js'
import type { CrawledPage } from './crawl.js'
import { labelFor, TAG_LABELS } from './tags.js'

const MODEL = process.env.CLAUDE_MODEL ?? 'claude-sonnet-5'

const CAMP_TOOL = {
  name: 'submit_camp_results',
  description:
    'Submit the structured, graded list of distinct day camps found in the provided sources.',
  input_schema: {
    type: 'object' as const,
    properties: {
      camps: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Camp name' },
            organization: { type: 'string', description: 'Organization or provider running the camp' },
            location: { type: 'string', description: 'Town/city or address where the camp is held' },
            ageMin: { type: 'number', description: 'Minimum age accepted, if stated' },
            ageMax: { type: 'number', description: 'Maximum age accepted, if stated' },
            weeksOrDates: { type: 'string', description: 'Session dates/weeks offered, if stated' },
            costPerWeek: { type: 'string', description: 'Cost, as stated on the page (e.g. "$275/week"), or "Not listed"' },
            transportationOffered: { type: 'boolean', description: 'Whether bus/shuttle transportation is mentioned' },
            transportationDetails: { type: 'string', description: 'Which towns/stops are served, if mentioned' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Best-fit activity/vibe labels for this camp, drawn from the provided vocabulary list',
            },
            summary: { type: 'string', description: 'Neutral 2-3 sentence summary of the camp based only on the source text' },
            sourceIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'IDs (e.g. "S1") of the provided sources this camp entry was drawn from',
            },
            childFit: {
              type: 'array',
              description: 'One entry per child provided, in the same order',
              items: {
                type: 'object',
                properties: {
                  childId: { type: 'string' },
                  eligible: { type: 'boolean', description: 'Whether the child is within the camp age range (assume eligible if age range unstated)' },
                  score: { type: 'number', description: 'Fit score 0-100 combining age eligibility and interest/personality overlap' },
                  reasoning: { type: 'string', description: 'One sentence explaining the score' },
                },
                required: ['childId', 'eligible', 'score', 'reasoning'],
              },
            },
          },
          required: ['name', 'summary', 'sourceIds', 'childFit'],
        },
      },
    },
    required: ['camps'],
  },
}

function buildPrompt(town: string, children: Child[], sources: CampSource[], pages: CrawledPage[]): string {
  const childrenBlock = children
    .map((c) => {
      const traits = c.traits.map(labelFor).join(', ') || 'none specified'
      return `- id: ${c.id}, name: ${c.name}, age: ${c.age}, interests/personality: ${traits}`
    })
    .join('\n')

  const sourcesBlock = pages
    .map((p) => {
      const src = sources.find((s) => s.url === p.url)
      return `### Source ${src?.id} — ${p.title || p.url}\nURL: ${p.url}\n"""\n${p.text}\n"""`
    })
    .join('\n\n')

  return `You are helping a parent find day camps for their kids near ${town}.

Children:
${childrenBlock}

Below are excerpts crawled from web pages found by searching for day camps near ${town}. Some may be irrelevant (ads, unrelated businesses, camps in a totally different region, overnight-only camps) — ignore those. Some pages may describe the same camp; merge duplicates into a single entry citing all relevant source ids.

For each real day camp you find:
- Extract only what the text actually states. Use "Not listed" for cost/dates if absent. Do not invent ages, prices, or transportation details.
- Assess transportation based only on what's stated (bus/shuttle service and which towns/stops, if any).
- Choose 1-4 tags from this vocabulary that best describe the camp's activities/vibe: ${Object.keys(TAG_LABELS).join(', ')}
- For every child listed above, provide a childFit entry: age eligibility (assume eligible if the camp's age range isn't stated), and a 0-100 score reflecting how well the camp's activities and atmosphere match that child's stated interests and personality, with a one-sentence reason.

Sources:

${sourcesBlock}

Call submit_camp_results with the full list of distinct camps you found. If no real camps are described in the sources, submit an empty camps array.`
}

export async function gradeCamps(
  town: string,
  children: Child[],
  sources: CampSource[],
  pages: CrawledPage[],
): Promise<CampResult[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  if (pages.length === 0) {
    return []
  }

  const anthropic = new Anthropic({ apiKey })
  const prompt = buildPrompt(town, children, sources, pages)

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    tools: [CAMP_TOOL],
    tool_choice: { type: 'tool', name: 'submit_camp_results' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = message.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    return []
  }

  const input = toolUse.input as { camps?: CampResult[] }
  return input.camps ?? []
}
