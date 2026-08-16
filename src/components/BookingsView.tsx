import { copy } from '../copy'
import type { Booking } from '../types'
import { formatNiceDate, formatNiceRange, isAboutOneWeekAway, parseIsoDate } from '../utils/dates'
import { CampCard } from './CampCard'

interface BookingsViewProps {
  bookings: Booking[]
  onRemove: (id: string) => void
  onToggleNotify: (booking: Booking) => void
}

function campStart(booking: Booking) {
  return parseIsoDate(booking.camp.startDate) ?? parseIsoDate(booking.dateFrom)
}

function registrationStart(booking: Booking) {
  return parseIsoDate(booking.camp.registrationStartDate)
}

export function BookingsView({ bookings, onRemove, onToggleNotify }: BookingsViewProps) {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl text-ink">{copy.bookings.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{copy.bookings.subtitle}</p>
      </header>

      {bookings.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-sand-300 bg-white/70 p-6 text-sm leading-relaxed text-ink-soft">
          {copy.bookings.empty}
        </p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => {
            const start = campStart(booking)
            const registration = registrationStart(booking)
            const campSoon = start ? isAboutOneWeekAway(start) : false
            const registrationSoon = registration ? isAboutOneWeekAway(registration) : false

            return (
              <li key={booking.id} className="space-y-3">
                {(campSoon || registrationSoon) && (
                  <p className="rounded-2xl bg-sun/15 px-4 py-3 text-sm text-ink">
                    {campSoon ? copy.bookings.dueSoon : copy.bookings.registrationSoon}
                  </p>
                )}
                <CampCard camp={booking.camp} sources={booking.sources} kids={[]} booked />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-sand-200 bg-white px-4 py-3 text-sm">
                  <p className="text-ink-soft">
                    Saved for {booking.area} · {formatNiceRange(booking.dateFrom, booking.dateTo)}
                    {booking.camp.registrationStartDate
                      ? ` · registration ${formatNiceDate(booking.camp.registrationStartDate)}`
                      : ''}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleNotify(booking)}
                      className={`rounded-full px-4 py-2 font-semibold ${
                        booking.notify ? 'bg-moss text-white' : 'bg-cream text-moss'
                      }`}
                    >
                      {booking.notify ? copy.bookings.notifyOn : copy.bookings.notifyOff}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(booking.id)}
                      className="rounded-full px-4 py-2 text-clay hover:bg-cream"
                    >
                      {copy.bookings.remove}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
