import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import AccessibilityPage from "../../app/accessibility/page";
import ClaudeCodePage from "../../app/agents/claude-code/page";
import CodexPage from "../../app/agents/codex/page";
import CursorPage from "../../app/agents/cursor/page";
import GrokBuildPage from "../../app/agents/grok-build/page";
import AppleWatchPage from "../../app/apple-watch-coding-agents/page";
import DataRightsPage from "../../app/data-rights/page";
import GrokBotPage from "../../app/grok-bot/page";
import LicensesPage from "../../app/licenses/page";
import PricingPage from "../../app/pricing/page";
import PrivacyPage from "../../app/privacy/page";
import ProjectMeshPage from "../../app/project-mesh/page";
import SecurityPage from "../../app/security/page";
import SupportPage from "../../app/support/page";
import TermsPage from "../../app/terms/page";

const pages = [
  ["Accessibility", AccessibilityPage], ["Data choices and deletion", DataRightsPage],
  ["Licenses and notices", LicensesPage], ["Choose how many computers to connect.", PricingPage],
  ["Privacy Policy", PrivacyPage], ["Security", SecurityPage], ["Support", SupportPage], ["Terms of Use", TermsPage],
] as const;

const guides = [
  ["Claude Code, visible beyond the terminal.", ClaudeCodePage],
  ["Codex tasks, connected to the same human.", CodexPage],
  ["Bring Cursor work into the same Task view.", CursorPage],
  ["Keep Grok Build work in view.", GrokBuildPage],
  ["The wrist is for the decision, not the whole terminal.", AppleWatchPage],
  ["Grok Bot is a participant, not a provider shortcut.", GrokBotPage],
  ["One Task can outlive one agent session.", ProjectMeshPage],
] as const;

describe("public legal and support pages", () => {
  test.each(pages)("renders %s with its customer-facing content", async (title, Page) => {
    render(await Page());
    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeTruthy();
    expect(screen.getByRole("link", { name: "GrantTap home" }).getAttribute("href")).toBe("/");
  });

  test.each(guides)("renders guide %s with capability boundaries", (title, Page) => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "What works", level: 2 })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Honest limits", level: 2 })).toBeTruthy();
  });

  test("shows provider capability limits without implying feature parity", () => {
    const cursor = render(<CursorPage />);
    expect(screen.getByText("Available with defined limits")).toBeTruthy();
    cursor.unmount();
    render(<GrokBuildPage />);
    expect(screen.getByText("Available where the local runtime supports it")).toBeTruthy();
  });

  test("Russian legal URLs render Russian immediately and expose a crawlable English link", async () => {
    render(await PrivacyPage({ searchParams: Promise.resolve({ lang: "ru" }) }));
    expect(screen.getByRole("heading", { name: "Политика конфиденциальности", level: 1 })).toBeTruthy();
    expect(screen.getByRole("link", { name: /EN — Переключить на английский/ }).getAttribute("href")).toBe("/privacy");
  });

  test("an English pricing URL remains English even when a previous private flow saved Russian", async () => {
    window.localStorage.setItem("granttap.locale", "ru");
    render(await PricingPage());
    expect(screen.getByRole("heading", { name: "Choose how many computers to connect.", level: 1 })).toBeTruthy();
  });
});
