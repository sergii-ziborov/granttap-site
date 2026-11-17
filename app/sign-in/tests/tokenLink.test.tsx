import { describe, expect, it } from "vitest";
import { nativeSignInLink } from "../tokenLink";

const secret = "gt_login_" + "a".repeat(43);
describe("native token handoff", () => {
  it("accepts exactly one token in the fragment without a redirect destination", () => {
    expect(nativeSignInLink("#token=" + secret)).toBe("granttap://sign-in#token=" + secret);
    for (const text of ["", "#token=bad", "?token=" + secret, "#token=" + secret + "&redirect=https://evil.test",
      "#token=" + secret + "&token=" + secret, "#token=" + secret + "%0a", "#token=" + secret + "="]) {
      expect(nativeSignInLink(text)).toBeNull();
    }
  });
});

describe("browser QR handoff", () => {
  it("passes exactly one code and browser key to the app", async () => {
    const { nativeHandoff } = await import("../tokenLink");
    const qr = "#qr=" + "a".repeat(43) + "." + "B".repeat(43);
    expect(nativeHandoff(qr)).toEqual({ kind: "qr", link: "granttap://sign-in" + qr });
    for (const text of ["#qr=" + "a".repeat(43), qr + "&x=1", "#qr=" + "a".repeat(42) + "." + "B".repeat(43), "?qr=" + qr.slice(4)]) {
      expect(nativeHandoff(text)).toBeNull();
    }
  });
});
