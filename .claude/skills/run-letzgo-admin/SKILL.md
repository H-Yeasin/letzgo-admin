---
name: run-letzgo-admin
description: Build, launch, and drive the LetzGo admin panel. Use when asked to start the admin UI, take screenshots, verify admin features, or interact with the admin panel.
---

The LetzGo admin panel is a React + TypeScript app (Vite) at [`letzgo_admin/`](../../). An agent drives it via `.claude/skills/run-letzgo-admin/driver.mjs` — a Playwright-based CLI driver that launches the dev server, navigates pages, and takes screenshots.

The admin panel proxies `/api` requests to `http://localhost:8000` — the backend must be running for full functionality.

All paths below are relative to `letzgo_admin/`.

## Prerequisites

- Node.js 18+ (v22 in this environment)
- npm deps installed (`node_modules/` already present after clone or `npm install`)

## Setup

```bash
npm install
```

## Run (agent path)

Use `driver.mjs` to drive the admin panel in a headless browser:

```bash
# Full smoke test: launch dev server → navigate pages → take screenshots → stop
node .claude/skills/run-letzgo-admin/driver.mjs smoke

# Navigate to a specific page
node .claude/skills/run-letzgo-admin/driver.mjs login      # Login page
node .claude/skills/run-letzgo-admin/driver.mjs dashboard   # Dashboard
node .claude/skills/run-letzgo-admin/driver.mjs users       # Users page
node .claude/skills/run-letzgo-admin/driver.mjs rides       # Active rides page
node .claude/skills/run-letzgo-admin/driver.mjs reports     # Reports page

# Manual interaction commands
node .claude/skills/run-letzgo-admin/driver.mjs screenshot       # Take a screenshot
node .claude/skills/run-letzgo-admin/driver.mjs html             # Dump page HTML
node .claude/skills/run-letzgo-admin/driver.mjs wait <selector>  # Wait for element
node .claude/skills/run-letzgo-admin/driver.mjs click <selector> # Click an element
node .claude/skills/run-letzgo-admin/driver.mjs shutdown         # Close browser
```

The driver auto-starts the Vite dev server on port 5173 if it's not already running.

Screenshots → `/tmp/letzgo-admin-shots/` (both timestamped and `-latest` copies).

### Standalone dev server

```bash
npx vite --port 5173
# → Local: http://localhost:5173/
```

## Run (human path)

```bash
npx vite --port 5173
# → Vite dev server. Open http://localhost:5173 in a browser.
```

## Build (production)

```bash
npm run build
# → Output in dist/
```

## Test

No test suite configured yet. `package.json` has only `dev`, `build`, and `preview` scripts.

## Pages

| Path | Component | Description |
|---|---|---|
| `/login` | `LoginPage.tsx` | Admin authentication |
| `/` → redirect | (routes via react-router) | |
| `/dashboard` | `Dashboard.tsx` | Analytics & stats |
| `/users` | `Users.tsx` | User management |
| `/active-rides` | `ActiveRides.tsx` | Active rides overview |
| `/completed-rides` | `CompletedRides.tsx` | Completed ride history |
| `/disputes` | `Disputes.tsx` | Dispute management |
| `/reports` | `Reports.tsx` | Reports/generated reports |
| `/meetup-reports` | `MeetupReports.tsx` | Meetup-specific reports |

## Gotchas

- **Requires running backend.** Most pages proxy `/api` to `http://localhost:8000`. Without the backend, pages will render shells but show loading errors.
- **Auth required.** `/dashboard`, `/users`, `/rides` etc. check auth state via `AuthContext`. Without a valid JWT, they'll redirect to `/login`.
- **No test suite yet.** Verify functionality via screenshots and console error checks.
- **Page transition time.** Some pages have slow first paint due to Vite's on-demand compilation. `waitForSelector` handles this better than fixed timeouts.

## Troubleshooting

- **`ECONNREFUSED :8000`**: the backend is not running. Start the backend first (see the `run-letzgo-backend` skill).
- **Vite dev server port in use**: another instance is running. Kill it with `pkill -f "vite"` or use a different port with `ADMIN_URL=http://localhost:5174 npx vite --port 5174`.
- **Blank screenshots**: The page shell rendered but data didn't load (backend offline). Check `console-errors` for API failures.
- **Playwright browser binary not found**: run `npx playwright install chromium`.
