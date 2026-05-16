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

* [ ] Home loads
* [ ] Revisit loads
* [ ] Archive loads
* [ ] Settings loads
* [ ] Refresh works on all routes
* [ ] No 404s
* [ ] Active nav state works
* [ ] Icons display correctly

---

# Capture Flow

* [ ] Add Loop disabled when empty
* [ ] Valid text enables Add Loop
* [ ] Add Loop creates loop
* [ ] Textarea clears after add
* [ ] Multiple loops stack correctly
* [ ] Autofocus works

---

# Keyboard Capture

* [ ] Cmd+Enter works
* [ ] Ctrl+Enter works
* [ ] Enter creates newline only
* [ ] Keyboard capture persists after refresh

---

# Loop Actions

* [ ] Do works
* [ ] Delay works
* [ ] Drop works
* [ ] Edit works
* [ ] Delete works
* [ ] Restore works
* [ ] Delete confirmation appears
* [ ] No double borders/cards

---

# Delay Scheduling

* [ ] Tomorrow works
* [ ] This Weekend works
* [ ] Next Week works
* [ ] Pick Date works
* [ ] Due Now appears correctly
* [ ] Relative labels display correctly
* [ ] Sorting is chronological

---

# Revisit

* [ ] Only delayed loops appear
* [ ] Delayed loops editable
* [ ] Delayed loops deletable
* [ ] Do from Revisit moves to Archive → Done
* [ ] Drop from Revisit moves to Archive → Dropped
* [ ] Empty state displays correctly

---

# Archive

* [ ] Done section works
* [ ] Dropped section works
* [ ] Restore works
* [ ] Permanent delete works
* [ ] Empty state displays correctly
* [ ] Archive feels calm and uncluttered

---

# Settings

* [ ] Counts are correct
* [ ] Counts update live
* [ ] Clear All confirmation works
* [ ] Clear All resets app correctly

---

# Persistence

* [ ] localStorage persists correctly
* [ ] Refresh preserves state
* [ ] Route changes preserve state
* [ ] Archive persists
* [ ] Delay timestamps persist

---

# PWA & Offline

* [ ] Manifest loads
* [ ] Service worker registers
* [ ] Offline shell works
* [ ] Home works offline
* [ ] Revisit works offline
* [ ] Archive works offline
* [ ] Settings works offline
* [ ] Install prompt works
* [ ] Icons display correctly

---

# Mobile UX

* [ ] No horizontal scrolling
* [ ] Buttons are easy to tap
* [ ] Text remains readable
* [ ] Navigation fits correctly
* [ ] Layout still feels calm with many loops

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

* [ ] Add loop
* [ ] Delay loop
* [ ] Verify Revisit
* [ ] Mark Do
* [ ] Verify Archive → Done
* [ ] Add another loop
* [ ] Drop loop
* [ ] Verify Archive → Dropped
* [ ] Restore archived loop
* [ ] Verify Home
* [ ] Refresh all routes
* [ ] Verify persistence

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
