# Flows & Queue Rules — MAISON ROSE

## Main Flows

### Remote Guest Flow
1. Guest opens `/` or `/join`, enters name and 10-digit phone number, selects 1–3 services, and picks a stylist (`Any Available Stylist`, `Meera`, `Kavya`, or `Tara`)[cite: 38, 39].
2. Guest taps `Confirm Queue Spot`, receives a daily token (`S-1`, `S-2`...), and lands on `/status/:id`[cite: 39, 41].
3. Position and estimated wait update as guests ahead move through the queue; when 2nd in line, a heads-up banner appears[cite: 38, 39].
4. Receptionist taps `Call Next` on an available stylist card -> status becomes `Called`, `/status/:id` shows `YOUR CHAIR IS READY!`, and `/display` highlights the token under `CALLED NOW`[cite: 38, 39].
5. Stylist (or front desk) starts the session (`In chair`) and marks it `Done` when finished[cite: 38, 39].

### Walk-In Flow
1. Front desk clicks `+ Add Walk-In`, enters guest details and 1–3 services, and adds the guest to the queue in arrival order (`Waiting`)[cite: 38, 39].

## Statuses & Allowed Transitions
- `Waiting` -> `Called` or `Cancelled`[cite: 39]
- `Called` -> `In chair` or `No-show` (after 10 minutes from `called_at`)[cite: 39]
- `In chair` -> `Done`[cite: 39]
- Terminal states (`Done`, `Cancelled`, `No-show`) do not move backward[cite: 39].

## Queue & Assignment Rules
- **Order:** First-come, first-served by `created_at` (and insertion order)[cite: 39].
- **Stylist preference:** `Call Next` for a specific stylist selects the earliest `Waiting` guest whose `barber_id` is either that stylist or unassigned (`Any`). A guest assigned to a specific stylist is not called by a different stylist[cite: 39].
- **Single occupancy:** A stylist cannot have more than one guest in `Called` or `In chair` status at the same time[cite: 39].
- **One active spot per phone:** A phone number with an active `Waiting`, `Called`, or `In chair` entry cannot join a second time simultaneously[cite: 39].
- **Closing cutoff:** Online joining closes 30 minutes before `salonClose` (or when `queueOpen` is turned off)[cite: 39].
- **Break / off-duty:** Stylists marked off-duty or on break cannot be called or selected as available active stylists[cite: 39].

## Waiting-Time Rule
- Estimated wait is calculated from the total service minutes of waiting guests ahead divided by the number of active stylists not on break (minimum `1`)[cite: 39].

## No-Show & Cancel Rules
- Guests can cancel while `Waiting` (`Cancelled`)[cite: 39].
- Guests `Called` for at least 10 minutes without starting can be marked `No-show`[cite: 39].
- A `No-show` guest can be re-added by the front desk (`Re-add at End`), receiving a new token at the end of the queue[cite: 39, 41].

## Test Checklist
- [ ] Selecting 1–3 services updates total minutes and total price (`₹`) accurately[cite: 39].
- [ ] Entering an invalid phone number or 0 / >3 services shows a clear error[cite: 38, 39].
- [ ] Duplicate active phone number is blocked and points to the active pass[cite: 39].
- [ ] `Call Next` respects stylist preference and skips guests locked to another stylist[cite: 39].
- [ ] `Start Session` and `Mark Done` update Reception, Stylist view, Guest pass, and Lobby TV[cite: 39, 41].
- [ ] `No-show` only unlocks after 10 minutes from call, and `Re-add at End` places the guest at the back with a new token[cite: 39, 41].
- [ ] Turning off online queue joining or reaching the 30-minute closing window blocks new remote check-ins[cite: 39].
- [ ] Language toggle switches English and Gujarati labels/service names cleanly[cite: 39, 41].
- [ ] Layout works cleanly on mobile viewports (`375px` width) with readable text and accessible buttons[cite: 41, 43].