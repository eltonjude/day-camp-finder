# CampQuest

A warm camp finder for families anywhere in the United States. Tell CampQuest the area, the school-break session, the year, and the dates you hope to cover. It searches the web, chooses a best pick, and lists every other camp with price, dates, and registration information. You can save a camp to **Bookings** and allow a gentle reminder one week before.

## What you can do

- Search a city, ZIP, state, or the whole country
- Choose Summer Break, Winter Break, Spring Break, Fall Break, Thanksgiving Break, Holiday Break, or year-round
- See a **best pick** plus every other match
- Add a camp to bookings from the main menu
- Allow notifications for a reminder one week before camp (and one week before registration when that date is known)
- Optionally add children so fit notes can be more personal — search works without them

All in-app messages are written to feel kind and unhurried.

## How search works

1. Brave Search looks up U.S. camp pages for your area, session, year, and dates.
2. CampQuest reads those pages.
3. Claude uses the prompt in [`prompts/camp-search.md`](prompts/camp-search.md) to extract details and choose a best pick. It must not invent prices, dates, or registration information.

The same logic lives in two places so each host can run on its own:

- **`server/`** — Express, for local development (`npm run dev:all`)
- **`api/`** — Azure Functions, for Azure Static Web Apps

If search keys are not set, CampQuest still returns a clearly labeled **preview** of U.S. camps so you can try bookings and reminders.

To keep building this app in Cursor, use [`prompts/cursor-app-prompt.md`](prompts/cursor-app-prompt.md).

## Setup

Requires Node 20+.

```bash
npm install
cp server/.env.example server/.env
# then edit server/.env and set BRAVE_API_KEY and ANTHROPIC_API_KEY
```

- Brave Search API key: https://brave.com/search/api/
- Anthropic API key: https://console.anthropic.com/

Without those keys, family profiles, bookings, and preview search still work.

## Development

```bash
npm run dev:all
```

This starts the Vite app on `http://localhost:5173` (proxying `/api` to the backend) and Express on `http://localhost:8787`.

```bash
npm run dev         # frontend only
npm run dev:server  # backend only
```

## Build

```bash
npm run build
npm run build --workspace server
cd api && npm install && npm run build
```

## Deploying (free) to Azure Static Web Apps

1. Push this repo to GitHub.
2. In the [Azure Portal](https://portal.azure.com), create a **Static Web App** on the Free plan.
3. Connect this repository. Build details:
   - App location: `/`
   - Api location: `api`
   - Output location: `dist`
4. Add application settings `BRAVE_API_KEY` and `ANTHROPIC_API_KEY`.

Camp details are summarized from websites and may change. Please confirm dates, prices, and registration with the camp before enrolling.
