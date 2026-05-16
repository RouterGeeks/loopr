# Loopr Context

Loopr is a mobile-first PWA for capturing open loops and deciding what to do with them.

Core flow:
Capture → Do → Doing → Done / Dropped / Delayed → Revisit

Loopr is evolving from a lightweight productivity app into a calm cognitive-support tool focused on reducing executive-function friction and helping thoughts resurface safely.

---

# Core Principles

## Frictionless capture is the #1 priority

If capture takes more than 2–3 seconds, the app is broken.

The critical user experience is:

Thought → Captured

with as little interruption as possible.

Loopr should optimize:
- low cognitive load
- low visual overwhelm
- rapid thought capture
- emotional clarity
- contextual memory support

---

# Product Philosophy

Loops are recurring thoughts, not failures.

The app should feel calm, breathable, emotionally safe, and quietly supportive.

Loopr avoids:
- urgency mechanics
- streaks
- productivity guilt
- gamification
- red overdue states
- anxiety-inducing dashboards
- excessive notifications
- cluttered interfaces

The app should never shame users for resurfacing loops repeatedly.

A loop resurfacing multiple times is treated as useful information:
- the loop may be too large
- emotionally complex
- poorly defined
- blocked
- or no longer relevant

The app should gently support reflection without judgment.

---

# Loop State Model

Loops move between five distinct states. Each state names a cognitive
posture rather than a task-management bucket.

| State | Meaning |
|---|---|
| Do | captured / open loops awaiting triage |
| Doing | loops you are actively engaging with |
| Delayed | resurfacing loops scheduled for later |
| Done | completed loops |
| Dropped | consciously released loops |

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
- Do → engage with this loop now (moves it into Doing)
- Done → mark a Doing loop as complete
- Delay → revisit later
- Drop → consciously release it

"Resurface" is supporting emotional language and system framing, not a
replacement for clarity.

Examples:
- delayed loops can "resurface"
- revisit areas may reference "waiting at the front desk"
- loops may "resurface today"

But users should never need to decode metaphors to use the app.

Functional clarity always comes first.

---

# Neurodivergent-Friendly UX Principles

Loopr is intentionally designed to reduce executive-function friction and support neurodivergent users without infantilizing them.

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

Loopr should help reconnect context gently.

Examples:
- subtle “Added 3 days ago”
- revisit timestamps
- resurfacing history
- lightweight contextual cues

The goal is not productivity optimization.
The goal is reducing cognitive friction.

---

# Motel / Keychain Design Philosophy

The retro motel keychain theme is atmospheric, tactile, and emotionally grounding.

It should feel:
- analog
- warm
- slightly nostalgic
- breathable
- tactile
- calm

The motel metaphor should remain subtle.

It is flavor and emotional texture — not roleplay.

Avoid:
- excessive themed copy
- overexplaining the metaphor
- turning the app into a gimmick

The best implementations feel:
- quiet
- natural
- lightly poetic
- emotionally resonant

---

# Resurfacing Philosophy

A resurfacing loop is not a failure state.

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

Current / near-term features:
- Quick text capture
- Cmd/Ctrl + Enter capture
- Do / Doing / Delayed / Done / Dropped state model
- Dedicated Doing view for active engagement
- Delay scheduling
- Revisit view for delayed loops
- Resolved view (Done + Dropped) with restore
- Relative resurfacing labels
- Edit and delete loops
- Local storage persistence with backward-compatible migration
- PWA install support
- Offline shell support
- Contextual timestamps (Added / Started / Completed / Dropped)
- Simple settings

Future considerations:
- Voice capture
- Gentle notifications
- Resurface insights
- Smaller-step suggestions

---

# Explicit Non-Goals

Loopr is NOT:
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
- Retro motel keychain aesthetic
- Muted lavender
- Seafoam
- Cream
- Charcoal

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