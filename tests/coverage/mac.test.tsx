import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import MacPage, { generateMetadata } from "../../app/mac/page";

test("Mac page shows real demo captures and explains both connection paths", async () => {
  render(await MacPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: "GrantTap for Mac" })).toBeTruthy();
  expect(screen.getByText(/GrantTap 1\.0\.1 for Mac is in App Review, submitted on November 15, 2026\. Until Apple approves it, the app is available by TestFlight invitation\. GrantTap for iPhone and iPad is already on the App Store as a free download/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Request a TestFlight invitation" }).getAttribute("href")).toBe("/support#contact");
  expect(screen.getByRole("link", { name: "Get GrantTap for iPhone and iPad" }).getAttribute("href")).toBe("https://apps.apple.com/app/id6809739366");
  expect(screen.queryByText(/Mac (is|is now) (on|available on) the App Store/)).toBeNull();
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
  expect(screen.getByText(/GrantTap 1\.0\.1 для Mac на проверке App Review с 15 ноября 2026\. Пока Apple не одобрит версию, приложение доступно по приглашению в TestFlight\./)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Запросить приглашение в TestFlight" }).getAttribute("href")).toBe("/support?lang=ru#contact");
  expect(screen.getByText(/одноразовым QR/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "EN — Переключить на английский" }).getAttribute("href"))
    .toBe("/mac");
  expect((await generateMetadata({ searchParams: Promise.resolve({ lang: "ru" }) })).alternates?.canonical)
    .toBe("/mac?lang=ru");
});
