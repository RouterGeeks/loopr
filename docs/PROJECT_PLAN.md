# Loopr Project Plan

## Product Direction

Loopr is a mobile-first PWA designed to reduce cognitive friction and help users safely capture and revisit recurring thoughts.

Loopr is intentionally evolving beyond a traditional productivity app.

The goal is not maximizing output.
The goal is reducing executive-function friction while preserving clarity, calmness, and emotional safety.

Core philosophy:
Capture → Do / Delay / Drop → Revisit

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
- Do
- Delay
- Drop
- Edit
- Delete
- Relative timestamps

## Delay Scheduling
- Tomorrow
- This Weekend
- Next Week
- Pick Date
- Due Now labeling
- Human-readable resurfacing labels

## Revisit
- Delayed loops sorted by revisit time
- Relative resurfacing states
- Empty-state support

## Settings
- Active count
- Delayed count
- Clear all data
- Confirmation protection

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

# Upcoming Priorities

## Sprint 9 — Capture & Context Polish
Planned:
- Navigation icons
- Contextual timestamps
- Improved count hierarchy
- Improved Edit visibility
- Additional capture friction reduction
- Neurodivergent-friendly UX refinements

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