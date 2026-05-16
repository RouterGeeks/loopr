# Loopr QA Workflow

This document defines how Loopr should be tested during development.

Loopr QA validates:

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

Preview mode is considered the final source of truth before shipping changes.

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
* Legacy routes (/revisit, /archive, /settings) redirect to new homes,
  online or offline

## Routing

* direct refresh works on all routes
* no 404s

## Persistence

* localStorage persists correctly
* Done page (Done + Dropped) persists correctly
* delay scheduling persists
* legacy data migrates on first load

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

* add loop (lands in Do on Dashboard)
* press Do — loop moves to Doing
* press Done on a Doing loop — moves to Done page (Done section)
* delay a loop and verify it appears on Delayed
* drop a loop and verify it appears in Done page (Dropped section)
* restore from Done page — loop returns to Do on Dashboard
* refresh every route
* verify persistence

---

# AI-Assisted Development

Before implementing significant features or architectural changes:

* review all files in /docs
* preserve Loopr's emotional UX principles
* preserve low-friction interaction design
* avoid introducing urgency, guilt, or gamification mechanics

---

# Philosophy

Loopr QA is not only about correctness.

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
