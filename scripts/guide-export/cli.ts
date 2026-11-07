import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { guideCatalog } from "../../app/guide/GuideContent/catalog";
import { exportGuide } from "./index";

const apple = process.argv.indexOf("--apple-root");
if (apple < 0 || !process.argv[apple + 1]) throw Error("Usage: npm run guide:export -- --apple-root /path/to/apple/repository");
const output = resolve(process.argv[apple + 1], "apps/ios/GrantTap/Features/Learn/UserGuide/Resources");
const source = mkdtempSync(resolve(tmpdir(), "granttap-offline-guide-"));
try {
  cpSync("app/guide/GuideContent/articles", resolve(source, "articles"), { recursive: true });
  const captures = JSON.parse(readFileSync("app/guide/GuideContent/screenshots.json", "utf8"));
  mkdirSync(resolve(source, "assets"));
  for (const capture of captures) {
    const original = resolve("public", capture.file.slice(1));
    const file = `assets/${capture.id}${original.slice(original.lastIndexOf("."))}`;
    cpSync(original, resolve(source, file)); capture.file = file;
  }
  writeFileSync(resolve(source, "catalog.json"), JSON.stringify(guideCatalog));
  writeFileSync(resolve(source, "screenshots.json"), JSON.stringify(captures));
  exportGuide(source, output);
  console.log(`Exported ${guideCatalog.length} chapters and ${captures.length} verified screenshots.`);
} finally { rmSync(source, { recursive: true, force: true }); }
