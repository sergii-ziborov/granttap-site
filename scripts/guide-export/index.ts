import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { parseGuide, plainText } from "../../app/guide/GuideReader/markdown";
import { renderChapter } from "./render";

export type Chapter = { slug: string; title: string; summary: string };
export type Capture = { id: string; file: string; title: string; caption: string;
  build: string; date: string; sha256: string };

/** Export the authored content and verified screenshots; no scripts or remote assets. */
export function exportGuide(source: string, output: string): void {
  const chapters: Chapter[] = JSON.parse(readFileSync(resolve(source, "catalog.json"), "utf8"));
  const captures: Capture[] = JSON.parse(readFileSync(resolve(source, "screenshots.json"), "utf8"));
  if (new Set(chapters.map(page => page.slug)).size !== chapters.length) throw Error("Duplicate chapter");
  const content = new Map(chapters.map(page => {
    if (!/^[a-z0-9-]+$/.test(page.slug)) throw Error("Invalid chapter slug");
    return [page.slug, readFileSync(resolve(source, "articles", `${page.slug}.md`), "utf8")];
  }));
  const sections = new Map([...content].map(([slug, text]) => [slug, parseGuide(text)]));
  const assets = new Map<string, Buffer>();
  const captureMap = new Map<string, Capture>();
  for (const capture of captures) {
    if (!/^[a-z0-9-]+$/.test(capture.id)) throw Error("Invalid capture id");
    const path = resolve(source, capture.file);
    if (!path.startsWith(resolve(source) + "/")) throw Error("Invalid capture path");
    const bytes = readFileSync(path);
    if (createHash("sha256").update(bytes).digest("hex") !== capture.sha256) {
      throw Error(`Screenshot hash mismatch: ${capture.id}`);
    }
    const file = `user-guide--capture-${capture.id}${extname(path)}`;
    assets.set(file, bytes); captureMap.set(capture.id, { ...capture, file });
  }
  function link(href: string): string | undefined {
    if (href.startsWith("/guide/") && !/\.(zip|pdf)(#.*)?$/.test(href)) {
      const [slug, anchor] = href.slice(7).split("#");
      const target = sections.get(slug);
      if (!target) throw Error(`Unknown chapter: ${slug}`);
      if (anchor && !target.some(section => section.id === anchor)) throw Error(`Unknown anchor: ${href}`);
      return `user-guide--${slug}.html${anchor ? `#${anchor}` : ""}`;
    }
    if (/^\/(?!\/)/.test(href)) return `https://granttap.com${href}`;
    return /^(https:\/\/|#)/.test(href) ? href : undefined;
  }
  const pages = chapters.map(page => ({
    page, html: renderChapter(page, sections.get(page.slug)!, captureMap, link),
  }));
  const index = chapters.map(page => ({ id: page.slug, title: page.title, summary: page.summary,
    searchText: plainText(content.get(page.slug)!), file: `user-guide--${page.slug}.html` }));
  mkdirSync(output, { recursive: true });
  for (const [file, bytes] of assets) writeFileSync(resolve(output, file), bytes);
  for (const { page, html } of pages) writeFileSync(resolve(output, `user-guide--${page.slug}.html`), html);
  writeFileSync(resolve(output, "user-guide-index.json"), JSON.stringify(index, null, 2) + "\n");
}
