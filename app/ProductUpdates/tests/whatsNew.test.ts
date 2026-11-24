// @vitest-environment node
import { describe, expect, it } from "vitest";
import { releaseAvailability } from "../../ProductOffer";
import { versionHistory } from "..";
import { whatsNew } from "../whatsNew";

describe("what's new", () => {
  it.each(["en", "ru"] as const)("names the published version and keeps the next update in review in %s", locale => {
    const news = whatsNew(locale);
    const [app, computer, next] = news.columns;
    expect(news.columns.map(column => column.key)).toEqual(["app", "computer", "next"]);
    expect(news.title).toContain(releaseAvailability.ios.version);
    expect(app.label).toContain(releaseAvailability.ios.version);
    expect(app.status).toMatch(/App Store/);
    expect(computer.label).toContain("0.8.203");
    expect(next.status).not.toMatch(/App Store|npm/);
    expect(next.status).toContain("App Review");
    expect(next.status).toContain(releaseAvailability.ios.inReview!.version);
    expect(next.label).not.toMatch(/\d+\.\d+\.\d+/);
    expect(news.mac).toContain("Mac App Store");
    expect(news.mac).toContain(`${releaseAvailability.mac.inReview!.version} `);
    expect(news.mac).toContain("App Review");
    expect(news.mac).not.toContain("TestFlight");
    for (const column of news.columns) expect(column.items).toHaveLength(4);
  });

  it("matches the version history for the published releases, the version in review and the helper", () => {
    for (const locale of ["en", "ru"] as const) {
      const bullets = versionHistory(locale).bullets!;
      const release = bullets.find(bullet => bullet.includes(`${releaseAvailability.ios.version} (`))!;
      expect(release).toContain("App Store");
      const review = bullets.find(bullet => bullet.includes(`${releaseAvailability.ios.inReview!.version} (`))!;
      expect(review).toContain("App Review");
      expect(review).not.toContain("App Store ·");
      const mac = bullets.find(bullet => bullet.includes(`${releaseAvailability.mac.version} (`) && bullet.includes("Mac"))!;
      expect(mac).toContain("Mac App Store");
      expect(bullets[0]).toContain("0.8.203");
      expect(versionHistory(locale).links![0].href).toContain("0.8.203");
    }
    expect(releaseAvailability.ios.publishedOn).toBe("2026-11-23");
    expect(releaseAvailability.mac).toMatchObject({ state: "live", publishedOn: "2026-11-24", firstPublishedOn: "2026-11-24" });
    expect(releaseAvailability.macLocalPurchase).toBe("live");
  });
});
