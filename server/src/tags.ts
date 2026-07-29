// Mirrors the vocabulary in the frontend (src/types.ts TAG_OPTIONS) so prompts
// sent to the model use readable labels instead of raw ids.
export const TAG_LABELS: Record<string, string> = {
  sports: 'Sports & Team Games',
  swimming: 'Swimming & Water Play',
  'arts-crafts': 'Arts & Crafts',
  music: 'Music',
  drama: 'Drama & Theater',
  dance: 'Dance',
  stem: 'STEM & Coding',
  nature: 'Nature & Outdoors',
  hiking: 'Hiking & Adventure',
  animals: 'Animals',
  cooking: 'Cooking & Baking',
  'martial-arts': 'Martial Arts',
  'games-puzzles': 'Games & Puzzles',
  academics: 'Academic Enrichment',
  'ropes-course': 'Ropes Course & Climbing',
  energetic: 'Energetic / Active',
  'calm-quiet': 'Calm / Quiet',
  'social-team': 'Social / Team-Oriented',
  independent: 'Independent',
  creative: 'Creative',
  competitive: 'Competitive',
  structured: 'Likes Structure',
  'free-play': 'Likes Free Play',
  'small-group': 'Small Groups',
  'shy-warmup': 'Shy / Needs Warm-up',
}

export function labelFor(tagId: string): string {
  return TAG_LABELS[tagId] ?? tagId
}
