import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { build } from "esbuild";

mkdirSync(".runtime", { recursive: true });
const result = await build({
  entryPoints: ["hetzner/site-start.mjs"], outfile: ".runtime/site-start.mjs",
  bundle: true, format: "esm", platform: "node", target: "node22", metafile: true,
});
const externalImports = [...new Set(Object.values(result.metafile.outputs)
  .flatMap(output => output.imports.filter(item => item.external).map(item => item.path)))];
if (externalImports.some(name => !name.startsWith("node:"))) {
  throw new Error("Production server has an undeclared external runtime dependency");
}
writeFileSync(".runtime/proof.json", JSON.stringify({ externalImports,
  sha256: createHash("sha256").update(readFileSync(".runtime/site-start.mjs")).digest("hex"),
}, null, 2) + "\n");
