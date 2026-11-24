import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import MacPage, { generateMetadata } from "../../app/mac/page";

test("Mac page shows real demo captures and explains both connection paths", async () => {
  render(await MacPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: "GrantTap for Mac" })).toBeTruthy();
  expect(screen.getByText("Mac · On the Mac App Store")).toBeTruthy();
  expect(screen.getByText(/GrantTap 1\.0\.1 for Mac is a free download on the Mac App Store\. Subscriptions and the one-time Mac Local purchase are made through Apple in the app\. Version 1\.0\.6 was submitted to App Review on November 24, 2026\. The same App Store app runs on iPhone and iPad/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Download on the Mac App Store" }).getAttribute("href")).toBe("https://apps.apple.com/app/id6809739366");
  expect(screen.queryByRole("link", { name: /TestFlight/ })).toBeNull();
  expect(screen.queryByText(/for Mac is in App Review/)).toBeNull();
  const gallery = screen.getByRole("heading", { name: "The real Mac app" }).parentElement;
  expect(gallery).not.toBeNull();
  expect(within(gallery!).getAllByRole("img")).toHaveLength(5);
  expect(screen.getByText(/one-time QR/)).toBeTruthy();
  expect(screen.getByRole("link", { name: /Mac source and build instructions/ }).getAttribute("href"))
    .toBe("https://github.com/sergii-ziborov/granttap/tree/main/apps/macos");
  expect((await generateMetadata({ searchParams: Promise.resolve({}) })).alternates?.canonical).toBe("/mac");
});

test("Mac page localizes content and canonical metadata for Russian", async () => {
  render(await MacPage({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(screen.getByRole("heading", { name: "GrantTap для Mac" })).toBeTruthy();
  expect(screen.getByText("Mac · в Mac App Store")).toBeTruthy();
  expect(screen.getByText(/GrantTap 1\.0\.1 для Mac — бесплатная загрузка в Mac App Store\. Подписки и разовая покупка Mac Local оформляются через Apple в приложении\. Версия 1\.0\.6 отправлена в App Review 24 ноября 2026\./)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Загрузить в Mac App Store" }).getAttribute("href")).toBe("https://apps.apple.com/app/id6809739366");
  expect(screen.queryByRole("link", { name: /TestFlight/ })).toBeNull();
  expect(screen.getByText(/одноразовым QR/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "EN — Переключить на английский" }).getAttribute("href"))
    .toBe("/mac");
  expect((await generateMetadata({ searchParams: Promise.resolve({ lang: "ru" }) })).alternates?.canonical)
    .toBe("/mac?lang=ru");
});
