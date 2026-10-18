# Loopr QA Checklist

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

# Card Action Overflow Menu (Sprint 17)

* [ ] Default LoopCard footer shows only Note + More (⋯)
* [ ] Tapping More reveals Edit + trash + Close (✕) inline
* [ ] Tapping Close returns to default footer state
* [ ] Edit from the overflow menu enters edit mode normally
* [ ] Delete from the overflow menu still shows the confirmation step
* [ ] Trash icon is recessive charcoal — never red

---

# Notes

* [ ] Note button visible on every card (Do, Doing, Delayed, Done, Dropped)
* [ ] Notes are collapsed by default (no expanded editor on first render)
* [ ] Clicking Note opens an inline editor with a focused textarea
* [ ] Save persists the note to localStorage
* [ ] Edit replaces the previous value
* [ ] Empty Save clears the note (no empty-string artifact in storage)
* [ ] Cancel discards the draft without changing the stored value
* [ ] Esc cancels the editor; Cmd/Ctrl+Enter saves
* [ ] Small dot indicator appears on the Note button when a note exists
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
* [ ] Save/Cancel from note and edit returns focus to Note or More; delay/delete Cancel returns to its trigger
* [ ] More/Close announces expanded state and actions include the relevant loop context
* [ ] Clear All announces its title and description, starts on Cancel, traps Tab in both directions, closes with Escape, and returns focus
* [ ] VoiceOver cannot browse or activate background controls while Clear All is open
* [ ] Common controls have at least 44px hit areas with no overlapping targets
* [ ] Secondary labels, hints, placeholders, and navigation text are readable
* [ ] All routes and expanded action rows fit at 320/375/390px and 200% text enlargement
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
