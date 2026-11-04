# Guide verification — 4 November 2026

The source guide has 48 chapters and 34 unchanged screenshot originals, with
20 build-250 Simulator captures. 29 chapters embed screenshots contextually.
The gallery also exposes all images and their individual provenance.

Native UI: 11 scenarios passed, zero failures. Device/cache/login fixtures,
request-scoped file diffs and child agents, repository search, approval details,
Codex automation editing, and architecture details. The fixture-driven UI
checks do not authorize or perform real OAuth login or edit real automations.

Website: authored links/anchors/capture hashes, all production chapter routes,
canonical URLs and unknown-route 404, practice ZIP and generated search index.
Chrome: 1440×1000 and 390×844, no page overflow; search content, Devices filter,
lightbox, Escape/focus restoration, mobile drawer/body scroll, inline images,
and light/dark theme. Browser proof is recorded after the final build.

The initial guide HTML fell from approximately 1.11 MB to 82 KB before transfer
compression by loading the full search index only when requested. This is a
response-size observation on the local production build, not a latency claim.

Existing journal publication scheduling remains request-time based. Candidate
and production checks retain the ten bilingual articles and their dated visibility.

Public checks and deployment identity are recorded with the final release.
