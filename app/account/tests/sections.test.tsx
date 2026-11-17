import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { relativeTime, shortDate, type Device } from "../client";
import { AccountDevices } from "../Devices";
import { devicesCopy } from "../Devices/copy";
import { EncryptionKey } from "../EncryptionKey";
import { keyCopy } from "../EncryptionKey/copy";
import { accountCopy } from "../copy";

vi.mock("../PhoneSignIn", () => ({ PhoneSignIn: ({ onDone }: { onDone: (account: string, key: string) => void }) =>
  <div><button type="button" onClick={() => onDone("a", "stored")}>phone stored</button>
    <button type="button" onClick={() => onDone("a", "failed")}>phone failed</button></div> }));
afterEach(() => vi.restoreAllMocks());

const day = 86_400_000;
const device = (patch: Partial<Device>): Device => ({ type: "session", id: crypto.randomUUID(), kind: "browser", name: "Safari on iOS",
  signIn: "qr", createdAt: Date.now() - day, lastSeenAt: Date.now() - 1000, expiresAt: Date.now() + day, current: false, delegated: true, ...patch });

describe("devices section", () => {
  it("labels every kind in Russian, counts quiet devices and reports a failed removal", async () => {
    const devices = [device({ current: true, kind: "iphone", name: "iPhone", signIn: "invite" }),
      device({ kind: "unknown", name: "Старое", lastSeenAt: null, createdAt: null, signIn: null }),
      device({ kind: "ipad", name: "iPad", signIn: "token", lastSeenAt: Date.now() - 40 * day }),
      device({ type: "computer", kind: "computer", name: "Mac mini", signIn: null, encryptionKeyId: null, lastSeenAt: Date.now() - 50 * day }),
      device({ kind: "mac", name: "Mac", signIn: "password" }), device({ kind: "app", name: "App", signIn: "passkey" })];
    const fetcher = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({}, { status: 500 }));
    const changed = vi.fn(), out = vi.fn();
    render(<AccountDevices locale="ru" devices={devices} onChanged={changed} onSignedOut={out} />);
    expect(screen.getByText("Это устройство")).toBeTruthy();
    expect(screen.getByText(/ещё не появлялся/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Удалить устройства, неактивные 30 дней" }));
    expect(screen.getByText(/Удалить 3 устройства, неактивных 30 дней/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Удалить 3 устройства" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Удалить: Mac mini" }));
    fireEvent.click(within(screen.getByRole("group")).getByRole("button", { name: "Удалить" }));
    await waitFor(() => expect(fetcher).toHaveBeenCalledWith(expect.stringContaining("devices/computers/"), expect.anything()));
    expect(changed).not.toHaveBeenCalled();
  });

  it("signs this browser out when its own row is removed, and says when nothing is stale", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ revoked: true }));
    const out = vi.fn();
    render(<AccountDevices locale="en" devices={[device({ current: true, name: "Chrome on macOS" })]} onChanged={() => {}} onSignedOut={out} />);
    expect(screen.getByText("Every device was active in the last 30 days.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sign out: Chrome on macOS" }));
    expect(screen.getByText("Sign out of this browser?")).toBeTruthy();
    fireEvent.click(within(screen.getByRole("group")).getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(out).toHaveBeenCalled());
  });

  it("pluralises and formats in both languages", () => {
    expect(devicesCopy.ru.confirmPrune(1)).toContain("1 устройство");
    expect(devicesCopy.ru.confirmPrune(5)).toContain("5 устройств");
    expect(devicesCopy.ru.confirmPrune(21)).toContain("21 устройство");
    expect(devicesCopy.en.confirmPrune(1)).toContain("1 device ");
    expect(devicesCopy.ru.thisBrowser("browser")).toBe("Этот браузер");
    expect(accountCopy.en.passkeyCount(2)).toBe("2 passkeys");
    expect(accountCopy.en.passkeyCount(1)).toBe("1 passkey");
    expect(accountCopy.ru.passkeyCount(3)).toBe("Ключей: 3");
    expect(accountCopy.ru.tokenCount(2)).toBe("Активных: 2");
    expect(accountCopy.ru.signedInWith("passkey")).toContain("passkey");
    expect(keyCopy.ru.storedSince("1 дек.", "Safari")).toContain("Safari");
    const now = Date.UTC(2026, 10, 17);
    expect(relativeTime(now - 30_000, "en", now)).toBe("30 seconds ago");
    expect(relativeTime(now - 5 * 60_000, "en", now)).toBe("5 minutes ago");
    expect(relativeTime(now - 3 * 3_600_000, "en", now)).toBe("3 hours ago");
    expect(relativeTime(now - 3 * day, "ru", now)).toBe("3 дня назад");
    expect(relativeTime(now - 90 * day, "en", now)).toBe("3 months ago");
    expect(relativeTime(now - 800 * day, "en", now)).toBe("2 years ago");
    expect(shortDate(now, "ru")).toMatch(/2026/);
  });
});

describe("encryption key section", () => {
  const computers = [device({ type: "computer", kind: "computer", name: "MacBook Pro", encryptionKeyId: "a1b2c3" + "0".repeat(58) }),
    device({ type: "computer", kind: "computer", name: "Mac mini", encryptionKeyId: null })];

  it("explains the risk before asking the iPhone and reports a key that was not saved", () => {
    const changed = vi.fn();
    render(<EncryptionKey locale="en" status={{ stored: false }} computers={computers} onChanged={changed} />);
    expect(screen.getByText("Chats encrypted · key a1b2c3…")).toBeTruthy();
    expect(screen.getByText("Chats encrypted · not connected yet")).toBeTruthy();
    expect(screen.getByText(/If granttap.com is ever hacked/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Get the key from my iPhone" }));
    fireEvent.click(screen.getByRole("button", { name: "phone failed" }));
    expect(screen.getByRole("alert").textContent).toBe("The key wasn't saved. Try again.");
    fireEvent.click(screen.getByRole("button", { name: "Get the key from my iPhone" }));
    fireEvent.click(screen.getByRole("button", { name: "phone stored" }));
    expect(changed).toHaveBeenCalled();
  });

  it("names removed computers and reports a failed removal in Russian", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({}, { status: 503 }));
    render(<EncryptionKey locale="ru" computers={[]} onChanged={() => {}} status={{ stored: true, createdAt: Date.UTC(2026, 10, 17),
      storedFrom: "Chrome on macOS", computers: [{ computerId: "x", name: null, recipientKeyId: "64e997" + "0".repeat(58) }] }} />);
    expect(screen.getByText("Удалённый компьютер")).toBeTruthy();
    expect(screen.getByText("веб-ключ 64e997…")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Удалить ключ из аккаунта" }));
    fireEvent.click(screen.getByRole("button", { name: "Удалить ключ" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/Не удалось удалить ключ/);
  });
});

describe("inline confirmation", () => {
  it("moves focus to the action, closes on Escape and returns focus to the trigger", async () => {
    const { ConfirmAction } = await import("../ConfirmAction");
    const confirm = vi.fn();
    render(<ConfirmAction label="Remove" question="Remove it?" confirmLabel="Remove it" cancelLabel="Keep it" danger onConfirm={confirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(document.activeElement?.textContent).toBe("Remove it");
    fireEvent.keyDown(screen.getByRole("group", { name: "Remove it?" }), { key: "Escape" });
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Remove"));
    expect(confirm).not.toHaveBeenCalled();
  });
});
