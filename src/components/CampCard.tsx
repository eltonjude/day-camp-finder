import type { CampResult, CampSource, Child } from '../types'

interface CampCardProps {
  camp: CampResult
  sources: CampSource[]
  kids: Child[]
  highlightChildId?: string
}

export function CampCard({ camp, sources, kids, highlightChildId }: CampCardProps) {
  const camSources = camp.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is CampSource => Boolean(s))

  const ageRange =
    camp.ageMin != null || camp.ageMax != null
      ? `Ages ${camp.ageMin ?? '?'}–${camp.ageMax ?? '?'}`
      : 'Ages not listed'

  const fitsToShow = highlightChildId ? camp.childFit.filter((f) => f.childId === highlightChildId) : camp.childFit

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{camp.name}</h3>
        {camp.organization && <span className="text-xs text-slate-500">{camp.organization}</span>}
      </div>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
        {camp.location && <span>📍 {camp.location}</span>}
        <span>{ageRange}</span>
        {camp.weeksOrDates && <span>🗓 {camp.weeksOrDates}</span>}
        {camp.costPerWeek && <span>💲 {camp.costPerWeek}</span>}
      </div>

      {camp.transportationOffered && (
        <p className="mt-1.5 text-sm text-teal-700 dark:text-teal-400">
          🚌 Bus/shuttle available{camp.transportationDetails ? ` — ${camp.transportationDetails}` : ''}
        </p>
      )}

      {camp.tags && camp.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {camp.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{camp.summary}</p>

      <div className="mt-3 space-y-1.5">
        {fitsToShow.map((fit) => {
          const child = kids.find((c) => c.id === fit.childId)
          if (!child) return null
          return (
            <div key={fit.childId} className="flex items-center gap-2 text-sm">
              <span className="w-16 shrink-0 truncate font-medium text-slate-700 dark:text-slate-200">{child.name}</span>
              <div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className={`h-1.5 rounded-full ${fit.eligible ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  style={{ width: `${fit.eligible ? fit.score : 0}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs text-slate-500">{fit.eligible ? `${fit.score}` : '—'}</span>
            </div>
          )
        })}
        {fitsToShow.map((fit) => (
          <p key={`reason-${fit.childId}`} className="text-xs text-slate-400">
            {kids.find((c) => c.id === fit.childId)?.name}: {fit.eligible ? fit.reasoning : `Not age-eligible — ${fit.reasoning}`}
          </p>
        ))}
      </div>

      {camSources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
          {camSources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              {s.title || s.url} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
