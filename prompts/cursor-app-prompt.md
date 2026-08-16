# Cursor prompt — keep building CampQuest

Paste this into a new Cursor agent when you want to continue the app.

---

You are helping me build **CampQuest**, a warm camp-finder for families anywhere in the United States.

## Product

Parents enter:

1. **Area** — city, ZIP, state, or the whole U.S.
2. **Session** — Summer Break, Winter Break, Spring Break, Fall Break, Thanksgiving Break, Holiday Break, or year-round
3. **Year**
4. **Dates they want** — for example June 1 through June 29

The engine searches the live web (Brave Search + page crawl + Claude using `prompts/camp-search.md`), then shows:

- a **best pick** with a kind explanation
- **every other camp** with price, dates, registration start date, and source links

From a camp card, they can **add it to Bookings** in the main menu. On a booking they can **allow notifications**; we remind them **one week before** camp (and one week before registration when we have that date).

Kids/family profiles are optional. They improve fit scoring but must never be required to search.

## Voice

Every in-app message should feel very, very nice: calm, specific, and encouraging. No sarcasm, no blame, no “error: invalid input.” If something fails, reassure the parent that they did nothing wrong.

## Stack

- Frontend: React + Vite + Tailwind in `src/`
- Local API: Express in `server/` (`npm run dev:all`)
- Azure Functions copy in `api/` (keep it in sync with `server/` — it cannot import from outside `api/`)
- Bookings and family profiles live in `localStorage`
- Notifications use the browser Notification API and an in-app banner (the tab must be opened for reminders to fire)

## Please

- Keep server and Azure function logic aligned
- Do not invent camp facts in the model prompt
- Prefer editing existing files over adding new frameworks
- After changes, run `npm run lint` and `npm run build`
