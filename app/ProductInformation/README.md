# Customer information

Public entry: `customerDocument` and `documentProps` in `index.ts`.
EN/RU Help, Terms, Privacy and license summaries live in `Resources`.
Pricing text is built from the same first-launch offer used by the website and
account receipt allowlist. Purchase availability is separate from copy.

`scripts/product-information/sync.ts --apple-root <checkout>` exports the exact
resolved documents into the Apple application's offline resources. Do not edit
independent price lists in the exported files. Third-party license texts retain
their original upstream wording. Website and in-app Help use the same captions
for current, sanitized setup screenshots.
