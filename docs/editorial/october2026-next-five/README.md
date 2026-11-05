# Five additional October field guides

Prepared and checked **November 5, 2026**, timezone **Asia/Jerusalem**.
These fill the nearest five remaining past slots, **October 20–24**.
Archive dates are editorial slots; each page separately displays the actual
review date and dateModified. The stories are practical workshops, not news
purported to have occurred on those dates.

| Date | Topic | EN body words | RU body words |
| --- | --- | ---: | ---: |
| 2026-10-20 | Как исследовать границы кода через Graph и Health | 2549 | 2556 |
| 2026-10-21 | Как проектировать понятные контракты MCP-инструментов | 2658 | 2609 |
| 2026-10-22 | Обновление зависимостей с агентом без потери воспроизводимости | 2545 | 2618 |
| 2026-10-23 | Понятное и доступное управление агентом с телефона | 2565 | 2717 |
| 2026-10-24 | Как разобрать сбой после работы агента по свидетельствам | 2543 | 2557 |

Counts include opening and section paragraphs only. Headings, captions, sources,
closing notes and review notices do not satisfy the requested 2,500-word minimum.
All ten localized manuscripts exceed the minimum without shared body paragraphs.

## Images and sources

Each article has three new illustrations from the **built-in image_gen** tool.
All fifteen final WebP files live in `public/blog/october2026-next-five/`.
[image-prompts.json](image-prompts.json) records every prompt, destination, original
asset identity, dimensions and source/final SHA-256. Originals remain in normal
Codex generated-image storage. Images are conceptual and labelled accordingly.

Four stories additionally reuse genuine app screenshots. Their actual build,
capture date, iOS Simulator and synthetic-fixture details remain in captions.
The older MCP capture remains build 230; it is not relabelled as current runtime data.

Primary MCP (explicit 2025-06-18 specification), npm CLI v11, W3C and Git sources
were read for narrow technical claims. All four external source URLs answered
HTTP 200. The rest is original practical methodology grounded in the current
GrantTap guide; [content-review.json](content-review.json) records the distinctions.

## Calendar

[calendar-validation.json](calendar-validation.json) records before/after gaps.
There are **42 published stories on November 5**, **45 prepared total**.
Existing November 6–8 gates remain intact. No other date was populated.
Remaining historical gaps from September 24 through November 5:

- October 17–19: 3 days, the nearest gap.
- October 11–15: 5 days.
- October 6–9: 4 days.
- September 25–October 2: 8 days.

That is **20** remaining empty days.

## Validation

The release checks bilingual body length, distinct image identity and file hashes,
review/archival metadata, historical calendar counts and capture provenance.
Production HTML verification checks both locales, all new image bytes, product/help
routes and future-story gates. Browser verification checks desktop and phone widths,
both locales, actual image loading, reading-section scrolling and review-note visibility.
Final execution results are recorded with the local/public proof files.

This is a website editorial release. No new Apple binary or agent runtime is implied.

Local verification passed: 50 targeted Vitest checks in 14 files, production
build plus 25 Node/SSR checks, typecheck, 10 localized HTML pages, all 15 image
hashes and 14 product/help routes. Lint has zero errors and the existing unused
`_account` warning in `hetzner/client-access.mjs`. Twenty browser journeys cover
both languages at desktop and phone widths with all images loaded, no horizontal
overflow, visible reading notices and no JavaScript exceptions. Browser image
waiting is bounded; it no longer waits indefinitely on responsive-image decode.
The historical October 16 quality comparison now uses the journal available at
that date instead of drifting upward whenever future longform stories are added.

Public verification also passed: 10 localized article pages contain 2,543–2,717
visible body words, all 15 generated asset hashes match, and 14 product/help routes
respond. All 20 desktop/phone browser journeys passed in both languages with no
JavaScript exceptions. The serving container is healthy on source commit
`9a7b67b8c0fee5ee529f9107215ae4f243a43456`, image
`73118439f3048a0a7b45ccfec3a5a425b15b7ec04b13d550a7ca9707874585a2`.
Candidate and live checks additionally verified all 48 guide chapters, 34 guide
capture hashes and the search index. The preceding site container is retained
for rollback. Account and relay services were not changed. Local preview and
owned headless browser processes were stopped after verification.
