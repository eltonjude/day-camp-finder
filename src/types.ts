export interface TagOption {
  id: string
  label: string
  category: 'activity' | 'vibe'
}

// Shared vocabulary used by both children (interests/personality) and camps (tags),
// so overlap between the two can be scored directly.
export const TAG_OPTIONS: TagOption[] = [
  { id: 'sports', label: 'Sports & Team Games', category: 'activity' },
  { id: 'swimming', label: 'Swimming & Water Play', category: 'activity' },
  { id: 'arts-crafts', label: 'Arts & Crafts', category: 'activity' },
  { id: 'music', label: 'Music', category: 'activity' },
  { id: 'drama', label: 'Drama & Theater', category: 'activity' },
  { id: 'dance', label: 'Dance', category: 'activity' },
  { id: 'stem', label: 'STEM & Coding', category: 'activity' },
  { id: 'nature', label: 'Nature & Outdoors', category: 'activity' },
  { id: 'hiking', label: 'Hiking & Adventure', category: 'activity' },
  { id: 'animals', label: 'Animals', category: 'activity' },
  { id: 'cooking', label: 'Cooking & Baking', category: 'activity' },
  { id: 'martial-arts', label: 'Martial Arts', category: 'activity' },
  { id: 'games-puzzles', label: 'Games & Puzzles', category: 'activity' },
  { id: 'academics', label: 'Academic Enrichment', category: 'activity' },
  { id: 'ropes-course', label: 'Ropes Course & Climbing', category: 'activity' },
  { id: 'energetic', label: 'Energetic / Active', category: 'vibe' },
  { id: 'calm-quiet', label: 'Calm / Quiet', category: 'vibe' },
  { id: 'social-team', label: 'Social / Team-Oriented', category: 'vibe' },
  { id: 'independent', label: 'Independent', category: 'vibe' },
  { id: 'creative', label: 'Creative', category: 'vibe' },
  { id: 'competitive', label: 'Competitive', category: 'vibe' },
  { id: 'structured', label: 'Likes Structure', category: 'vibe' },
  { id: 'free-play', label: 'Likes Free Play', category: 'vibe' },
  { id: 'small-group', label: 'Small Groups', category: 'vibe' },
  { id: 'shy-warmup', label: 'Shy / Needs Warm-up', category: 'vibe' },
]

export interface Child {
  id: string
  name: string
  age: number
  traits: string[]
  notes?: string
}

export interface ChildFit {
  childId: string
  eligible: boolean
  score: number
  reasoning: string
}

export interface CampSource {
  id: string
  url: string
  title?: string
}

export interface CampResult {
  name: string
  organization?: string
  location?: string
  ageMin?: number
  ageMax?: number
  weeksOrDates?: string
  startDate?: string
  endDate?: string
  costPerWeek?: string
  price?: string
  registrationStartDate?: string
  registrationNotes?: string
  transportationOffered?: boolean
  transportationDetails?: string
  tags?: string[]
  summary: string
  sourceIds: string[]
  childFit: ChildFit[]
  dateFitNote?: string
  isBestPick?: boolean
}

export interface SearchCampsResponse {
  area: string
  session: string
  year: number
  dateFrom: string
  dateTo: string
  generatedAt: string
  sources: CampSource[]
  camps: CampResult[]
  bestPickName?: string
  bestPickReason?: string
  preview?: boolean
  warnings?: string[]
}

export interface SearchCampsRequest {
  area: string
  session: string
  year: number
  dateFrom: string
  dateTo: string
  children: Child[]
}

export interface Booking {
  id: string
  camp: CampResult
  sources: CampSource[]
  area: string
  session: string
  year: number
  dateFrom: string
  dateTo: string
  notify: boolean
  createdAt: string
  campRemindedAt?: string
  registrationRemindedAt?: string
}

export type AppTab = 'find' | 'bookings' | 'family'
