# Dash Dot Dot Project Plan

## Product Direction

Dash Dot Dot (formerly Loopr) is a mobile-first PWA designed to reduce cognitive friction and help users safely capture and revisit recurring thoughts.

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
- Ready to revisit labeling with original scheduled-date context
- Human-readable resurfacing labels

## Dashboard (route /)
- Capture input with Cmd/Ctrl + Enter shortcut
- Conditional link below capture showing how many delayed thoughts are ready
- Workflow legend: Do / Delay / Drop
- List of Do (open) loops
- Autofocus on mount and on return navigation

## Doing (route /doing)
- Dedicated view for actively engaged loops
- Page heading identifies the Doing state; redundant status pills removed
- "Started X" contextual timestamp
- Transitions to Done, Delayed, or Dropped

## Delayed (route /delayed)
- Ready to revisit / Later / Choose a date groups, sorted by revisit time
- Relative resurfacing states
- Empty-state support

## Done (route /done)
- Done and Dropped surfaced as named sections
- Restore returns loops to Do
- Permanent delete with confirmation
- Empty-state support

## Dials (route /dials)
- Four-tile count grid: Do / Doing / Delayed / Done
- Export and restore versioned JSON backups (live)
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

## Connect the dots — locally approved, publication pending

- Manual, undirected connections between existing thoughts in all five states.
  No AI processing, suggestions, API keys, backend, or new dependencies.
- Active cards expose Connect the dots in a compact More panel; completed/dropped cards
  expose it alongside their existing controls. Current bottom navigation remains.
- A focused graph shows up to four neighbors per page. The local constellation
  refinement uses small clickable dots around a slightly larger central dot,
  with a direct solid line for each relationship. Labels wrap up to three lines;
  full text remains in the accessible name, thought detail, and List view.
  List includes every connection and explicit Remove connection actions.
- Every dot and its label is a real link to a thought detail page, including the
  central dot. Detail shows full text and existing state-appropriate controls;
  Back to connections returns to the originating neighborhood. Missing/deleted
  thoughts have an explicit empty state. Routes: /thoughts/:id and
  /thoughts/:id/connections, beneath the existing deployment base.
- Search and choose a saved thought to connect. Self-links and duplicates are
  excluded. Failed saves retain search and saved data; stale writes use the
  existing review/retry flow. Open picker and in-progress writes block updates.
- Connections persist with thoughts in loopr.loops as optional connections ID
  arrays. Each undirected edge is stored once on its lower-ID endpoint. Loading
  remains read-only; invalid edge types, duplicate/self/missing endpoints fail
  closed. Successful mutations prune links to deleted thoughts atomically with
  the existing write. State changes and Restore preserve links. Removing a
  connection leaves both thoughts untouched; Clear All removes both.
- Backups with connections use version 2 so older builds reject them rather
  than silently discarding links. Backups without connections retain version 1;
  the new reader accepts both. Restoring an old backup replaces the full dataset
  and therefore its connections too. Existing app identifier remains loopr.
- AI suggestions, automatic linking, whole-library graphs, and sync are deferred.
- Local refinement: More opens matching Note/Connect/Edit/Delete rows without expanding
  the card. Outside tap, Escape, focus departure, or selection dismisses it. Add note/Edit note
  is inside the menu in every state; one editable note and its saved preview remain.
  Connection counts remain deferred.

Local validation is recorded in QA_CHECKLIST. On 2026-10-18 the user approved
manual connections and menu changes locally and authorized committing/pushing
the implementation, project plan, QA checklist, and tests to dev. Publication
remains a separate step. Detailed iPhone/VoiceOver results were not supplied;
AI suggestions remain deferred.

## Dash Dot Dot identity — live (`9ba5f9c`)

- Entries are called thoughts throughout visible copy, accessibility labels,
  confirmations, backup errors, and metadata. Internal names and compatibility
  identifiers remain unchanged; historical docs retain earlier terminology.
- Adopted the approved Dash Dot Dot name and Morse D mark: one dash followed
  by two dots (− · ·). Branding remains within the calm notebook palette.
- Shared header uses an italic serif wordmark and small decorative mark.
  Dashboard adds a fine divider and a curved dash/two-dot empty-state sketch.
  Marks are hidden from assistive technology and do not encode controls or state.
- Dashboard / Doing / Delayed / Done / Dials, routes, existing controls, capture
  behavior, and the other page illustrations retain their current behavior.
- Updated document title, installation metadata, About/update/backup copy,
  download filenames, and PNG favicon/Home Screen icons. Icon source is editable
  in public/brand-icon.svg; optional renderer uses existing local Playwright.
- Compatibility identifiers intentionally stay `loopr`: storage/preference keys,
  backup `app` identifier and version, write lock, service-worker protocol/cache
  namespace, repository, package name, and /loopr/ Pages path. Existing thoughts,
  settings, and older exports need no migration. New exports also remain readable
  by the previous app. No domain/repository move or publication is included.

Local checks: lint, both builds, 19 Node tests, all-page layout at 320/375/390px
and 200% text, old stored thoughts/preferences, and backup export/restore passed.
Offline/update and scheduling browser regressions passed after the thoughts
wording cleanup. Actual iPhone installed-name/icon
refresh and VoiceOver review remain pending; no reinstall or data clearing is
needed for review. The user approved the branding locally on 2026-10-18 and authorized the
thoughts wording cleanup and commit/push to dev. Published on 2026-10-18; live assets and browser checks passed.



## App update notice — live (`029424c`)

- A quiet notice appears when a production service worker has an update waiting.
  Later dismisses that worker's notice for this page session. Update now is an
  explicit activation and reload; no other window is automatically reloaded.
- Capture text, open edit/note/schedule/confirmation panels, pending backup work,
  changed default-time preference, active voice capture, and in-progress saves
  block updating. Open editors are conservatively protected even if unchanged.
- The waiting worker counts all in-scope windows, including uncontrolled and
  older clients. It permits activation only for the sole requesting window.
  Other windows must be closed; a failed or missing reply leaves updating blocked.
- The requesting UI is temporarily inert during the activation handshake. A
  timeout restores interaction and instructs the user to close/reopen safely.
  Only the requester reloads on controller change, and only if no blockers remain.
- Forced activation retains earlier caches to protect a window opened during
  the client-count/activation race. A later normal activation cleans old caches.
  Window enumeration and activation are not atomic browser operations; the app
  never commands other windows to reload. Saved thought storage is untouched.
- Update checks run on startup and return to the app; offline failures are quiet.
  Close-and-reopen remains supported. This release cannot show a notice inside
  an already-running older build that has no notice code; first upgrade still
  needs the existing close/reopen flow.

Local verification: lint, root/Pages builds, 19 Node tests, and isolated two-build
Chromium checks passed. Browser coverage includes failed capture saves, capture,
edit, note, schedule and default-time guards, rejection with another window,
Later, explicit activation/reload, and unchanged saved thoughts/preferences.
The user approved the update notice and draft protection locally on 2026-10-18
and authorized committing/pushing the implementation, documentation, and tests
to dev. Published on 2026-10-18; live artifacts matched the release, offline
checks passed, and the release artifact passed two-build update tests. Actual iPhone announcement and
activation results have not been explicitly supplied. AI remains deferred.



## Linked counts and revisit scheduling — live (`1428fed`)

- Dials count tiles link to Dashboard, Doing, Delayed, and Done. Done continues
  to include Dropped; its accessible link name states this.
- Dashboard uses a calm lavender Ready to revisit row with a count and an
  explicit View thought(s) action, shown only when scheduled thoughts are ready.
- Dials offers a saved default revisit time (initially 09:00). Quick choices
  show that time; opening a new delay panel reads the latest saved preference.
  Changing it leaves existing loop timestamps unchanged.
- Custom scheduling has labeled date/time controls and an explicit Schedule
  revisit button. Cancel leaves data unchanged. Rescheduling starts with the
  existing date/time. Past or nonexistent local times show an inline message.
- Times use the device timezone at scheduling, stored as an absolute timestamp.
  Future labels now include the time. DST gaps are rejected; when clocks fall
  back, an ambiguous local time uses the first occurrence (native Date behavior).
- Default time is a separate device preference, `loopr.revisitTime`. Thought
  backup/restore and Clear All retain their existing scope and leave this setting
  unchanged. The Dials copy makes the backup boundary explicit. Failed preference
  writes retain the previous value and show a retry message.
- AI, similarity detection, notifications, and automatic rescheduling are deferred.

Local checks: lint, root/Pages production builds, and 15 Node tests; isolated
browser checks cover linked navigation, default-time persistence and write
failure, unchanged existing schedules, explicit custom save/cancel/reschedule,
and narrow layouts. Actual iPhone date/time pickers and VoiceOver require user
review. The user approved the local changes on 2026-10-18 and authorized
committing/pushing the implementation, documentation, and tests to dev.
Published to main and GitHub Pages on 2026-10-18. Deployment, live artifact
comparison, and isolated live scheduling checks passed.



## Installed-iPhone and offline reliability — live (`014378e`)

Production audit reproduced a failed service-worker install on a server
matching GitHub Pages: virtual routes in `cache.addAll` returned 404. The
old shell also omitted the built JS/CSS and cleared unrelated origin caches.

- Build now generates a versioned offline shell from real files, including
  the exact JS/CSS bundles; manifest scope and paths support root and /loopr/.
- Navigations use the installed release's cached index, including deep links
  and legacy redirects. Assets and HTML stay together through offline use.
- New workers install the complete shell before activation. They wait until
  existing app windows close; no forced reload or draft interruption. A failed
  install leaves the previous release usable. Open windows can intentionally
  remain on the old version until all are closed and Loopr is reopened.
- Cleanup targets this app's scope-specific caches and known legacy Loopr
  caches, preserving unrelated caches. Thought storage is untouched.
- No new dependencies, screens, storage migration, or notifications.

Local validation (2026-10-17): lint, both production builds, and 12 Node tests
pass. Isolated Chromium tests on a Pages-like server cover initial control,
all five routes and legacy redirects offline, offline capture/edit/notes,
closing/reopening a page with saved data, a waiting update retaining an open
draft, activation after closing the old client, unrelated-cache preservation,
and failed-update fallback. Mobile width checked at 375px. This is not an
actual iPhone process-termination or storage-eviction test.

The user approved offline and Home Screen behavior on their iPhone on
2026-10-18 and authorized committing/pushing the fixes, docs, and tests to dev.
The candidate was served through a trusted temporary HTTPS preview; see
QA_CHECKLIST for its URL and build identity. Chromium also verified its secure
context, worker control, offline reload/capture, and offline deep link.
Published on 2026-10-18; deployment passed, live files matched the artifact,
and isolated live offline navigation/capture/reopen checks passed. iOS version and individual device steps
were not recorded; cross-mode storage behavior, Files backup, VoiceOver,
storage eviction, and updating between two releases on iPhone have not been
explicitly confirmed by this approval.


## Data reliability — live (`2e0382b`)

- Capture, editing, notes, transitions, deletion, and restore now persist
  before updating the displayed data or closing the editor. Failed saves
  retain drafts; a calm message explains retry/review options. Drafts are
  in memory: keep the page open or copy them before navigating/reloading.
- Loading and legacy migration no longer write to storage. Invalid JSON,
  malformed records, and duplicate IDs are rejected without replacing the
  original bytes. Known legacy statuses and numeric string IDs still load.
- Dials offers Download original data when storage is unreadable. This is
  an exact recovery copy, not a normal backup. Valid backup replacement
  and Clear All remain explicit, confirmed actions.
- Every writer compares the exact stored version the user reviewed.
  Another-tab changes surface a review message instead of overwriting
  newer data; reviewing can retain a draft on a surviving card. Copy a draft
  first if its card was deleted elsewhere. No automatic conflict merging.
- On supported secure origins, Web Locks serializes simultaneous app
  writes. Where Web Locks is unavailable (including some local HTTP
  previews), version checks still reject stale snapshots but cannot make
  simultaneous cross-tab writes transactional. Old deployed clients or
  external scripts do not participate in this lock protocol.
- GitHub validation runs lint, `npm test`, and the Pages build for dev
  pushes and PRs. Main deployments now run lint and tests before building
  and uploading. Dev validation and main deployment passed on 2026-10-17.

Local validation: both production builds, lint, diff checks, and all nine
unit tests pass. Tests cover unreadable bytes, read-only legacy
migration, quota/clear failures, stale and simultaneous writers, and
explicit recovery. Isolated browser tests verify failed capture/edit/note
draft retention and retry, two-tab conflicts and reviewed retry, corrupt
data preservation across routes, exact original-data download, and valid
backup recovery. Blocked-storage access retains the capture draft without
page errors, and the mobile error layout fits at 375px. Backup and
resurfacing regression checks pass.

Local review approved on 2026-10-17; commit and push to dev authorized,
including documentation, tests, and GitHub validation. Published to main
and GitHub Pages on 2026-10-17. Live artifact-byte comparison and isolated
browser reliability checks passed. Installed-iPhone/offline testing remains a subsequent
priority; the current work does not migrate storage or introduce sync.

## Resurfacing clarity — live (`d64dbe5`)

- Dashboard shows a quiet count/link below capture only when delayed
  thoughts are ready. Its empty open-loop list says "Nothing new here"
  when ready thoughts exist elsewhere, instead of "Quiet for now".
- Delayed separates Ready to revisit, Later, and Choose a date. Missing or
  invalid dates remain visible in Choose a date. No automatic state changes.
- Due thoughts say "Ready to revisit" and retain the scheduled date/time
  as context. Future thoughts use Today at [time], Tomorrow, or a dated
  schedule. Dates are displayed in the device's current local timezone.
- A shared readiness helper keeps the Dashboard count and Delayed labels
  consistent. Refresh occurs at the next due time/local midnight and on
  focus, pageshow, or returning to a visible tab, without writing storage.
- Cards remain stable across time-driven group changes so an open editor,
  unsaved draft, and its focus survive. Capture remains above the cue.
- Existing Do / Delay / Drop, persistence, routes, and local backup format
  remain unchanged. No notifications, urgency badges, or new dependencies.

Local validation (2026-10-17): production build, lint, and diff checks
passed. `node --test scripts/resurfacing.test.mjs` covers exact boundaries,
past/future/missing/invalid dates, calendar labels, next refresh timing,
and 23/25-hour local days around US daylight-saving transitions. Isolated
Chromium controlled-clock checks passed for cue/count agreement, due-time
updates without capture draft/focus loss, an open note surviving a day and
group change, rescheduling, Do, return-to-app focus refresh, invalid dates,
and 320/375/390px layouts. Delayed was visually reviewed at mobile width.

The user approved the resurfacing changes after local review on 2026-10-17
and authorized committing the implementation, documentation, and tests to
dev. Published to GitHub Pages on 2026-10-17; live verification passed. Actual iPhone background/foreground and
VoiceOver behavior remain device checks.

## Mobile accessibility — live (`a9cdde8`)

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
to dev on 2026-10-17. Published to GitHub Pages on 2026-10-17; live verification passed. Actual iPhone
Safari/VoiceOver announcements, reading order, touch comfort, enlarged
text, and dialog dismissal have not all been explicitly confirmed.
Browser accessibility-tree and keyboard checks do not establish VoiceOver
behavior. The keyboard-retention experiment remains reverted.

## Export and restore — live (`4417739`)

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
and authorized committing the feature and documentation to dev. Published to GitHub Pages on 2026-10-17; live verification passed. iPhone Safari download/file-picker behavior and
assistive-technology review have not been explicitly confirmed; local
browser checks do not establish those device behaviors.

Voice capture, backup, accessibility, and resurfacing improvements are live.
Data reliability and offline improvements are also live. Current work is local review of manual thought connections.

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
- Optional sync (manual export/restore is already live)

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


## Constellation presentation — locally approved, publication pending

Replaces the branching graph with a static constellation. SVG lines track the
actual dot centers as the layout and text size change. Visible dots are 10px
(neighbors) and 16px (center), inside links with at least 44px touch targets.
Manual connection data, four-neighbor paging, List, routes, and persistence
remain unchanged. No AI or force animation added. On 2026-10-18 the user
approved the constellation locally and authorized commit/push to dev, including
the project plan, QA checklist, and tests. Publication remains a separate step;
AI suggestions remain deferred.
