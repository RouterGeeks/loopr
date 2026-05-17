# Loopr

> A quiet place for your thoughts.

A calm editorial notebook for capturing open loops and deciding what
to do with them later. Mobile-first, local-first, no account required.

## Try It

Live demo: **https://routergeeks.github.io/loopr/** *(rebuilds on every push to `main`)*

The demo is the full app — capture loops, move them through
Do → Doing → Done, delay them, drop them, take notes. Data lives in
your browser's localStorage. Nothing leaves your device.

## What Loopr Is

Loopr is a mobile-first PWA designed to reduce cognitive friction
around recurring thoughts. Fast, low-pressure capture and a simple
cognitive workflow:

**Capture → Do → Doing → Done / Dropped / Delayed → Revisit**

Local-first, no account required, follows neurodivergent-friendly UX
principles: recognition over recall, minimal decision fatigue, and
emotional safety.

## Loop States

Loopr distinguishes engagement from completion. Loops live in one of
five states:

| State | Where it lives |
|---|---|
| Do | Dashboard — captured, awaiting triage |
| Doing | Doing — actively engaging with |
| Delayed | Delayed — resurfacing later |
| Done | Done — completed |
| Dropped | Done — consciously released |

Pressing **Do** moves a captured loop into **Doing**, not into Done.
Completion is reachable only via Doing → Done. This gives in-progress
work its own visible state.

## Navigation

Five-tab bottom navigation: **Dashboard / Doing / Delayed / Done / Dials**.
Routes: `/`, `/doing`, `/delayed`, `/done`, `/dials`. The legacy paths
`/revisit`, `/archive`, and `/settings` redirect to their new homes so
old PWA caches and bookmarks keep working.

## Core Philosophy

- Loops are recurring thoughts, not failures.
- Capture should never take more than two or three seconds.
- The interface stays calm: no streaks, no urgency badges, no
  gamification, no red overdue states.
- Delayed loops resurface; they don't accumulate as guilt.
- Dropped loops are consciously released — and recoverable from Done.

## Visual Direction

Editorial notebook / lightweight sketchbook (the earlier
motel/keychain direction was retired in Sprint 16):

- Cool stone paper shell + pale paper card surface
- Cool graphite ink, italic serif "loopr" wordmark
- Serif body for loop text and notes, sans for UI chrome, mono for
  date / capture label / keyboard hint
- Hand-drawn pencil underlines (HandUnderline SVG) under H1s and the
  active bottom-nav tab
- Per-page sketch doodles: mountain (Dashboard), coffee (Doing),
  moon (Delayed), paper stack (Done), dial knob (Dials)
- Dusty lavender + muted sage as the only accent colors

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- localStorage (no backend, no required login, no cloud sync in V1)
- PWA (service worker offline shell, installable)

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

## Deploying the Demo (GitHub Pages)

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
builds and publishes the live demo to GitHub Pages on every push to
`main`. To enable it on a fresh fork:

1. In **Repository Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**.
2. Push to `main` (or run the **Deploy to GitHub Pages** workflow
   manually under the **Actions** tab).
3. The site lives at `https://<owner>.github.io/<repo>/`.

The workflow runs `npm run build:pages`, which sets
`VITE_BASE_PATH=/loopr/` so Vite, React Router, the manifest, and the
service worker all use the sub-path. A separate post-build step
copies `dist/index.html` to `dist/404.html` so that direct links
(`/loopr/doing`, refreshes, etc.) resolve through React Router.

If you fork to a differently-named repo, change `VITE_BASE_PATH` in
`package.json`'s `build:pages` script to match `/<your-repo>/`.

## Documentation

The `/docs` directory holds the working documentation:

- `LOOPR_CONTEXT.md` — product philosophy and tone
- `PROJECT_PLAN.md` — product direction, sprint history, repository structure
- `QA_WORKFLOW.md` — pre-commit and pre-merge QA process
- `QA_CHECKLIST.md` — exhaustive QA list
- `QA_NOTES.md` — known noise and clarifications

Read these before making significant changes.
