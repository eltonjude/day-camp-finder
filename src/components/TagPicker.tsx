import { TAG_OPTIONS } from '../types'

interface TagPickerProps {
  selected: string[]
  onToggle: (tagId: string) => void
}

export function TagPicker({ selected, onToggle }: TagPickerProps) {
  const activities = TAG_OPTIONS.filter((t) => t.category === 'activity')
  const vibes = TAG_OPTIONS.filter((t) => t.category === 'vibe')

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Interests</p>
        <div className="flex flex-wrap gap-1.5">
          {activities.map((tag) => (
            <Chip key={tag.id} label={tag.label} active={selected.includes(tag.id)} onClick={() => onToggle(tag.id)} />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">Personality</p>
        <div className="flex flex-wrap gap-1.5">
          {vibes.map((tag) => (
            <Chip key={tag.id} label={tag.label} active={selected.includes(tag.id)} onClick={() => onToggle(tag.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active
          ? 'border-teal-600 bg-teal-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'
      }`}
    >
      {label}
    </button>
  )
}
