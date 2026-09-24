import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import ConnectPage from "../../app/connect/page";
import { ConnectView } from "../../app/connect/ConnectView";

afterEach(() => {
  vi.unstubAllGlobals();
  window.location.hash = "";
});

test("the /connect route renders the authorization card", () => {
  window.location.hash = "";
  render(<ConnectPage />);
  expect(screen.getByRole("heading", { name: "Connect your coding app", level: 1 })).toBeTruthy();
});

test("connect page talks only to the website API", async () => {
  window.location.hash = "#request=11111111-1111-4111-8111-111111111111";
  const fetchMock = vi.fn(async (input: RequestInfo) => {
    const url = String(input);
    expect(url).toContain("/api/connect/requests/");
    expect(url).not.toMatch(/127\.0\.0\.1|localhost|17342/);
    if (url.endsWith("/decision")) return new Response(JSON.stringify({ ok: true }), { status: 200 });
    return new Response(JSON.stringify({
      clientName: "Cursor",
      paired: true,
      phones: [{ name: "iPhone", status: "paired" }],
      providers: [{ id: "cursor", installed: true, ready: true }],
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);

  render(<ConnectView />);
  expect(await screen.findByRole("heading", { name: "Connect your coding app", level: 1 })).toBeTruthy();
  expect(screen.getByText("Cursor")).toBeTruthy();
  expect(screen.getByRole("button", { name: /iPhone/i })).toBeTruthy();

  await userEvent.click(screen.getByRole("button", { name: /iPhone/i }));
  await userEvent.click(screen.getByRole("button", { name: "Approve" }));
  expect(fetchMock.mock.calls.some((call) => String(call[0]).endsWith("/decision"))).toBe(true);
  const decision = fetchMock.mock.calls.find((call) => String(call[0]).endsWith("/decision")) as
    | [RequestInfo, RequestInit?]
    | undefined;
  expect(JSON.parse(String(decision?.[1]?.body))).toMatchObject({ decision: "approve", phone: "iPhone" });
});

test("a missing website row keeps the person on this page", async () => {
  window.location.hash = "#request=11111111-1111-4111-8111-111111111111";
  vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 404 })));
  render(<ConnectView />);
  expect(await screen.findByText(/not on GrantTap yet/i)).toBeTruthy();
});

test("Deny posts the decision without leaving the page", async () => {
  window.location.hash = "#request=11111111-1111-4111-8111-111111111111";
  const fetchMock = vi.fn(async (input: RequestInfo) => {
    if (String(input).endsWith("/decision")) return new Response(JSON.stringify({ ok: true }), { status: 200 });
    return new Response(JSON.stringify({
      clientName: "Cursor",
      paired: true,
      phones: [{ name: "iPhone", status: "paired" }],
      providers: [{ id: "cursor", installed: true, ready: true }],
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<ConnectView />);
  expect(await screen.findByRole("button", { name: "Deny" })).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Deny" }));
  const decision = fetchMock.mock.calls.find((call) => String(call[0]).endsWith("/decision")) as
    | [RequestInfo, RequestInit?]
    | undefined;
  expect(JSON.parse(String(decision?.[1]?.body))).toMatchObject({ decision: "deny" });
});

test("missing request does not mention loopback", async () => {
  window.location.hash = "";
  render(<ConnectView />);
  expect(await screen.findByText(/not on GrantTap yet/i)).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/127\.0\.0\.1|localhost:17342/);
});

test("connection page distinguishes two phones and provider readiness", async () => {
  window.location.hash = "#request=66666666-6666-4666-8666-666666666666";
  const fetchMock = vi.fn(async (input: RequestInfo) => {
    if (String(input).endsWith("/decision")) return new Response(JSON.stringify({ ok: true }), { status: 200 });
    return new Response(JSON.stringify({
      clientName: "Codex", paired: true,
      phones: [{ name: "iPhone", status: "seen" }, { name: "iPad", status: "paired" }],
      providers: [{ id: "codex", installed: true, ready: true }, { id: "cursor", installed: true, ready: false }, { id: "claude", installed: false, ready: false }],
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);
  render(<ConnectView />);
  expect(await screen.findByText("Codex · Ready")).toBeTruthy();
  expect(screen.getByText("Cursor · Installed")).toBeTruthy();
  expect(screen.getByText("Claude Code · Not installed")).toBeTruthy();
  const iPhone = screen.getByRole("button", { name: /iPhone.*Online just now/i });
  const iPad = screen.getByRole("button", { name: /iPad.*Paired/i });
  expect(iPhone.className).toContain("seen");
  await userEvent.click(iPad);
  await userEvent.click(screen.getByRole("button", { name: "Approve" }));
  const decision = fetchMock.mock.calls.find(call => String(call[0]).endsWith("/decision")) as
    | [RequestInfo, RequestInit?]
    | undefined;
  expect(JSON.parse(String(decision?.[1]?.body))).toMatchObject({ decision: "approve", phone: "iPad" });
});

test("connection page reports unpaired, failed, and pending authorization states", async () => {
  window.location.hash = "#request=77777777-7777-4777-8777-777777777777";
  let snapshot: Record<string, unknown> = {
    clientName: "Cursor", paired: false, phones: [], providers: [], error: "Helper unavailable",
  };
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(snapshot), { status: 200 })));
  const view = render(<ConnectView />);
  expect(await screen.findByText("Helper unavailable")).toBeTruthy();
  expect(screen.getByText(/No phone is listed for this computer/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: "Подключите coding app" })).toBeTruthy();
  view.unmount();
  window.localStorage.clear();
  snapshot = { clientName: "Cursor", paired: true, phones: [{ name: "iPhone", status: "paired" }], providers: [], decision: "approve" };
  render(<ConnectView />);
  expect(await screen.findByText(/has not finished authorization/)).toBeTruthy();
  expect(screen.getByRole("button", { name: "Deny" })).toBeTruthy();
});
