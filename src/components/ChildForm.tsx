import { useState } from 'react'
import { copy } from '../copy'
import type { Child } from '../types'
import { TagPicker } from './TagPicker'

interface ChildFormProps {
  initial?: Child
  onSave: (child: Omit<Child, 'id'>) => void
  onCancel?: () => void
}

export function ChildForm({ initial, onSave, onCancel }: ChildFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [age, setAge] = useState(initial?.age?.toString() ?? '')
  const [traits, setTraits] = useState<string[]>(initial?.traits ?? [])
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const toggleTrait = (tagId: string) => {
    setTraits((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAge = Number(age)
    if (!name.trim() || !parsedAge) return
    onSave({ name: name.trim(), age: parsedAge, traits, notes: notes.trim() || undefined })
    if (!initial) {
      setName('')
      setAge('')
      setTraits([])
      setNotes('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.family.name}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={copy.family.namePlaceholder}
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
        </div>
        <div className="w-24">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.family.age}</label>
          <input
            type="number"
            min={2}
            max={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="9"
            className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
        </div>
      </div>

      <TagPicker selected={traits} onToggle={toggleTrait} />

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-moss">{copy.family.notes}</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={copy.family.notesPlaceholder}
          className="w-full rounded-2xl border border-sand-200 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-moss"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm text-ink-soft hover:bg-cream">
            {copy.family.cancel}
          </button>
        )}
        <button type="submit" className="rounded-full bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-moss-dark">
          {initial ? copy.family.save : copy.family.add}
        </button>
      </div>
    </form>
  )
}
