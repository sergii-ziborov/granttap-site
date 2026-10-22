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
