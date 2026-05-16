# Loopr

> Capture open loops and decide what to do next.

## What Loopr Is

Loopr is a mobile-first PWA designed to reduce cognitive friction around recurring thoughts. It's built for fast, low-pressure capture and a simple triage workflow:

**Capture → Do / Delay / Drop → Revisit**

It's local-first, requires no account, and follows neurodivergent-friendly UX principles: recognition over recall, minimal decision fatigue, and emotional safety.

## Core Philosophy

- Loops are recurring thoughts, not failures.
- Capture should never take more than two or three seconds.
- The interface stays calm: no streaks, no urgency badges, no gamification, no red overdue states.
- Delayed loops resurface; they don't accumulate as guilt.
- Dropped loops are consciously released — and recoverable from the Archive.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- localStorage
- PWA (service worker offline shell, installable)

No backend. No required login. No cloud sync in V1.

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

Production build and local preview:

```bash
npm run build
npm run preview
```

## Documentation

The `/docs` directory holds the working documentation:

- `LOOPR_CONTEXT.md` — product philosophy and tone
- `PROJECT_PLAN.md` — product direction, sprint history, repository structure
- `QA_WORKFLOW.md` — pre-commit and pre-merge QA process
- `QA_CHECKLIST.md` — exhaustive QA list
- `QA_NOTES.md` — known noise and clarifications

Read these before making significant changes.
