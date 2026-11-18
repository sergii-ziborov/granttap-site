import { afterEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountDevices } from "../Devices";
import type { Device } from "../client";

const DAY = 86_400_000, now = Date.now();
const created = new Date(2026, 10, 2, 12).getTime();
const session = (id: string, extra: Partial<Device>): Device => ({ type: "session", id, kind: "iphone", name: "iPhone",
  signIn: "passkey", createdAt: now - DAY, lastSeenAt: now - 60_000, expiresAt: now + 29 * DAY, current: false,
  delegated: false, older: false, ...extra });
const here = session("9d7a7d0b-08f4-4b8f-9fd2-6d0a3b9f1e10", { kind: "browser", name: "Chrome on macOS", current: true });
const silent = session("1f0e6a59-2c55-4d55-9a8f-2d2f8b8c1c11", { kind: "unknown", name: "Signed-in device", signIn: null,
  createdAt: created, lastSeenAt: null, older: true });
const usedApp = session("2a0e6a59-2c55-4d55-9a8f-2d2f8b8c1c12", { kind: "app", name: "GrantTap app", signIn: null,
  createdAt: created, lastSeenAt: now - 3 * DAY, older: true });

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

test("older sign-ins say when they began and when they were last used, and go together", async () => {
  const fetcher = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ removed: [] }));
  const changed = vi.fn();
  render(<AccountDevices locale="en" devices={[here, silent, usedApp]} onChanged={changed} onSignedOut={() => {}} />);
  expect(screen.getByRole("heading", { level: 3, name: "Older sign-ins" })).toBeTruthy();
  const [recorded, older] = screen.getAllByRole("list");
  expect(within(recorded).getAllByRole("listitem")).toHaveLength(1);
  const rows = within(older).getAllByRole("listitem").map(item => item.textContent);
  expect(rows[0]).toContain("Older sign-in");
  expect(rows[0]).toContain("since Nov 2, 2026 · no use recorded");
  expect(rows[0]).not.toMatch(/Unknown device|not seen yet/);
  expect(rows[1]).toContain("GrantTap app · since Nov 2, 2026 · last used 3 days ago");
  await userEvent.click(screen.getByRole("button", { name: "Remove 2 older sign-ins" }));
  expect(screen.getByText(/Sign out 2 older sign-ins\? A device still using one/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Remove 2 older sign-ins" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalledWith("/api/account/devices/prune", expect.objectContaining({ body: '{"older":true}' })));
  expect(changed).toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Remove devices not seen for 30 days" }).hasAttribute("disabled")).toBe(true);
});

test("in Russian, and with only this browser among them, there is nothing to remove at once", () => {
  render(<AccountDevices locale="ru" devices={[{ ...silent, current: true }, here]} onChanged={() => {}} onSignedOut={() => {}} />);
  expect(screen.getByRole("heading", { level: 3, name: "Прежние входы" })).toBeTruthy();
  expect(screen.getByText("Прежний вход")).toBeTruthy();
  expect(screen.getByText(/с 2 нояб\. 2026 г\. · использование не записано/)).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Удалить \d+ прежн/ })).toBeNull();
});

test("a failed removal of older sign-ins says so", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ error: "no" }, { status: 503 }));
  render(<AccountDevices locale="ru" devices={[here, silent]} onChanged={() => {}} onSignedOut={() => {}} />);
  await userEvent.click(screen.getByRole("button", { name: "Удалить 1 прежний вход" }));
  expect(screen.getByText(/Завершить 1 прежний вход\?/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "Удалить 1 прежний вход" }));
  expect((await screen.findByRole("alert")).textContent).toMatch(/Не удалось изменить устройства/);
});
