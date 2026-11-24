import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Home from "../../app/page";

test("renders the Personal product journey and locale control", async () => {
  const user = userEvent.setup();
  render(await Home({ searchParams: Promise.resolve({}) }));

  expect(screen.getByRole("heading", { name: /Claude Code.*Codex.*Within reach/i })).toBeTruthy();
  const providers = screen.getByRole("region", { name: "Supported providers" });
  expect(within(providers).getByRole("link", { name: "Claude Code" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Codex" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Cursor" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Grok Build" })).toBeTruthy();
  expect(screen.getAllByText("GrantTap screen · sample data").length).toBeGreaterThan(0);
  expect(screen.getByText("Mac app · sample data")).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Needs You" })).toBeTruthy();
  expect(screen.getByText(/codex plugin add granttap@granttap/)).toBeTruthy();
  expect(screen.getByText(/claude plugin install granttap@granttap/)).toBeTruthy();
  expect(screen.getByText(/Install GrantTap from Cursor Marketplace/)).toBeTruthy();
  expect(screen.getAllByText(/npm install -g granttap-mcp/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Enterprise|Open account|GrantTap Web/i)).toBeNull();
  expect(screen.getByRole("img", { name: "GrantTap Now on iPhone" })).toBeTruthy();

  const previews = screen.getAllByRole("button", { name: /Open full-size/i });
  expect(previews.length).toBeGreaterThanOrEqual(3);
  expect(screen.getByRole("button", { name: "Open full-size: Tasks" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Open full-size: Mesh" })).toBeTruthy();
  await user.click(previews[0]);
  expect(screen.getByRole("dialog", { name: "Now screenshot" })).toBeTruthy();
  expect(screen.getByRole("img", { name: "GrantTap Now, full size" })).toBeTruthy();
  await user.keyboard("a");
  expect(screen.getByRole("dialog", { name: "Now screenshot" })).toBeTruthy();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();

  await user.click(previews[1]);
  await user.click(screen.getByRole("button", { name: "Close preview" }));
  expect(screen.queryByRole("dialog")).toBeNull();

  await user.click(previews[3]);
  const usageDialog = screen.getByRole("dialog", { name: "Usage screenshot" });
  fireEvent.mouseDown(screen.getByRole("img", { name: "GrantTap Usage, full size" }));
  expect(screen.getByRole("dialog", { name: "Usage screenshot" })).toBeTruthy();
  fireEvent.mouseDown(usageDialog);
  expect(screen.queryByRole("dialog")).toBeNull();

  expect(screen.getByRole("link", { name: "RU — Switch to Russian" }).getAttribute("href")).toBe("/?lang=ru");
});

test("the home page says GrantTap is on the App Store, 1.0.5 is in review and Mac is on the Mac App Store", async () => {
  render(await Home({ searchParams: Promise.resolve({}) }));
  expect(screen.getByText("Now on the App Store for iPhone and iPad")).toBeTruthy();
  expect(screen.getByText(/Version 1\.0\.4 · Free download/)).toBeTruthy();
  expect(screen.getByRole("link", { name: "What’s new ↓" }).getAttribute("href")).toBe("#whats-new");
  const news = screen.getByRole("region", { name: "What’s new in GrantTap\u00a01.0.4" });
  expect(within(news).getAllByRole("article")).toHaveLength(3);
  expect(within(news).getByText(/on the App Store since November 13, 2026\. Version 1\.0\.4 arrived on November 23, 2026/)).toBeTruthy();
  expect(within(news).getByRole("link", { name: "Download on the App Store" }).getAttribute("href")).toBe("https://apps.apple.com/app/id6809739366");
  expect(within(news).getByRole("heading", { name: "GrantTap MCP 0.8.203" })).toBeTruthy();
  expect(within(news).getByText("On npm for your computer")).toBeTruthy();
  expect(within(news).getByRole("link", { name: "See the full version history →" }).getAttribute("href")).toBe("/support#version-history");
  expect(within(news).getByText("Version 1.0.5 in App Review")).toBeTruthy();
  expect(within(news).queryByText("After Apple approves it")).toBeNull();
  const availability = document.getElementById("availability")!;
  expect(within(availability).getByRole("heading", { name: "Get GrantTap on the App Store." })).toBeTruthy();
  expect(within(availability).getByText(/Mac: GrantTap 1\.0\.1 is now on the Mac App Store, with Mac Local as a one-time purchase in the app\. Version 1\.0\.6 for Mac.*is in App Review\./)).toBeTruthy();
  expect(screen.queryByText(/^GrantTap (for Mac )?is available by TestFlight invitation/)).toBeNull();
  expect(screen.getByText("GrantTap on Mac · On the Mac App Store")).toBeTruthy();
  expect(screen.queryByText("GrantTap on Mac · In App Review")).toBeNull();
});

test("a Russian journal link opens the product and returns to the Russian journal", async () => {
  window.localStorage.clear();
  window.history.replaceState(null, "", "/?lang=ru");
  const view = render(await Home({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(await screen.findByRole("heading", { name: /Claude Code.*Codex/i })).toBeTruthy();
  expect(within(screen.getByRole("navigation", { name: "Основная навигация" })).getByRole("link", { name: "Блог" }).getAttribute("href")).toBe("/blog?lang=ru");
  view.unmount();
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
  document.documentElement.lang = "en";
});
