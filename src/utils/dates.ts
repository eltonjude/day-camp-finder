const MS_PER_DAY = 24 * 60 * 60 * 1000

export function parseIsoDate(value?: string): Date | null {
  if (!value) return null
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return null
  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntil(target: Date, from = new Date()): number {
  return Math.round((startOfDay(target).getTime() - startOfDay(from).getTime()) / MS_PER_DAY)
}

export function isAboutOneWeekAway(target: Date, from = new Date()): boolean {
  const days = daysUntil(target, from)
  return days >= 0 && days <= 7
}

export function formatNiceDate(value?: string): string {
  const date = parseIsoDate(value)
  if (!date) return value?.trim() || 'We’ll need to check with the camp'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatNiceRange(from?: string, to?: string): string {
  if (!from && !to) return 'Dates to be confirmed'
  if (from && to) return `${formatNiceDate(from)} – ${formatNiceDate(to)}`
  return formatNiceDate(from || to)
}

export function campStartDate(camp: { startDate?: string; dateFrom?: string }, fallback?: string): string | undefined {
  return camp.startDate || fallback
}
