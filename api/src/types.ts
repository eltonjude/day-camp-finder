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
  costPerWeek?: string
  transportationOffered?: boolean
  transportationDetails?: string
  tags?: string[]
  summary: string
  sourceIds: string[]
  childFit: ChildFit[]
}

export interface SearchCampsResponse {
  town: string
  generatedAt: string
  sources: CampSource[]
  camps: CampResult[]
  warnings?: string[]
}

export interface SearchCampsRequest {
  town: string
  children: Child[]
}
