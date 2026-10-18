# Dash Dot Dot QA Checklist

> Use this checklist after major features, sprint completions, merges, or AI-assisted coding sessions.

## Embedded Lavender icon — live (`69be861`), iPhone preview passed (2026-10-18)

Device evidence: iOS 27.2 with public-beta updates selected. After the live
filename refresh, the user still saw a grey D in Add to Home Screen, in both
web-app toggle states and Private Safari. The direct PNG displays correctly.
The embedded workaround now passes the affected iPhone preview test; the
underlying iOS cause remains unconfirmed.

* [x] User confirmed “it's working” on 2026-10-18 after retesting the live Add to Home Screen preview at https://routergeeks.github.io/loopr/ following release `69be861`. iOS 27.2, public-beta updates selected; exact build not recorded.
* [ ] Keep the existing installed app and website data intact; confirm saved thoughts and unfinished drafts remain accessible.
* [ ] Check an unaffected iPhone if available, recording its version separately.
* [ ] Confirm a newly installed Home Screen icon separately; only the preview result is established by this retest. Keep the existing installation intact.

Production builds embed the existing PNG before shell hashing. Dev mode retains
the source file link. No app identity or storage changes. GitHub validation
passed and Pages deployment 39162528428 published `69be861`. Live files matched
the artifact; isolated Chromium/WebKit confirmed startup, worker control, and
exact embedded PNG decoding. The user subsequently confirmed preview success.

Local checks passed: 40 Node tests, lint, Pages/root production builds; offline
browser checks decode the embedded 180px PNG online and offline and preserve
saved thought/note bytes. Chromium/WebKit mixed-release tests and update guards
passed, including drafts and other-window protection. Root preview restored.
These checks do not exercise the native iPhone Add to Home Screen sheet.

## Earlier filename refresh — released (`a656ec4`), superseded by embedded workaround

Observed on the user's iPhone: direct Lavender image loads, but Add to Home
Screen remains a grey D after Safari reload. A fresh icon filename is a cache
mitigation to test, not a confirmed resolution. The old PNG remains available.

* [ ] After the candidate activates on a trusted HTTPS origin, verify Add to Home Screen previews Lavender; record iOS version and URL.
* [ ] Confirm the new icon URL loads as PNG online and offline; verify the old URL still works.
* [ ] Verify existing thoughts/drafts remain accessible. Do not clear website data or delete the existing installation to force an icon refresh.
* [ ] Confirm actual installed icon separately from the share-sheet preview; browser automation cannot prove the iPhone result.

Local checks passed: 39 Node tests, lint, Pages and root builds, and the isolated
offline browser suite including both icon URLs. Root preview restored.
Published in deployment 39161343127 after validation passed; live files matched
the artifact and isolated Chromium/WebKit startup passed. User retest failed
the Lavender preview check at that release; the embedded workaround above
subsequently passed on the affected iPhone.

## Current release status — reconciled 2026-10-18

- Embedded Lavender icon workaround is live as `69be861`; affected iPhone
  Add to Home Screen preview passed on 2026-10-18 (evidence above).

- Note/thought-edit recovery is live as `7b83c72`: validation and deployment
  39159902588 passed, live files matched the artifact, and isolated live checks
  passed. Subsequent blank-page investigation exposed an older mixed cache;
  fresh-profile tests alone did not cover that upgrade condition.

## Mixed-release shell prevention — live (`13c050e`, released with `a656ec4`)

* [ ] Serve HTTP-200 older HTML with a new worker/asset manifest: installation fails instead of accepting mixed versions.
* [ ] Changed JS/CSS/icon/manifest bytes, missing digests, and HTTP failures also reject installation. Existing active cache/data remain intact.
* [ ] A partial candidate cache-write failure removes only that candidate, with no pending writes recreating it.
* [ ] A consistent update installs and waits normally; blockers and other-window checks still protect open work.
* [ ] Saved thoughts and unfinished drafts survive rejection, reload, and later successful update.
* [ ] A previously blank client with a healthy waiting update recovers after app windows close/reopen, without clearing website data.
* [ ] iPhone Home Screen: save open Safari work, close site tabs and dismiss the app from the app switcher, then reopen online. Verify thoughts/drafts and later offline launch. Do not delete the installation.

Observed Chrome result: empty app root and JS/CSS 404s; cache metadata showed
older HTML in the newer Dashboard-draft release cache. A healthy editor-recovery
release was waiting. Navigating away/reopening restored the Dashboard and visible
saved thoughts. No localStorage/sessionStorage was edited, no caches cleared,
and no installation deleted. iPhone Home Screen retest remains pending.

Local validation: 38 Node tests, lint, Pages/root builds, and isolated Chromium
and WebKit mixed-response upgrade checks passed; existing offline/update checks
passed. Test: after `npm run build:pages`, run
`node scripts/shell-integrity-browser-check.cjs` (requires both local browser
engines), followed by offline/update browser checks. Rebuild root preview with
`npm run build`. Published in deployment 39161343127 with exact live artifact
comparison. User confirmed updating the iPhone app; the icon issue is separate.

## Earlier release and local-review evidence

Recorded release evidence; this documentation review adds no new device results.

- Live: linked counts/scheduling (`1428fed`), update protection (`029424c`),
  Dash Dot Dot identity (`9ba5f9c`), manual connections/menu (`e33e775`),
  constellation (`e6c2304`), Lavender icons (`3b9b459`), and offline routing (`aa3af0b`).
- Offline routing: GitHub deployment passed; isolated live Chromium verified
  the updated worker, brand, direct Lavender PNG online/offline, and Dials offline.
  The user reported the HTTPS preview looked good before release.
- Find a thought (`77b57a7`) is live; deployment, artifact comparison, and
  isolated live search/draft/offline checks passed. Labels/filters (`290457f`) are also live; deployment, artifact comparison, and
  isolated live label/filter/backup/offline checks passed. Dashboard draft recovery
  is live (`3626f21`, 2026-10-18). Deployment run
  [39158350787](https://github.com/RouterGeeks/loopr/actions/runs/39158350787)
  passed; live artifact comparison and isolated live draft/offline checks passed.
  User iPhone approval did not include iOS version or individual test results.
- Older “local review” / “publication pending” entries below are historical
  snapshots, superseded by this release record. Unchecked manual/device steps
  remain unverified; publication does not establish VoiceOver or every iPhone test.


## Note and thought-edit recovery — locally approved (2026-10-18)

Live app baseline remains `3626f21`; documentation reconciliation is merged as
`62353d8`. The editor-recovery changes below are approved for dev; publication is pending.

* [ ] Type a multiline note/edit, navigate away and reopen the same editor; reload and reopen. Restored text is not saved until Save.
* [ ] Notes recover in Do/Doing/Delayed/Done/Dropped. Thought edits retain existing state restrictions. One note per thought remains unchanged.
* [ ] Save persists only the intended field; Cancel/Escape discards only its draft. Focus returns to More. Empty note deletion recovers; empty thought text cannot save.
* [ ] Two tabs/duplicated tab: a second editor for the same field is read-only and explains ownership. Its Cancel or Dials discard cannot erase the owner's draft. Close the owner and retry to recover.
* [ ] Note and thought-edit drafts on the same thought are separate; changes to the saved thought trigger review before another draft saves.
* [ ] Change the saved thought elsewhere, reload or review latest: preserve the draft and show the newer saved value. Use my draft after review does not save; a second concurrent change requires fresh review.
* [ ] A deleted/replaced thought never gets recreated by recovery. Dials → Unfinished edits retains selectable text; confirmed discard removes only that draft.
* [ ] Draft-write failures retain visible text and block Save until persistence succeeds. Thought-write failures retain recovery text. Cleanup failure after a committed save cannot silently reapply an old edit.
* [ ] During an in-flight save, typing, voice append, Cancel, and repeated Save cannot clear/change the submitted draft. Cancel cleanup failure leaves the editor open with retry guidance.
* [ ] Malformed drafts remain byte-for-byte unchanged, with an editor error rather than silent replacement.
* [ ] Export/restore/Clear All do not include or remove recovery drafts. Search matches saved content only. Dials explains draft boundaries.
* [ ] Unsupported Web Locks: session-only recovery after reload, no shared local draft writes. Denied lock access fails closed. Offline reload/reopen works after online installation.
* [ ] Update now remains blocked by an open editor/voice/save/discard confirmation. Other app windows retain update protection.
* [ ] iPhone Safari and Home Screen over HTTPS: reopen notes/edits, close/reopen, try two tabs, Save/Cancel, multiline/dictation, VoiceOver status and focus, enlarged text. Record iOS version and mode separately.

Repeat: `npm test`, `npm run lint`, `npm run build:pages`, then
`node scripts/editor-draft-browser-check.cjs` and the existing draft, search,
offline, and update browser checks. Root-build menu/connection checks cover
shared editor integration. `npm run build` restores the local root preview.
Use disposable data and isolated profiles. iPhone behavior, OS termination,
and eviction are not established by automated Chromium checks.

Local result (2026-10-18): 37 Node tests, lint, Pages/root builds, and diff checks
passed. The new isolated Chromium suite passed note/text recovery after reload
and navigation, exclusive ownership and closed-owner recovery, explicit Save/
Cancel, newer-content review, failed thought writes, interrupted cleanup,
empty-note recovery, notes on Done, deleted-thought text in Dials, malformed
record preservation, offline reopening, session-only fallback, and 320/375/390px
editor layout with doubled text. Unit cases additionally cover failed draft
writes/Cancel, busy-save protection, denied locks, changed-again review, and
Cancel during asynchronous lock acquisition. The latter race was corrected
before final validation. Existing Dashboard draft, search, offline, two-build
update, compact-menu/focus, and connection/backup browser suites passed. The
mobile editor was visually inspected; root preview rebuilt for review.
Actual iPhone/VoiceOver and OS eviction/termination checks remain unverified.
No commit, push, or publication was performed during those local checks.

Local approval (2026-10-18): the user approved the recovery behavior locally
and authorized commit/push to dev, including the project plan, QA checklist,
supporting docs, and tests. Individual iPhone/VoiceOver outcomes remain
unverified. Publication remains pending.



---

# Session Info

* Date:
* Branch:
* Sprint / Feature:
* Commit:
* Tester:

---

# Build & Startup

* [ ] `npm test`, `npm run lint`, `npm run build:pages`, and `npm run build` succeed
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

* [ ] "+" Add Thought button disabled (lavender at reduced opacity) when empty
* [ ] Valid text enables the "+" button at full lavender
* [ ] "+" creates thought
* [ ] Textarea clears after add
* [ ] Capture textarea has no visible internal ruled rows when empty
* [ ] Capture container has a hairline border but no card-shadow weight
* [ ] Multiple thoughts stack correctly
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
* [ ] Spoken text fills the thought textarea
* [ ] Spoken text appends to a non-empty textarea with a space separator
* [ ] Transcript is editable before Save / Add Thought
* [ ] Spoken text in a note appends to the existing note value
* [ ] Permission denied shows "Microphone permission was denied."
* [ ] Silence shows "Didn't catch that."
* [ ] No microphone shows "No microphone found."
* [ ] When the browser/mode lacks the speech API, the
      mic is hidden and "Voice capture isn't built into this browser.
      Try your keyboard's mic instead." appears
* [ ] No audio data appears in localStorage — only the transcribed text
* [ ] Safari/iPhone: works after a user-gesture tap
* [ ] Safari/iPhone: layout doesn't break when mic is rendered

---

# Thought Actions

* [ ] Do moves thought from Do → Doing
* [ ] Done moves thought from Doing → Done (Done section)
* [ ] Delay moves an active thought (Do/Doing/Delayed) → Delayed
* [ ] Do on a Delayed thought moves it to Doing
* [ ] Drop moves thought from Do / Doing / Delayed → Done (Dropped section)
* [ ] Edit works in Do, Doing, and Delayed states
* [ ] Delete works in every state
* [ ] Restore from Done page sends thought back to Do
* [ ] Delete confirmation appears
* [ ] No double borders/cards
* [ ] Doing dot is visually distinct (sage tone) but calm

# Compact thought actions — current regression

* [ ] Default LoopCard footer shows only More (⋯); Note is inside the menu
* [ ] Tapping More opens a compact floating panel with Add note/Edit note, Connect the dots, Edit labels, Edit thought where supported, and Delete thought; the card does not expand or move.
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
* [ ] Choosing Add note/Edit note opens an inline editor with a focused textarea
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
* [ ] Only delayed thoughts appear
* [ ] Delayed thoughts editable
* [ ] Delayed thoughts deletable
* [ ] Do from Delayed moves thought to Doing
* [ ] Drop from Delayed moves thought to Done page (Dropped section)
* [ ] Delay from Delayed re-schedules the thought
* [ ] Empty state displays correctly

## Resurfacing clarity

* [ ] Dashboard cue appears only for ready delayed thoughts, with correct singular/plural text and a link to Delayed
* [ ] Cue count matches Ready to revisit; no "Quiet for now" message when ready thoughts exist
* [ ] Ready to revisit / Later / Choose a date headings appear only for nonempty groups
* [ ] Ready and future groups are chronological; missing/invalid dates stay visible under Choose a date
* [ ] Ready cards preserve original scheduled date/time; future labels distinguish Today at [time], Tomorrow, and later dates
* [ ] Due-time and midnight updates occur while open; tab/app return refreshes stale labels
* [ ] Time-driven changes preserve capture text, open note/edit drafts, focus, and thought state
* [ ] Rescheduling updates group/count; Do moves to Doing and Drop moves to Done as before
* [ ] Check daylight-saving transitions, local timezone changes, and overnight background return
* [ ] On iPhone, review cue discoverability, VoiceOver headings/link text, and background/foreground behavior

---

# Done (route /done)

* [ ] Page heading reads "Done"
* [ ] Done section works
* [ ] Dropped section works
* [ ] Restore sends thoughts back to Do
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
* [ ] Clear All removes saved thoughts, notes, labels, and connections; retains Dashboard drafts and default revisit time

## Backup export and restore

* [ ] Export downloads a dated JSON file with all thoughts, notes, labels, connections, states, and dates; drafts/preferences are excluded
* [ ] Restore validates a selected file before any storage changes
* [ ] Confirmation clearly says replacement, not merge; Cancel keeps current data
* [ ] Empty backups explicitly warn that restoration removes all current thoughts
* [ ] Full export/restore round trip preserves data after refresh and navigation
* [ ] Invalid JSON, unsupported versions, duplicate IDs, malformed records, and files over 5 MB are rejected
* [ ] Storage-write failure leaves existing data and counts intact
* [ ] Changes to current thoughts during review require choosing the backup again
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
* [ ] `startedAt` persists for Doing thoughts
* [ ] `note` field persists for any state
* [ ] Legacy data (`active` / `pending` / `delay` / `drop` / legacy `do`) decodes on first load without rewriting stored bytes
* [ ] Legacy thoughts without a `note` field render and function normally

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
* [ ] Layout still feels calm with many thoughts

## Mobile accessibility

* [ ] All fields and keyboard-focused controls have a clear focus outline
* [ ] Focus stays visible above fixed navigation
* [ ] Save/Cancel from note and edit returns focus to More; delay/delete Cancel returns to its trigger
* [ ] More announces expanded state and actions include the relevant thought context
* [ ] Clear All announces its title and description, starts on Cancel, traps Tab in both directions, closes with Escape, and returns focus
* [ ] VoiceOver cannot browse or activate background controls while Clear All is open
* [ ] Common controls have at least 44px hit areas with no overlapping targets
* [ ] Secondary labels, hints, placeholders, and navigation text are readable
* [ ] All routes and compact action panels fit at 320/375/390px and 200% text enlargement
* [ ] iPhone VoiceOver reads thought context, control names, and confirmation content in a useful order
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

* [ ] Add thought (lands in Do on Dashboard)
* [ ] Add a note to that thought; verify the saved preview and Edit note wording appear
* [ ] Press Do — thought moves to Doing page; note persists
* [ ] Press Done on Doing card — thought moves to Done page (Done section); note persists
* [ ] Add another thought, press Delay → schedule
* [ ] Verify Delayed page shows it
* [ ] Press Do on a Delayed card → moves to Doing
* [ ] Add another thought, press Drop → Done page (Dropped section)
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
* [ ] With a newer candidate served, keep a draft open and confirm it is not reloaded. Save it, close every Dash Dot Dot window, reopen online, then relaunch offline and verify the new build and saved data. This requires two known candidate builds.
* [ ] Check VoiceOver reading order, enlarged text, and Clear All dialog cancellation in both modes; record any differences.

Expected limits: first-ever offline launch is unsupported. Dashboard drafts have
best-effort recovery with working storage and ownership locks; session fallback
does not promise closed-tab recovery. Note/edit/label drafts remain in memory.
Browser/OS storage removal can remove assets, thoughts, and drafts. Backups
exclude unfinished drafts and preferences. Keep exported saved-thought backups. In-app voice recognition
is not an offline guarantee; typed capture is the offline test target.


# Historical release QA snapshots

The sections below preserve results and approvals at each stage. “Local”,
“pending”, and “not published” describe that past stage, not today's release.
All shipped features listed at the top are live. Temporary tunnel URLs and cache
IDs are historical and may no longer work. Checklists remain useful for repeats;
unchecked device steps remain unverified. Later label and draft releases supersede
earlier version-1-only backup and in-memory-only capture assumptions.

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

## Offline asset navigation fix — local candidate

The user reported a grey D Home Screen icon and a direct Apple-touch PNG URL
opening the app shell on their iPhone. The same icon displayed via GitHub raw,
and Home Screen installation worked on their wife's iPhone. Reproduced cause
of the blank image page: every navigation received cached index.html before
asset matching. This does not yet prove the cause of the Home Screen fallback.

* [ ] With the candidate worker controlling Safari, open Apple-touch/PWA/favicon PNG URLs directly, with and without a query string. They display images, never app navigation.
* [ ] Repeat direct icon navigation offline after an online install.
* [ ] Dashboard, Doing, Delayed, Done, Dials, legacy routes, and thought/connection deep links still work offline.
* [ ] Saved thoughts, notes, and connections remain unchanged after visiting images and returning to Dashboard.
* [ ] Unknown file URLs do not receive the worker's offline HTML substitute (hosting may still supply its own 404 page).
* [ ] Waiting updates preserve unsaved drafts; normal update activation and cache isolation still work.
* [ ] On the affected iPhone, inspect Add to Home Screen's Lavender preview after the candidate worker has activated. Record separately from direct-image loading; do not clear data or delete the existing app.

Local automated checks passed: lint, 24 Node tests, Pages build, isolated
Chromium direct PNG byte/content-type/image-decoding checks online/offline,
app/legacy/thought deep links, saved-data equality, offline capture/edit/note,
update-draft protection, cache isolation, and failed-update fallback.

The existing temporary HTTPS test preview now serves this candidate:
https://providers-keyboard-disposition-width.trycloudflare.com/loopr/
Candidate cache: loopr-offline-%2Floopr%2F-aeb43a85173c5d67.
This is separate test-origin storage, not production thoughts. Keep the Mac
awake. Save test drafts and close all earlier preview tabs/windows before
reopening if an old worker remains active. Production is unchanged; iPhone
results, commit, and publication were pending at this check.

Offline routing approval (2026-10-18): after retesting the HTTPS preview, the
user reported “looks good” and authorized committing and pushing the fix,
QA checklist, and regression tests to dev. This is general preview approval;
individual manual checklist items above are not claimed as separately verified.
Production publication remains pending.


## Find a thought — local review

* [ ] Header Find a thought is reachable from existing pages; bottom navigation stays unchanged.
* [ ] Capture/edit/note/scheduling drafts and active saves cannot be discarded by opening search; save or close them first.
* [ ] Blank/whitespace search shows guidance; no matches has a calm message. Clear search returns focus to the input.
* [ ] Search text and notes across all five states; mixed case, multiline notes, multiple words split across text/note, Unicode and literal punctuation work.
* [ ] Results include state and excerpts around matches, with no HTML interpretation. More than 20 results can all be reached.
* [ ] Open a result and return via Back to search or browser Back; query is retained and refreshed results reflect any edits/deletions.
* [ ] Search does not alter saved bytes, schedules, notes, connections, preferences, or backup schema; query is not sent in a URL.
* [ ] Unreadable storage remains intact and shows recovery guidance; another-tab changes can be reviewed without losing the query.
* [ ] After installing online, /find works on offline navigation and refresh; direct PNG URLs still show images.
* [ ] At 320/375/390px and 200% text, labels/results fit; keyboard focus is visible and targets are at least 44px.
* [ ] iPhone: check search keyboard, Clear, result opening/back navigation, long note excerpts, and VoiceOver reading order/count announcements.

Labels are discussion-only: optional shared themes may later help find related
thoughts, but they will not automatically create manual connections. No labels,
AI, notifications, or sync are included. Local checks are recorded below after
execution; publication requires separate approval.

Local result (2026-10-18): lint, 26 Node tests, and Pages/root production builds
passed. Isolated Chromium verified text/note matching across all states,
20-result paging, detail/back query retention, capture and note-draft navigation
guards, unchanged saved bytes, clear-input focus, stale-tab review, unreadable
storage preservation, and offline search/refresh. Layout and 44px input/result
links passed at 320/375/390px and 200% text; the 390px search screen was visually
reviewed. Offline icon/navigation and two-build update/draft regression checks
also passed. No page errors were observed. Actual iPhone keyboard, VoiceOver,
and touch comfort remain for user review; nothing committed or published.
Repeat: after `npm run build:pages`, run `node scripts/search-browser-check.cjs`,
`node scripts/offline-browser-check.cjs`, and `node scripts/update-browser-check.cjs`.
Then `npm run build` restores the root-path preview.

Search placement refinement: moved the entry point from beneath the tagline to
a 44px magnifying-glass link at the upper right beside the mark. Accessible name
is Find a thought; decorative SVG is hidden from assistive technology. Back to
search remains a text link. Draft protection and five-tab navigation are unchanged.

Find a thought approval (2026-10-18): the user approved search and the new icon
placement locally and authorized commit/push to dev, including the project plan,
QA checklist, release-status corrections, and tests. Labels remain deferred.
Earlier local-test entries are historical; individual iPhone/VoiceOver steps
remain unchecked unless explicitly verified. Publication remains pending.


## Custom labels, filters, and shared-label suggestions — local review

* [ ] More → Edit labels works in all five states; Dashboard capture has no label requirement or extra chips.
* [ ] Create/reuse multiple labels; whitespace and Garden/garden do not produce duplicates. Empty or over-40-character names are rejected. Cancel/Escape leaves saved data untouched.
* [ ] Save with unadded typed text asks the user to add/clear it. Failed storage writes preserve selections/text; another-tab review/retry preserves other changes.
* [ ] An open labels editor blocks update activation and the search shortcut. Label-filter chips and Edit labels do not discard an open note/edit draft.
* [ ] Saved detail chips open label-filtered Find. Filters work with no query, OR across labels, AND with text/note words and captured date range.
* [ ] From/To boundaries are inclusive in device timezone; one-sided ranges work. Reversed/invalid ranges explain the problem; they do not silently show unfiltered data.
* [ ] Active filters can be removed individually or cleared; words remain. Detail/back and browser Back retain the full filter/query selection.
* [ ] Shared labels starts collapsed, explains the match, excludes self/already-connected thoughts, and supports more than 10 suggestions. Opening it or a result saves nothing.
* [ ] Explicit Connect creates one reciprocal manual connection. Failure retains the suggestion; retry works. Removing labels leaves existing connections intact.
* [ ] Labels/notes/connections survive state transitions and v3 export/restore. v1/v2 still import; malformed labels and labels hidden in older backup versions are rejected without mutation.
* [ ] Offline /find and /thoughts/:id/labels support filtering, label editing, reload, and saved data. PNG routing and update-draft safeguards remain correct.
* [ ] 320/375/390px and 200% text: editor, longer menu, filter fields, long labels, and suggestions fit; controls retain visible focus and 44px row targets.
* [ ] iPhone: review native date pickers, keyboard Save/Cancel, label-chip navigation, VoiceOver labels/selected states, and collapsed suggestions. Record Safari vs Home Screen mode and iOS version.

Scope: no AI, automatic connections, label graph nodes, global label management,
or sync. Existing legacy timestamp-ID fallback is unchanged. Use an updated
candidate in all open windows before testing labels; older builds do not retain
unknown label fields. Keep production data separate from disposable test data.

Repeat after Pages build: `node scripts/labels-browser-check.cjs`, existing
search/offline/update browser scripts, and `npm test`. Rebuild root preview
with `npm run build` afterward. Actual iPhone checks remain pending review.

Local result (2026-10-18): 29 Node tests, lint, root/Pages builds, and diff checks
passed. Isolated Chromium passed label create/reuse/remove/cancel in all states,
failed writes and stale-tab review/retry, unchanged connections after removing
labels, filter-only search and inclusive date bounds, invalid range messaging,
filter retention on return, shared-label explanation and explicit connection,
actual v3 download/restore, and offline label editing/filter reload. Editor and
filter layouts fit 320/375/390px at default and doubled text. Search, offline PNG
routing, manual connection/backup regressions, and two-build update protection
(including the open label editor) passed. The extended More menu passed keyboard,
focus, dismissal, and mobile/enlarged-text bounds checks after adding Edit labels
to its expected Tab order. The filter view was visually reviewed; checkbox art
is small inside a full 44px tappable row. Actual iPhone/VoiceOver review remains
pending. No commit, push, or publication was performed.

Labels approval (2026-10-18): the user approved custom labels, Find filters, and
shared-label suggestions locally and authorized commit/push to dev with the
project plan, QA checklist, and tests. AI and automatic connections remain
excluded. Earlier local-check entries retain their historical status; this
approval does not mark individual iPhone/VoiceOver steps as verified. Production
publication remains pending.


## Dashboard draft recovery — live regression (`3626f21`)

* [ ] Type multiline text or append dictation, navigate away/back, reload, and reopen offline. The owned draft is restored without changing saved thoughts or moving the capture field.
* [ ] Two open tabs keep separate drafts. Duplicate a tab: its inherited session pointer cannot overwrite or clear the original tab's draft.
* [ ] Other saved drafts stays collapsed; recovering while the owner is open explains why it cannot proceed. Close the owner and recover into an empty capture.
* [ ] A nonempty capture cannot be replaced by another saved draft. Recovery transfers ownership without copying/deleting other tabs' text.
* [ ] Successful capture clears only that draft; failed writes preserve it. Reload between saved-thought commit and draft cleanup does not reintroduce a completed capture.
* [ ] Type new text while a capture save waits: the submitted thought saves once and the new draft survives reload.
* [ ] Discard → Keep draft retains text; confirmed discard clears only the current draft. Failed storage cleanup explains retry and does not claim durability.
* [ ] Draft-storage failures keep current text visible, show retry/copy guidance, and do not silently report capture success. Malformed records remain byte-for-byte intact.
* [ ] Drafts do not appear in Find or backups. Clear All/backup restore retain separate drafts; Dials explains this boundary.
* [ ] Update guards still block active capture drafts; a safely stored draft survives leaving Dashboard and updating/reloading from another page.
* [ ] Without Web Locks, session-only fallback is explained; no shared local draft is written or taken over. Same-session reload still works.
* [ ] iPhone over trusted HTTPS: type, background/return, reload, close/reopen, and try two tabs/Home Screen windows. Record iOS version and mode; do not assume Safari/Home Screen storage is shared.
* [ ] VoiceOver announces restoration/errors without reading every keystroke; recovery/discard controls have clear names and usable targets at enlarged text.

Run `node scripts/draft-browser-check.cjs` after `npm run build:pages`, plus
existing offline/update/search browser checks. Use disposable data in isolated
profiles. Drafts are best-effort local recovery, not exported backups. Browser
storage removal can remove them; note/edit/label drafts remain outside this scope.

Local result (2026-10-18): lint, 29 Node tests, root/Pages builds, and diff checks
passed. Isolated Chromium tested navigation/reload, separate and duplicated-tab
ownership, refusal to recover an active tab, recovery after closing it, failed
thought writes, failed draft cleanup after capture, new typing during a blocked
write, discard/cancel, corrupt draft preservation, offline reload, session-only
and denied-lock fallback, and 320/375/390px at doubled text. Search, offline PNG
routing/capture, and two-build update/draft protection regressions passed. The
mobile capture view was visually reviewed. Actual iPhone/VoiceOver and OS process
termination/storage eviction remain device-review items. Nothing published.

The trusted HTTPS test preview has been refreshed for this candidate:
https://providers-keyboard-disposition-width.trycloudflare.com/loopr/
Pages cache: loopr-offline-%2Floopr%2F-4a2897564260a962. Secure-context Web Locks and
draft restoration after reload were verified against the final candidate in
isolated Chromium. The final candidate also passed the isolated local browser suite. This is separate test-origin data, not production thoughts.
Keep the Mac awake; save earlier test drafts and use the update notice or close
earlier preview windows to load the candidate. LAN HTTP only tests session-level
recovery. No commit, push, or publication performed.

Dashboard draft recovery approval (2026-10-18): the user reported that draft
recovery looks good on their iPhone and authorized commit/push to dev with the
project plan, QA checklist, release-status corrections, and tests. The iOS
version and individual device-step results were not supplied; this approval
does not mark every VoiceOver/process-termination/storage-eviction check complete.
Earlier local results remain historical. Published as `3626f21`; see the current
release record above. Unchecked device scenarios remain open.
