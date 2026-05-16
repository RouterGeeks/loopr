# Loopr QA Checklist

> Use this checklist after major features, sprint completions, merges, or AI-assisted coding sessions.

---

# Session Info

* Date:
* Branch:
* Sprint / Feature:
* Commit:
* Tester:

---

# Build & Startup

* [ ] `npm run build` succeeds
* [ ] `npm run dev` starts correctly
* [ ] `npm run preview` starts correctly
* [ ] No unexpected console errors
* [ ] No React warnings
* [ ] No TypeScript issues

---

# Routing & Navigation

* [ ] Dashboard loads (route /)
* [ ] Doing loads (route /doing)
* [ ] Delayed loads (route /delayed)
* [ ] Done loads (route /done)
* [ ] Dials loads (route /dials)
* [ ] Refresh works on all routes
* [ ] No 404s
* [ ] Active nav state works
* [ ] Icons display correctly
* [ ] Nav labels read: Dashboard / Doing / Delayed / Done / Dials

# Legacy Route Redirects

* [ ] /revisit redirects to /delayed
* [ ] /archive redirects to /done
* [ ] /settings redirects to /dials
* [ ] URL bar updates to the new path (replace, not push)

---

# Capture Flow

* [ ] Add Loop disabled when empty
* [ ] Valid text enables Add Loop
* [ ] Add Loop creates loop
* [ ] Textarea clears after add
* [ ] Multiple loops stack correctly
* [ ] Autofocus works

---

# Keyboard Capture

* [ ] Cmd+Enter works
* [ ] Ctrl+Enter works
* [ ] Enter creates newline only
* [ ] Keyboard capture persists after refresh

---

# Loop Actions

* [ ] Do moves loop from Do → Doing
* [ ] Done moves loop from Doing → Done (Done section)
* [ ] Delay moves loop from any state → Delayed
* [ ] Do on a Delayed loop moves it to Doing
* [ ] Drop moves loop from Do / Doing / Delayed → Done (Dropped section)
* [ ] Edit works in Do, Doing, and Delayed states
* [ ] Delete works in every state
* [ ] Restore from Done page sends loop back to Do
* [ ] Delete confirmation appears
* [ ] No double borders/cards
* [ ] Doing pill is visually distinct (seafoam tone) but calm

---

# Delay Scheduling

* [ ] Tomorrow works
* [ ] This Weekend works
* [ ] Next Week works
* [ ] Pick Date works
* [ ] Due Now appears correctly
* [ ] Relative labels display correctly
* [ ] Sorting is chronological

---

# Delayed (route /delayed)

* [ ] Page heading reads "Delayed"
* [ ] Only delayed loops appear
* [ ] Delayed loops editable
* [ ] Delayed loops deletable
* [ ] Do from Delayed moves loop to Doing
* [ ] Drop from Delayed moves loop to Done page (Dropped section)
* [ ] Delay from Delayed re-schedules the loop
* [ ] Empty state displays correctly

---

# Done (route /done)

* [ ] Page heading reads "Done"
* [ ] Done section works
* [ ] Dropped section works
* [ ] Restore sends loops back to Do
* [ ] Permanent delete works
* [ ] Empty state displays correctly
* [ ] Page feels calm and uncluttered

---

# Dials (route /dials)

* [ ] Page heading reads "Dials"
* [ ] Do / Doing / Delayed / Done counts are correct
* [ ] Counts update live after Clear All
* [ ] Counts reload when the confirmation modal closes
* [ ] Clear All confirmation works
* [ ] Clear All resets app correctly

---

# Persistence

* [ ] localStorage persists correctly
* [ ] Refresh preserves state
* [ ] Route changes preserve state
* [ ] Done page (Done + Dropped) persists
* [ ] Delay timestamps persist
* [ ] `startedAt` persists for Doing loops
* [ ] Legacy data (`active` / `pending` / `delay` / `drop` / legacy `do`) migrates on first load

---

# PWA & Offline

* [ ] Manifest loads
* [ ] Service worker registers
* [ ] Offline shell works
* [ ] Dashboard works offline
* [ ] Doing works offline
* [ ] Delayed works offline
* [ ] Done works offline
* [ ] Dials works offline
* [ ] Install prompt works
* [ ] Icons display correctly

---

# Mobile UX

* [ ] No horizontal scrolling
* [ ] Buttons are easy to tap
* [ ] Text remains readable
* [ ] Navigation fits correctly
* [ ] Layout still feels calm with many loops

---

# Emotional UX

* [ ] No guilt-oriented language
* [ ] No urgency mechanics
* [ ] No accidental gamification
* [ ] UI still feels calm
* [ ] App still feels low-friction
* [ ] Theme remains subtle
* [ ] Interactions feel emotionally safe

---

# Regression Smoke Test

* [ ] Add loop (lands in Do on Dashboard)
* [ ] Press Do — loop moves to Doing page
* [ ] Press Done on Doing card — loop moves to Done page (Done section)
* [ ] Add another loop, press Delay → schedule
* [ ] Verify Delayed page shows it
* [ ] Press Do on a Delayed card → moves to Doing
* [ ] Add another loop, press Drop → Done page (Dropped section)
* [ ] Restore from Done page → reappears in Do on Dashboard
* [ ] Refresh every route, verify persistence
* [ ] Verify offline shell still loads each route

---

# Notes

## Bugs Found

*

## UX Observations

*

## Deferred Items

*

## Follow-ups for Next Sprint

*
