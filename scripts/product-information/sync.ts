import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { customerDocument, type ProductDocumentName } from "../../app/ProductInformation";

const names: ProductDocumentName[] = ["support", "terms", "privacy", "licenses", "pricing"];
const apple = process.argv.indexOf("--apple-root");
const output = apple >= 0
  ? resolve(process.argv[apple + 1], "apps/ios/GrantTap/Features/ProductInformation/Resources")
  : resolve("public/product-information");
mkdirSync(output, { recursive: true });
for (const name of names) {
  for (const locale of ["en", "ru"] as const) {
    const document = customerDocument(name, locale);
    if (/\{\{[A-Z_]+\}\}/.test(JSON.stringify(document))) throw Error("Unresolved product copy");
    writeFileSync(resolve(output, `Product-${name}-${locale}.json`), JSON.stringify(document, null, 2) + "\n");
  }
}
console.log(`Exported ${names.length * 2} resolved customer documents.`);
