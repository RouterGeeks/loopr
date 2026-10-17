# Loopr Project Plan

## Product Direction

Loopr is a mobile-first PWA designed to reduce cognitive friction and help users safely capture and revisit recurring thoughts.

Loopr is intentionally evolving beyond a traditional productivity app.

The goal is not maximizing output.
The goal is reducing executive-function friction while preserving clarity, calmness, and emotional safety.

Core philosophy:
Capture → Do → Doing → Done / Dropped / Delayed → Revisit

Loopr distinguishes between engagement (Doing) and completion (Done).
Pressing "Do" on an open loop moves it into Doing — not into Done. This
separation supports neurodivergent cognition by giving "in progress" its
own visible state.

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
  /components   reusable UI (LoopCard, ArchiveCard, BottomNav, ...)
  /pages        route components (Home, Doing, Revisit, Archive, Settings)
                  user-facing labels: Dashboard / Doing / Delayed / Done / Dials
                  primary routes: /, /doing, /delayed, /done, /dials
                  legacy redirects: /revisit → /delayed,
                                    /archive → /done,
                                    /settings → /dials
  /lib          shared logic — loops.ts owns the state model, migration, persistence
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
- Voice-to-text via browser SpeechRecognition (append-only; transcripts
  editable; mic hidden + calm fallback when API unsupported; no audio
  stored)
- Immediate local persistence

## Loop Management
- Do (engage, moves to Doing)
- Done (complete, from Doing)
- Delay (re-schedule, from any state)
- Drop (release)
- Edit
- Delete
- Restore from Done or Dropped back to Do
- Optional note on any loop (collapsed; expand to add/edit; small dot
  indicator when a note exists; works in Do / Doing / Delayed / Done /
  Dropped)
- Relative timestamps (Added / Started / Completed / Dropped)

## Delay Scheduling
- Tomorrow
- This Weekend
- Next Week
- Pick Date
- Due Now labeling
- Human-readable resurfacing labels

## Dashboard (route /)
- Capture input with Cmd/Ctrl + Enter shortcut
- Workflow legend: Do / Delay / Drop
- List of Do (open) loops
- Autofocus on mount and on return navigation

## Doing (route /doing)
- Dedicated view for actively engaged loops
- Page heading identifies the Doing state; redundant status pills removed
- "Started X" contextual timestamp
- Transitions to Done, Delayed, or Dropped

## Delayed (route /delayed)
- Delayed loops sorted by revisit time
- Relative resurfacing states
- Empty-state support

## Done (route /done)
- Done and Dropped surfaced as named sections
- Restore returns loops to Do
- Permanent delete with confirmation
- Empty-state support

## Dials (route /dials)
- Four-tile count grid: Do / Doing / Delayed / Done
- Export and restore versioned JSON backups (locally approved; publication pending)
- Clear all data
- Confirmation protection

## Legacy route redirects
- /revisit → /delayed
- /archive → /done
- /settings → /dials

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

## Sprint 9 — Capture & Context Polish
Completed:
- Confirmed navigation icons remain subtle and recognition-first
- Verified contextual timestamps on active, delayed, and archived loops
- Strengthened count hierarchy on Home, Revisit, and Settings
- Added inline counts beside Archive section headers and an Archived total in Settings
- Made Edit slightly more discoverable while keeping it secondary to Do / Delay / Drop
- Refined empty-state copy on Home and Revisit with calm supporting lines
- Tightened mobile heading sizes and SectionCard padding for better scanability
- Replaced performative capture copy with a quiet keyboard-shortcut cue
- Softened Settings subtitle to remove marketing-leaning language

---

## Sprint 10 — Cognitive State Model
Completed:
- Introduced Doing as a first-class state distinct from Done
- Pressing Do now moves a loop into Doing, not into the resolved set
- Added a dedicated Doing page with its own LoopCard treatment (seafoam pill)
- Renamed the Archive page label to "Resolved" while keeping the /archive route
- Surfaced Done and Dropped as named sections inside Resolved
- Added 5-tab bottom navigation: Home / Doing / Revisit / Resolved / Settings
- Extracted shared `lib/loops.ts` module with typed migration and persistence
- Added backward-compatible migration for `active`, `pending`, `delay`, `drop`,
  legacy `do` (completed), and current schema strings
- Tracked `startedAt` on Doing transitions for contextual "Started X" timestamps
- Updated Settings counts to a 4-tile grid: Do / Doing / Delayed / Resolved
- Surfaced Do / Doing / Delayed counts on Home for orientation
- Restore now sends Done or Dropped loops back to Do (not directly to Doing)

Hotfix during testing (BUG-01):
- Restored autofocus on the Dashboard capture textarea using a ref +
  useEffect, since the HTML autofocus attribute is unreliable under
  React SPA hydration.

---

## Sprint 11 — Navigation Terminology
Completed:
- Renamed nav labels: Home → Dashboard, Revisit → Delayed,
  Resolved → Done, Settings → Dials (Doing unchanged)
- Updated H1s on all five pages to match new nav labels
- Routes preserved (`/`, `/doing`, `/revisit`, `/archive`, `/settings`)
  to avoid invalidating PWA service-worker caches and existing bookmarks
- Empty-state copy on the Done page no longer uses the word "resolved"
- Internal icon and count-tile names renamed to match new labels
- Docs (README, LOOPR_CONTEXT, PROJECT_PLAN, QA_CHECKLIST, QA_NOTES,
  QA_WORKFLOW) updated to use the new vocabulary

No state-model, persistence, or workflow logic changed.

---

## Sprint 12 — Route Alignment
Completed:
- Renamed routes to match nav labels: /revisit → /delayed,
  /archive → /done, /settings → /dials
- Added in-app redirects so the old paths (`/revisit`, `/archive`,
  `/settings`) navigate to their new homes — preserves bookmarks and
  installed-PWA cache entries
- Updated BottomNav `to` targets to point at the new paths
- Bumped service worker cache to `loopr-shell-v5`
- Added new routes (/doing, /delayed, /done, /dials) to the SW SHELL
  precache list for first-load offline coverage
- Updated docs to reflect the new routes and the legacy redirect map

No state-model, persistence, or workflow logic changed.

---

## Sprint 13 — Optional Loop Notes
Completed:
- Added optional `note?: string` field to LoopItem; existing loops
  without a note continue to work
- New shared `NoteEditor` component (textarea + Save / Cancel, with
  Cmd/Ctrl+Enter to save and Esc to cancel)
- Note affordance lives in the utility row on both LoopCard and
  ArchiveCard, alongside Edit / Delete — collapsed by default
- Tiny lavender dot indicator on the Note button when a note exists
- Notes available in every state: Do, Doing, Delayed, Done, Dropped
- Notes persist through state transitions and through Restore
- Empty Save clears the note field (data stays clean — no empty strings)
- Loader treats blank stored notes as absent for backward compatibility
- Verified headlessly via Playwright (19/19): notes save, edit, clear,
  persist across reload, survive Do→Doing→Done, work on ArchiveCard for
  Done and Dropped, legacy loops without `note` render fine, Cancel
  discards the draft

No state-model, persistence-schema, or workflow logic changed beyond
adding the optional note field.

---

## Sprint 14 — Voice-to-Text Capture
Completed:
- Added `useSpeechCapture` hook wrapping the browser `SpeechRecognition`
  / `webkitSpeechRecognition` API with minimal TS typings, error
  classification, and StrictMode-safe cleanup
- New `MicButton` component (icon button + Listening… indicator + calm
  inline error messages)
- Mic surfaced inside the Dashboard capture textarea row and inside the
  NoteEditor; both append transcripts to the current draft and refocus
  the textarea so the transcript stays editable
- Feature-detect at module load: when the API is unavailable, mic is
  hidden entirely and a calm fallback line reads "Voice capture isn't
  available in this browser yet."
- Friendly error mapping for `not-allowed`, `no-speech`, `audio-capture`;
  silent on intentional `aborted`
- **No audio is ever stored.** The Web Speech API exposes transcripts
  only; nothing else is written to localStorage. Verified by inspecting
  the persisted JSON in the headless test
- Verified headlessly via Playwright (19/19): mic visibility under
  supported/unsupported, transcript fills then appends with spacing,
  transcripts remain editable, voice flow works in notes and persists
  as edited text, error states surface calmly, no console errors

Compatibility notes:
- Chrome/Edge: full support
- Safari (macOS + iOS): supports `webkitSpeechRecognition`; requires a
  user gesture (button tap is fine) and microphone permission
- Firefox desktop: no support → fallback message
- Capacitor wrapper: the Web API works inside iOS WebView when the host
  app adds `NSSpeechRecognitionUsageDescription` and
  `NSMicrophoneUsageDescription` to Info.plist. No app-side code change
  is needed.

No state model, persistence schema, workflow logic, or stored data
shape changed. The only new behaviour is the transcribed-text input
path.

---

## Sprint 15 — UX Refinement and Mobile Fit

Completed:
- Inline note previews on LoopCard and ArchiveCard (italic
  charcoal/55, single-line truncate, hidden in editor)
- "Due now" → "Back today" on delayed labels; capture placeholder
  "task" → "thought"; Delayed subtitle rewritten
- BottomNav switched to `grid grid-cols-5` so all five labels fit at
  iPhone SE width without overflow
- Dashboard replaced its three vertical count tiles with a single
  compact chip row; "New loop" label dropped, a11y kept via
  aria-label on the textarea
- LoopCard / ArchiveCard "Delete" text button replaced with a
  recessive trash icon (charcoal, never red — aligned with the
  "no warning states" guideline)
- Subtle Do→Doing transition feedback: 180ms opacity fade on the
  card before it leaves the list; respects prefers-reduced-motion;
  optional 10ms haptic where supported

---

## Sprint 16 — Notebook Visual Identity

Completed:
- Retired the motel/keychain metaphor in favor of an editorial
  notebook / lightweight sketchbook direction
- Palette: paper-shell (cool stone) + paper-light (pale paper),
  cool graphite ink, dusty lavender + muted sage accents (the
  Doing state moved from seafoam to sage, with `seafoam` kept as
  a token alias)
- Typography: italic serif "loopr" wordmark; serif body for loop
  text and notes; sans for UI chrome; mono for date eyebrow,
  capture label, and the keyboard hint
- Structure: AppHeader (wordmark + tagline) sits above the page
  card; PageContainer wraps content in a hairline-bordered paper
  card on the darker shell
- DateEyebrow replaces the "LOOPR · FIELD NOTES" eyebrow with
  the current date in mono caps
- BottomNav goes transparent over the shell, active item gets a
  small HandUnderline pencil mark beneath its label
- Loop entries lost their card shell — entries are now divided
  list items with hairline rules between, no border/bg/shadow on
  the entry root
- Status pill replaced with a leading-dot annotation + tracked
  uppercase label
- Capture textarea embedded directly on the page (no SectionCard
  wrapper). Inline lavender "+" Add Loop button; mono ⌘ Enter hint
- CapturePlusButton FAB on every non-Dashboard page (lavender, jumps
  to Dashboard for capture)
- Sketch language: HandUnderline SVG; per-section pencil-line sketch
  doodles (mountain on Dashboard, coffee on Doing, moon on Delayed,
  paper stack on Done, dial knob on Dials); SketchFlowers +
  handwritten "clear mind, open space" italic annotation in
  Dashboard empty state; "in your hands" / "back when ready" /
  "set down gently" italic captions for Doing / Delayed / Done
  empty states
- "RECENTLY CAPTURED" section heading above the Dashboard loop list

---

## Sprint 17 — Identity Cleanup and Mobile UX Refinement

Completed:
- Replaced the motel-keychain PNG icons (icon-192, icon-512,
  apple-touch-icon, favicon) with a notebook-inspired mark:
  paper-light card surface + hand-drawn loop arc + small lavender
  pencil stroke
- Manifest theme_color and HTML meta theme-color realigned with the
  current cool-stone palette
- /docs sections retitled: motel/keychain references replaced with
  editorial notebook direction; remaining mentions are historical
  "retired in Sprint 16" footnotes
- Capture textarea: dropped the internal repeating-linear-gradient
  ruling that was reading as stacked form rows. Now a clean open
  writing area with the hairline-bordered container framing it
- `⌘ Enter to add` hint gets `whitespace-nowrap` so it stops
  breaking onto two lines at narrow widths
- New 'menu' mode on LoopCard. Default footer row shows Note +
  a single More (⋯) icon. Tap More to expand inline into NOTE
  / EDIT / trash / ✕ — six simultaneous actions dropped to three
  by default; the secondary three are one tap away
- PageContainer card now has a hairline `border-rule` (cleaner
  separation from the shell)
- Footer label opacity bumped (`text-charcoal/45` → `/55`) so
  "Added today" / "Started today" reads cleanly without going dark

---

## Sprint 18 — Conceptual Clarity and Hierarchy Refinement

Completed (commit `aa3bbde`):
- Removed redundant overview chips on Dashboard, Doing, and Delayed,
  and redundant state annotations on loop cards.
- Simplified capture framing and connected "thoughts" with "open loops".
- Added the Do / Delay / Drop workflow legend below capture.
- Renamed the Dashboard list heading to "OPEN LOOPS".
- Retained routing, storage, loop states, notes, voice, and visual identity.

Subsequent maintenance: service-worker cache updated to v6 (`cf0ebbe`);
Settings counts initialized from storage and refreshed through confirmation
handlers to resolve the lint error (`e4dd5bb`).

---

# Upcoming Priorities

## Mobile accessibility — locally approved, publication pending

- Added shared high-contrast focus outlines for keyboard controls and
  editable fields, plus scroll margins above fixed navigation.
- After local visual feedback, Dashboard capture uses a thinner lavender
  focus boundary around the whole capture surface. The textarea has no
  separate outline crossing the microphone/+ row; keyboard focus remains
  visibly indicated at the existing outer border.
- Loop and note editors use a thin lavender border with an inset focus
  line, avoiding the heavy external/double outline. Loop editing has
  internal padding; note action buttons wrap when text is enlarged.
- Inline note/edit/delay/delete panels return focus to the appropriate
  surviving action when canceled or saved. Edit returns to More because
  the Edit control is hidden when its panel closes.
- Clear All now uses a labeled native modal dialog with initial focus on
  Cancel, explicit Tab wrapping, Escape dismissal, background isolation,
  and focus return to its trigger.
- Loop cards have labeled groups and action descriptions tied to the loop
  text. More remains mounted and exposes its expanded state and controls
  relationship. Main navigation has an accessible name.
- Shared minimum hit areas are 44 by 44 CSS pixels. Action rows wrap
  instead of overflowing. Icons retain their small visual size.
- Darkened meaningful secondary text and placeholders; raised the smallest
  metadata/navigation labels to 12px at default size. Decorative artwork
  remains subdued. Capture still renders at 16px at default text size.
- The desktop shortcut hint is hidden below the small-screen breakpoint
  to avoid crowding at narrow widths; Cmd/Ctrl+Enter still works.

Local validation (2026-10-17): build, lint, and diff checks passed.
Chromium checks cover capture focus indication; focus return from edit,
note, and delay; expanded-state semantics; modal initial focus, forward
and reverse Tab wrapping, Escape, and trigger focus return without data
loss; 44px control bounds; and all five routes at 320/375/390px with both
default and doubled root text size, including the expanded action row.
No horizontal overflow or page errors occurred in those checks. The
375px populated Dashboard was visually reviewed. Backup regression
checks also cover downloads, full restoration, validation, and failures.

The user approved the revised capture and editor focus borders and
authorized committing the accessibility improvements and documentation
to dev on 2026-10-17. Publication remains pending. Actual iPhone
Safari/VoiceOver announcements, reading order, touch comfort, enlarged
text, and dialog dismissal have not all been explicitly confirmed.
Browser accessibility-tree and keyboard checks do not establish VoiceOver
behavior. The keyboard-retention experiment remains reverted.

## Export and restore — locally approved, publication pending

Dials → Data now offers a dated JSON backup download and a labeled file
picker for restoration. Backups contain all five loop states, text, notes,
IDs, and available timestamps, with `app: "loopr"`, `version: 1`, and an
export timestamp. No account, server, or new dependency is required.

Restore validates the entire file before offering an inline confirmation.
It rejects unsupported versions, malformed records, duplicate IDs, invalid
field types/dates, and files larger than 5 MB. Unknown fields are ignored.
Restoration replaces all current loops; it never merges. The confirmation
explains this and recommends exporting current loops first. Empty backups
receive an explicit warning that all current loops will be removed.

Canceling or rejecting a backup makes no storage changes. Confirmation
checks that local data has not changed during review, then writes through
the existing storage helper in one atomic localStorage operation. On a
storage-write failure, the current data and counts remain unchanged.
Successful restoration refreshes Dials counts immediately.

Local validation (2026-10-17): production build, lint, and diff whitespace
checks passed. Isolated Chromium production-preview tests verified actual
backup downloads; complete round trips across all five states with notes,
multiline text, and dates; reload persistence; cancellation; invalid JSON,
versions, duplicate IDs, states, notes, dates, and records; simulated quota
failure; data changed during review; and empty-backup confirmation. The
375px layout has no horizontal overflow and was visually reviewed. No
browser page errors occurred during these checks.

The user approved export and restore after local review on 2026-10-17
and authorized committing the feature and documentation to dev. Publication
remains pending. iPhone Safari download/file-picker behavior and
assistive-technology review have not been explicitly confirmed; local
browser checks do not establish those device behaviors.

Voice capture is already implemented (Sprint 14). Next priorities after
backup review remain mobile accessibility and resurfacing clarity.

## iPhone Safari capture investigation — reverted after device test

On 2026-10-17, a local experiment prevented primary-pointer focus transfer
from an already-focused Dashboard textarea when pressing +. Submission
remained on click; no forced refocus, timers, keyboard hacks, dependencies,
layout changes, or persistence changes were added.

Local build and lint passed. Chromium desktop and touch-emulation checks
passed for ten successive captures, draft clearing, retained DOM focus,
stationary field bounds, unique saved entries, persistence after reload,
multiline input, Cmd/Ctrl+Enter, empty-input validation, Tab/Enter activation,
and no refocus after explicit blur. Mocked voice append/edit/save and a
mouse press released outside the button also passed. These checks did not
establish real iPhone software-keyboard behavior.

The user tested the local preview on their iPhone and reported that the
keyboard still dismissed after tapping +. The iOS version was not recorded;
no conclusion is drawn about every Safari version. VoiceOver and actual
microphone recognition were not verified in this investigation.

Decision: revert the capture code experiment and retain existing capture
behavior. The experiment was not published. Keyboard retention remains
unresolved and is deferred unless repeated-capture friction warrants
further investigation; do not add unreliable focus workarounds. Keep the
project-plan corrections and this test result as the record of the work.

---

# Future Exploration

Possible future directions:
- Gentle resurfacing notifications
- Resurface history
- Smaller-step suggestions
- Emotional-context support
- Optional sync (manual export/restore implemented locally above)

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
- Editorial notebook / lightweight sketchbook (retired the earlier
  motel/keychain direction in Sprint 16)
- Cool stone paper surfaces
- Cool graphite ink
- Dusty lavender accents
- Muted sage (the Doing accent — replaces the older seafoam token)
- Hand-drawn pencil sketch motifs (HandUnderline, per-page sketch
  doodles for Dashboard / Doing / Delayed / Done / Dials)

## Interaction Style
- Soft transitions
- Hairline borders + paper surfaces (no heavy SaaS cards)
- Calm spacing
- Minimal visual noise
- Recognition-first UX

## Emotional Tone
The app should feel:
- quietly supportive
- calm
- mature
- tactile
- lightly editorial
- emotionally intelligent

Avoid:
- mascot energy
- forced positivity
- productivity hype
- overly cute UX writing
- excessive metaphor usage
- sepia vintage / scrapbook decoration
