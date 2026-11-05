import { expect, test } from "vitest";
import { canonicalRedirect, siteHeaders, withSecurityHeaders } from "..";

test("canonical redirects preserve the path and locale while local previews remain local", () => {
  for (const origin of ["http://granttap.com", "https://www.granttap.com", "https://granttap.serhiiright.chatgpt.site"]) {
    expect(canonicalRedirect(new URL(origin + "/blog?lang=ru"))?.href).toBe("https://granttap.com/blog?lang=ru");
  }
  expect(canonicalRedirect(new URL("https://granttap.com/blog"))).toBeUndefined();
  expect(canonicalRedirect(new URL("http://127.0.0.1:3218/blog"))).toBeUndefined();
});

test("the shared security contract retains body and response semantics without HSTS on HTTP", async () => {
  const result = withSecurityHeaders(new Request("https://granttap.com/guide"),
    new Response("fixture", { status: 201, headers: { "content-type": "text/plain", "x-fixture": "yes" } }));
  expect(result.status).toBe(201);
  expect(await result.text()).toBe("fixture");
  expect(result.headers.get("x-fixture")).toBe("yes");
  expect(result.headers.get("strict-transport-security")).toContain("includeSubDomains");
  expect(result.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  expect(result.headers.get("content-security-policy")).not.toContain("unsafe-eval");
  const insecure = withSecurityHeaders(new Request("http://granttap.com/"),
    new Response(null, { headers: { "strict-transport-security": "old" } }));
  expect(insecure.headers.get("strict-transport-security")).toBeNull();
  expect(siteHeaders(false).get("x-content-type-options")).toBe("nosniff");
});
