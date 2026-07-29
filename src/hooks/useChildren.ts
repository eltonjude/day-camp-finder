import { useEffect, useState } from 'react'
import type { Child } from '../types'

const STORAGE_KEY = 'day-camp-finder:children'

function load(): Child[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Child[]) : []
  } catch {
    return []
  }
}

export function useChildren() {
  const [children, setChildren] = useState<Child[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(children))
  }, [children])

  const addChild = (child: Omit<Child, 'id'>) => {
    setChildren((prev) => [...prev, { ...child, id: crypto.randomUUID() }])
  }

  const updateChild = (id: string, updates: Omit<Child, 'id'>) => {
    setChildren((prev) => prev.map((c) => (c.id === id ? { ...updates, id } : c)))
  }

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id))
  }

  return { children, addChild, updateChild, removeChild }
}
