# Guide verification — 24 November 2026

The guide has 57 chapters (7 new: live-map, context-compaction, chat-tree,
needs-you-actions, changes-worktrees, quotes, subscription) and 59 screenshot
originals. 26 are build 316 Russian iOS 26.5 Simulator captures from demo and
DEBUG fixtures: 5 replace the outdated now, tasks, usage, chat and automations
entries under the same ids, 21 are new. Every capture keeps its unchanged PNG
bytes, SHA-256, build, date, locale and launch scenario in screenshots.json.

Behavior basis: native 5f3e1760 (1.0.5, build 316) plus claude/quote-jump up to
0f04aaaa, the What's New texts of 1.0.2–1.0.5, feature READMEs and commit
messages; MCP 58667cc (0.8.203, confirmed on npm). The public App Store lookup
reported 1.0.4, released 2026-11-23T22:14:31Z, at preparation time.

Capture method: the installed Debug app was driven by a temporary standalone
XCUITest that launched it by bundle id and only tapped, swiped and typed. No
real computer, provider sign-in, purchase, automation, commit or sub-chat was
performed. Rejected frames: the Devices phone list (fixture shows a personal
device name), the Settings list (its Language row read English while the UI
was forced to Russian) and a composer frame covered by a system keyboard tip.

Website: `npx vitest run app/guide` 83 passed. `npm test` (guide export 2/2,
production build, 33/33 production tests including every chapter, anchors,
search index with 432 sections and the practice archive) passed. Chrome checks
at 1440×1000 and 390×844 passed without errors after the final build; see
browser-proof.json.

`npm run guide:export` was run against a temporary root, not the app
repository: it would add 7 chapters and 21 captures to the bundled Learn guide,
replace 5 captures and change 33 other existing files (several chapters in
the app bundle predate this site revision), growing Resources from about 11 MB to
20 MB. Exporting into the app is left to the app's release work.
