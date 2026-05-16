# Loopr QA Notes

This document captures intentional product decisions, QA observations, and behavioral notes discovered during development and testing.

These notes exist to:

* preserve product intent
* prevent accidental regressions
* guide future AI-assisted development
* document UX philosophy decisions

---

# Product Decisions

## Drop vs Delete

Drop is intentionally reversible.

Behavior:

* Drop moves a loop into Archive → Dropped
* Dropped loops can be restored later
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

# Technical Notes

## localStorage

Loopr currently persists data using:

```txt
loopr.loops
```

Persistence is verified across:

* refreshes
* route changes
* preview mode
* offline mode

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
