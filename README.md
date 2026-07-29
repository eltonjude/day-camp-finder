# Day Camp Finder

Add your kids' ages, interests, and personality — enter your town — and this app
searches the web for day camps near you, then uses Claude to read camp pages and
grade how well each one fits each child. Results are grouped into camps that work
for the whole family and camps that are a great individual match for just one kid.

## How it works

- **Frontend** (`src/`): React + Vite + Tailwind. Child profiles are stored in the
  browser (`localStorage`) — no account needed.
- **Backend logic**: given a town, it
  1. Runs a few Brave Search queries to find candidate camp web pages.
  2. Crawls and extracts text from those pages.
  3. Sends the page text + your kids' profiles to Claude in a single tool-use call,
     which extracts structured camp details (ages, cost, transportation, activities)
     and grades fit per child.
  4. Returns the graded list, which the frontend groups into "whole family" vs.
     "just right for [child]" sections.

  This logic is intentionally implemented twice, once per deployment target:
  - **`server/`** — an Express server, for local development (`npm run dev:all`).
  - **`api/`** — an Azure Functions app, for deploying to Azure Static Web Apps
    (its build only packages the `api/` folder in isolation, so it can't share
    code living outside it).

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
npm run build --workspace server   # backend (Express, for local dev)
cd api && npm install && npm run build   # backend (Azure Functions, for deployment)
```

## Deploying (free) to Azure Static Web Apps

Azure Static Web Apps has an always-free tier that hosts the built frontend and
pairs it with the `api/` Azure Functions app as one integrated deployment — no
separate backend host or CORS config needed, and no local API keys ever leave
your machine.

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In the [Azure Portal](https://portal.azure.com), create a new resource →
   search for **Static Web Apps** → **Create**.
3. Pick a name and resource group, and select the **Free** plan.
4. Under **Deployment details**, choose **GitHub**, sign in, and select this
   repository and the branch you want to deploy.
5. Under **Build details**, set:
   - **Build presets**: `Custom` (or `React` if offered)
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `dist`
6. Click **Review + create** → **Create**. Azure commits a GitHub Actions
   workflow to the repo and kicks off the first deployment automatically.
7. Once deployed, go to the Static Web App resource → **Settings** →
   **Environment variables**, and add:
   - `BRAVE_API_KEY`
   - `ANTHROPIC_API_KEY`
   Save — this redeploys the API with the keys available to it.
8. Visit the `*.azurestaticapps.net` URL shown on the resource's Overview page.

Every push to the connected branch redeploys automatically via the generated
GitHub Actions workflow.
