import type { CampResult, Child } from '../types'

export const GOOD_FIT_THRESHOLD = 50

export function fitFor(camp: CampResult, childId: string) {
  return camp.childFit.find((f) => f.childId === childId)
}

export function isGoodFit(camp: CampResult, childId: string): boolean {
  const fit = fitFor(camp, childId)
  return Boolean(fit && fit.eligible && fit.score >= GOOD_FIT_THRESHOLD)
}

export interface GroupedCamps {
  familyMatches: CampResult[]
  individualMatches: { child: Child; camps: CampResult[] }[]
}

export function groupCamps(camps: CampResult[], children: Child[]): GroupedCamps {
  if (children.length === 0) {
    return { familyMatches: [], individualMatches: [] }
  }

  const familyMatches: CampResult[] = []
  const remaining: CampResult[] = []

  for (const camp of camps) {
    const allGoodFit = children.length > 1 && children.every((c) => isGoodFit(camp, c.id))
    if (allGoodFit) {
      familyMatches.push(camp)
    } else {
      remaining.push(camp)
    }
  }

  const individualMatches = children
    .map((child) => ({
      child,
      camps: remaining.filter((camp) => isGoodFit(camp, child.id)),
    }))
    .filter((group) => group.camps.length > 0)

  return { familyMatches, individualMatches }
}
