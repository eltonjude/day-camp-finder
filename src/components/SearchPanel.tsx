import { useEffect, useState } from 'react'

interface SearchPanelProps {
  town: string
  onTownChange: (town: string) => void
  onSearch: () => void
  loading: boolean
  disabled: boolean
}

const LOADING_MESSAGES = [
  'Searching the web for camps near you…',
  'Reading camp websites…',
  'Grading fit for your kids…',
]

export function SearchPanel({ town, onTownChange, onSearch, loading, disabled }: SearchPanelProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  const handleSearch = () => {
    setMessageIndex(0)
    onSearch()
  }

  useEffect(() => {
    if (!loading) return
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1))
    }, 3500)
    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <label className="mb-1 block text-xs font-medium text-slate-500">Your town</label>
      <div className="flex gap-2">
        <input
          value={town}
          onChange={(e) => onTownChange(e.target.value)}
          placeholder="e.g. Maplewood, NJ"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
        <button
          onClick={handleSearch}
          disabled={disabled || loading || !town.trim()}
          className="shrink-0 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Find camps'}
        </button>
      </div>
      {disabled && !loading && (
        <p className="mt-2 text-xs text-amber-600">Add at least one child above before searching.</p>
      )}
      {loading && <p className="mt-2 text-sm text-slate-500">{LOADING_MESSAGES[messageIndex]}</p>}
    </div>
  )
}
