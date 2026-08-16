import { useEffect, useState } from 'react'
import { SEARCH_YEARS, SESSIONS, US_STATES, type SessionId } from '../constants'
import { copy } from '../copy'

interface SearchPanelProps {
  city: string
  state: string
  session: SessionId
  year: number
  dateFrom: string
  dateTo: string
  onCityChange: (value: string) => void
  onStateChange: (value: string) => void
  onSessionChange: (value: SessionId) => void
  onYearChange: (value: number) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onSearch: () => void
  loading: boolean
  canSearch: boolean
}

export function SearchPanel({
  city,
  state,
  session,
  year,
  dateFrom,
  dateTo,
  onCityChange,
  onStateChange,
  onSessionChange,
  onYearChange,
  onDateFromChange,
  onDateToChange,
  onSearch,
  loading,
  canSearch,
}: SearchPanelProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const selected = SESSIONS.find((s) => s.id === session)

  useEffect(() => {
    if (!loading) return
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, copy.search.loading.length - 1))
    }, 2800)
    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className="rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
      <h2 className="font-display text-2xl text-ink">{copy.search.title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{copy.search.subtitle}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.cityLabel}</span>
          <input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder={copy.search.cityPlaceholder}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.stateLabel}</span>
          <select
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          >
            <option value="">{copy.search.anyState}</option>
            {US_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.sessionLabel}</span>
          <select
            value={session}
            onChange={(e) => onSessionChange(e.target.value as SessionId)}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          >
            {SESSIONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {selected && <span className="mt-1 block text-xs text-ink-soft">{selected.hint}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.yearLabel}</span>
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          >
            {SEARCH_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.fromLabel}</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.search.toLabel}</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={!canSearch || loading}
        className="mt-5 w-full rounded-full bg-moss px-4 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark disabled:cursor-not-allowed disabled:bg-sand-300"
      >
        {loading ? copy.search.submitting : copy.search.submit}
      </button>
      {!canSearch && !loading && <p className="mt-2 text-sm text-clay">{copy.search.needArea}</p>}
      {loading && <p className="mt-3 text-sm text-ink-soft">{copy.search.loading[messageIndex]}</p>}
    </div>
  )
}
