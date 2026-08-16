import { useState } from 'react'
import { copy } from '../copy'
import type { Child } from '../types'
import { TAG_OPTIONS } from '../types'
import { ChildForm } from './ChildForm'

interface ChildListProps {
  kids: Child[]
  onUpdate: (id: string, updates: Omit<Child, 'id'>) => void
  onRemove: (id: string) => void
}

const labelFor = (id: string) => TAG_OPTIONS.find((t) => t.id === id)?.label ?? id

export function ChildList({ kids, onUpdate, onRemove }: ChildListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (kids.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-sand-300 bg-white/70 p-5 text-sm leading-relaxed text-ink-soft">
        {copy.family.empty}
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {kids.map((child) => (
        <li key={child.id}>
          {editingId === child.id ? (
            <ChildForm
              initial={child}
              onSave={(updates) => {
                onUpdate(child.id, updates)
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-start justify-between rounded-3xl border border-sand-200 bg-white p-5 shadow-sm">
              <div>
                <p className="font-display text-lg text-ink">
                  {child.name} <span className="font-sans text-sm font-normal text-ink-soft">· age {child.age}</span>
                </p>
                {child.traits.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {child.traits.map((t) => (
                      <span key={t} className="rounded-full bg-moss/10 px-2.5 py-0.5 text-xs text-moss-dark">
                        {labelFor(t)}
                      </span>
                    ))}
                  </div>
                )}
                {child.notes && <p className="mt-2 text-sm text-ink-soft">{child.notes}</p>}
              </div>
              <div className="flex shrink-0 gap-3 text-sm">
                <button onClick={() => setEditingId(child.id)} className="text-moss hover:underline">
                  {copy.family.edit}
                </button>
                <button onClick={() => onRemove(child.id)} className="text-clay hover:underline">
                  {copy.family.remove}
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
