import { copy } from '../copy'
import type { CampResult, CampSource, Child } from '../types'
import { formatNiceDate, formatNiceRange } from '../utils/dates'

interface CampCardProps {
  camp: CampResult
  sources: CampSource[]
  kids: Child[]
  featured?: boolean
  booked?: boolean
  onAdd?: () => void
}

export function CampCard({ camp, sources, kids, featured, booked, onAdd }: CampCardProps) {
  const camSources = camp.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is CampSource => Boolean(s))

  const ageRange =
    camp.ageMin != null || camp.ageMax != null
      ? `Ages ${camp.ageMin ?? '?'}–${camp.ageMax ?? '?'}`
      : 'Ages we’ll confirm with the camp'

  const price = camp.price || camp.costPerWeek || 'We’ll need to check with the camp'
  const dates = camp.weeksOrDates || formatNiceRange(camp.startDate, camp.endDate)
  const registration = formatNiceDate(camp.registrationStartDate)

  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-sm ${
        featured ? 'border-sun/70 ring-2 ring-sun/30' : 'border-sand-200'
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl text-ink">{camp.name}</h3>
        {camp.organization && <span className="text-xs text-ink-soft">{camp.organization}</span>}
      </div>

      <dl className="mt-3 grid gap-2 text-sm text-ink sm:grid-cols-2">
        {camp.location && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-moss">Where</dt>
            <dd>{camp.location}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">Price</dt>
          <dd>{price}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">Dates</dt>
          <dd>{dates}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">Registration opens</dt>
          <dd>{registration}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-moss">Ages</dt>
          <dd>{ageRange}</dd>
        </div>
      </dl>

      {camp.registrationNotes && <p className="mt-2 text-sm text-ink-soft">{camp.registrationNotes}</p>}
      {camp.dateFitNote && <p className="mt-2 text-sm text-moss">{camp.dateFitNote}</p>}

      {camp.transportationOffered && (
        <p className="mt-2 text-sm text-moss">
          A bus or shuttle is mentioned{camp.transportationDetails ? ` — ${camp.transportationDetails}` : ''}.
        </p>
      )}

      {camp.tags && camp.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {camp.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-cream px-2.5 py-0.5 text-xs text-ink-soft">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink">{camp.summary}</p>

      {kids.length > 0 && camp.childFit.length > 0 && (
        <div className="mt-4 space-y-2">
          {camp.childFit.map((fit) => {
            const child = kids.find((c) => c.id === fit.childId)
            if (!child) return null
            return (
              <div key={fit.childId}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-20 shrink-0 truncate font-medium text-ink">{child.name}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-sand-100">
                    <div
                      className={`h-1.5 rounded-full ${fit.eligible ? 'bg-moss' : 'bg-sand-300'}`}
                      style={{ width: `${fit.eligible ? fit.score : 0}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs text-ink-soft">
                    {fit.eligible ? `${fit.score}` : '—'}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{fit.reasoning}</p>
              </div>
            )
          })}
        </div>
      )}

      {camSources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-sand-100 pt-3">
          {camSources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-moss underline-offset-2 hover:underline"
            >
              {s.title || s.url}
            </a>
          ))}
        </div>
      )}

      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={booked}
          className="mt-4 w-full rounded-full bg-moss px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-moss-dark disabled:bg-sand-300 disabled:text-ink-soft"
        >
          {booked ? copy.results.alreadyBooked : copy.results.add}
        </button>
      )}
    </article>
  )
}
