import { expect, test, vi } from "vitest";
import sitemap from "../../app/sitemap";

test("sitemap includes the full journal as stories become available", () => {
  vi.useFakeTimers();
  try {
    vi.setSystemTime(new Date("2026-10-03T12:00:00Z"));
    const first = sitemap().map(entry => entry.url);
    expect(first).toContain("https://granttap.com/blog/why-granttap-is-a-control-center");
    expect(first).toContain("https://granttap.com/blog/coding-agents-on-your-phone-2026");
    expect(first.filter(url => url.startsWith("https://granttap.com/blog/"))).toHaveLength(10);
    vi.setSystemTime(new Date("2026-10-04T12:00:00Z"));
    const complete = sitemap().map(entry => entry.url);
    expect(complete).toContain("https://granttap.com/blog/cortex-loom-evidence-per-token");
    expect(complete.filter(url => url.startsWith("https://granttap.com/blog/"))).toHaveLength(13);
    vi.setSystemTime(new Date("2026-10-05T12:00:00Z"));
    const expanded = sitemap().map(entry => entry.url);
    expect(expanded).toContain("https://granttap.com/blog/local-cloud-hybrid-agent-boundaries");
    expect(expanded.filter(url => url.startsWith("https://granttap.com/blog/"))).toHaveLength(15);
  } finally {
    vi.useRealTimers();
  }
});
