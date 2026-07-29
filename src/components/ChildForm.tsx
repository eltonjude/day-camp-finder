import { useState } from 'react'
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ava"
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
        <div className="w-20">
          <label className="mb-1 block text-xs font-medium text-slate-500">Age</label>
          <input
            type="number"
            min={2}
            max={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="9"
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
      </div>

      <TagPicker selected={traits} onToggle={toggleTrait} />

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Notes (optional)</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. loves being outside, gets overwhelmed by loud groups"
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-900"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
          {initial ? 'Save changes' : 'Add child'}
        </button>
      </div>
    </form>
  )
}
