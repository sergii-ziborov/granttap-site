import { expect, test, vi } from "vitest";
import sitemap from "../../app/sitemap";

test("sitemap includes released articles and adds each future story on its date", () => {
  vi.useFakeTimers();
  try {
    vi.setSystemTime(new Date("2026-10-03T12:00:00Z"));
    const first = sitemap().map(entry => entry.url);
    expect(first).toContain("https://granttap.com/blog/why-granttap-is-a-control-center");
    expect(first).not.toContain("https://granttap.com/blog/coding-agents-on-your-phone-2026");
    vi.setSystemTime(new Date("2026-10-31T12:00:00Z"));
    const complete = sitemap().map(entry => entry.url);
    expect(complete).toContain("https://granttap.com/blog/cortex-loom-evidence-per-token");
    expect(complete.filter(url => url.startsWith("https://granttap.com/blog/"))).toHaveLength(10);
  } finally {
    vi.useRealTimers();
  }
});
