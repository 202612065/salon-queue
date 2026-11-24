# Salon Queue Management System — MAISON ROSE

**Live demo:** https://salon-queue-theta.vercel.app
**Hosted on:** Vercel (frontend) + Render (backend)
**Staff access:** Open routes (`/reception`, `/admin`, `/display`, `/barber/meera`, `/barber/kavya`, `/barber/tara`) — no PIN required.

## About
**MAISON ROSE** is a live walk-in queue application built with React, Vite, Node/Express, Socket.IO, and SQLite. Guests can join the queue from their phone, see their token and estimated wait time, and get notified when their chair is called, while front desk staff, stylists (**Meera**, **Kavya**, **Tara**), and the lobby display stay synchronized in real time.

## Key Routes
- `/` — Home overview, live wait metrics, stylist status, and treatment menu
- `/join` — Guest queue check-in (select 1–3 services, choose stylist or any available, live price & time summary)
- `/status/:id` — Live guest token pass, position in line, wait time, and turn alert
- `/reception` — Front desk chair controls, live queue table, walk-in form, and no-show recovery
- `/barber/:name` — Stylist station (`meera`, `kavya`, `tara`) for break toggle, starting sessions, and marking done
- `/display` — Lobby queue display (`IN CHAIR`, `CALLED NOW`, `UP NEXT`)
- `/admin` — Owner controls for services, stylists, online queue toggle, closing time, and daily stats

## Running Locally
```bash
npm install
npm run dev ```