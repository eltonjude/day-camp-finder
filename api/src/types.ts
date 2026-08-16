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

export interface SearchCriteria {
  area: string
  session: string
  year: number
  dateFrom: string
  dateTo: string
}

export interface GradeResult {
  camps: CampResult[]
  bestPickName?: string
  bestPickReason?: string
}
