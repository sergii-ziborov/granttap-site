import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import IPhonePage, { generateMetadata } from "../../app/iphone/page";
import { appStoreListingURL, availabilityNote, installationAction, releaseAvailability } from "../../app/ProductOffer";

test("iPhone page links the App Store release, shows real captures and answers common questions", async () => {
  const { container } = render(await IPhonePage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { level: 1, name: "GrantTap for iPhone" })).toBeTruthy();
  expect(screen.getByText(/1\.0\.1 for iPhone and iPad is a free download on the App Store/)).toBeTruthy();
  expect(screen.queryByText(/was submitted to App Review/)).toBeNull();
  expect(screen.getByRole("link", { name: "Download on the App Store" }).getAttribute("href")).toBe(appStoreListingURL);
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
  expect(screen.queryByText(/отправлена в App Review/)).toBeNull();
});

test("Without a published store URL every install action falls back to an invitation", () => {
  const ios = releaseAvailability.ios as { storeURL: string | null; state: string };
  const saved = { ...ios };
  expect(installationAction("en")).toEqual({ href: "https://apps.apple.com/app/id6809739366", label: "Download on the App Store" });
  try {
    ios.storeURL = null; ios.state = "invitation";
    expect(installationAction("en")).toEqual({ href: "/support#contact", label: "Request an invitation" });
    expect(availabilityNote("ru")).toMatch(/по приглашению в TestFlight/);
  } finally { Object.assign(ios, saved); }
  expect(installationAction("en", "mac").label).toBe("Request an invitation");
  expect(availabilityNote("en", "mac")).toBe("GrantTap 1.0.1 for Mac was submitted to App Review on November 15, 2026. "
    + "Until Apple publishes it, builds are available by TestFlight invitation.");
});
