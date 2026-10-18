# Dash Dot Dot

Formerly Loopr. The repository, `/loopr/` URL, storage keys, and backup app
identifier retain their original names for compatibility. The current app and
Lavender Home Screen icon are live.

> A quiet place for your thoughts.

A calm editorial notebook for capturing thoughts and deciding what
to do with them later. Mobile-first, local-first, no account required.

## Try It

Live app: **[Dash Dot Dot](https://routergeeks.github.io/loopr/)**.
Successful deployments from `main` publish to GitHub Pages; pushing to `dev`
only runs validation. The latest app release is Dashboard draft recovery
(`3626f21`, 2026-10-18). See the [release record](docs/PROJECT_PLAN.md#current-work-and-release-status).

## What is live

- Text and supported browser voice capture, multiline entry, and Cmd/Ctrl+Enter.
- Do / Doing / Delayed / Done / Dropped, one editable note per thought, and compact More actions.
- Linked Dials counts, a Ready to revisit cue, a default revisit time, and custom date/time scheduling.
- Find a thought: local search across saved thoughts and notes, custom label filters, and inclusive captured-date ranges.
- Connect the dots: manual connections in clickable constellation and List views. Shared labels suggest related thoughts; connecting is always explicit.
- Dials backup export/restore, guarded storage writes, and recovery guidance for unreadable data.
- Lavender Home Screen icon, an offline app shell after an online install, and an update notice that protects open work and other tabs.
- Dashboard draft recovery with per-tab ownership on supported secure browsers.

## Privacy, storage, and recovery

Saved thoughts, notes, labels, connections, states, and schedules live in this
browser's localStorage. There is no app account, cloud sync, or app backend for
thought content. Find and shared-label suggestions run locally; there is no AI
suggestion service. Loading the site and checking for app updates still uses
the network.

The optional mic uses the browser's speech-recognition service. Dash Dot Dot
does not record or store audio itself, but the browser/provider may send audio
to a remote service. On-device transcription and offline voice availability
are not guaranteed. Keyboard dictation follows the device/provider's settings.
See [MDN's speech-recognition privacy/availability note](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

| Data | Recovery and backup limits |
|---|---|
| Saved thoughts and their notes, labels, connections, states, and dates | Included in Dials JSON exports. Restore replaces the entire saved dataset; it does not merge. |
| Unfinished Dashboard text | Stored separately as you type. With available Web Locks and working storage, each draft has one tab owner; after that owner closes, another tab can recover it into an empty capture. Without ownership locks, recovery is session-only; closed-tab recovery is not promised. |
| Unsaved note, thought-edit, and label-editor changes | Temporary in-memory drafts. Failed saves retain the open draft, but reload/closure can lose it. Save or copy before leaving. |
| Default revisit time | A separate local preference; excluded from thought exports. |

Draft recovery is best effort, **not a backup**. Storage access failures, browser
data clearing, private-browsing lifetimes, or OS/browser eviction can remove
thoughts, drafts, and offline assets. The app cannot recover erased storage.
Production, localhost, LAN, and temporary HTTPS previews have separate origins;
do not assume Safari and a Home Screen installation share data. Export from the
context that contains your thoughts before moving between contexts.

Backups are readable JSON files; store/share them accordingly. Exports retain
`app: "loopr"`: version 3 when label fields exist, version 2 for connection
fields without labels, otherwise version 1. The current app reads all three;
older builds may reject newer versions. Update older open clients before editing
newer data. Backups exclude unfinished drafts and preferences. Restore and Clear
All affect saved thoughts, including notes/labels/connections, while leaving
Dashboard drafts and the default revisit time intact. Discard drafts separately
on Dashboard. Download original data in Dials preserves unreadable stored bytes
for recovery; it is not a validated backup.

Update now waits for open work to be saved/closed and for other app windows to
close. It reloads only the requester; Later postpones it. Do not clear website
data or delete an installation merely to force an update or icon refresh.

## What Dash Dot Dot Is

Dash Dot Dot is a mobile-first PWA designed to reduce cognitive friction
around recurring thoughts. Fast, low-pressure capture and a simple
cognitive workflow:

**Capture → Do → Doing → Done / Dropped / Delayed → Revisit**

Local-first, no account required, follows neurodivergent-friendly UX
principles: recognition over recall, minimal decision fatigue, and
emotional safety.

## Thought States

Dash Dot Dot distinguishes engagement from completion. Thoughts live in one of
five states:

| State | Where it lives |
|---|---|
| Do | Dashboard — captured, awaiting triage |
| Doing | Doing — actively engaging with |
| Delayed | Delayed — resurfacing later |
| Done | Done — completed |
| Dropped | Done — consciously released |

Pressing **Do** moves a captured thought into **Doing**, not into Done.
Completion is reachable only via Doing → Done. This gives in-progress
work its own visible state.

## Navigation

Five-tab bottom navigation: **Dashboard / Doing / Delayed / Done / Dials**.
Routes: `/`, `/doing`, `/delayed`, `/done`, `/dials`. The legacy paths
`/revisit`, `/archive`, and `/settings` redirect to their new homes so
old PWA caches and bookmarks keep working. Find lives at `/find`; thought
details, connections, and label editing use `/thoughts/:id`,
`/thoughts/:id/connections`, and `/thoughts/:id/labels`.

## Core Philosophy

- Recurring thoughts are not failures.
- Capture should never take more than two or three seconds.
- The interface stays calm: no streaks, no urgency badges, no
  gamification, no red overdue states.
- Delayed thoughts resurface; they don't accumulate as guilt.
- Dropped thoughts are consciously released — and recoverable from Done.

## Visual Direction

Editorial notebook / lightweight sketchbook (the earlier
motel/keychain direction was retired in Sprint 16):

- Cool stone paper shell + pale paper card surface
- Cool graphite ink, italic serif "Dash Dot Dot" wordmark and − · · motif
- Serif body for thought text and notes, sans for UI chrome, mono for
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
npm ci
npm run dev
```

The dev server runs at `http://localhost:5173`.

Production build and local preview:

```bash
npm run build
npm run preview
```

Local validation:

```bash
npm test
npm run lint
npm run build:pages
npm run build
```

The last command restores the root-path preview after the `/loopr/` Pages build.
For production browser checks, see [QA workflow](docs/QA_WORKFLOW.md). An HTTP
LAN preview can check layout, but trusted HTTPS is required for iPhone service
worker/offline testing and full draft ownership/recovery. First-ever offline
launch is unsupported.

## Deploying the App (GitHub Pages)

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`)
builds and publishes the live demo to GitHub Pages on every push to
`main`. To enable it on a fresh fork:

1. In **Repository Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**.
2. Push to `main` (or run the **Deploy to GitHub Pages** workflow
   manually under the **Actions** tab).
3. The site lives at `https://<owner>.github.io/<repo>/`.

The workflow runs lint and `npm test` before `npm run build:pages`, which sets
`VITE_BASE_PATH=/loopr/` so Vite, React Router, the manifest, and the
service worker all use the sub-path. A separate post-build step
copies `dist/index.html` to `dist/404.html` so that direct links
(`/loopr/doing`, refreshes, etc.) resolve through React Router.

If you fork to a differently-named repo, change `VITE_BASE_PATH` in
`package.json`'s `build:pages` script to match `/<your-repo>/`.

## Documentation

The `/docs` directory holds the working documentation:

- [LOOPR_CONTEXT.md](docs/LOOPR_CONTEXT.md) — product philosophy and tone
- [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) — current capabilities, release status, and history
- [QA_WORKFLOW.md](docs/QA_WORKFLOW.md) — local checks, device review, and release verification
- [QA_CHECKLIST.md](docs/QA_CHECKLIST.md) — repeatable QA and historical results
- [QA_NOTES.md](docs/QA_NOTES.md) — intentional behavior and known limits

Read these before making significant changes.
