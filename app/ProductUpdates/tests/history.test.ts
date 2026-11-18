// @vitest-environment node
import { describe, expect, it } from "vitest";
import { customerDocument } from "../../ProductInformation";

describe("published version history", () => {
  it("is available in both customer help documents with application and helper versions", () => {
    for (const locale of ["en", "ru"] as const) {
      const help = customerDocument("support", locale);
      const section = help.sections.find(s => s.heading === (locale === "ru" ? "История версий" : "Version history"));
      expect(section).toBeDefined();
      expect(section?.id).toBe("version-history");
      expect(section?.bullets?.join(" ")).toContain("201");
      expect(section?.bullets?.join(" ")).toContain("202");
      expect(section?.paragraphs?.[0]).toContain("App Store");
      expect(section?.paragraphs?.[0]).toContain("1.0.2");
      expect(section?.bullets?.[0]).toContain("0.8.193");
      expect(section?.bullets?.[0]).toContain("0.8.195");
      expect(section?.bullets?.[1]).toContain("1.0.2");
      expect(section?.bullets?.[1]).toContain("295");
      expect(section?.bullets?.[1]).toContain("App Store");
      expect(section?.bullets?.[1]).toContain("App Review");
      expect(section?.bullets?.[2]).toContain("0.8.190");
      expect(section?.bullets?.[2]).toContain("0.8.192");
      expect(section?.bullets?.[3]).toContain("0.8.189");
      expect(section?.bullets?.[3]).toContain("297");
      expect(section?.bullets?.[4]).toContain("0.8.188");
      expect(section?.bullets?.[4]).toContain("296");
      expect(section?.bullets?.[5]).toContain("0.8.187");
      expect(section?.bullets?.[5]).toContain("Engine 0.1.8");
      expect(section?.bullets?.[6]).toContain("0.8.178");
      expect(section?.bullets?.[7]).toContain("1.0.1");
      expect(section?.bullets?.[7]).toContain("291");
      expect(section?.bullets?.[7]).toContain("App Review");
      expect(section?.bullets?.[8]).toContain("289");
      expect(section?.bullets?.[8]).toContain("App Store");
      expect(section?.bullets?.[9]).toContain("0.8.177");
      expect(section?.bullets?.[12]).toContain("App Store");
      expect(section?.bullets?.[12]).toContain("273");
      expect(section?.bullets?.[14]).toContain("0.8.167");
      expect(section?.bullets?.[15]).toContain("273");
      expect(section?.bullets?.[16]).toContain("0.8.166");
      expect(section?.bullets?.[17]).toContain("0.8.165");
      expect(section?.bullets?.join(" ")).toContain("250");
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
      expect(section?.links?.[0].href).toContain("/granttap-mcp/v/0.8.195");
    }
  });
});
