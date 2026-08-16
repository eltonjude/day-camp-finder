import { copy } from '../copy'
import type { AppTab } from '../types'

interface AppNavProps {
  tab: AppTab
  bookingCount: number
  onChange: (tab: AppTab) => void
}

const items: { id: AppTab; label: string }[] = [
  { id: 'find', label: copy.nav.find },
  { id: 'bookings', label: copy.nav.bookings },
  { id: 'family', label: copy.nav.family },
]

export function AppNav({ tab, bookingCount, onChange }: AppNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-sand-200 bg-white/95 px-3 py-2 backdrop-blur md:static md:mb-8 md:rounded-full md:border md:px-2 md:py-1.5">
      <ul className="mx-auto flex max-w-xl justify-around md:justify-center md:gap-1">
        {items.map((item) => {
          const active = tab === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-moss text-white' : 'text-ink-soft hover:bg-cream'
                }`}
              >
                {item.label}
                {item.id === 'bookings' && bookingCount > 0 ? ` (${bookingCount})` : ''}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
