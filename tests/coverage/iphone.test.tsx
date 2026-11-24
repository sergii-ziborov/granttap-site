import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import IPhonePage, { generateMetadata } from "../../app/iphone/page";
import { appStoreListingURL, availabilityNote, installationAction, releaseAvailability } from "../../app/ProductOffer";

test("iPhone page links the App Store release, shows real captures and answers common questions", async () => {
  const { container } = render(await IPhonePage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { level: 1, name: "GrantTap for iPhone" })).toBeTruthy();
  expect(screen.getByText(/1\.0\.4 for iPhone and iPad is a free download on the App Store\. .*Version 1\.0\.5 was submitted to App Review on November 23, 2026\./)).toBeTruthy();
  expect(screen.queryByText(/for iPhone and iPad (is in|was submitted to) App Review/)).toBeNull();
  const installs = screen.getAllByRole("link", { name: "Download on the App Store" });
  expect(installs.length).toBeGreaterThanOrEqual(2);
  expect(installs.every(link => link.getAttribute("href") === appStoreListingURL)).toBe(true);
  const news = screen.getByRole("region", { name: "What’s new in GrantTap\u00a01.0.4" });
  expect(within(news).getByRole("heading", { name: "iPhone and iPad · 1.0.4" })).toBeTruthy();
  expect(within(news).getByText("On the App Store")).toBeTruthy();
  expect(within(news).getByRole("heading", { name: "Next iPhone update" })).toBeTruthy();
  expect(within(news).getByText("Version 1.0.5 in App Review")).toBeTruthy();
  expect(within(news).getByText(/Mac: GrantTap 1\.0\.1 is now on the Mac App Store.*Version 1\.0\.6 for Mac.*is in App Review/)).toBeTruthy();
  const gallery = screen.getByRole("heading", { name: "The real app" }).parentElement!;
  expect(within(gallery).getAllByRole("img")).toHaveLength(6);
  expect(screen.getByText("Does GrantTap include an AI model?")).toBeTruthy();
  const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
  const types = data["@graph"].map((item: { "@type": string }) => item["@type"]);
  expect(types).toEqual(["MobileApplication", "FAQPage", "BreadcrumbList"]);
  expect(data["@graph"][0].offers).toEqual({ "@type": "Offer", price: "0", priceCurrency: "USD" });
  expect(data["@graph"][0].downloadUrl).toBe(appStoreListingURL);
  expect(data["@graph"][1].mainEntity).toHaveLength(5);
});

test("iPhone metadata has a full title, self canonical and the Smart App Banner after release", async () => {
  const en = await generateMetadata({ searchParams: Promise.resolve({}) });
  expect(en.title).toEqual({ absolute: "GrantTap for iPhone: Claude Code and Codex on your phone" });
  expect(en.alternates?.canonical).toBe("/iphone");
  expect(en.other).toEqual({ "apple-itunes-app": "app-id=6809739366" });
  const ru = await generateMetadata({ searchParams: Promise.resolve({ lang: "ru" }) });
  expect(ru.alternates?.canonical).toBe("/iphone?lang=ru");
  render(await IPhonePage({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(screen.getByRole("heading", { level: 1, name: "GrantTap для iPhone" })).toBeTruthy();
  expect(screen.getByText(/бесплатная загрузка в App Store/)).toBeTruthy();
  expect(screen.queryByText(/для iPhone и iPad (на проверке|отправлена в) App Review/)).toBeNull();
});

test("Without a published store URL every install action falls back to an invitation; with one, each platform names its store", () => {
  const ios = releaseAvailability.ios as { storeURL: string | null; state: string };
  const saved = { ...ios };
  expect(installationAction("en")).toEqual({ href: "https://apps.apple.com/app/id6809739366", label: "Download on the App Store" });
  try {
    ios.storeURL = null; ios.state = "invitation";
    expect(installationAction("en")).toEqual({ href: "/support#contact", label: "Request a TestFlight invitation" });
    expect(availabilityNote("ru")).toMatch(/по приглашению в TestFlight/);
  } finally { Object.assign(ios, saved); }
  expect(installationAction("en", "mac")).toEqual({ href: appStoreListingURL, label: "Download on the Mac App Store" });
  expect(availabilityNote("en", "mac")).toBe("GrantTap 1.0.1 for Mac is a free download on the Mac App Store. "
    + "Subscriptions and the one-time Mac Local purchase are made through Apple in the app. "
    + "Version 1.0.6 was submitted to App Review on November 24, 2026.");
  const mac = releaseAvailability.mac as { storeURL: string | null; state: string };
  const savedMac = { ...mac };
  try {
    mac.storeURL = null; mac.state = "review";
    expect(installationAction("en", "mac").label).toBe("Request a TestFlight invitation");
    expect(availabilityNote("en", "mac")).toBe("GrantTap 1.0.1 for Mac is in App Review, submitted on November 15, 2026. "
      + "Until Apple approves it, the app is available by TestFlight invitation.");
  } finally { Object.assign(mac, savedMac); }
});
