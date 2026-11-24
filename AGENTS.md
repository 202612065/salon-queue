# AGENTS.md — Salon Queue Management (MAISON ROSE)

Live walk-in queue web app for **MAISON ROSE** where guests join from their phone, see estimated wait times, and get called when their chair is ready, while front desk, stylists, and the lobby screen stay synced in real time.

## Read First
- `docs/01-brief.md` -> Problem, users, features in scope, and what NOT to build[cite: 37, 40].
- `docs/02-screens.md` -> Every screen route, layout, controls, states, and responsive behavior[cite: 38, 40].
- `docs/03-flows-rules.md` -> End-to-end flows, status rules, wait-time calculation, edge cases, and test checklist[cite: 39, 40].

## Stack & Run Command
- Frontend: React + Vite (`src/main.jsx`, `src/style.css`, `src/route-segment.js`)
- Backend & Realtime: Node/Express + Socket.IO + SQLite (`server/index.js`, `server/queue.js`)
- Run locally: `npm run dev`
- Hosting: Frontend on Vercel (or static host) + Backend on Render/Railway, with live URL at the top of `README.md`[cite: 40, 44].

## Working Rules
- Keep changes scoped to the requested screen or rule; avoid unintended edits to unrelated views[cite: 40].
- Visual theme: Rosewood, Burgundy & Warm Blush (`#4A1424` / `#340C18` burgundy ground, `#F9E6EA` blush accents/buttons, `#FFFAFA` light cards, `#24141A` plum-espresso text on light cards) with `Cormorant Garamond` and `Plus Jakarta Sans`[cite: 40].
- Support English and Gujarati (`en` / `gu`) labels and service names where available[cite: 37, 40].
- Keep queue state transitions, eligibility, and wait-time logic consistent across server and UI[cite: 40].
- Do not add out-of-scope features (online payments, future-date bookings, SMS/WhatsApp, loyalty points, multi-branch management)[cite: 37, 40].
- Update docs alongside UI/rule changes and log prompts in `prompts.md`[cite: 43, 44].