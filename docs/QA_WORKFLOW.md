# Dash Dot Dot QA Workflow

This document defines how Dash Dot Dot should be tested during development.

Dash Dot Dot QA validates:

* functionality
* UX quality
* emotional interaction quality
* neurodivergent-friendly design
* PWA/offline behavior

---

# Development Workflow

## During active feature development

Run:

```bash
npm run dev
```

Purpose:

* rapid iteration
* UI testing
* workflow validation
* interaction testing

---

## Before commit or merge

Run:

```bash
npm test
npm run lint
npm run build:pages
npm run build
npm run preview
```

Purpose:

* validate production behavior
* validate PWA functionality
* validate routing
* validate offline behavior
* validate installability
* validate caching

Production preview verifies a candidate build, not the live release or actual
iPhone behavior. Local approval, dev push, main publication, and live
verification are separate stages. Documentation-only edits need link, accuracy,
and diff checks; app suites need not be rerun when no executable files change.

---

# Dev Mode QA

Validate:

## Core Interaction

* capture flow
* Do (Do → Doing) / Done (Doing → Done) / Delay / Drop
* Edit / Delete
* Restore behavior (back to Do)
* keyboard shortcuts

## UX

* visual clarity
* mobile layout
* calm interaction feel
* no double containers/borders

## Emotional UX

* no guilt-oriented interactions
* no urgency
* no overwhelming screens
* calm visual tone

## Technical

* no React warnings
* no TypeScript errors
* no console errors caused by the app
* HMR works correctly

---

# Preview Mode QA

Validate:

## Production Build

* build succeeds
* preview starts correctly
* optimized app works correctly

## PWA

* manifest loads
* service worker registers
* installability works
* icons appear correctly
* standalone mode works

## Offline

* Dashboard (/) works offline
* Doing (/doing) works offline
* Delayed (/delayed) works offline
* Done (/done) works offline
* Dials (/dials) works offline
* Find and thought/detail/connection/label routes work offline after installation
* Legacy routes (/revisit, /archive, /settings) redirect to new homes,
  online or offline

## Routing

* direct refresh works on all routes
* no 404s

## Persistence

* localStorage persists correctly
* Done page (Done + Dropped) persists correctly
* delay scheduling persists
* legacy data decodes without writes; only an explicit successful save rewrites it

## Cache Validation

* old assets removed correctly
* new icons appear correctly
* service worker cache version updated when required

---

# Recommended Workflow

## Step 1

Build feature in dev mode:

```bash
npm run dev
```

---

## Step 2

Validate build:

```bash
npm run build
```

---

## Step 3

Validate production behavior:

```bash
npm run preview
```

---

## Step 4

Run regression smoke test:

* add thought (lands in Do on Dashboard)
* press Do — thought moves to Doing
* press Done on a Doing thought — moves to Done page (Done section)
* delay a thought and verify it appears on Delayed
* drop a thought and verify it appears in Done page (Dropped section)
* restore from Done page — thought returns to Do on Dashboard
* refresh every route
* verify persistence

---

# AI-Assisted Development

Before implementing significant features or architectural changes:

* review all files in /docs
* preserve Dash Dot Dot's emotional UX principles
* preserve low-friction interaction design
* avoid introducing urgency, guilt, or gamification mechanics

---

# Philosophy

Dash Dot Dot QA is not only about correctness.

It should also validate:

* emotional safety
* cognitive clarity
* low-friction interaction design
* calmness under prolonged use

The app should always feel:

* breathable
* trustworthy
* emotionally safe
* recognition-first


# Production browser regression

CI runs `npm run lint`, `npm test`, and `npm run build:pages` for dev pushes and
PRs to dev/main. Main deployment runs these checks before publishing the Pages
artifact. CI does not run the optional Playwright harnesses or iPhone QA.

With local Playwright and its Chromium binary available, run relevant harnesses
against the production build. They use isolated browser profiles with disposable
data; never point destructive test fixtures at a user's real browser profile.
These optional harnesses are separate from the package-defined CI checks.

After `npm run build:pages`, these scripts start their own Pages-like servers:

```bash
node scripts/editor-draft-browser-check.cjs
node scripts/draft-browser-check.cjs
node scripts/labels-browser-check.cjs
node scripts/search-browser-check.cjs
node scripts/offline-browser-check.cjs
node scripts/update-browser-check.cjs
```

Run sequentially. Then `npm run build` restores the root-path build. Start
`npm run preview` in a separate terminal (expected port 4173) for these checks:

```bash
node scripts/connections-browser-check.cjs
node scripts/constellation-browser-check.cjs
node scripts/thought-menu-browser-check.cjs
node scripts/scheduling-browser-check.cjs
```

Select checks appropriate to the change; preserve recorded failures and actual
results in QA_CHECKLIST. Chromium emulation is not iPhone Safari or VoiceOver.

# iPhone and update review

Use a trusted HTTPS candidate and an online first load for service workers and
full Dashboard draft ownership. HTTP LAN preview only establishes layout and
session-level draft fallback. Temporary tunnel URLs/build hashes in older QA
entries are historical snapshots, not durable environments. Record the current
URL, build, iOS version, and Safari versus Home Screen mode for each review.
Use disposable test data; different origins have separate storage. Observe
Safari/Home Screen sharing rather than assuming it.

Update now requires saving/closing blocking work and closing other app windows.
Only the requester reloads. Later postpones the notice; normal close/reopen
activation remains supported. Test both a blocked update and a successful one
with two known builds. Do not clear storage or reinstall to force an update.
Dashboard recovery is best effort, not a backup or permission to discard editor
drafts. See [README limits](../README.md#privacy-storage-and-recovery).

# Release verification

After explicit publication authorization, verify GitHub deployment success,
compare live files with the deployment artifact, and check rendered live behavior
in isolated storage. Record commit/run identity and results separately from local
checks. General iPhone approval does not establish every VoiceOver, Files,
process-termination, or storage-eviction scenario. Do not mark unchecked manual
steps complete without evidence.
