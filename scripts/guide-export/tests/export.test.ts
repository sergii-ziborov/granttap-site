import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { exportGuide } from "../index";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "granttap-guide-export-"));
  const source = join(root, "source"); const output = join(root, "output");
  mkdirSync(join(source, "articles"), { recursive: true });
  mkdirSync(join(source, "assets"));
  const image = Buffer.from("witnessed screenshot fixture");
  writeFileSync(join(source, "assets", "sample.png"), image);
  writeFileSync(join(source, "catalog.json"), JSON.stringify([
    { slug: "start", title: "Start <here>", summary: "Offline & safe" },
    { slug: "next", title: "Next", summary: "More" },
  ]));
  writeFileSync(join(source, "screenshots.json"), JSON.stringify([
    { id: "sample", file: "assets/sample.png", title: "Sample", caption: "Demo only",
      build: "250", date: "2026-11-04", sha256: createHash("sha256").update(image).digest("hex") },
  ]));
  writeFileSync(join(source, "articles", "start.md"), [
    "## First {#first}", "[Next](/guide/next#result) and [Terms](/terms).",
    "<script>alert(1)</script> [Unsafe](javascript:alert)", ":::capture sample",
    ":::diagram delivery", ":::check Verify", "**Preserved** text", ":::",
    "- One", "- Two", "| A | B |", "|---|---|", "| 1 | 2 |",
    "```txt", "<untrusted>", "```",
  ].join("\n"));
  writeFileSync(join(source, "articles", "next.md"), "## Result {#result}\nSearchable receipt.");
  return { root, source, output };
}

test("exports an offline searchable guide with local links and original images", () => {
  const f = fixture();
  try {
    exportGuide(f.source, f.output);
    const index = JSON.parse(readFileSync(join(f.output, "user-guide-index.json"), "utf8"));
    assert.equal(index.length, 2);
    assert.match(index[1].searchText, /Searchable receipt/);
    const html = readFileSync(join(f.output, index[0].file), "utf8");
    assert.match(html, /href="user-guide--next.html#result"/);
    assert.match(html, /href="https:\/\/granttap.com\/terms"/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script|href="javascript:|src="https:\/\//);
    assert.match(html, /Content-Security-Policy/);
    assert.match(html, /build 250/);
    assert.match(html, /<table>/);
    assert.match(html, /&lt;untrusted&gt;/);
    assert.deepEqual(readFileSync(join(f.output, "user-guide--capture-sample.png")),
      readFileSync(join(f.source, "assets", "sample.png")));
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("rejects changed screenshot bytes and unresolved internal chapter links", () => {
  const f = fixture();
  try {
    writeFileSync(join(f.source, "assets", "sample.png"), "changed");
    assert.throws(() => exportGuide(f.source, f.output), /Screenshot hash/);
    writeFileSync(join(f.source, "screenshots.json"), "[]");
    writeFileSync(join(f.source, "articles", "start.md"), "[Missing](/guide/missing#where)");
    assert.throws(() => exportGuide(f.source, f.output), /Unknown chapter/);
    writeFileSync(join(f.source, "articles", "start.md"), "[Missing](/guide/next#absent)");
    assert.throws(() => exportGuide(f.source, f.output), /Unknown anchor/);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});
