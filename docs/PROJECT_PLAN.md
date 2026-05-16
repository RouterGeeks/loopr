# Loopr Project Plan

## Product Direction

Loopr is a mobile-first PWA designed to reduce cognitive friction and help users safely capture and revisit recurring thoughts.

Loopr is intentionally evolving beyond a traditional productivity app.

The goal is not maximizing output.
The goal is reducing executive-function friction while preserving clarity, calmness, and emotional safety.

Core philosophy:
Capture → Do → Doing → Done / Dropped / Delayed → Revisit

Loopr distinguishes between engagement (Doing) and completion (Done).
Pressing "Do" on an open loop moves it into Doing — not into Done. This
separation supports neurodivergent cognition by giving "in progress" its
own visible state.

The app should feel:
- fast
- breathable
- tactile
- emotionally safe
- low-pressure
- recognition-first

---

# V1 Goal

Build a lightweight local-first PWA that allows users to:
- capture thoughts rapidly
- revisit thoughts intentionally
- reduce cognitive load
- avoid shame-based productivity mechanics

Core interaction:
Thought → Captured within 2–3 seconds.

---

# Core Product Principles

## Frictionless Capture
Capture speed is the highest priority.

Any unnecessary friction during capture is considered a product failure.

Examples:
- Cmd/Ctrl + Enter capture
- auto-focus
- minimal required decisions
- minimal visual clutter

---

## Emotional Safety
Loopr avoids:
- streaks
- urgency mechanics
- red overdue states
- guilt-driven productivity systems
- anxiety-inducing dashboards
- manipulative engagement loops

Delayed loops are treated as resurfacing thoughts, not failures.

---

## Calm Clarity
The app should:
- feel calm
- remain visually lightweight
- prioritize readability and recognition
- support contextual memory
- avoid overwhelming interfaces

---

# Tech Stack

## Current Stack
- React
- Vite
- TypeScript
- Tailwind CSS
- localStorage
- PWA support
- Service worker offline shell

## Possible Future
- IndexedDB
- Optional sync
- Gentle notifications
- Voice capture

No backend in V1.
No AI processing in V1.

---

# Repository Structure

```
/docs
  LOOPR_CONTEXT.md
  PROJECT_PLAN.md
  QA_CHECKLIST.md
  QA_NOTES.md
  QA_WORKFLOW.md

/public
/src
  /components   reusable UI (LoopCard, ArchiveCard, BottomNav, ...)
  /pages        route components (Home, Doing, Revisit, Archive, Settings)
                  user-facing labels: Dashboard / Doing / Delayed / Done / Dials
                  primary routes: /, /doing, /delayed, /done, /dials
                  legacy redirects: /revisit → /delayed,
                                    /archive → /done,
                                    /settings → /dials
  /lib          shared logic — loops.ts owns the state model, migration, persistence
```

The /docs directory contains:

- product philosophy
- QA workflow
- sprint planning
- UX principles
- development guidance

All AI-assisted development sessions should review /docs before making significant changes.

---

# Current Feature Set

## Capture
- Quick text capture
- Multiline support
- Cmd/Ctrl + Enter submit
- Immediate local persistence

## Loop Management
- Do (engage, moves to Doing)
- Done (complete, from Doing)
- Delay (re-schedule, from any state)
- Drop (release)
- Edit
- Delete
- Restore from Done or Dropped back to Do
- Relative timestamps (Added / Started / Completed / Dropped)

## Delay Scheduling
- Tomorrow
- This Weekend
- Next Week
- Pick Date
- Due Now labeling
- Human-readable resurfacing labels

## Dashboard (route /)
- Capture input with Cmd/Ctrl + Enter shortcut
- Overview chips: Do / Doing / Delayed counts
- List of Do (open) loops
- Autofocus on mount and on return navigation

## Doing (route /doing)
- Dedicated view for actively engaged loops
- Seafoam-toned status pill for subtle visual distinction
- "Started X" contextual timestamp
- Transitions to Done, Delayed, or Dropped

## Delayed (route /delayed)
- Delayed loops sorted by revisit time
- Relative resurfacing states
- Empty-state support

## Done (route /done)
- Done and Dropped surfaced as named sections
- Restore returns loops to Do
- Permanent delete with confirmation
- Empty-state support

## Dials (route /dials)
- Four-tile count grid: Do / Doing / Delayed / Done
- Clear all data
- Confirmation protection

## Legacy route redirects
- /revisit → /delayed
- /archive → /done
- /settings → /dials

## PWA
- Installable app
- Offline shell support
- PNG icon support
- Mobile-first behavior

---

# Completed Sprints

## Sprint 1 — App Shell
Completed:
- Vite React TypeScript setup
- Tailwind integration
- Mobile-first layout
- Home / Revisit / Settings navigation

---

## Sprint 2 — Capture
Completed:
- Quick capture input
- Immediate loop rendering
- Local persistence
- Autofocus behavior

---

## Sprint 3 — Do / Delay / Drop
Completed:
- Core workflow actions
- Status handling
- Delay scheduling foundation
- Drop behavior

---

## Sprint 4 — Revisit
Completed:
- Delayed loop resurfacing
- Revisit workflow
- Empty states
- Persistence behavior

---

## Sprint 5 — Stability & Settings
Completed:
- Settings page
- Active/delayed counts
- Clear all data flow
- Confirmation dialogs
- Routing fixes
- Persistence fixes

---

## Sprint 6 — Loop Management
Completed:
- Edit loop
- Delete loop
- Confirmation flows
- Improved persistence handling

---

## Sprint 7 — PWA Support
Completed:
- Manifest
- Service worker
- Offline shell
- Installability
- PNG app icons
- Mobile metadata

---

## Sprint 8 — Delay Scheduling Refinement
Completed:
- Human-readable resurfacing labels
- Due now support
- Tomorrow / This Weekend / Next Week logic
- Revisit sorting
- Improved scheduling behavior

---

## Sprint 9 — Capture & Context Polish
Completed:
- Confirmed navigation icons remain subtle and recognition-first
- Verified contextual timestamps on active, delayed, and archived loops
- Strengthened count hierarchy on Home, Revisit, and Settings
- Added inline counts beside Archive section headers and an Archived total in Settings
- Made Edit slightly more discoverable while keeping it secondary to Do / Delay / Drop
- Refined empty-state copy on Home and Revisit with calm supporting lines
- Tightened mobile heading sizes and SectionCard padding for better scanability
- Replaced performative capture copy with a quiet keyboard-shortcut cue
- Softened Settings subtitle to remove marketing-leaning language

---

## Sprint 10 — Cognitive State Model
Completed:
- Introduced Doing as a first-class state distinct from Done
- Pressing Do now moves a loop into Doing, not into the resolved set
- Added a dedicated Doing page with its own LoopCard treatment (seafoam pill)
- Renamed the Archive page label to "Resolved" while keeping the /archive route
- Surfaced Done and Dropped as named sections inside Resolved
- Added 5-tab bottom navigation: Home / Doing / Revisit / Resolved / Settings
- Extracted shared `lib/loops.ts` module with typed migration and persistence
- Added backward-compatible migration for `active`, `pending`, `delay`, `drop`,
  legacy `do` (completed), and current schema strings
- Tracked `startedAt` on Doing transitions for contextual "Started X" timestamps
- Updated Settings counts to a 4-tile grid: Do / Doing / Delayed / Resolved
- Surfaced Do / Doing / Delayed counts on Home for orientation
- Restore now sends Done or Dropped loops back to Do (not directly to Doing)

Hotfix during testing (BUG-01):
- Restored autofocus on the Dashboard capture textarea using a ref +
  useEffect, since the HTML autofocus attribute is unreliable under
  React SPA hydration.

---

## Sprint 11 — Navigation Terminology
Completed:
- Renamed nav labels: Home → Dashboard, Revisit → Delayed,
  Resolved → Done, Settings → Dials (Doing unchanged)
- Updated H1s on all five pages to match new nav labels
- Routes preserved (`/`, `/doing`, `/revisit`, `/archive`, `/settings`)
  to avoid invalidating PWA service-worker caches and existing bookmarks
- Empty-state copy on the Done page no longer uses the word "resolved"
- Internal icon and count-tile names renamed to match new labels
- Docs (README, LOOPR_CONTEXT, PROJECT_PLAN, QA_CHECKLIST, QA_NOTES,
  QA_WORKFLOW) updated to use the new vocabulary

No state-model, persistence, or workflow logic changed.

---

## Sprint 12 — Route Alignment
Completed:
- Renamed routes to match nav labels: /revisit → /delayed,
  /archive → /done, /settings → /dials
- Added in-app redirects so the old paths (`/revisit`, `/archive`,
  `/settings`) navigate to their new homes — preserves bookmarks and
  installed-PWA cache entries
- Updated BottomNav `to` targets to point at the new paths
- Bumped service worker cache to `loopr-shell-v5`
- Added new routes (/doing, /delayed, /done, /dials) to the SW SHELL
  precache list for first-load offline coverage
- Updated docs to reflect the new routes and the legacy redirect map

No state-model, persistence, or workflow logic changed.

---

# Upcoming Priorities

(Sprint 12 complete — next sprint to be planned.)

---

# Future Exploration

Possible future directions:
- Voice capture
- Gentle resurfacing notifications
- Resurface history
- Smaller-step suggestions
- Emotional-context support
- Optional sync/export

These are exploratory and secondary to maintaining clarity and low friction.

---

# Explicit Non-Goals

Loopr is NOT:
- a gamified productivity system
- a hustle/productivity-maximization tool
- a KPI dashboard
- a streak app
- a social platform
- an addictive engagement system

Avoid:
- XP systems
- streak mechanics
- urgency badges
- red warning states
- shame-driven productivity patterns
- excessive notifications

---

# Design Direction

## Visual Identity
- Retro motel keychain aesthetic
- Muted lavender
- Seafoam
- Cream
- Charcoal

## Interaction Style
- Soft transitions
- Rounded tactile surfaces
- Calm spacing
- Minimal visual noise
- Recognition-first UX

## Emotional Tone
The app should feel:
- quietly supportive
- calm
- mature
- tactile
- atmospheric
- emotionally intelligent

Avoid:
- mascot energy
- forced positivity
- productivity hype
- overly cute UX writing
- excessive metaphor usage

The motel metaphor should remain subtle and atmospheric, not gimmicky.