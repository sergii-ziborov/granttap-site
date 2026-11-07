# Offline guide export

`npm run guide:export -- --apple-root /absolute/path/to/apple/repository` exports
the canonical authored guide to the Apple Learn resources. It verifies screenshot
hashes, resolves chapter and anchor links, renders safe static HTML, copies original
capture bytes with their original provenance, and builds the searchable catalog.
Reading needs neither JavaScript nor network access. External help and downloadable
practice files remain explicit HTTPS links. The generated document resources are
not source-code copies; the website remains the editing source.

Public entry: `exportGuide(source, output)`. The source has catalog.json,
screenshots.json, articles and relative screenshot files. The CLI adapts the site's
catalog to that contract. Run `npm run test:guide-export` to verify durable output,
safe rendering, local navigation, asset identity and rejected broken links.
