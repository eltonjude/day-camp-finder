import type { CampResult, CampSource, Child, ChildFit, SearchCampsRequest, SearchCampsResponse } from './types.js'
import { sessionLabel } from './campPrompt.js'

interface SampleCamp extends Omit<CampResult, 'childFit' | 'sourceIds' | 'isBestPick'> {
  // State codes, state names, city names, and ZIP prefixes this camp serves.
  regions: string[]
  // Chains that run in most U.S. metros, so they stay relevant for any area.
  nationwide?: boolean
  source: CampSource
}

const SAMPLES: SampleCamp[] = [
  {
    name: 'Barton Springs Day Camp',
    organization: 'Austin Parks & Recreation',
    location: 'Austin, TX',
    ageMin: 6,
    ageMax: 12,
    weeksOrDates: 'Weekly sessions all summer',
    startDate: '2027-06-02',
    endDate: '2027-08-08',
    costPerWeek: '$185/week',
    price: '$185/week',
    registrationStartDate: '2027-02-15',
    registrationNotes: 'Residents often receive an early window.',
    transportationOffered: false,
    tags: ['swimming', 'nature', 'energetic'],
    summary:
      'A classic city day camp beside the springs, with swimming, crafts, and unhurried outdoor play. Staff are used to Texas heat and build in plenty of water time.',
    dateFitNote: 'Weekly summer sessions make it easy to choose the weeks that match your calendar.',
    regions: ['tx', 'texas', 'austin', '787'],
    source: { id: 'P1', url: 'https://www.austintexas.gov/department/parks-and-recreation', title: 'Austin Parks & Recreation' },
  },
  {
    name: 'Central Park Summer Camp',
    organization: 'New York City Parks',
    location: 'New York, NY',
    ageMin: 6,
    ageMax: 13,
    weeksOrDates: 'July sessions in the park',
    startDate: '2027-07-06',
    endDate: '2027-07-31',
    costPerWeek: 'We’ll need to check with the camp',
    price: 'We’ll need to check with the camp',
    registrationStartDate: '2027-03-01',
    transportationOffered: false,
    tags: ['sports', 'nature', 'social-team'],
    summary:
      'A city-run summer camp that treats Central Park as the playground — games, nature walks, and plenty of shade. A familiar, community-minded choice for Manhattan and nearby boroughs.',
    dateFitNote: 'July weeks line up well with a mid-summer break.',
    regions: ['ny', 'new york', 'nyc', 'manhattan', 'brooklyn', 'queens', '100', '112'],
    source: { id: 'P2', url: 'https://www.nycgovparks.org/programs/recreation/camps', title: 'NYC Parks Camps' },
  },
  {
    name: 'Golden Gate Park Day Camp',
    organization: 'San Francisco Recreation & Parks',
    location: 'San Francisco, CA',
    ageMin: 5,
    ageMax: 12,
    weeksOrDates: 'June through mid-August',
    startDate: '2027-06-15',
    endDate: '2027-08-14',
    costPerWeek: '$240/week',
    price: '$240/week',
    registrationStartDate: '2027-02-01',
    transportationOffered: true,
    transportationDetails: 'Limited shuttle from nearby rec centers',
    tags: ['nature', 'arts-crafts', 'calm-quiet'],
    summary:
      'Fog-kissed mornings and art under the trees in Golden Gate Park. A gentle pace with room for both quiet makers and kids who want to roam.',
    dateFitNote: 'Flexible summer weeks, including the heart of June.',
    regions: ['ca', 'california', 'san francisco', 'sf', '941', 'bay area'],
    source: { id: 'P3', url: 'https://sfrecpark.org/', title: 'SF Rec & Park' },
  },
  {
    name: 'Lincoln Park Nature Camp',
    organization: 'Chicago Park District',
    location: 'Chicago, IL',
    ageMin: 7,
    ageMax: 14,
    weeksOrDates: 'Two-week summer sessions',
    startDate: '2027-06-22',
    endDate: '2027-08-07',
    costPerWeek: '$160/week',
    price: '$160/week',
    registrationStartDate: '2027-01-20',
    transportationOffered: false,
    tags: ['nature', 'animals', 'hiking'],
    summary:
      'A lakeside nature camp with pond dipping, simple field science, and time on the grass. It feels like a small breath of woods inside the city.',
    dateFitNote: 'Two-week blocks can be chosen to sit inside your requested dates.',
    regions: ['il', 'illinois', 'chicago', '606'],
    source: { id: 'P4', url: 'https://www.chicagoparkdistrict.com/', title: 'Chicago Park District' },
  },
  {
    name: 'Crandon Park Beach Camp',
    organization: 'Miami-Dade Parks',
    location: 'Key Biscayne, FL',
    ageMin: 6,
    ageMax: 12,
    weeksOrDates: 'June and July beach weeks',
    startDate: '2027-06-08',
    endDate: '2027-07-31',
    costPerWeek: '$210/week',
    price: '$210/week',
    registrationStartDate: '2027-03-10',
    transportationOffered: false,
    tags: ['swimming', 'sports', 'energetic'],
    summary:
      'A bright beach week with swimming, sand games, and lots of sunscreen reminders. Best for kids who are happiest near the water.',
    dateFitNote: 'Summer beach weeks cover most of June and July.',
    regions: ['fl', 'florida', 'miami', 'key biscayne', '331'],
    source: { id: 'P5', url: 'https://www.miamidade.gov/parks/', title: 'Miami-Dade Parks' },
  },
  {
    name: 'Cherry Creek Sports Camp',
    organization: 'Denver Parks & Recreation',
    location: 'Denver, CO',
    ageMin: 7,
    ageMax: 13,
    weeksOrDates: 'June 1 – August 7',
    startDate: '2027-06-01',
    endDate: '2027-08-07',
    costPerWeek: '$195/week',
    price: '$195/week',
    registrationStartDate: '2027-02-08',
    transportationOffered: true,
    transportationDetails: 'Morning pickup at select rec centers',
    tags: ['sports', 'energetic', 'social-team'],
    summary:
      'A lively sports camp with rotating games, water breaks, and a kind coaching style. Good for kids who like to move and make friends quickly.',
    dateFitNote: 'The season opens on June 1, which matches many summer-break calendars.',
    regions: ['co', 'colorado', 'denver', '802'],
    source: { id: 'P6', url: 'https://www.denvergov.org/Government/Agencies-Departments-Offices/Parks-Recreation', title: 'Denver Parks & Recreation' },
  },
  {
    name: 'Discovery Park Adventure Camp',
    organization: 'Seattle Parks and Recreation',
    location: 'Seattle, WA',
    ageMin: 8,
    ageMax: 14,
    weeksOrDates: 'Late June through August',
    startDate: '2027-06-22',
    endDate: '2027-08-21',
    costPerWeek: '$230/week',
    price: '$230/week',
    registrationStartDate: '2027-02-25',
    transportationOffered: false,
    tags: ['hiking', 'nature', 'independent'],
    summary:
      'Trails, tide-pool looking, and picnic lunches at one of Seattle’s wilder parks. Counselors keep the groups small enough that quieter kids can settle in.',
    dateFitNote: 'Late-June start suits families who need a little time after school ends.',
    regions: ['wa', 'washington', 'seattle', '981'],
    source: { id: 'P7', url: 'https://www.seattle.gov/parks', title: 'Seattle Parks' },
  },
  {
    name: 'Museum of Science Vacation Week',
    organization: 'Museum of Science, Boston',
    location: 'Boston, MA',
    ageMin: 6,
    ageMax: 12,
    weeksOrDates: 'Winter, spring, and summer vacation weeks',
    startDate: '2026-12-21',
    endDate: '2027-08-14',
    costPerWeek: '$375/session week',
    price: '$375/session week',
    registrationStartDate: '2026-10-01',
    transportationOffered: false,
    tags: ['stem', 'games-puzzles', 'structured'],
    summary:
      'Hands-on science days inside the museum during school breaks. A thoughtful pick for winter, spring, or a single summer week when you want indoor wonder.',
    dateFitNote: 'Vacation-week sessions are offered across the year, including winter and spring break.',
    regions: ['ma', 'massachusetts', 'boston', 'cambridge', '021'],
    source: { id: 'P8', url: 'https://www.mos.org/', title: 'Museum of Science' },
  },
  {
    name: 'Piedmont Park Arts Camp',
    organization: 'Atlanta Botanical-adjacent arts collective',
    location: 'Atlanta, GA',
    ageMin: 5,
    ageMax: 11,
    weeksOrDates: 'June 8 – July 24',
    startDate: '2027-06-08',
    endDate: '2027-07-24',
    costPerWeek: '$275/week',
    price: '$275/week',
    registrationStartDate: '2027-01-15',
    transportationOffered: false,
    tags: ['arts-crafts', 'music', 'creative'],
    summary:
      'Paint, clay, and a little music in the park. The days are colorful without being loud, and families often praise how gently new campers are welcomed.',
    dateFitNote: 'June and July weeks sit comfortably inside a typical summer break.',
    regions: ['ga', 'georgia', 'atlanta', '303'],
    source: { id: 'P9', url: 'https://www.atlantaga.gov/government/departments/parks-recreation', title: 'Atlanta Parks' },
  },
  {
    name: 'Pullen Park Summer Camp',
    organization: 'Raleigh Parks',
    location: 'Raleigh, NC',
    ageMin: 5,
    ageMax: 12,
    weeksOrDates: 'June 15 – August 14',
    startDate: '2027-06-15',
    endDate: '2027-08-14',
    costPerWeek: '$155/week',
    price: '$155/week',
    registrationStartDate: '2027-02-10',
    transportationOffered: true,
    transportationDetails: 'Activity-bus from a few neighborhood pools',
    tags: ['free-play', 'sports', 'small-group'],
    summary:
      'A friendly neighborhood camp with playground time, crafts, and a ride on the park train when the group earns it. Easy to love for younger campers.',
    dateFitNote: 'Weekly enrollment from mid-June onward.',
    regions: ['nc', 'north carolina', 'raleigh', 'durham', '276'],
    source: { id: 'P10', url: 'https://raleighnc.gov/parks', title: 'Raleigh Parks' },
  },
  {
    name: 'YMCA Day Camp (nationwide preview)',
    organization: 'YMCA of the USA',
    location: 'Locations across the United States',
    ageMin: 5,
    ageMax: 14,
    weeksOrDates: 'School-break and summer sessions vary by branch',
    costPerWeek: 'Often $150–$280/week',
    price: 'Often $150–$280/week',
    registrationStartDate: 'We’ll need to check with the camp',
    registrationNotes: 'Each local Y sets its own calendar and resident discounts.',
    transportationOffered: true,
    transportationDetails: 'Many branches offer bus routes — please confirm locally',
    tags: ['sports', 'swimming', 'social-team'],
    summary:
      'A familiar, community-rooted day camp you can find in most U.S. cities. Swimming, games, and a staff who know the neighborhood — always worth calling your local Y.',
    dateFitNote: 'Local branches usually offer weeks that can be matched to your break.',
    regions: [],
    nationwide: true,
    source: { id: 'P11', url: 'https://www.ymca.org/what-we-do/youth-development/camps', title: 'YMCA Camps' },
  },
  {
    name: 'iD Tech Campus Preview',
    organization: 'iD Tech',
    location: 'University campuses across the U.S.',
    ageMin: 7,
    ageMax: 17,
    weeksOrDates: 'One-week summer intensives',
    startDate: '2027-06-08',
    endDate: '2027-08-14',
    costPerWeek: 'From about $1,100/week',
    price: 'From about $1,100/week',
    registrationStartDate: '2026-11-15',
    transportationOffered: false,
    tags: ['stem', 'games-puzzles', 'structured'],
    summary:
      'A focused coding and game-design week on a college campus. A strong match for kids who light up around computers and like a clear daily plan.',
    dateFitNote: 'One-week summer sessions can be chosen to sit inside your date window.',
    regions: [],
    nationwide: true,
    source: { id: 'P12', url: 'https://www.idtech.com/', title: 'iD Tech' },
  },
]

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function isWholeCountry(area: string): boolean {
  const hay = normalize(area)
  if (!hay) return true
  const words = hay.split(' ')
  return (
    hay.includes('united states') ||
    words.includes('anywhere') ||
    words.includes('everywhere') ||
    words.includes('us') ||
    words.includes('usa') ||
    words.includes('nationwide')
  )
}

// Matches on whole words and ZIP prefixes so a city like "Austin" is never
// treated as containing a code such as "us".
function areaMatches(camp: SampleCamp, area: string): boolean {
  const hay = normalize(area)
  if (!hay) return true
  const words = hay.split(' ')

  return camp.regions.some((region) => {
    if (region.includes(' ')) return hay.includes(region)
    if (/^\d+$/.test(region)) return words.some((word) => /^\d+$/.test(word) && word.startsWith(region))
    return words.includes(region)
  })
}

function scoreChild(camp: SampleCamp, child: Child): ChildFit {
  const eligible =
    (camp.ageMin == null || child.age >= camp.ageMin) && (camp.ageMax == null || child.age <= camp.ageMax)
  const overlap = child.traits.filter((t) => camp.tags?.includes(t)).length
  const score = eligible ? Math.min(96, 58 + overlap * 12) : 20
  const reasoning = eligible
    ? overlap
      ? `${child.name} would likely enjoy the ${camp.tags?.slice(0, 2).join(' and ')} days here.`
      : `${child.name} is the right age; we can learn more about the daily rhythm from the camp.`
    : `${child.name} may be outside the listed age range — worth a kind call to double-check.`
  return { childId: child.id, eligible, score, reasoning }
}

export function previewSearch(request: SearchCampsRequest): SearchCampsResponse {
  const nationwide = SAMPLES.filter((camp) => camp.nationwide)
  const local = isWholeCountry(request.area)
    ? SAMPLES.filter((camp) => !camp.nationwide)
    : SAMPLES.filter((camp) => !camp.nationwide && areaMatches(camp, request.area))

  // Local matches lead so the best pick belongs to the area that was searched.
  const pool = [...local, ...nationwide]

  const sources = pool.map((camp) => camp.source)
  const camps: CampResult[] = pool.map((camp) => ({
    ...camp,
    sourceIds: [camp.source.id],
    childFit: request.children.map((child) => scoreChild(camp, child)),
  }))

  const best = camps[0]
  if (best) best.isBestPick = true

  return {
    area: request.area,
    session: request.session,
    year: request.year,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    generatedAt: new Date().toISOString(),
    sources,
    camps,
    bestPickName: best?.name,
    bestPickReason: best
      ? `If we may choose one to start with, ${best.name} in ${best.location} feels like a kind match for ${sessionLabel(request.session)} ${request.year}. The dates and spirit line up gently with what you asked for — and you can still browse every other option below.`
      : 'We could not fairly recommend a camp just yet, and we would rather wait than guess.',
    preview: true,
    warnings: [
      'These are preview camps so you can see how CampQuest feels. When search keys are set, we look up live pages from across the U.S. for you.',
    ],
  }
}
