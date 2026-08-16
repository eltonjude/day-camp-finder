export const SESSIONS = [
  { id: 'summer-break', label: 'Summer Break', hint: 'Long, sunny days and plenty of time to explore' },
  { id: 'winter-break', label: 'Winter Break', hint: 'A cozy stretch when school is out for winter' },
  { id: 'spring-break', label: 'Spring Break', hint: 'A bright little pause in the school year' },
  { id: 'fall-break', label: 'Fall Break', hint: 'Crisp air, shorter days, and a welcome rest' },
  { id: 'thanksgiving-break', label: 'Thanksgiving Break', hint: 'A few extra days around the holiday table' },
  { id: 'holiday-break', label: 'Holiday Break', hint: 'The weeks around the winter holidays' },
  { id: 'year-round', label: 'Year-round / Anytime', hint: 'Whenever you need a caring place for them to be' },
] as const

export type SessionId = (typeof SESSIONS)[number]['id']

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const

export const SEARCH_YEARS = [2026, 2027, 2028]

export function sessionLabel(id: string): string {
  return SESSIONS.find((s) => s.id === id)?.label ?? id
}

export function defaultDatesForSession(session: SessionId, year: number): { from: string; to: string } {
  const pad = (n: number) => String(n).padStart(2, '0')
  const d = (month: number, day: number, y = year) => `${y}-${pad(month)}-${pad(day)}`

  switch (session) {
    case 'summer-break':
      return { from: d(6, 1), to: d(8, 15) }
    case 'winter-break':
      return { from: d(12, 20), to: d(1, 5, year + 1) }
    case 'spring-break':
      return { from: d(3, 16), to: d(4, 10) }
    case 'fall-break':
      return { from: d(10, 6), to: d(10, 17) }
    case 'thanksgiving-break':
      return { from: d(11, 23), to: d(11, 29) }
    case 'holiday-break':
      return { from: d(12, 21), to: d(1, 4, year + 1) }
    case 'year-round':
      return { from: d(1, 6), to: d(12, 18) }
  }
}

export function formatArea(city: string, state: string): string {
  const place = city.trim()
  const st = state.trim()
  if (place && st) return `${place}, ${st}`
  if (place) return place
  if (st) {
    const named = US_STATES.find((s) => s.code === st)?.name
    return named ? `${named}, ${st}` : st
  }
  return 'the United States'
}
