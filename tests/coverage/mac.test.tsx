import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import MacPage, { generateMetadata } from "../../app/mac/page";

test("Mac page shows real demo captures and explains both connection paths", async () => {
  render(await MacPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: "GrantTap for Mac" })).toBeTruthy();
  expect(screen.getByText(/available to invited internal testers through TestFlight/)).toBeTruthy();
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
  expect(screen.getByText(/доступен приглашённым внутренним тестировщикам через TestFlight/)).toBeTruthy();
  expect(screen.getByText(/одноразовым QR/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "Переключить на английский" }).getAttribute("href"))
    .toBe("/mac");
  expect((await generateMetadata({ searchParams: Promise.resolve({ lang: "ru" }) })).alternates?.canonical)
    .toBe("/mac?lang=ru");
});
