// @vitest-environment node
import { describe, expect, it } from "vitest";
import { releaseAvailability } from "../../ProductOffer";
import { versionHistory } from "..";
import { whatsNew } from "../whatsNew";

describe("what's new", () => {
  it.each(["en", "ru"] as const)("names the published version and keeps the next update unreleased in %s", locale => {
    const news = whatsNew(locale);
    const [app, computer, next] = news.columns;
    expect(news.columns.map(column => column.key)).toEqual(["app", "computer", "next"]);
    expect(news.title).toContain(releaseAvailability.ios.version);
    expect(app.label).toContain(releaseAvailability.ios.version);
    expect(app.status).toMatch(/App Store/);
    expect(computer.label).toContain("0.8.195");
    expect(next.status).not.toMatch(/App Store|npm/);
    expect(next.label).not.toMatch(/\d+\.\d+\.\d+/);
    expect(news.mac).toContain("App Review");
    expect(news.mac).toContain("TestFlight");
    for (const column of news.columns) expect(column.items).toHaveLength(4);
  });

  it("matches the version history for the published release and helper", () => {
    for (const locale of ["en", "ru"] as const) {
      const bullets = versionHistory(locale).bullets!;
      const release = bullets.find(bullet => bullet.includes(`${releaseAvailability.ios.version} (`))!;
      expect(release).toContain("App Store");
      expect(bullets[0]).toContain("0.8.195");
      expect(versionHistory(locale).links![0].href).toContain("0.8.195");
    }
    expect(releaseAvailability.ios.publishedOn).toBe("2026-11-18");
    expect(releaseAvailability.mac.state).toBe("review");
  });
});
