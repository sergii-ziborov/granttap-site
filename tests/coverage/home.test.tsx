import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Home from "../../app/page";

test("renders the Personal product journey and locale control", async () => {
  const user = userEvent.setup();
  render(await Home({ searchParams: Promise.resolve({}) }));

  expect(screen.getByRole("heading", { name: /All your coding agents/i })).toBeTruthy();
  const providers = screen.getByRole("region", { name: "Supported providers" });
  expect(within(providers).getByRole("link", { name: "Claude Code" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Codex" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Cursor Beta" })).toBeTruthy();
  expect(within(providers).getByRole("link", { name: "Grok Build · Experimental" })).toBeTruthy();
  expect(screen.getByRole("heading", { name: "Needs You" })).toBeTruthy();
  expect(screen.getByText(/codex plugin add granttap@granttap/)).toBeTruthy();
  expect(screen.getByText(/claude plugin install granttap@granttap/)).toBeTruthy();
  expect(screen.getByText(/Install GrantTap from Cursor Marketplace/)).toBeTruthy();
  expect(screen.getAllByText(/npm install -g granttap-mcp/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/Enterprise|Open account|GrantTap Web/i)).toBeNull();
  expect(screen.getByRole("img", { name: "GrantTap live task chat" })).toBeTruthy();

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

  expect(screen.getByRole("link", { name: "Switch to Russian" }).getAttribute("href")).toBe("/?lang=ru");
});

test("a Russian journal link opens the product and returns to the Russian journal", async () => {
  window.localStorage.clear();
  window.history.replaceState(null, "", "/?lang=ru");
  const view = render(await Home({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(await screen.findByRole("heading", { name: /Все ваши coding agents/i })).toBeTruthy();
  expect(within(screen.getByRole("navigation", { name: "Основная навигация" })).getByRole("link", { name: "Блог" }).getAttribute("href")).toBe("/blog?lang=ru");
  view.unmount();
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
  document.documentElement.lang = "en";
});
