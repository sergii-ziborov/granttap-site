import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { guideCatalog, guideGroups } from "../catalog";
import { guideContent, guideSearchIndex } from "..";
import { parseGuide } from "../../GuideReader/markdown";
import captures from "../screenshots.json";
import { illustrations } from "../illustrations";

describe("published handbook integrity", () => {
  it("resolves every authored chapter link, anchor and downloadable practice file", () => {
    const sections = Object.fromEntries(guideCatalog.map(page => [page.slug, parseGuide(guideContent[page.slug])]));
    expect(Object.keys(guideContent).sort()).toEqual(guideCatalog.map(page => page.slug).sort());
    for (const page of guideCatalog) {
      expect(guideGroups.some(group => group.id === page.group)).toBe(true);
      const ids = sections[page.slug].map(section => section.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const [, , href] of guideContent[page.slug].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        if (!href.startsWith("/guide/")) continue;
        const [target, anchor] = href.slice(7).split("#");
        if (target.endsWith(".zip")) {
          expect(existsSync(resolve("public/guide", target)), href).toBe(true); continue;
        }
        expect(sections[target], `${page.slug} → ${href}`).toBeDefined();
        if (anchor) expect(sections[target].some(section => section.id === anchor), href).toBe(true);
      }
      for (const section of sections[page.slug]) {
        for (const block of section.blocks) {
          if (block.kind === "capture") expect(captures.some(item => item.id === block.id)).toBe(true);
          if (block.kind === "diagram") expect(["delivery", "task", "governance"]).toContain(block.id);
        }
      }
      expect(guideSearchIndex.some(entry => entry.slug === page.slug)).toBe(true);
    }
  });
  it("ships unchanged real screenshot bytes with explicit provenance", () => {
    for (const capture of captures) {
      const bytes = readFileSync(resolve("public", capture.file.slice(1)));
      expect(createHash("sha256").update(bytes).digest("hex"), capture.id).toBe(capture.sha256);
      expect(capture.build).toBeTruthy(); expect(capture.date).toMatch(/^2026-/);
      expect(capture.width).toBeGreaterThan(300); expect(capture.caption).toBeTruthy();
    }
  });
  it("includes the separate ImageGen artwork as real optimized image assets", () => {
    for (const illustration of Object.values(illustrations)) {
      const bytes = readFileSync(resolve("public", illustration.file.slice(1)));
      expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
      expect(bytes.length).toBeGreaterThan(10_000);
      expect(illustration.alt).toContain("иллюстрация");
    }
  });
});
