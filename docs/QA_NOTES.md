# Loopr QA Notes

This document captures intentional product decisions, QA observations, and behavioral notes discovered during development and testing.

These notes exist to:

* preserve product intent
* prevent accidental regressions
* guide future AI-assisted development
* document UX philosophy decisions

---

# Product Decisions

## State Model (Sprint 10) + Nav Terminology (Sprint 11) + Routes (Sprint 12)

Loops live in one of five states: Do, Doing, Delayed, Done, Dropped.

* **Do** — captured/open loops awaiting triage. Lives on the Dashboard page (route `/`).
* **Doing** — actively engaged loops. Lives on the Doing page (route `/doing`).
* **Delayed** — resurfacing loops scheduled for later. Lives on the Delayed page (route `/delayed`).
* **Done** — completed loops. Lives on the Done page (route `/done`), in the Done section.
* **Dropped** — consciously released loops. Lives on the Done page, in the Dropped section.

"Do" is engagement, not completion. Completion is only reachable from
Doing → Done. This separation gives in-progress work its own visible
state, which matters for neurodivergent users who need to see what they
are currently holding.

Restore from the Done page returns the loop to Do (not directly to
Doing), so the user can decide what to do with it as if it were freshly
captured.

**Legacy routes.** The pre-Sprint-12 paths still resolve, via in-app
redirects:

* `/revisit` → `/delayed`
* `/archive` → `/done`
* `/settings` → `/dials`

This keeps installed PWAs and existing bookmarks working. The service
worker cache version was bumped to `loopr-shell-v5` when the new routes
joined the precache SHELL, so old caches are cleared on next
service-worker activation.

**Renaming trail** (for archaeology): the Done page was originally
called Archive, then Resolved (Sprint 10), then Done (Sprint 11). Its
route was `/archive` through Sprint 11 and became `/done` in Sprint 12,
with `/archive` redirecting.

---

## Drop vs Delete

Drop is intentionally reversible.

Behavior:

* Drop moves a loop into the Done page → Dropped section
* Dropped loops can be restored later (to Do)
* Drop does NOT require confirmation

Delete is permanent.

Behavior:

* Delete permanently removes the loop
* Delete requires confirmation
* Deleted loops cannot be restored

Rationale:
Dropping a loop is intended to feel low-pressure and emotionally safe.
Permanent deletion should require deliberate confirmation.

---

## Delay / Resurface Philosophy

Delayed loops are not failures.

Loopr intentionally avoids:

* overdue language
* urgency
* shame-oriented productivity mechanics

Delayed loops are treated as resurfacing thoughts.

The app should feel:

* calm
* supportive
* reflective
* emotionally safe

Repeated resurfacing should never feel punitive.

---

## “This Weekend” Scheduling

When tested on Saturday:

* “This Weekend” intentionally resolves to Sunday (Tomorrow)

Rationale:
Delay actions should schedule future resurfacing rather than same-day deferral.

---

## Motel / Keychain Theme

The motel metaphor is atmospheric, not literal.

The theme should:

* remain subtle
* never reduce usability clarity
* avoid gimmicky roleplay behavior

The app should still feel:

* mature
* calm
* recognition-first

---

## Emotional UX Rules

Avoid:

* guilt-oriented copy
* hustle/productivity culture language
* streaks
* gamification
* urgency mechanics
* red warning states

Preferred tone:

* calm
* breathable
* lightly human
* emotionally intelligent

---

## Count Hierarchy (Sprint 9)

Counts across Dashboard, Delayed, Dials, and Done emphasize the number and
de-emphasize the label.

* Number: tabular-nums, semibold, leading-none, tracking-tight
* Label: smaller, lighter charcoal (~/45–/50), wider tracking
* Background: soft lavender or white at low opacity — never bright

Avoid:

* bright accent colors
* dashboard-style energy
* labels louder than numbers

---

## Edit Visibility (Sprint 9)

Edit on LoopCard sits in the utility row at the bottom of the card, beneath
the primary action row. It carries a subtle background and ring so it reads
as a button, but it should never compete with the primary actions.

Delete remains intentionally more recessive — text-only, no default background.

Hierarchy:

1. Primary row — Do / Delay / Drop on Do and Delayed cards; Done / Delay / Drop on Doing cards
2. Edit (utility, subtle button)
3. Delete (utility, recessive)

---

# Technical Notes

## localStorage

Loopr currently persists data using:

```txt
loopr.loops
```

All read/write goes through `src/lib/loops.ts`. The loader detects legacy
schemas (V1 `pending`/`delay`/`drop`/`do`-as-completed and V4 `active`)
and normalizes them into the current model. Once the loader has touched
a dataset, the writer always saves new-schema strings, so the legacy
detection only fires once per device.

Persistence is verified across:

* refreshes
* route changes
* preview mode
* offline mode
* upgrade from V4 (`active`/`delayed`/`done`/`dropped`) — existing
  `active` loops become `do`, all other states preserved

---

## Dev Console Noise

The following errors may appear during development:

* “Could not establish connection. Receiving end does not exist”
* “message channel closed before a response was received”

These are browser-extension related and not Loopr application errors.

Ignore unless app functionality is affected.

---

## Dev vs Preview

`npm run dev`

* used for active development
* HMR enabled
* service worker behavior differs

`npm run preview`

* validates production behavior
* validates PWA functionality
* validates offline/caching/installability

Preview mode is the final QA validation target before commit/merge.

---

# UX QA Focus Areas

Loopr QA should validate:

* technical correctness
* emotional safety
* cognitive friction reduction
* neurodivergent-friendly interaction quality

Questions to ask:

* Does this interaction feel stressful?
* Does this interaction feel punishing?
* Is the UI cognitively overwhelming?
* Does the app still feel calm after prolonged use?
* Is functionality immediately understandable?
