import type { CampResult, Child, SearchCampsResponse } from '../types'

export function averageFit(camp: CampResult, children: Child[]): number {
  if (children.length === 0) return camp.isBestPick ? 90 : 70
  const scores = children.map((child) => {
    const fit = camp.childFit.find((f) => f.childId === child.id)
    if (!fit) return 0
    return fit.eligible ? fit.score : 0
  })
  return scores.reduce((sum, n) => sum + n, 0) / scores.length
}

export function chooseBestCamp(results: SearchCampsResponse, children: Child[]): CampResult | null {
  if (results.camps.length === 0) return null

  const named = results.bestPickName
    ? results.camps.find((c) => c.name.toLowerCase() === results.bestPickName?.toLowerCase())
    : undefined
  if (named) return named

  const flagged = results.camps.find((c) => c.isBestPick)
  if (flagged) return flagged

  return [...results.camps].sort((a, b) => averageFit(b, children) - averageFit(a, children))[0] ?? null
}

export function otherCamps(results: SearchCampsResponse, best: CampResult | null): CampResult[] {
  if (!best) return results.camps
  return results.camps.filter((camp) => camp.name !== best.name)
}
