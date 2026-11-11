import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import IPhonePage, { generateMetadata } from "../../app/iphone/page";
import { appStoreListingURL, availabilityNote, installationAction, releaseAvailability } from "../../app/ProductOffer";

test("iPhone page explains the App Review state, shows real captures and answers common questions", async () => {
  const { container } = render(await IPhonePage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { level: 1, name: "GrantTap for iPhone" })).toBeTruthy();
  expect(screen.getByText(/submitted to App Review on November 11, 2026/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Request an invitation" }).getAttribute("href")).toBe("/support#contact");
  const gallery = screen.getByRole("heading", { name: "The real app" }).parentElement!;
  expect(within(gallery).getAllByRole("img")).toHaveLength(6);
  expect(screen.getByText("Does GrantTap include an AI model?")).toBeTruthy();
  const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!);
  const types = data["@graph"].map((item: { "@type": string }) => item["@type"]);
  expect(types).toEqual(["MobileApplication", "FAQPage", "BreadcrumbList"]);
  expect(data["@graph"][0].offers).toEqual({ "@type": "Offer", price: "0", priceCurrency: "USD" });
  expect(data["@graph"][0]).not.toHaveProperty("downloadUrl");
  expect(data["@graph"][1].mainEntity).toHaveLength(5);
});

test("iPhone metadata has a full title, self canonical and no Smart App Banner before release", async () => {
  const en = await generateMetadata({ searchParams: Promise.resolve({}) });
  expect(en.title).toEqual({ absolute: "GrantTap for iPhone: Claude Code and Codex on your phone" });
  expect(en.alternates?.canonical).toBe("/iphone");
  expect(en.other).toBeUndefined();
  const ru = await generateMetadata({ searchParams: Promise.resolve({ lang: "ru" }) });
  expect(ru.alternates?.canonical).toBe("/iphone?lang=ru");
  render(await IPhonePage({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(screen.getByRole("heading", { level: 1, name: "GrantTap для iPhone" })).toBeTruthy();
  expect(screen.getByText(/отправлен в App Review 11 ноября 2026/)).toBeTruthy();
});

test("A published store URL turns every install action into the App Store link", () => {
  const ios = releaseAvailability.ios as { storeURL: string | null; state: string };
  const saved = { ...ios };
  try {
    ios.storeURL = appStoreListingURL; ios.state = "live";
    expect(installationAction("en")).toEqual({ href: "https://apps.apple.com/app/id6809739366", label: "Download on the App Store" });
    expect(availabilityNote("ru")).toMatch(/бесплатная загрузка в App Store/);
  } finally { Object.assign(ios, saved); }
  expect(installationAction("en").label).toBe("Request an invitation");
  expect(availabilityNote("en", "mac")).toMatch(/TestFlight invitation/);
});
