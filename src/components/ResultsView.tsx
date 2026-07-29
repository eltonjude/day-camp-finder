import type { Child, SearchCampsResponse } from '../types'
import { groupCamps } from '../utils/grouping'
import { CampCard } from './CampCard'

interface ResultsViewProps {
  results: SearchCampsResponse
  kids: Child[]
}

export function ResultsView({ results, kids }: ResultsViewProps) {
  const { familyMatches, individualMatches } = groupCamps(results.camps, kids)
  const hasAnyMatches = familyMatches.length > 0 || individualMatches.length > 0

  return (
    <div className="space-y-8">
      {results.warnings && results.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          {results.warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </div>
      )}

      {!hasAnyMatches && (
        <p className="text-sm text-slate-500">
          No strong matches found among {results.camps.length} camp{results.camps.length === 1 ? '' : 's'} discovered near{' '}
          {results.town}. Try broadening your kids' interests, or check the camps below.
        </p>
      )}

      {familyMatches.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
            🏕️ Great for the whole family
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {familyMatches.map((camp, i) => (
              <CampCard key={`family-${i}`} camp={camp} sources={results.sources} kids={kids} />
            ))}
          </div>
        </section>
      )}

      {individualMatches.map(({ child, camps }) => (
        <section key={child.id}>
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
            ⭐ Just right for {child.name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {camps.map((camp, i) => (
              <CampCard key={`${child.id}-${i}`} camp={camp} sources={results.sources} kids={kids} highlightChildId={child.id} />
            ))}
          </div>
        </section>
      ))}

      {results.camps.length > 0 && (
        <details className="text-sm text-slate-500">
          <summary className="cursor-pointer">All {results.camps.length} camps found (including weaker matches)</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {results.camps.map((camp, i) => (
              <CampCard key={`all-${i}`} camp={camp} sources={results.sources} kids={kids} />
            ))}
          </div>
        </details>
      )}

      <p className="text-xs text-slate-400">
        Details are AI-summarized from camp websites and may be incomplete or out of date — always verify dates,
        pricing, and transportation directly with the camp before enrolling.
      </p>
    </div>
  )
}
