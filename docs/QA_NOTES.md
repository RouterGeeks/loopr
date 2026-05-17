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

## Keyboard Hint Visibility

The "Cmd or Ctrl + Enter to capture." hint under the Dashboard textarea
is desktop-only. It renders only when:

* `window.matchMedia('(pointer: fine)').matches` is true (mouse / trackpad
  / stylus primary), **and**
* `window.Capacitor` is undefined (i.e. not running inside a Capacitor
  native wrapper)

On phones and tablets the hint would just be noise — no physical keyboard
is reachable. Inside Capacitor, even if the primary pointer happens to be
fine (e.g. iPad with keyboard), the hint stays hidden, because the host
app should be the source of truth for input affordances in that context.

The detection runs once at mount via `useMemo`. If a user plugs in a
keyboard mid-session, the hint will appear after the next reload — a
minor staleness we accept to keep the implementation calm.

---

## Voice Capture (Sprint 14)

Voice-to-text uses the browser's `SpeechRecognition` (Chrome/Edge) or
`webkitSpeechRecognition` (Safari, including iOS) directly. There is no
backend, no cloud transcription, and no Anthropic/OpenAI integration.

Hard constraints baked into the implementation:

* **No audio is ever stored.** The Web Speech API exposes transcripts
  only; we never touch MediaRecorder, AudioBuffer, or Blob. Storage
  schema unchanged.
* **Transcripts are always editable.** Voice fills (or appends to) the
  same textarea the user types into. Save is still an explicit user
  action.
* **Append semantics** in both the Dashboard capture and NoteEditor:
  if the textarea already has content, voice text appends with a single
  space separator. If empty, voice text fills it directly.
* **Feature-detected at module load.** When the API is absent, the mic
  is hidden entirely and a calm fallback line takes its place:
  "Voice capture isn't built into this browser. Try your keyboard's
  mic instead." Users never see a broken mic affordance, and they get
  pointed at the universal fallback (system-level dictation) rather
  than being told voice is simply unavailable.
* **Continuous mode is OFF.** `recognition.continuous = false` so the
  API auto-stops on natural silence. Cleaner UX on iOS and avoids
  surprise hot-mic situations. Users can tap mic again to add more.
* **StrictMode-safe.** The hook aborts any active recognition on
  unmount, and `start()` early-returns when a recognition is already
  active.

Error → user-facing copy mapping:

| API error          | Copy shown                              |
|--------------------|------------------------------------------|
| `not-allowed`      | "Microphone permission was denied."     |
| `no-speech`        | "Didn't catch that."                    |
| `audio-capture`    | "No microphone found."                  |
| `aborted`          | (silent — intentional)                  |
| anything else      | "Voice capture had a hiccup."           |

Capacitor / iOS wrapper readiness:

* The Web API works inside an iOS WKWebView when the host app adds
  `NSSpeechRecognitionUsageDescription` and
  `NSMicrophoneUsageDescription` to its Info.plist.
* No app-side code change is needed for the wrapper. If we ever want
  native-quality transcription on iOS, we could swap the hook
  implementation for `@capacitor-community/speech-recognition` behind
  the same `useSpeechCapture` interface.

What voice is **not**:

* not an AI summary or rewrite — transcripts are saved verbatim (after
  user edits)
* not background recording — listening only fires from explicit user
  taps
* not cloud-routed — everything happens locally in the browser

## Two voice paths, one text field

Every platform Loopr runs on has a **system-level dictation** path that
types speech into any focused text field, independent of any web API:

| Platform | System dictation |
|---|---|
| iPhone / iPad | Mic on the on-screen keyboard (iOS Dictation) |
| Android | Mic on Gboard / SwiftKey (Google Voice Typing) |
| macOS | Fn key twice / Edit → Start Dictation |
| Windows | Win + H |

Loopr's in-app mic is a **convenience**, not the only path. When the
Web Speech API is unsupported (notably iOS PWA mode in some versions),
users can still dictate via their keyboard. The fallback copy points
them there explicitly.

This is also why we don't try harder to detect iOS specifically — the
fallback message works universally.

---

## Loop Notes (Sprint 13)

Notes are intentionally minimal: a single optional string per loop,
collapsed by default, accessible through a "Note" button in the utility
row of every card. They are framed as **context breadcrumbs**, not task
management — Loopr is not becoming a project tracker.

Behavior:

* Notes exist in every state (Do, Doing, Delayed, Done, Dropped)
* Notes persist through state transitions and through Restore
* An empty Save deletes the field entirely (no empty-string artifacts)
* Cancel and Esc discard the draft
* A small lavender dot on the Note button indicates a note exists, but
  there is no count, no preview, and no metric — recognition only

What notes are NOT:

* not a comments thread
* not a todo sublist
* not a checklist
* not a place for assignments, due dates, or tags

If we add structure here later (e.g. a second field for "next action"),
it should still feel like context, not project management.

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

## Editorial Notebook Theme

The motel/keychain metaphor was retired in Sprint 16. Loopr's current
identity is a calm editorial notebook / lightweight sketchbook (cool
stone paper, cool graphite ink, dusty lavender + muted sage accents,
hand-drawn pencil sketch motifs).

The theme should:

* remain subtle
* never reduce usability clarity
* avoid scrapbook decoration or sepia vintage cosplay

The app should still feel:

* mature
* calm
* recognition-first
* lightly editorial — not themed-productivity beige

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

## Card Action Hierarchy (Sprint 9 → 17)

Hierarchy on LoopCard's utility row evolved with the visual identity:

1. Primary row — Do / Delay / Drop on Do/Delayed cards; Done / Delay
   / Drop on Doing cards.
2. Always-visible secondary — Note button (lavender dot indicates a
   note exists).
3. Hidden behind a More (⋯) overflow button — Edit, Delete (trash
   icon), and a Close (✕) action.

The Sprint 17 change reduced default-visible actions per card from
six to three: tap More to reveal Edit + trash inline. Delete still
requires the existing confirmation step, so the destructive action
is never one tap from default. Trash is recessive charcoal — never
red, per the "no warning states" rule.

---

## Capture Textarea (Sprint 16 → 17)

The capture textarea is embedded directly on the page, inside a
hairline-bordered paper container. No background ruling: the
Sprint 16 attempt to draw repeating notebook lines inside the input
was read as stacked form rows and pulled in Sprint 17. The container
itself + the monospace label and placeholder carry the notebook
feel.

The keyboard hint "⌘ Enter to add" is `whitespace-nowrap` so it
never breaks across two lines. It's still hidden on coarse-pointer
devices via `matchMedia('(pointer: fine)')`, so phones don't see
it at all.

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
