// @vitest-environment node
import { describe, expect, it } from "vitest";
import { customerDocument, documentProps, type ProductDocumentName } from "..";
import { launchOffer, localizedProductPath, monthlyPlansSummary, usdPrice } from "../../ProductOffer";

const names: ProductDocumentName[] = ["support", "pricing", "terms", "privacy", "licenses"];

describe("the same customer documents on the website and offline Apple clients", () => {
  it.each(names)("resolves %s in both languages without stale price placeholders", name => {
    for (const locale of ["en", "ru"] as const) {
      const doc = customerDocument(name, locale);
      expect(doc.sections.length).toBeGreaterThanOrEqual(3);
      expect(doc.title.length).toBeGreaterThan(0);
      expect(JSON.stringify(doc)).not.toMatch(/\{\{[A-Z_]+\}\}/);
      for (const section of doc.sections) {
        for (const link of section.links ?? []) {
          if (link.href.startsWith("/") && locale === "ru") expect(link.href).toContain("lang=ru");
        }
      }
      const props = documentProps(name);
      expect(props.intro[locale]).toBe(doc.intro);
      expect(props.sections[locale]).toEqual(doc.sections);
      expect(props.updatedISO).toBe(doc.updated);
    }
  });

  it("explains all three launch plans and the separate one-time purchase", () => {
    expect(launchOffer.plans.map(p => [p.label, p.usdCents, p.computers])).toEqual([
      ["Personal", 399, 2], ["Personal Plus", 699, 5], ["Fleet", 1199, 15],
    ]);
    const doc = customerDocument("pricing", "en");
    for (const plan of launchOffer.plans) {
      expect(doc.sections.find(s => s.heading === plan.label)?.paragraphs?.join(" "))
        .toContain(usdPrice(plan.usdCents));
    }
    expect(customerDocument("support", "en").sections.map(s => s.paragraphs?.join(" ")).join(" "))
      .toContain(monthlyPlansSummary("en"));
  });

  it("ships current credential-free connection illustrations and keeps language links stable", () => {
    for (const locale of ["en", "ru"] as const) {
      expect(customerDocument("support", locale).sections.flatMap(s => s.image ? [s.image.name] : []))
        .toEqual(["help-devices", "help-scan-qr"]);
    }
    expect(localizedProductPath("/support?topic=pairing#contact", "ru"))
      .toBe("/support?topic=pairing&lang=ru#contact");
    expect(localizedProductPath("/support?lang=ru#contact", "ru"))
      .toBe("/support?lang=ru#contact");
  });
});
