import { useState } from 'react'
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
      <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-600">
        No kids added yet. Add one above to start finding camps.
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
            <div className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {child.name} <span className="font-normal text-slate-500">· age {child.age}</span>
                </p>
                {child.traits.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {child.traits.map((t) => (
                      <span key={t} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                        {labelFor(t)}
                      </span>
                    ))}
                  </div>
                )}
                {child.notes && <p className="mt-1.5 text-sm text-slate-500">{child.notes}</p>}
              </div>
              <div className="flex shrink-0 gap-3 text-sm">
                <button onClick={() => setEditingId(child.id)} className="text-teal-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => onRemove(child.id)} className="text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
