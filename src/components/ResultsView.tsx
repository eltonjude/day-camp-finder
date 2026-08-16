import { copy } from '../copy'
import type { Child, SearchCampsResponse } from '../types'
import { chooseBestCamp, otherCamps } from '../utils/ranking'
import { CampCard } from './CampCard'

interface ResultsViewProps {
  results: SearchCampsResponse
  kids: Child[]
  isBooked: (campName: string) => boolean
  onAdd: (campName: string) => void
}

export function ResultsView({ results, kids, isBooked, onAdd }: ResultsViewProps) {
  const best = chooseBestCamp(results, kids)
  const others = otherCamps(results, best)

  return (
    <div className="space-y-10">
      {results.warnings && results.warnings.length > 0 && (
        <div className="rounded-2xl border border-sun/40 bg-sun/10 p-4 text-sm text-ink">
          {results.warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

      {results.camps.length === 0 && <p className="text-sm leading-relaxed text-ink-soft">{copy.results.empty}</p>}

      {best && (
        <section>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">{copy.results.bestPickTitle}</p>
          <h2 className="mb-2 font-display text-2xl text-ink">{best.name}</h2>
          {results.bestPickReason && (
            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{results.bestPickReason}</p>
          )}
          <CampCard
            camp={best}
            sources={results.sources}
            kids={kids}
            featured
            booked={isBooked(best.name)}
            onAdd={() => onAdd(best.name)}
          />
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-2xl text-ink">{copy.results.othersTitle}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {others.map((camp) => (
              <CampCard
                key={camp.name}
                camp={camp}
                sources={results.sources}
                kids={kids}
                booked={isBooked(camp.name)}
                onAdd={() => onAdd(camp.name)}
              />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs leading-relaxed text-ink-soft">{copy.results.verify}</p>
    </div>
  )
}
