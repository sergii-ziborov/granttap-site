import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlCenter } from "..";
import { browserFixture } from "./browser-fixture";

vi.mock("../../RelayConnection", async () => {
  const { FixtureRelayConnection } = await import("./browser-fixture");
  return { BrowserRelayConnection: FixtureRelayConnection };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("requires the account and entitlement before rendering control", async () => {
  await browserFixture("signin"); const first = render(<ControlCenter />);
  expect(await screen.findByRole("link", { name: "Sign in with a passkey →" })).toBeTruthy(); first.unmount();
  await browserFixture("subscription"); render(<ControlCenter />);
  expect(await screen.findByText("GrantTap access is required")).toBeTruthy();
  expect(screen.queryByRole("navigation", { name: "GrantTap" })).toBeNull();
});
it("opens a large conversation, sends to relay without a native receipt, and preserves the Task view", async () => {
  const f = await browserFixture(); const user = userEvent.setup(); render(<ControlCenter />);
  await user.click(await screen.findByRole("button", { name: /Synthetic web Task/ }));
  await screen.findByText("Synthetic history 4999");
  expect(document.querySelectorAll(".gt-message").length).toBe(120);
  await user.click(screen.getByRole("button", { name: "Show earlier messages" }));
  expect(document.querySelectorAll(".gt-message").length).toBe(240);
  await user.type(screen.getByRole("textbox", { name: "Message" }), "A synthetic follow-up");
  await user.selectOptions(screen.getByRole("combobox", { name: "Model" }), "fixture-model");
  await user.selectOptions(screen.getByRole("combobox", { name: "Effort" }), "ultra");
  await user.click(screen.getByRole("button", { name: "Send message" }));
  expect(await screen.findByText("Saved on relay · the computer will receive it when available")).toBeTruthy();
  expect(f.received.find(payload => payload.type === "user.message")).toMatchObject({ text: "A synthetic follow-up", effort: "ultra", model: "fixture-model" });
});
it("shows native questions and permissions for all four providers and sends the decision immediately", async () => {
  const f = await browserFixture(); const user = userEvent.setup(); render(<ControlCenter />);
  await screen.findByRole("button", { name: /Synthetic web Task/ });
  for (const agent of ["codex", "claude", "cursor", "grok"]) f.sockets[0].payload({ type: "approval.request",
    requestId: "approval-" + agent, agent, kind: "permission", title: agent + " permission fixture", tool: "shell", createdAt: Date.now() });
  for (const agent of ["codex", "claude", "cursor", "grok"]) {
    const heading = await screen.findByRole("heading", { name: agent + " permission fixture" });
    const card = heading.closest("article")!;
    await user.click(within(card).getByRole("button", { name: "Allow" }));
    expect(await within(card).findByText("Saved on relay · waiting for computer")).toBeTruthy();
  }
  expect(f.received.filter(payload => payload.type === "approval.decision")).toHaveLength(4);
});
it("searches Tasks without stale matches and shows the empty state after an authoritative empty catalog", async () => {
  const f = await browserFixture(), user = userEvent.setup(); render(<ControlCenter />);
  await screen.findByRole("button", { name: /Synthetic web Task/ });
  await user.click(screen.getByRole("button", { name: "Tasks" }));
  await user.type(screen.getByRole("searchbox", { name: "Search Tasks" }), "no match");
  expect(screen.queryByRole("button", { name: /Synthetic web Task/ })).toBeNull();
  expect(screen.getByText(/No Tasks in the latest snapshot/)).toBeTruthy();
  await user.clear(screen.getByRole("searchbox", { name: "Search Tasks" }));
  expect(screen.getByRole("button", { name: /Synthetic web Task/ })).toBeTruthy();
  await act(() => f.sockets[0].payload({ type: "sessions.status", machine: "Synthetic", sessions: [], generatedAt: Date.now() + 1 }));
  expect(screen.queryByRole("button", { name: /Synthetic web Task/ })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Usage" }));
  expect(screen.getAllByText("Subscription limits have not been reported.")).toHaveLength(4);
  await user.click(screen.getByRole("button", { name: "Computers" }));
  expect(screen.getByText("Browser authorized")).toBeTruthy();
});
