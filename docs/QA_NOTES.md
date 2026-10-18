# Dash Dot Dot QA Notes

This document captures intentional product decisions, QA observations, and behavioral notes discovered during development and testing.

These notes exist to:

* preserve product intent
* prevent accidental regressions
* guide future AI-assisted development
* document UX philosophy decisions

---

# Product Decisions

## State Model (Sprint 10) + Nav Terminology (Sprint 11) + Routes (Sprint 12)

Thoughts live in one of five states: Do, Doing, Delayed, Done, Dropped.

* **Do** — captured/open thoughts awaiting triage. Lives on the Dashboard page (route `/`).
* **Doing** — actively engaged thoughts. Lives on the Doing page (route `/doing`).
* **Delayed** — resurfacing thoughts scheduled for later. Lives on the Delayed page (route `/delayed`).
* **Done** — completed thoughts. Lives on the Done page (route `/done`), in the Done section.
* **Dropped** — consciously released thoughts. Lives on the Done page, in the Dropped section.

"Do" is engagement, not completion. Completion is only reachable from
Doing → Done. This separation gives in-progress work its own visible
state, which matters for neurodivergent users who need to see what they
are currently holding.

Restore from the Done page returns the thought to Do (not directly to
Doing), so the user can decide what to do with it as if it were freshly
captured.

**Legacy routes.** The pre-Sprint-12 paths still resolve, via in-app
redirects:

* `/revisit` → `/delayed`
* `/archive` → `/done`
* `/settings` → `/dials`

This keeps installed PWAs and existing bookmarks working. Historically, the service
worker cache version was bumped to `loopr-shell-v5` when the new routes
joined the precache SHELL, so old caches are cleared on next
service-worker activation at that release. Current builds use content-derived,
scope-specific cache identities and guarded update activation.

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

The hint is hidden on coarse-pointer devices and below the small-screen
breakpoint to avoid crowding; hardware-keyboard shortcuts still work. Inside Capacitor, even if the primary pointer happens to be
fine (e.g. iPad with keyboard), the hint stays hidden, because the host
app should be the source of truth for input affordances in that context.

The detection runs once at mount via `useMemo`. Pointer capability detection does not establish whether a physical keyboard
is connected; the hint is only an affordance, not a shortcut gate.

---

## Voice Capture (Sprint 14)

Voice-to-text uses the browser's `SpeechRecognition` (Chrome/Edge) or
`webkitSpeechRecognition` (Safari, including iOS) directly. There is no
app transcription backend and no Anthropic/OpenAI integration. The browser
may use a remote recognition provider; on-device processing and offline voice
are not guaranteed. See [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

Hard constraints baked into the implementation:

* **The app does not record or store audio.** The Web Speech API exposes transcripts
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

Native-wrapper support is unverified. A future Capacitor/WKWebView wrapper
requires its own API/integration and device tests; permissions alone do not
establish speech-recognition support. Browser feature detection and mocked QA
do not prove actual microphone, provider, or installed-mode availability.

What voice is **not**:

* not an AI summary or rewrite — transcripts are saved verbatim (after
  user edits)
* not background recording — listening only fires from explicit user
  taps
* not a guarantee of local-only processing — browser and system dictation
  providers control their own processing and retention

## Two voice paths, one text field

Many devices offer **system-level dictation**, depending on settings and
availability, independently of the web speech API:

| Platform | System dictation |
|---|---|
| iPhone / iPad | Mic on the on-screen keyboard (iOS Dictation) |
| Android | Mic on Gboard / SwiftKey (Google Voice Typing) |
| macOS | Fn key twice / Edit → Start Dictation |
| Windows | Win + H |

Dash Dot Dot's in-app mic is a **convenience**, not the only path. When the
Web Speech API is unsupported (notably iOS PWA mode in some versions),
users can still dictate via their keyboard. The fallback copy points
them there explicitly.

This is also why we don't try harder to detect iOS specifically — the
fallback message works universally.

---

## Thought notes — current behavior

Each thought has one optional note, available in every state through
More → Add note/Edit note. The editor is closed by default; a saved preview
remains visible beneath the thought. Notes are context, not a comment thread
or checklist.

- Save replaces the one note; empty Save removes it.
- Cancel/Escape discards unsaved edits and preserves the saved note.
- Notes survive state changes, restore from Done/Dropped, and JSON backups.
- Failed saves keep the open draft for retry. Note drafts are in memory only;
  save or copy before reload/closure. Dashboard recovery does not cover notes.

---

## Drop vs Delete

Drop is intentionally reversible.

Behavior:

* Drop moves a thought into the Done page → Dropped section
* Dropped thoughts can be restored later (to Do)
* Drop does NOT require confirmation

Delete is permanent.

Behavior:

* Delete permanently removes the thought
* Delete requires confirmation
* Deleted thoughts cannot be restored

Rationale:
Dropping a thought is intended to feel low-pressure and emotionally safe.
Permanent deletion should require deliberate confirmation.

---

## Delay / Resurface Philosophy

Delayed thoughts are not failures.

Dash Dot Dot intentionally avoids:

* overdue language
* urgency
* shame-oriented productivity mechanics

Delayed thoughts are treated as resurfacing thoughts.

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

The motel/keychain metaphor was retired in Sprint 16. Dash Dot Dot's current
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

## Card action hierarchy — current behavior

Primary state actions remain visible where applicable. More (⋯) opens a compact
floating disclosure with Add note/Edit note, Connect the dots, Edit labels,
Edit thought where supported, and Delete thought. Completed/dropped thoughts
retain their state-appropriate controls. There is no separate Note or Close
button and no expanded inline toolbar. Saved note previews remain visible.

Actions use ordinary link/button keyboard navigation. Selection, Escape,
outside tap, or focus leaving dismisses the panel; Escape returns focus to More.
Delete still requires confirmation. No connection count is shown.

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

Dash Dot Dot currently persists data using:

```txt
loopr.loops
```

Saved-thought reads/writes go through `src/lib/loops.ts`. The loader detects legacy
schemas (V1 `pending`/`delay`/`drop`/`do`-as-completed and V4 `active`)
and decodes them in memory into the current model. Loading never rewrites
storage. Only an explicit successful mutation writes current-schema values.
Invalid data is preserved for recovery; stale writes require review/retry.
`src/lib/captureDraft.ts` owns separate Dashboard draft storage; the default
revisit preference is separate too. See [README limits](../README.md#privacy-storage-and-recovery)
for backup scope, session fallback, browser storage loss, and other-tab ownership.

Persistence is verified across:

* refreshes
* route changes
* preview mode
* offline mode
* upgrade from V4 (`active`/`delayed`/`done`/`dropped`) — existing
  `active` thoughts become `do`, all other states preserved

---

## Dev Console Noise

The following errors may appear during development:

* “Could not establish connection. Receiving end does not exist”
* “message channel closed before a response was received”

These are browser-extension related and not Dash Dot Dot application errors.

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

Production preview validates the candidate; actual iPhone testing and live
release verification are separate evidence. See [QA workflow](QA_WORKFLOW.md).

---

# UX QA Focus Areas

Dash Dot Dot QA should validate:

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
