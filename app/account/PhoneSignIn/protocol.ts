import nacl from "tweetnacl";
import { ACCOUNT_ID, accountApi } from "../client";

export type Purpose = "sign-in" | "key";
export type PhoneRequest = { code: string; secret: string; expiresAt: number; qr: string; secretKey: Uint8Array };
export type KeyTransfer = { id: string; keyDigest: string; sealedKey: { senderPublicKey: string; nonce: string; box: string } };
export type PollState = { status: "waiting" | "scanned"; expiresAt: number }
  | { status: "approved"; accountId: string; keyTransfer: KeyTransfer | null }
  | { status: "expired" | "denied" | "used" } | { status: "error"; limited: boolean };

const bytes = (text: string) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0));
const base64url = (value: Uint8Array) => btoa(String.fromCharCode(...value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** A fresh browser key pair per code; the secret half stays in this page's memory only. */
export async function openPhoneRequest(purpose: Purpose): Promise<PhoneRequest | "limited" | "unavailable"> {
  const pair = nacl.box.keyPair(), publicKey = base64url(pair.publicKey);
  const result = await accountApi<{ code?: string; secret?: string; expiresAt?: number }>("qr-sign-in/requests",
    { method: "POST", body: { publicKey, purpose } });
  if (result.status === 429) return "limited";
  const { code, secret, expiresAt } = result.body ?? {};
  if (!result.ok || typeof code !== "string" || typeof secret !== "string" || !Number.isFinite(expiresAt)) return "unavailable";
  return { code, secret, expiresAt: expiresAt!, secretKey: pair.secretKey,
    qr: `https://granttap.com/sign-in#qr=${code}.${publicKey}` };
}

export async function pollPhoneRequest(secret: string): Promise<PollState> {
  const result = await accountApi<Record<string, unknown>>("qr-sign-in/poll", { method: "POST", body: { secret } });
  const status = result.body?.status;
  if (result.status === 410 && (status === "expired" || status === "denied" || status === "used")) return { status };
  if (!result.ok || !result.body) return { status: "error", limited: result.status === 429 };
  if ((status === "waiting" || status === "scanned") && Number.isFinite(result.body.expiresAt)) {
    return { status, expiresAt: Number(result.body.expiresAt) };
  }
  if (status === "approved" && typeof result.body.accountId === "string" && ACCOUNT_ID.test(result.body.accountId)) {
    return { status, accountId: result.body.accountId, keyTransfer: (result.body.keyTransfer as KeyTransfer | null) ?? null };
  }
  return { status: "error", limited: false };
}

/** Opens the phone's sealed bundle and checks it is exactly what the phone approved, for this account. */
export async function openKeyTransfer(transfer: KeyTransfer, secretKey: Uint8Array, accountId: string): Promise<string | null> {
  try {
    const opened = nacl.box.open(bytes(transfer.sealedKey.box), bytes(transfer.sealedKey.nonce),
      bytes(transfer.sealedKey.senderPublicKey), secretKey);
    if (!opened) return null;
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(opened))),
      byte => byte.toString(16).padStart(2, "0")).join("");
    const text = new TextDecoder("utf-8", { fatal: true }).decode(opened);
    const value = JSON.parse(text) as { schema?: unknown; accountId?: unknown; pairings?: unknown };
    return digest === transfer.keyDigest && value.schema === "granttap.account-web-key.v1"
      && value.accountId === accountId && Array.isArray(value.pairings) ? text : null;
  } catch { return null; }
}

export async function storeAccountKey(transfer: KeyTransfer, secretKey: Uint8Array, accountId: string): Promise<boolean> {
  const bundle = await openKeyTransfer(transfer, secretKey, accountId);
  if (!bundle) return false;
  const result = await accountApi("web-key", { method: "PUT", body: { transferId: transfer.id, bundle } });
  return result.ok;
}
