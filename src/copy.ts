export const copy = {
  appName: 'CampQuest',
  tagline: 'A kind place to find camp, anywhere in the United States.',
  welcome:
    'Tell us where you’d love camp to be, which break you’re planning for, and the dates that would make life a little easier. We’ll search with care and bring back a best pick — plus every other lovely option we find.',

  nav: {
    find: 'Find camps',
    bookings: 'Bookings',
    family: 'Your family',
  },

  search: {
    title: 'Where should we look?',
    subtitle:
      'You can search a city, a ZIP code, a whole state, or the entire country. We’ll stay within the U.S.',
    cityLabel: 'Area',
    cityPlaceholder: 'Austin, Brooklyn, 94110, or “anywhere”',
    stateLabel: 'State',
    anyState: 'Any state in the U.S.',
    sessionLabel: 'Session',
    yearLabel: 'Year',
    fromLabel: 'You’d like camp from',
    toLabel: 'Through',
    submit: 'Find wonderful camps',
    submitting: 'Looking with care…',
    needArea: 'A city, ZIP, or state helps us look in the right place — whenever you’re ready.',
    loading: [
      'Searching camp pages across the United States…',
      'Reading schedules, prices, and registration dates…',
      'Choosing a best pick with your dates in mind…',
      'Almost there — folding the nicest options into a list for you…',
    ],
  },

  results: {
    bestPickTitle: 'Our best pick for you',
    othersTitle: 'Every other camp we found',
    empty:
      'We looked far and wide, and we didn’t find a great match just yet. A nearby city or a slightly wider date range can help us try again — we’re happy to keep looking.',
    previewNote:
      'These are preview camps so you can see how CampQuest feels. When search keys are set, we’ll look up live pages from across the U.S. for you.',
    verify:
      'We gather details from camp websites and summarize them with care. Dates, prices, and registration can change — please confirm with the camp before you enroll. You’re doing a beautiful job planning this.',
    added: 'It’s on your bookings. We’ll keep this camp safe for you.',
    alreadyBooked: 'This one is already in your bookings.',
    add: 'Add to my bookings',
    addedShort: 'Saved',
  },

  bookings: {
    title: 'Your bookings',
    subtitle:
      'A quiet list of the camps you’re holding onto. Turn on reminders and we’ll gently tap you on the shoulder one week before.',
    empty:
      'No bookings yet — and that’s perfectly all right. When a camp feels like a good fit, you can save it from the search results.',
    remove: 'Remove with kindness',
    notifyOn: 'Reminders are on — we’ll check in one week before.',
    notifyOff: 'Allow a gentle reminder one week before',
    notifyNeedsPermission:
      'Your browser would like a moment of permission so we can send a kind reminder. Nothing noisy — just a note, one week before.',
    notifyDenied:
      'Reminders aren’t available in this browser right now. You can still keep the camp here, and we’ll highlight it on this page when the week arrives.',
    dueSoon: 'This camp is about a week away. We hope it feels like a gift of time.',
    registrationSoon: 'Registration is about a week away. A little head start, just for you.',
  },

  family: {
    title: 'Your family',
    subtitle:
      'You can search without adding anyone — truly. If you’d like, tell us a little about your kids so we can notice camps that might feel especially right.',
    addTitle: 'Add a child',
    empty: 'No children added yet. You’re welcome to search just the same.',
    name: 'Name',
    namePlaceholder: 'Ava',
    age: 'Age',
    notes: 'Anything we should know? (optional)',
    notesPlaceholder: 'Loves being outside, feels best in smaller groups…',
    save: 'Save this child',
    add: 'Add this child',
    cancel: 'Never mind',
    edit: 'Edit',
    remove: 'Remove',
  },

  reminder: {
    title: 'A little reminder from CampQuest',
    campBody: (name: string) => `${name} begins in about a week. We hope it’s a wonderful week.`,
    registrationBody: (name: string) => `Registration for ${name} opens in about a week. No rush — just a kind heads-up.`,
  },

  errors: {
    generic:
      'Something got in the way of our search just now. You’re not doing anything wrong — please try once more in a moment.',
    missingKeys:
      'Live web search isn’t set up on this computer yet, so we’re showing a careful preview instead. You’re still welcome to save camps and try reminders.',
  },

  toast: {
    booked: 'Saved to your bookings. We’re glad this one spoke to you.',
    removed: 'Removed from your bookings. It will be here if you need it again.',
    notifyOn: 'Reminders are on. We’ll look in one week before, quietly.',
    notifyOff: 'Reminders are off. The camp is still saved for you.',
  },
} as const
