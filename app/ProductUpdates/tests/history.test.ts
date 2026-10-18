// @vitest-environment node
import { describe, expect, it } from "vitest";
import { customerDocument } from "../../ProductInformation";

describe("published version history", () => {
  it("is available in both customer help documents with application and helper versions", () => {
    for (const locale of ["en", "ru"] as const) {
      const help = customerDocument("support", locale);
      const section = help.sections.find(s => s.heading === (locale === "ru" ? "История версий" : "Version history"));
      expect(section).toBeDefined();
      expect(section?.bullets?.join(" ")).toContain("201");
      expect(section?.bullets?.join(" ")).toContain("202");
      expect(section?.bullets?.join(" ")).toContain("0.8.75");
      expect(section?.bullets?.join(" ")).toContain("199");
      expect(section?.bullets?.join(" ")).toContain("0.8.74");
      expect(section?.links?.[0].href).toContain("/granttap-mcp");
    }
  });
});
