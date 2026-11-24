# MAISON ROSE — Project Brief & Scope

## Problem
Walk-in salon guests often wait without clear visibility into their place in line or how long their turn will take, leading to crowded waiting areas, missed turns, and confusion around chair order[cite: 37].

## Users
- **Guests (Customers):** Join the queue from a phone, pick services and a preferred stylist (or any available stylist), and track live status[cite: 37, 38].
- **Front Desk / Reception:** Add walk-ins, call the next guest for a stylist, start/cancel/mark no-show, and re-add no-shows[cite: 37, 38, 39].
- **Stylists (Meera, Kavya, Tara):** View active/called/next guests for their chair, mark sessions started or done, and toggle breaks[cite: 37, 38].
- **Owner / Admin:** Toggle online queue joining, set closing time, toggle services/stylists, add new services, and view daily stats[cite: 37, 38].
- **Lobby Screen:** Display live called, in-chair, and upcoming tokens for guests waiting in the studio[cite: 37, 38].

## Must-Have Features
1. Phone-friendly queue check-in (`/join`) with 1–3 services and stylist choice (`Any Available Stylist`, `Meera`, `Kavya`, `Tara`)[cite: 37, 38].
2. Live guest pass (`/status/:id`) showing token (`S-1`, `S-2`...), position, estimated wait, 2nd-in-line heads-up, and "YOUR CHAIR IS READY!" callout[cite: 37, 38, 41].
3. Front desk queue management (`/reception`) with stylist chair cards, walk-in modal, call next, start, cancel, no-show, and re-add at end[cite: 37, 38, 39].
4. Stylist station view (`/barber/:name`) with current/called guest controls (`Start Session`, `Mark Done`), next guest preview, and break toggle[cite: 37, 38].
5. Lobby display (`/display`) showing called tokens, active sessions, and upcoming tokens[cite: 37, 38].
6. Owner settings (`/admin`) with daily summary stats, service toggles/creation, stylist duty toggles, online queue toggle, and closing time[cite: 37, 38].
7. English and Gujarati language toggle (`en` / `gu`)[cite: 37, 40, 41].

## Don't Build
- Online payment gateways or advance checkout
- Future-date scheduled appointments
- SMS or WhatsApp notifications
- Loyalty points or membership tiers
- Multi-branch salon management[cite: 37]

## Look & Feel
Classy rosewood, burgundy, and warm blush salon aesthetic with `Cormorant Garamond` serif headings and `Plus Jakarta Sans` body text, supporting English and Gujarati[cite: 37, 40].