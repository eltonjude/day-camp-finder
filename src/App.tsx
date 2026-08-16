import { useState } from 'react'
import { searchCamps } from './api'
import { AppNav } from './components/AppNav'
import { BookingsView } from './components/BookingsView'
import { FamilyView } from './components/FamilyView'
import { ResultsView } from './components/ResultsView'
import { SearchPanel } from './components/SearchPanel'
import { defaultDatesForSession, formatArea, type SessionId } from './constants'
import { copy } from './copy'
import { useBookings } from './hooks/useBookings'
import { useChildren } from './hooks/useChildren'
import { requestNotifyPermission, useReminders } from './hooks/useReminders'
import type { AppTab, Booking, SearchCampsResponse } from './types'

function App() {
  const { children, addChild, updateChild, removeChild } = useChildren()
  const { bookings, addBooking, removeBooking, setNotify, markCampReminded, markRegistrationReminded, isBooked } =
    useBookings()
  useReminders(bookings, markCampReminded, markRegistrationReminded)

  const [tab, setTab] = useState<AppTab>('find')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [session, setSession] = useState<SessionId>('summer-break')
  const [year, setYear] = useState(2027)
  const defaults = defaultDatesForSession('summer-break', 2027)
  const [dateFrom, setDateFrom] = useState(defaults.from)
  const [dateTo, setDateTo] = useState(defaults.to)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [results, setResults] = useState<SearchCampsResponse | null>(null)

  const area = formatArea(city, state)
  const canSearch = Boolean(city.trim() || state.trim())

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 4200)
  }

  const handleSessionChange = (next: SessionId) => {
    setSession(next)
    const dates = defaultDatesForSession(next, year)
    setDateFrom(dates.from)
    setDateTo(dates.to)
  }

  const handleYearChange = (next: number) => {
    setYear(next)
    const dates = defaultDatesForSession(session, next)
    setDateFrom(dates.from)
    setDateTo(dates.to)
  }

  const handleSearch = async () => {
    if (!canSearch) return
    setLoading(true)
    setError(null)
    try {
      const res = await searchCamps({
        area,
        session,
        year,
        dateFrom,
        dateTo,
        children,
      })
      setResults(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.generic)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCamp = (campName: string) => {
    if (!results) return
    const camp = results.camps.find((c) => c.name === campName)
    if (!camp) return
    addBooking({
      camp,
      sources: results.sources,
      area: results.area,
      session: results.session,
      year: results.year,
      dateFrom: results.dateFrom,
      dateTo: results.dateTo,
    })
    showToast(copy.toast.booked)
  }

  const handleToggleNotify = async (booking: Booking) => {
    if (booking.notify) {
      setNotify(booking.id, false)
      showToast(copy.toast.notifyOff)
      return
    }
    const permission = await requestNotifyPermission()
    if (permission === 'denied') {
      showToast(copy.bookings.notifyDenied)
      setNotify(booking.id, true)
      return
    }
    if (permission === 'unsupported') {
      showToast(copy.bookings.notifyDenied)
      setNotify(booking.id, true)
      return
    }
    setNotify(booking.id, true)
    showToast(copy.toast.notifyOn)
  }

  const handleRemove = (id: string) => {
    removeBooking(id)
    showToast(copy.toast.removed)
  }

  return (
    <div className="min-h-screen bg-cream pb-24 text-ink md:pb-10">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">United States camp finder</p>
            <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{copy.appName}</h1>
            <p className="mt-2 text-sm font-semibold text-moss">{copy.tagline}</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{copy.welcome}</p>
          </div>
          <div className="hidden h-24 w-24 shrink-0 rounded-full bg-sun/80 shadow-inner md:block" aria-hidden="true" />
        </header>

        <AppNav tab={tab} bookingCount={bookings.length} onChange={setTab} />

        {tab === 'find' && (
          <div className="space-y-8">
            <SearchPanel
              city={city}
              state={state}
              session={session}
              year={year}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onCityChange={setCity}
              onStateChange={setState}
              onSessionChange={handleSessionChange}
              onYearChange={handleYearChange}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onSearch={handleSearch}
              loading={loading}
              canSearch={canSearch}
            />
            {error && (
              <p className="rounded-2xl border border-clay/30 bg-clay/10 p-4 text-sm text-ink">{error}</p>
            )}
            {results && (
              <ResultsView
                results={results}
                kids={children}
                isBooked={(name) => isBooked(name, results.area, results.year)}
                onAdd={handleAddCamp}
              />
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <BookingsView bookings={bookings} onRemove={handleRemove} onToggleNotify={handleToggleNotify} />
        )}

        {tab === 'family' && (
          <FamilyView kids={children} onAdd={addChild} onUpdate={updateChild} onRemove={removeChild} />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-30 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-center text-sm text-cream shadow-lg md:bottom-6">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
