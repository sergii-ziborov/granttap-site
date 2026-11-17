import { act, fireEvent, render, screen } from "@testing-library/react";
import nacl from "tweetnacl";
import { webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PhoneSignIn } from "..";
import { openKeyTransfer, openPhoneRequest, pollPhoneRequest } from "../protocol";

const accountId = "0b6f0e7e-3a43-4c49-8a8e-5ad2c3a1b2c4";
const code = "C".repeat(43), secret = "S".repeat(43);
beforeEach(() => vi.stubGlobal("crypto", webcrypto));
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function sealed(bundle: string, browserKey: string) {
  const sender = nacl.box.keyPair(), nonce = nacl.randomBytes(24);
  const box = nacl.box(Uint8Array.from(Buffer.from(bundle)), nonce, Uint8Array.from(Buffer.from(browserKey, "base64url")), sender.secretKey);
  const digest = Buffer.from(await webcrypto.subtle.digest("SHA-256", new TextEncoder().encode(bundle))).toString("hex");
  return { id: "f1e2d3c4-b5a6-4978-8a9b-0c1d2e3f4a5b", keyDigest: digest, sealedKey: { senderPublicKey: Buffer.from(sender.publicKey).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64"), box: Buffer.from(box).toString("base64") } };
}

describe("phone sign-in protocol", () => {
  it("creates a request with a fresh browser key and reads every poll state", async () => {
    const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
    vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return Response.json({ code, secret, expiresAt: Date.now() + 180_000, purpose: "sign-in" }, { status: 201 });
    }));
    const request = await openPhoneRequest("sign-in");
    if (typeof request === "string") throw Error(request);
    const browserKey = calls[0].body.publicKey as string;
    expect(request.qr).toBe(`https://granttap.com/sign-in#qr=${code}.${browserKey}`);
    expect(Buffer.from(browserKey, "base64url")).toHaveLength(32);
    for (const [response, state] of [
      [Response.json({ status: "waiting", expiresAt: 5 }), { status: "waiting", expiresAt: 5 }],
      [Response.json({ status: "scanned", expiresAt: 6 }), { status: "scanned", expiresAt: 6 }],
      [Response.json({ status: "approved", accountId, keyTransfer: null }), { status: "approved", accountId, keyTransfer: null }],
      [Response.json({ status: "denied" }, { status: 410 }), { status: "denied" }],
      [Response.json({ error: "slow" }, { status: 429 }), { status: "error", limited: true }],
      [Response.json({ status: "approved", accountId: "nope" }), { status: "error", limited: false }],
    ] as const) {
      vi.stubGlobal("fetch", vi.fn(async () => response));
      expect(await pollPhoneRequest(secret)).toEqual(state);
    }
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 429 })));
    expect(await openPhoneRequest("key")).toBe("limited");
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ code })));
    expect(await openPhoneRequest("key")).toBe("unavailable");
  });

  it("opens only the bundle the phone sealed for this browser and this account", async () => {
    const pair = nacl.box.keyPair(), browserKey = Buffer.from(pair.publicKey).toString("base64url");
    const bundle = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId, createdAt: 1, pairings: [] });
    const transfer = await sealed(bundle, browserKey);
    expect(await openKeyTransfer(transfer, pair.secretKey, accountId)).toBe(bundle);
    expect(await openKeyTransfer(transfer, pair.secretKey, "4db0fc90-3ad4-4427-aec8-9b6405ec72d2")).toBeNull();
    expect(await openKeyTransfer({ ...transfer, keyDigest: "0".repeat(64) }, pair.secretKey, accountId)).toBeNull();
    expect(await openKeyTransfer(transfer, nacl.box.keyPair().secretKey, accountId)).toBeNull();
    const other = await sealed(JSON.stringify({ schema: "other", accountId, pairings: [] }), browserKey);
    expect(await openKeyTransfer(other, pair.secretKey, accountId)).toBeNull();
  });
});

describe("phone sign-in panel", () => {
  it("shows the QR, reacts to a scan, stores a shared key and reports the result", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let browserKey = "", secretKey: Uint8Array | null = null;
    const keyPair = nacl.box.keyPair;
    vi.spyOn(nacl.box, "keyPair").mockImplementation(() => { const pair = keyPair(); browserKey = Buffer.from(pair.publicKey).toString("base64url"); secretKey = pair.secretKey; return pair; });
    const states: Array<() => Promise<Response>> = [];
    let put: unknown = null;
    vi.stubGlobal("fetch", vi.fn(async (url: string, init: RequestInit) => {
      if (url.endsWith("qr-sign-in/requests")) return Response.json({ code, secret, expiresAt: Date.now() + 180_000 }, { status: 201 });
      if (url.endsWith("web-key")) { put = JSON.parse(String(init.body)); return Response.json({ stored: true }); }
      return (states.shift() ?? (async () => Response.json({ status: "waiting", expiresAt: Date.now() + 100_000 })))();
    }));
    const done = vi.fn();
    render(<PhoneSignIn locale="en" purpose="sign-in" onDone={done} />);
    expect(await screen.findByRole("img", { name: "QR code for GrantTap on your iPhone" })).toBeTruthy();
    expect(secretKey).not.toBeNull();
    states.push(async () => Response.json({ status: "scanned", expiresAt: Date.now() + 300_000 }));
    await act(async () => { await vi.advanceTimersByTimeAsync(2_100); });
    expect(screen.getByRole("status").textContent).toMatch(/Scanned/);
    const bundle = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId, createdAt: 1, pairings: [] });
    const transfer = await sealed(bundle, browserKey);
    states.push(async () => Response.json({ status: "approved", accountId, keyTransfer: transfer }));
    await act(async () => { await vi.advanceTimersByTimeAsync(2_100); });
    await vi.waitFor(() => expect(done).toHaveBeenCalledWith(accountId, "stored"));
    expect(put).toEqual({ transferId: transfer.id, bundle });
  });

  it("renews an expired code a few times, then waits for a click; a decline stops at once", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let created = 0, answer: Response = Response.json({ status: "expired" }, { status: 410 });
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url.endsWith("qr-sign-in/requests")) { created++; return Response.json({ code, secret, expiresAt: Date.now() + 1_000 }, { status: 201 }); }
      return answer.clone();
    }));
    render(<PhoneSignIn locale="ru" purpose="key" onDone={() => {}} />);
    for (let round = 0; round < 7; round++) await act(async () => { await vi.advanceTimersByTimeAsync(2_100); });
    expect(created).toBe(6);
    expect(await screen.findByText("Срок действия кода истёк.")).toBeTruthy();
    answer = Response.json({ status: "denied" }, { status: 410 });
    fireEvent.click(screen.getByRole("button", { name: "Показать новый код" }));
    await screen.findByRole("img", { name: "QR-код для GrantTap на iPhone" });
    await act(async () => { await vi.advanceTimersByTimeAsync(2_100); });
    expect(await screen.findByText(/Вход отклонён на iPhone/)).toBeTruthy();
    answer = Response.json({}, { status: 429 });
    fireEvent.click(screen.getByRole("button", { name: "Показать новый код" }));
    await screen.findByRole("img", { name: "QR-код для GrantTap на iPhone" });
    await act(async () => { await vi.advanceTimersByTimeAsync(2_100); });
    expect(await screen.findByText(/Слишком много кодов/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Показать новый код" })).toBeNull();
  });
});
