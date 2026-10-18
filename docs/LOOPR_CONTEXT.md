# Dash Dot Dot Context

Dash Dot Dot (formerly Loopr) is a mobile-first PWA for capturing thoughts and deciding what to do with them.

Core flow:
Capture → Do → Doing → Done / Dropped / Delayed → Revisit

Dash Dot Dot is evolving from a lightweight productivity app into a calm cognitive-support tool focused on reducing executive-function friction and helping thoughts resurface safely.

---

# Core Principles

## Frictionless capture is the #1 priority

If capture takes more than 2–3 seconds, the app is broken.

The critical user experience is:

Thought → Captured

with as little interruption as possible.

Dash Dot Dot should optimize:
- low cognitive load
- low visual overwhelm
- rapid thought capture
- emotional clarity
- contextual memory support

---

# Product Philosophy

Recurring thoughts are not failures.

The app should feel calm, breathable, emotionally safe, and quietly supportive.

Dash Dot Dot avoids:
- urgency mechanics
- streaks
- productivity guilt
- gamification
- red overdue states
- anxiety-inducing dashboards
- excessive notifications
- cluttered interfaces

The app should never shame users for resurfacing thoughts repeatedly.

A thought resurfacing multiple times is treated as useful information:
- the thought may be too large
- emotionally complex
- poorly defined
- blocked
- or no longer relevant

The app should gently support reflection without judgment.

---

# Thought State Model

Thoughts move between five distinct states. Each state names a cognitive
posture rather than a task-management bucket.

| State | Meaning |
|---|---|
| Do | captured / open thoughts awaiting triage |
| Doing | thoughts you are actively engaging with |
| Delayed | resurfacing thoughts scheduled for later |
| Done | completed thoughts |
| Dropped | consciously released thoughts |

Transitions are intentional and few:

- Do → Doing (engage), Delayed (push back), Dropped (release)
- Doing → Done (complete), Delayed (pause), Dropped (release)
- Delayed → Doing (engage now), Delayed (re-schedule), Dropped (release)
- Done / Dropped → Do (restore)

"Do" is engagement, not completion. Completion lives only in Done.

---

# Action Language

Do / Doing / Delay / Drop / Done are core identity elements and should
remain simple and immediately understandable.

Definitions:
- Do → engage with this thought now (moves it into Doing)
- Done → mark a Doing thought as complete
- Delay → revisit later
- Drop → consciously release it

"Resurface" is supporting emotional language and system framing, not a
replacement for clarity.

Examples:
- delayed thoughts can "resurface"
- revisit areas use clear Ready to revisit wording
- thoughts may "resurface today"

But users should never need to decode metaphors to use the app.

Functional clarity always comes first.

---

# Neurodivergent-Friendly UX Principles

Dash Dot Dot is intentionally designed to reduce executive-function friction and support neurodivergent users without infantilizing them.

The app should:
- feel calm and mature
- reduce overwhelm
- support recognition over recall
- minimize decision fatigue
- preserve context around thoughts
- avoid punishment mechanics

Avoid:
- mascot energy
- forced positivity
- productivity hype
- “you got this!” language
- overly cute UX writing
- guilt-oriented copy
- manipulative engagement loops

Tone should feel:
- calm
- clear
- atmospheric
- emotionally intelligent
- lightly human
- never performative

---

# Contextual Memory Support

ADHD and neurodivergent users may lose contextual memory around why a thought mattered.

Dash Dot Dot should help reconnect context gently.

Examples:
- subtle “Added 3 days ago”
- revisit timestamps
- resurfacing history
- lightweight contextual cues

The goal is not productivity optimization.
The goal is reducing cognitive friction.

---

# Editorial Notebook Direction

Dash Dot Dot's visual identity is a calm editorial notebook / lightweight
sketchbook. The earlier motel/keychain metaphor has been retired —
references to it in older sections of this doc set are historical, not
prescriptive.

The current direction should feel:
- analog
- warm
- lightly editorial
- breathable
- tactile
- calm
- modern

The notebook feel is carried by:
- cool stone / pale paper surfaces (no kraft beige)
- cool graphite ink
- restrained dusty lavender + muted sage accents
- italic serif "Dash Dot Dot" wordmark with a decorative − · · mark
- serif body type for thought content, sans for UI chrome, mono for date
  eyebrow and small labels
- hand-drawn pencil underlines (`HandUnderline` SVG) under H1s, empty
  state titles, and the active bottom-nav tab
- per-page sketch doodles in pencil-line SVG (mountain on Dashboard,
  coffee on Doing, moon on Delayed, paper stack on Done, dial on Dials)
- a small lavender "+" button (inline on Dashboard, FAB elsewhere)

Avoid:
- sepia vintage
- scrapbook decoration
- fake stationery effects
- beige themed-productivity energy
- bright SaaS dashboard colors

The best implementations feel:
- quiet
- intentional
- lightly poetic
- emotionally resonant

---

# Resurfacing Philosophy

A resurfacing thought is not a failure state.

Repeated resurfacing should feel:
- informative
- compassionate
- reflective

not:
- alarming
- urgent
- shameful

Resurface counts should never feel punitive.

If visual resurfacing indicators are added:
- they should become more tactile or “worn-in”
- not more alarming
- not more aggressive

Think:
- beloved analog object
- gentle wear
- history
- familiarity

Not:
- warning systems
- danger states
- escalating pressure

---

# V1 Features

Current live features (2026-10-18):
- Quick text capture
- Cmd/Ctrl + Enter capture
- Do / Doing / Delayed / Done / Dropped state model
- Dashboard (capture + overview of open work) at `/`
- Dedicated Doing view at `/doing`
- Delay scheduling
- Delayed view at `/delayed`
- Done view (completed + released thoughts, with restore) at `/done`
- Dials (settings / control panel) at `/dials`
- Legacy redirects: `/revisit` → `/delayed`, `/archive` → `/done`,
  `/settings` → `/dials`
- Relative resurfacing labels
- Edit and delete thoughts
- One optional note per thought via More → Add note/Edit note; saved previews
  remain visible, and the editor stays closed until requested
- Voice-to-text capture using the browser's Web Speech API: append-only,
  transcripts always editable, no audio stored by the app
- Local storage persistence with read-only legacy decoding until explicit save
- PWA install support
- Offline shell support
- Contextual timestamps (Added / Started / Completed / Dropped)
- Linked counts, clearer revisit cues, default revisit time, custom date/time scheduling
- Find across thoughts/notes, custom labels, and label/captured-date filters
- Manual constellation/List connections and explicit shared-label suggestions
- Versioned backup export/restore, guarded writes, and unreadable-data recovery
- Update notice with unsaved-work and other-tab protection
- Dashboard draft recovery (live `3626f21`) and Lavender Home Screen icons

See [README](../README.md#privacy-storage-and-recovery) for the current storage,
backup, speech privacy, and recovery limits. Browser speech recognition may use
a provider's remote service; the app does not guarantee on-device transcription.
Unsaved note/edit/label drafts remain temporary; no automatic connections or AI.

Future considerations:
- Gentle notifications
- Resurface insights
- Smaller-step suggestions

---

# Explicit Non-Goals

Dash Dot Dot is NOT:
- a gamified productivity app
- a hustle tool
- a KPI dashboard
- a streak app
- a task punishment system
- a social productivity platform

Avoid:
- XP systems
- streaks
- urgency badges
- red overdue warnings
- addictive engagement patterns
- attention hijacking

---

# Technical Direction

Architecture:
- Mobile-first PWA
- React + TypeScript + Vite
- Local-first storage
- No required login
- Minimal dependencies
- Lightweight and fast

Current storage:
- localStorage

Possible future:
- IndexedDB
- optional sync

No backend in V1.
No AI processing in V1.

---

# Design System

Visual style:
- Editorial notebook / lightweight sketchbook
- Cool stone paper surfaces
- Cool graphite ink
- Dusty lavender accents
- Muted sage (the Doing accent — replaces the older seafoam token)

Interaction style:
- Soft transitions
- Calm spacing
- Rounded tactile surfaces
- Minimal visual noise
- Clear hierarchy
- Recognition-first UX

The app should feel:
- quiet
- trustworthy
- breathable
- emotionally safe
- fast

Current live identity: Dash Dot Dot. Earlier Loopr references describe
the same product. Storage keys, backup identity, repository and /loopr/ URL remain
unchanged for compatibility; the name change does not migrate data.


## Manual thought connections (live)

Connect the dots adds user-created relationships between saved thoughts.
Graph and List are alternate views of the same manual connections; dots open
thought details. Connections never change state or scheduling. There is no AI
processing or remote request. Connections live in the same guarded thought
storage. Exports use v2 for connection fields without labels, v3 when label
fields exist, otherwise v1. The current reader accepts v1/v2/v3.
See PROJECT_PLAN and QA_CHECKLIST for scope and review status.


## Custom labels and filters (live)

Optional user-created labels describe themes; explicit thought connections
remain distinct. Labels can filter Find and explain suggestions in Connect the
dots, but never create automatic links. Labeled backups use version 3; existing
v1/v2 remain readable. See PROJECT_PLAN and QA_CHECKLIST for scope and status.


## Dashboard draft recovery (live `3626f21`)

Unfinished Dashboard text is separate from saved thoughts and backups. Supported
secure browsers use per-draft ownership locks for safe reload/closed-tab recovery;
other browsers use session-only recovery. No AI, sync, or note/edit draft recovery
is included. See PROJECT_PLAN and QA_CHECKLIST for validation and release status.


## Note and thought-edit recovery (local candidate, not published)

Recovery extends the existing reliability direction: restore unfinished text for
review, keep Save/Cancel explicit, protect other-tab ownership, and require review
of newer saved content. Dials exposes unfinished text when a thought is no longer
available. This does not add AI, sync, automatic saves, or label-draft recovery.
See PROJECT_PLAN and QA_CHECKLIST for candidate scope and validation.
