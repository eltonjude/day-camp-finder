import { copy } from '../copy'
import type { Child } from '../types'
import { ChildForm } from './ChildForm'
import { ChildList } from './ChildList'

interface FamilyViewProps {
  kids: Child[]
  onAdd: (child: Omit<Child, 'id'>) => void
  onUpdate: (id: string, updates: Omit<Child, 'id'>) => void
  onRemove: (id: string) => void
}

export function FamilyView({ kids, onAdd, onUpdate, onRemove }: FamilyViewProps) {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-display text-3xl text-ink">{copy.family.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{copy.family.subtitle}</p>
      </header>
      <ChildForm onSave={onAdd} />
      <ChildList kids={kids} onUpdate={onUpdate} onRemove={onRemove} />
    </section>
  )
}
