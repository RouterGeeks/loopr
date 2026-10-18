# Dash Dot Dot QA Checklist

> Use this checklist after major features, sprint completions, merges, or AI-assisted coding sessions.

---

# Session Info

* Date:
* Branch:
* Sprint / Feature:
* Commit:
* Tester:

---

# Build & Startup

* [ ] `npm run build` succeeds
* [ ] `npm run dev` starts correctly
* [ ] `npm run preview` starts correctly
* [ ] No unexpected console errors
* [ ] No React warnings
* [ ] No TypeScript issues

---

# Routing & Navigation

* [ ] Dashboard loads (route /)
* [ ] Doing loads (route /doing)
* [ ] Delayed loads (route /delayed)
* [ ] Done loads (route /done)
* [ ] Dials loads (route /dials)
* [ ] Refresh works on all routes
* [ ] No 404s
* [ ] Active nav state works
* [ ] Icons display correctly
* [ ] Nav labels read: Dashboard / Doing / Delayed / Done / Dials

# Legacy Route Redirects

* [ ] /revisit redirects to /delayed
* [ ] /archive redirects to /done
* [ ] /settings redirects to /dials
* [ ] URL bar updates to the new path (replace, not push)

---

# Capture Flow

* [ ] "+" Add Loop button disabled (lavender at reduced opacity) when empty
* [ ] Valid text enables the "+" button at full lavender
* [ ] "+" creates loop
* [ ] Textarea clears after add
* [ ] Capture textarea has no visible internal ruled rows when empty
* [ ] Capture container has a hairline border but no card-shadow weight
* [ ] Multiple loops stack correctly
* [ ] Autofocus works
* [ ] FAB (lavender +) visible on every non-Dashboard page; tap navigates to /

---

# Keyboard Capture

* [ ] Cmd+Enter works
* [ ] Ctrl+Enter works
* [ ] Enter creates newline only
* [ ] Keyboard capture persists after refresh
* [ ] "⌘ Enter to add" hint visible on desktop (fine pointer, at least sm width)
* [ ] Hint is hidden below sm width to keep capture controls usable
* [ ] Hint hidden on phones/tablets (coarse pointer)
* [ ] Hint hidden when running inside a Capacitor wrapper

---

# Voice Capture

* [ ] Mic button visible on Dashboard capture row (supported browsers)
* [ ] Mic button visible inside NoteEditor (supported browsers)
* [ ] First mic tap requests microphone permission (real browser)
* [ ] Listening… indicator appears while recording
* [ ] Spoken text fills the loop textarea
* [ ] Spoken text appends to a non-empty textarea with a space separator
* [ ] Transcript is editable before Save / Add Loop
* [ ] Spoken text in a note appends to the existing note value
* [ ] Permission denied shows "Microphone permission was denied."
* [ ] Silence shows "Didn't catch that."
* [ ] No microphone shows "No microphone found."
* [ ] In an unsupported browser (Firefox desktop, iOS PWA mode), the
      mic is hidden and "Voice capture isn't built into this browser.
      Try your keyboard's mic instead." appears
* [ ] No audio data appears in localStorage — only the transcribed text
* [ ] Safari/iPhone: works after a user-gesture tap
* [ ] Safari/iPhone: layout doesn't break when mic is rendered

---

# Loop Actions

* [ ] Do moves loop from Do → Doing
* [ ] Done moves loop from Doing → Done (Done section)
* [ ] Delay moves loop from any state → Delayed
* [ ] Do on a Delayed loop moves it to Doing
* [ ] Drop moves loop from Do / Doing / Delayed → Done (Dropped section)
* [ ] Edit works in Do, Doing, and Delayed states
* [ ] Delete works in every state
* [ ] Restore from Done page sends loop back to Do
* [ ] Delete confirmation appears
* [ ] No double borders/cards
* [ ] Doing dot is visually distinct (sage tone) but calm

# Compact thought actions — local review

* [ ] Default LoopCard footer shows only More (⋯); Note is inside the menu
* [ ] Tapping More opens a compact floating panel with Add note/Edit note, Connect the dots, Edit thought, and Delete thought; the card does not expand or move.
* [ ] Selecting an action, tapping outside, tapping More again, or pressing Escape closes the panel. No extra Close icon is shown.
* [ ] Opening focuses Add note/Edit note; Tab/Shift+Tab follow ordinary links/buttons and dismiss on leaving. Escape returns focus to More.
* [ ] Clicking an outside control dismisses without stealing focus; edit/delete Cancel returns to More.
* [ ] Panel stays inside the viewport and above bottom navigation at 320/375/390px and 200% text; every row has at least a 44px target.
* [ ] Add note/Edit note lives in the menu in every state, with a 44px target. Existing note preview remains beneath the thought; no standalone Note control.
* [ ] No connection count is displayed.
* [ ] Edit from the overflow menu enters edit mode normally
* [ ] Delete from the overflow menu still shows the confirmation step
* [ ] Trash icon is recessive charcoal — never red

---

# Notes

* [ ] Add note/Edit note available through More in every state (Do, Doing, Delayed, Done, Dropped)
* [ ] Notes are collapsed by default (no expanded editor on first render)
* [ ] Clicking Note opens an inline editor with a focused textarea
* [ ] Save persists the note to localStorage
* [ ] Edit replaces the previous value
* [ ] Empty Save clears the note (no empty-string artifact in storage)
* [ ] Cancel discards the draft without changing the stored value
* [ ] Esc cancels the editor; Cmd/Ctrl+Enter saves
* [ ] Menu says Add note when empty and Edit note when a note exists; saved preview remains visible
* [ ] Note carries through state transitions (Do → Doing → Done)
* [ ] Note carries through Restore (Done/Dropped → Do)
* [ ] Notes persist after a full page refresh
* [ ] Cards do not feel crowded with the new Note affordance

---

# Delay Scheduling

* [ ] Tomorrow works
* [ ] This Weekend works
* [ ] Next Week works
* [ ] Pick Date works
* [ ] Ready to revisit appears only once the scheduled time has arrived
* [ ] Relative labels display correctly
* [ ] Sorting is chronological

---

# Delayed (route /delayed)

* [ ] Page heading reads "Delayed"
* [ ] Only delayed loops appear
* [ ] Delayed loops editable
* [ ] Delayed loops deletable
* [ ] Do from Delayed moves loop to Doing
* [ ] Drop from Delayed moves loop to Done page (Dropped section)
* [ ] Delay from Delayed re-schedules the loop
* [ ] Empty state displays correctly

## Resurfacing clarity

* [ ] Dashboard cue appears only for ready delayed thoughts, with correct singular/plural text and a link to Delayed
* [ ] Cue count matches Ready to revisit; no "Quiet for now" message when ready thoughts exist
* [ ] Ready to revisit / Later / Choose a date headings appear only for nonempty groups
* [ ] Ready and future groups are chronological; missing/invalid dates stay visible under Choose a date
* [ ] Ready cards preserve original scheduled date/time; future labels distinguish Today at [time], Tomorrow, and later dates
* [ ] Due-time and midnight updates occur while open; tab/app return refreshes stale labels
* [ ] Time-driven changes preserve capture text, open note/edit drafts, focus, and loop state
* [ ] Rescheduling updates group/count; Do moves to Doing and Drop moves to Done as before
* [ ] Check daylight-saving transitions, local timezone changes, and overnight background return
* [ ] On iPhone, review cue discoverability, VoiceOver headings/link text, and background/foreground behavior

---

# Done (route /done)

* [ ] Page heading reads "Done"
* [ ] Done section works
* [ ] Dropped section works
* [ ] Restore sends loops back to Do
* [ ] Permanent delete works
* [ ] Empty state displays correctly
* [ ] Page feels calm and uncluttered

---

# Dials (route /dials)

* [ ] Page heading reads "Dials"
* [ ] Do / Doing / Delayed / Done counts are correct
* [ ] Counts update live after Clear All
* [ ] Counts reload when the confirmation modal closes
* [ ] Clear All confirmation works
* [ ] Clear All resets app correctly

## Backup export and restore

* [ ] Export downloads a dated JSON file with all loops, notes, states, and dates
* [ ] Restore validates a selected file before any storage changes
* [ ] Confirmation clearly says replacement, not merge; Cancel keeps current data
* [ ] Empty backups explicitly warn that restoration removes all current loops
* [ ] Full export/restore round trip preserves data after refresh and navigation
* [ ] Invalid JSON, unsupported versions, duplicate IDs, malformed records, and files over 5 MB are rejected
* [ ] Storage-write failure leaves existing data and counts intact
* [ ] Changes to current loops during review require choosing the backup again
* [ ] Dials counts update after restore
* [ ] File selection and confirmation work with keyboard and screen reader
* [ ] iPhone Safari can save an export and select it again from Files

---

## Persistence

* [ ] Failed capture/edit/note saves retain the draft and existing saved data; retry succeeds after storage recovers
* [ ] Failed state changes, delete, Clear All, and backup replacement preserve existing data
* [ ] Unreadable JSON and malformed records survive route changes/reload byte for byte; no mount-time writes
* [ ] Dials can download exact original data before explicit valid-backup recovery
* [ ] Blocked storage access shows a recoverable message instead of a blank/crashed app
* [ ] A stale tab cannot overwrite a newer tab; review latest then retry preserves both intended changes
* [ ] Simultaneous writes serialize under Web Locks; verify the documented fallback limitation on unsupported origins
* [ ] Legacy status and numeric-string-ID migration remains read-only until an explicit successful save
* [ ] Run `npm test`, lint, and Pages build; verify GitHub checks after pushing

* [ ] localStorage persists correctly
* [ ] Refresh preserves state
* [ ] Route changes preserve state
* [ ] Done page (Done + Dropped) persists
* [ ] Delay timestamps persist
* [ ] `startedAt` persists for Doing loops
* [ ] `note` field persists for any state
* [ ] Legacy data (`active` / `pending` / `delay` / `drop` / legacy `do`) migrates on first load
* [ ] Legacy loops without a `note` field render and function normally

---

# PWA & Offline

* [ ] Manifest loads
* [ ] Service worker registers
* [ ] Offline shell works
* [ ] Dashboard works offline
* [ ] Doing works offline
* [ ] Delayed works offline
* [ ] Done works offline
* [ ] Dials works offline
* [ ] Install prompt works
* [ ] Icons display correctly

---

# Mobile UX

* [ ] No horizontal scrolling
* [ ] Buttons are easy to tap
* [ ] Text remains readable
* [ ] Navigation fits correctly
* [ ] Layout still feels calm with many loops

## Mobile accessibility

* [ ] All fields and keyboard-focused controls have a clear focus outline
* [ ] Focus stays visible above fixed navigation
* [ ] Save/Cancel from note and edit returns focus to More; delay/delete Cancel returns to its trigger
* [ ] More announces expanded state and actions include the relevant loop context
* [ ] Clear All announces its title and description, starts on Cancel, traps Tab in both directions, closes with Escape, and returns focus
* [ ] VoiceOver cannot browse or activate background controls while Clear All is open
* [ ] Common controls have at least 44px hit areas with no overlapping targets
* [ ] Secondary labels, hints, placeholders, and navigation text are readable
* [ ] All routes and compact action panels fit at 320/375/390px and 200% text enlargement
* [ ] iPhone VoiceOver reads loop context, control names, and confirmation content in a useful order
* [ ] Capture shortcuts, multiline entry, voice capture, state transitions, and backup/restore still work

---

# Emotional UX

* [ ] No guilt-oriented language
* [ ] No urgency mechanics
* [ ] No accidental gamification
* [ ] UI still feels calm
* [ ] App still feels low-friction
* [ ] Theme remains subtle
* [ ] Interactions feel emotionally safe

---

# Regression Smoke Test

* [ ] Add loop (lands in Do on Dashboard)
* [ ] Add a note to that loop; verify dot indicator appears
* [ ] Press Do — loop moves to Doing page; note persists
* [ ] Press Done on Doing card — loop moves to Done page (Done section); note persists
* [ ] Add another loop, press Delay → schedule
* [ ] Verify Delayed page shows it
* [ ] Press Do on a Delayed card → moves to Doing
* [ ] Add another loop, press Drop → Done page (Dropped section)
* [ ] Restore from Done page → reappears in Do on Dashboard
* [ ] Refresh every route, verify persistence
* [ ] Verify offline shell still loads each route

---

# Notes

## Bugs Found

*

## UX Observations

*

## Deferred Items

*

## Follow-ups for Next Sprint

*


# Installed-iPhone review — offline reliability

Record iOS version, Safari vs Home Screen mode, preview URL, and tested build.
Use a trusted HTTPS preview serving the candidate build, with an online first
load. LAN HTTP is insufficient for service-worker QA. Export existing thoughts
before device testing; Safari and Home Screen data sharing must be observed,
not assumed. Use disposable thoughts for replacement/restore checks.

* [ ] Open online, add to Home Screen, launch, then enable airplane mode with Wi-Fi off. Confirm all five pages load.
* [ ] Offline: add three thoughts, edit one, add a note, and move one to Doing. Close and reopen the app; confirm every saved change survives.
* [ ] Open a delayed thought, background the app, then return after its scheduled time. Confirm the ready label updates.
* [ ] Export to Files and restore the test backup in the same mode; confirm text, notes, states, and dates. Repeat file selection in Safari and Home Screen mode.
* [ ] With a newer candidate served, keep a draft open and confirm it is not reloaded. Save it, close every Loopr window, reopen online, then relaunch offline and verify the new build and saved data. This requires two known candidate builds.
* [ ] Check VoiceOver reading order, enlarged text, and Clear All dialog cancellation in both modes; record any differences.

Expected limits: first-ever offline launch is unsupported; unsaved drafts are
not durable across closing the app; browser/OS storage removal can remove both
offline assets and thoughts. Keep exported backups. In-app voice recognition
is not an offline guarantee; typed capture is the offline test target.


## Temporary HTTPS candidate — 2026-10-18

URL: https://providers-keyboard-disposition-width.trycloudflare.com/loopr/

Offline cache/build: `loopr-offline-%2Floopr%2F-bb8f43feb9359827`.
Tested snapshot includes the offline fixes based on `2e0382b`.
Served from `/private/tmp/loopr-iphone-preview`, not the repository or live
site. A temporary Cloudflare tunnel forwards to the snapshot server on
127.0.0.1:4185. Keep the Mac awake and both processes running while testing.
This is a public testing URL, with separate storage from production. Use
disposable thoughts and name its Home Screen shortcut "Loopr Preview".
Restarting the tunnel changes the origin/URL, so continue using this URL
for this test session. Production publication remains pending.

Trusted HTTPS, service-worker control, offline reload/capture, and an offline
Dials deep link passed in isolated Chromium.

Device result (2026-10-18): the user reported that offline and Home Screen
tests look good on their iPhone and approved committing/pushing to dev.
The iOS version and per-step results were not supplied. The checklist remains
available for repeat testing; this approval does not establish Files backup,
VoiceOver, cross-mode storage sharing, or a two-release iPhone update test.


# Linked counts and scheduling — local review

* [ ] Dials Do / Doing / Delayed / Done counts link to the correct pages, including zero counts; Done includes Dropped.
* [ ] Dashboard ready cue is legible, links to Delayed, has correct singular/plural copy, and disappears when no thoughts are ready.
* [ ] Save a default time in Dials; reload and confirm it persists. Existing scheduled thoughts retain their exact timestamps.
* [ ] Tomorrow / This weekend / Next week display and use the default local time, including weekend/year boundaries.
* [ ] Date and time entry does not save until Schedule revisit; Cancel leaves all saved data unchanged.
* [ ] Reopen a delayed thought's picker; its existing date/time is prefilled. Future labels display the chosen time.
* [ ] Reject past dates/times, invalid dates, and nonexistent DST times. A repeated fall-back hour uses its first occurrence.
* [ ] Failed schedule writes retain entered date/time and previous saved thoughts; failed default writes retain the old preference and editable draft.
* [ ] Default preference remains separate from thought backup/restore and Clear All; a new device starts at 09:00.
* [ ] On iPhone, check native date/time controls, focus/VoiceOver labels, touch comfort, narrow layout, and enlarged text.
* [ ] Capture, notes, state transitions, persistence, and offline shell still work. No AI behavior or notifications added.

Local review result (2026-10-18): the user approved linked counts and scheduling
after local review and authorized commit/push to dev. Specific iPhone picker
and VoiceOver results were not supplied. Publication remains pending.


# App update notice — two-build review

* [ ] Install candidate A online, then serve candidate B on the same origin. A quiet update notice appears; no reload interrupts the page.
* [ ] Later hides the notice for that waiting worker in this page session. Work continues normally.
* [ ] Capture text, open edit/note/scheduling panels, changed default time, backup review, voice capture, confirmations, and active saves disable Update now.
* [ ] Failed saves retain drafts and keep updating blocked. Saving or canceling open work permits updating when this is the only window.
* [ ] A second Loopr tab/window blocks activation, even if running older code. Closing it allows retry. An unrelated app does not block.
* [ ] Update now temporarily prevents new edits, then reloads only the requester. Saved thoughts, schedules, and preferences survive.
* [ ] Missing worker replies/activation failures do not force a reload or leave the UI permanently inert.
* [ ] Verify keyboard focus, notice announcements, narrow layout, and iPhone Home Screen behavior with two known builds.
* [ ] Normal close/reopen updates and offline launch/capture continue to work.

Optional local automation: after `npm run build:pages`, run
`node scripts/update-browser-check.cjs` with Playwright/Chromium installed.
It serves isolated successive builds and never uses the user's browser storage.
The first transition from an older app without this notice still requires
closing and reopening; subsequent releases can announce themselves.

Local review result (2026-10-18): the user approved the update notice and draft
protection locally and authorized commit/push to dev, including docs and tests.
Specific iPhone announcement/activation results were not supplied. Publication
to main remains pending.


# Dash Dot Dot identity — local review

* [ ] Header says Dash Dot Dot; mark order is exactly dash, dot, dot. Divider and empty-state sketch remain decorative and static.
* [ ] Dashboard / Doing / Delayed / Done / Dials labels, routes, focus, and touch targets stay unchanged.
* [ ] All pages fit at 320/375/390px and 200% text. Review empty and populated Dashboard layouts and header spacing.
* [ ] Browser title, About section, update notice, backup instructions, and downloaded filenames use the new name.
* [ ] Manifest, favicon, and Apple-touch icon show the new identity; review a new installation on iPhone. Record whether an existing installation refreshes its name/icon without clearing data.
* [ ] Existing loopr.loops and loopr.revisitTime values survive navigation, reload, and update with all notes/states/dates intact.
* [ ] An older Loopr backup imports, and new exports retain app: loopr and version: 1 for compatibility.
* [ ] Capture, scheduling, backup failures, offline launch, and update/draft protections still work.
* [ ] VoiceOver reads the brand as text and ignores decorative marks. No Morse knowledge is needed to operate the app.

Review pending. Repository and deployment path remain loopr; publication is a
separate step after local approval.


## Thoughts wording and branding approval — 2026-10-18

The user approved Dash Dot Dot branding and requested thoughts terminology
throughout the interface, including accessible names and backup messages.
Commit/push to dev is authorized; publication remains pending. Earlier QA
sections use historical loop terminology for the same entries.

* [ ] Dashboard says THOUGHTS; Dials says Your thoughts. Empty states, About, confirmations, and accessible capture/edit/delete labels use thought(s).
* [ ] Backup export/restore and validation messages use thoughts; older backups remain accepted without changing app: loopr, version: 1, or the loops field.
* [ ] Old storage keys, write locks, update protocol, DOM identifiers, and /loopr/ routes remain compatible.


# Connect the dots — local review (2026-10-18)

* [ ] Open a thought's More → Connect the dots; also check Done and Dropped cards.
* [ ] Connect two thoughts manually; confirm the connection appears from both ends and survives reload.
* [ ] Tap each dot, including the center, to open full thought text and the appropriate actions. Back to connections returns to the source neighborhood.
* [ ] Confirm long labels wrap without overlapping; Graph pages through more than four neighbors. List exposes every connection.
* [ ] Search by thought text across all states; self-links/already-connected thoughts cannot be chosen. Cancel/Escape returns focus without saving.
* [ ] Remove a connection in List: both thoughts remain; keyboard focus returns to List and a status message confirms removal.
* [ ] Edit, note, Do/Done/Delay/Drop/Restore preserve connections. Delete removes affected links only; a missing-thought URL remains navigable.
* [ ] Failed saves preserve saved bytes and picker/search. Another tab's edits reject stale connection writes until Review latest saved thoughts.
* [ ] Export and restore a connected dataset (version 2) through Dials; old version 1 backups still restore. Restoring replaces connections too.
* [ ] Malformed connections are rejected without changing original saved data; Clear All removes connections with thoughts.
* [ ] Offline: open thought/connection deep links, add/remove connections, and reload after an online installation.
* [ ] A waiting update is blocked while the connection picker or a save is active.
* [ ] iPhone: tap targets, long labels, enlarged text, Graph/List controls, search keyboard, and VoiceOver link names/reading order are comfortable.

Automated checks: `npm test`, `npm run lint`, both root and Pages builds.
Optional isolated Chromium checks: `node scripts/connections-browser-check.cjs`
against the root production preview, plus existing offline/update browser checks
against the Pages build. Use disposable data; automation does not touch the
user's normal browser profile. Device review and publication remain pending.

Local result (2026-10-18): lint, 23 Node tests, root/Pages builds, and diff
whitespace checks passed. Isolated Chromium passed manual connect/remove,
clickable detail/back navigation, reciprocal links, more-than-four pagination,
320/375/390px layouts at default/200% text, failed saves, stale-tab review/retry,
Done Restore, deletion cleanup, actual backup download/restore, offline deep
links and offline connection saves. Existing offline/update regressions passed,
including the new connection-picker update guard. The 390px graph was visually
inspected. No page errors occurred. Actual iPhone touch/VoiceOver checks remain
unchecked above, pending the user's local review. Nothing committed or published.


Compact menu local checks (2026-10-18): build, lint, 23 Node tests, and isolated
Chromium menu checks passed. Verified unchanged card height, selection,
outside dismissal, Escape/Tab/Shift+Tab, editor/delete-cancel focus return,
confirmation before deletion, Connect the dots navigation, and 44px targets at
320/375/390px with default and doubled text. The 390px panel was visually
reviewed. Optional repeat: `node scripts/thought-menu-browser-check.cjs` against
the root production preview. Actual iPhone Safari/VoiceOver comfort and touch
dismissal remain for user review. These changes are local and unpublished.
Connection/backup/offline and two-build update regressions also passed. The
connection regression caught a delayed scroll event dismissing a newly opened
panel; scrolling now repositions the panel instead. Both menu and connection
checks passed after that correction. Root preview was rebuilt for review.


## One note in the menu — local refinement

* [ ] More opens Add note first for an empty note, or Edit note for an existing one. No separate Note button remains.
* [ ] Save creates/replaces one note; multiline text is retained. Saving an empty note removes it and restores Add note wording.
* [ ] Saved preview remains visible beneath the thought while the menu is closed or open; Cancel preserves it.
* [ ] Save/Cancel/Escape returns focus to More. Failed saves keep the editor/draft and block updating.
* [ ] Do, Doing, Delayed, Done, and Dropped all expose notes through the same compact menu; archived thoughts retain Restore and do not gain unsupported text editing.
* [ ] iPhone: check four-row panel fit, touch comfort, VoiceOver labels, and enlarged text. Connection counts remain deferred.

Still local and unpublished; actual iPhone review pending.

Local result: lint, 23 Node tests, root/Pages builds, and isolated menu,
offline, and update browser checks passed. Menu checks include Add/Edit wording,
multiline note save/reopen/clear on a completed thought, preview visibility,
focus return, and four-row panel bounds at 320/375/390px and 200% text.
Existing offline note saves and note-draft update guards passed through More.


## Manual connections and menu approval — 2026-10-18

The user approved the manual connections and menu changes locally and authorized
commit/push to dev, including project plan, QA checklist, and tests. This includes
one editable note per thought, Add note/Edit note in More, and visible saved
note previews. Detailed device/VoiceOver results were not supplied. Earlier
local-review entries are the testing history. Publication remains pending; AI
suggestions and connection counts remain deferred.


## Constellation layout — local review

* [ ] Zero through four neighbors render clearly; each neighbor has its own direct line to the central dot, with no branching trunk.
* [ ] Small dots and labels open the correct thought; keyboard focus is visible and Enter opens it. Back returns to connections.
* [ ] Dot touch areas are at least 44px and do not overlap at 320/375/390px or doubled text.
* [ ] Lines remain attached to dot centers after resizing or enlarging text. No animation or new AI behavior.
* [ ] Long labels are limited to three lines in the graph; full text is available in List and thought detail, and in accessible link names.
* [ ] More than four neighbors still page correctly. List, adding/removing links, backup, and offline use retain existing behavior.
* [ ] On iPhone, review label readability, dot/label tapping, orientation changes, and VoiceOver.

Optional geometry check: `node scripts/constellation-browser-check.cjs` against
the root production preview. Use `node scripts/connections-browser-check.cjs`
for connection/data regression coverage. Changes remain local and unpublished.

Local result: lint, 23 Node tests, root/Pages builds, and diff checks passed.
Isolated Chromium verified 0–4 neighbors, exact line-to-dot endpoints after
resizing, nonoverlapping 44px links at 320/375/390px and 200% text, keyboard
opening/back navigation, and List. Connection regression passed manual changes,
paging, long text, failed/stale writes, backup restore, and offline deep links
and saves. The mobile constellation was visually reviewed. Actual iPhone
review remains pending; no commit, push, or publication performed.


Constellation approval (2026-10-18): the user approved the layout locally and
authorized committing/pushing the implementation, project plan, QA checklist,
and tests to dev. Detailed iPhone/VoiceOver results were not supplied; preceding
entries retain the test history. Publication remains pending. AI suggestions
remain deferred.


## Lavender Home Screen icon — local review

* [ ] Icon is lavender with exactly one graphite dash and two equal graphite dots.
* [ ] Apple-touch (180), PWA (192/512), and favicon (32) PNGs are opaque, square, and legible.
* [ ] Mark stays inside the maskable safe area; no baked-in rounded tile or transparent corners.
* [ ] Root and /loopr/ builds reference the correct icons and include them in the offline shell.
* [ ] Header, page styling, app name, saved thoughts, and manual connections remain unchanged.
* [ ] After publication or a trusted HTTPS candidate, check a new iPhone Add to Home Screen preview. Record separately whether an existing installation refreshes its icon without data removal.

Local icon review pending. No commit, push, or publication authorized yet.

Local checks passed: lint, 23 Node tests, root/Pages builds, diff check, and
PNG dimension/opaque-RGB validation for all four sizes. The Apple-touch artwork
was visually inspected; the local preview serves matching PNG bytes. Actual
new/existing iPhone Home Screen behavior remains for review; not published.


Lavender icon approval (2026-10-18): the user approved the icon locally and
authorized commit/push to dev with the project plan and QA checklist. Earlier
entries retain validation history. Publication and actual installed-iPhone
icon-refresh verification remain pending.
