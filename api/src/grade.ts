import Anthropic from '@anthropic-ai/sdk'
import type { Child, CampResult, CampSource, GradeResult, SearchCriteria } from './types'
import type { CrawledPage } from './crawl'
import { buildCampSearchPrompt, CAMP_TOOL } from './campPrompt'

const MODEL = process.env.CLAUDE_MODEL ?? 'claude-sonnet-5'

export async function gradeCamps(
  criteria: SearchCriteria,
  children: Child[],
  sources: CampSource[],
  pages: CrawledPage[],
): Promise<GradeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set')
  }
  if (pages.length === 0) {
    return { camps: [] }
  }

  const anthropic = new Anthropic({ apiKey })
  const prompt = buildCampSearchPrompt(criteria, children, sources, pages)

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    tools: [CAMP_TOOL],
    tool_choice: { type: 'tool', name: 'submit_camp_results' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = message.content.find((b) => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    return { camps: [] }
  }

  const input = toolUse.input as {
    camps?: CampResult[]
    bestPickName?: string
    bestPickReason?: string
  }
  const camps = (input.camps ?? []).map((camp) => ({
    ...camp,
    price: camp.price || camp.costPerWeek,
    costPerWeek: camp.costPerWeek || camp.price,
    childFit: camp.childFit ?? [],
    isBestPick: Boolean(input.bestPickName && camp.name === input.bestPickName),
  }))

  return {
    camps,
    bestPickName: input.bestPickName,
    bestPickReason: input.bestPickReason,
  }
}
