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
      expect(section?.bullets?.[0]).toContain("208");
      expect(section?.bullets?.join(" ")).toContain("0.8.83");
      expect(section?.bullets?.join(" ")).toContain("Engine 0.1.2");
      expect(section?.bullets?.join(" ")).toContain("0.8.82");
      expect(section?.bullets?.join(" ")).toContain("0.8.81");
      expect(section?.bullets?.join(" ")).toContain("206");
      expect(section?.bullets?.join(" ")).toContain("0.8.80");
      expect(section?.bullets?.join(" ")).toContain("0.8.79");
      expect(section?.bullets?.join(" ")).toContain("0.8.78");
      expect(section?.bullets?.join(" ")).toContain("0.8.77");
      expect(section?.bullets?.join(" ")).toContain("205");
      expect(section?.bullets?.join(" ")).toContain("204");
      expect(section?.bullets?.join(" ")).toContain("203");
      expect(section?.bullets?.join(" ")).toContain("0.8.75");
      expect(section?.bullets?.join(" ")).toContain("199");
      expect(section?.bullets?.join(" ")).toContain("0.8.74");
      expect(section?.links?.[0].href).toContain("/granttap-mcp/v/0.8.83");
    }
  });
});
