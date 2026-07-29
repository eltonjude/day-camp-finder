# Day Camp Finder

Add your kids' ages, interests, and personality — enter your town — and this app
searches the web for day camps near you, then uses Claude to read camp pages and
grade how well each one fits each child. Results are grouped into camps that work
for the whole family and camps that are a great individual match for just one kid.

## How it works

- **Frontend** (`src/`): React + Vite + Tailwind. Child profiles are stored in the
  browser (`localStorage`) — no account needed.
- **Backend** (`server/`): a small stateless Express server that, given a town:
  1. Runs a few Brave Search queries to find candidate camp web pages.
  2. Crawls and extracts text from those pages.
  3. Sends the page text + your kids' profiles to Claude in a single tool-use call,
     which extracts structured camp details (ages, cost, transportation, activities)
     and grades fit per child.
  4. Returns the graded list, which the frontend groups into "whole family" vs.
     "just right for [child]" sections.

Camp details are AI-summarized from live web pages and may be incomplete or
outdated — always verify dates, pricing, and transportation directly with the
camp before enrolling.

## Setup

Requires Node 20+.

```bash
npm install
cp server/.env.example server/.env
# then edit server/.env and set BRAVE_API_KEY and ANTHROPIC_API_KEY
```

- Brave Search API key: https://brave.com/search/api/
- Anthropic API key: https://console.anthropic.com/

Without these two keys set, the app runs fine but camp search returns a clear
"not configured" error — child profile management still works.

## Development

Run the frontend and backend together:

```bash
npm run dev:all
```

This starts the Vite dev server on `http://localhost:5173` (proxying `/api` to
the backend) and the Express server on `http://localhost:8787`.

Or run them separately:

```bash
npm run dev        # frontend only
npm run dev:server  # backend only
```

## Build

```bash
npm run build          # frontend
npm run build --workspace server   # backend
```
