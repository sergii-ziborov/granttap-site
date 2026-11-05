# Five retrospective GrantTap field guides

Prepared and reviewed **5 November 2026**, timezone **Asia/Jerusalem**.
These fill the five nearest empty historical slots, **25–29 October**.
They are original practical articles, not news purported to have happened on
those dates. Each page displays its preparation/review date separately from
its archive date, including dateModified metadata.

| Date | Guide | EN body words | RU body words |
| --- | --- | ---: | ---: |
| October 25 | Evaluate a coding agent on your own task | 2569 | 2615 |
| October 26 | Untrusted content and tool boundaries | 2572 | 2557 |
| October 27 | Review agent changes from a phone | 2662 | 2558 |
| October 28 | Processes, CPU, memory and disk | 2677 | 2524 |
| October 29 | Collaborate with scoped project access | 2635 | 2659 |

Counts include only opening and section paragraphs, excluding headings, image
captions, sources, review notice and closing note. All ten localized manuscripts
exceed the requested 2,500 words. No reused padding or shared section body is
appended to these stories. A meaningful article check enforces the minimum.

## Images

Each story has three distinct images made with the **built-in image_gen** tool.
Final WebP assets live in `public/blog/october2026-backfill/`. All fifteen prompts,
original source asset identities, dimensions and SHA-256 digests are recorded in
[image-prompts.json](image-prompts.json). Originals remain under the generator's
normal Codex storage; every consumed image is copied/converted into the project.
Images are labelled conceptual illustrations, never product or benchmark evidence.
Four stories additionally use existing native screenshots with truthful build,
date and fixture captions; an earlier Mesh capture retains build 230.

## Review and dates

[content-review.json](content-review.json) records source versions and the copy
areas updated. [external-source-audit.json](external-source-audit.json) checks all
36 external article-source URLs. 35 answered direct HTTP requests; OpenAI returned
403 to that client and was separately read through web.run at its official URL.
This is a source-access check, not an independent test of vendor release claims.
Primary MCP, Git, Apple and Anthropic references were read for the narrow factual
claims in the new original workshops. News references retain their source dates;
the Anthropic article now links the October 23 follow-up assessment.

Support in both languages, the version history, provider pages, current guide
review stamps and the journal's guide references were updated. Verified source:
native 250 / 9d947d62 and public MCP 0.8.143 / 54ddf6f. The native release evidence
confirms internal TestFlight membership on November 3; external beta approval or
public App Store availability is not inferred. Legal effective dates, planned
price labels and historical screenshot provenance were preserved.

## Calendar

[calendar-validation.json](calendar-validation.json) records before/after gaps.
The nearest remaining empty historical range is **October 17–24** (8 days).
Earlier gaps: October 11–15 (5), October 6–9 (4), September 25–October 2 (8).
There are **25** remaining empty days from the archive's September 24 start
through November 5. We did not populate dates outside the five requested slots.

On November 5 the archive contains 37 published articles and 40 prepared total.
The existing November 6–8 stories remain gated until their Jerusalem dates;
those future articles were neither removed nor exposed early by this work.

## Validation

Targeted guide, article, customer-document and version-history checks passed:
47 tests across 13 files. The production build and 25 Node/SSR checks passed,
as did typecheck. Lint has no errors and one pre-existing unused-variable warning
in `hetzner/client-access.mjs`. Browser QA checks every new article at desktop
and phone widths, scrolling into the actual reading section, image references,
review notes and absence of horizontal overflow. Publication checks validate
both languages, visible body words, all fifteen image hashes, updated help and
provider links, and the preserved future gates before/after activation.

This is a website/content release. No new Apple binary or provider runtime was
published, and illustrative native screens do not constitute live OAuth tests.

Final public verification passed on November 5: ten localized article pages
contain 2,524–2,677 visible body words, all fifteen image hashes match, fourteen
current product/help pages respond, mobile review notes remain visible, and
ten desktop/mobile browser journeys report no JavaScript exceptions. The site
is healthy on source 0626fb8c12713c2f5eb807b43d8aab75479e88be; the previous
serving container is retained for rollback. See public-proof.json.
