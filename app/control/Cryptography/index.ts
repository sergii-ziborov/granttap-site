import nacl from "tweetnacl";

export type BrowserPairing = {
  machineId: string; relayUrl: string; room: string; role: "phone"; deviceName: string;
  senderId: string; myPublicKey: string; mySecretKey: string; peerPublicKey: string; pushAuth: string;
};
export type BrowserEnvelope = {
  v: 1; room: string; from: "phone" | "machine"; to: "phone" | "machine" | "all";
  senderId: string; recipientKeyId?: string; deliveryId?: string; expiresAt?: number;
  nonce: string; box: string;
};

export function base64(bytes: Uint8Array): string {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 16_384) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 16_384));
  }
  return btoa(binary);
}
export function unbase64(text: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), char => char.charCodeAt(0));
}
export function browserKeyPair() {
  const pair = nacl.box.keyPair();
  return { publicKey: base64(pair.publicKey), secretKey: base64(pair.secretKey) };
}
export async function recipientId(publicKey: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", unbase64(publicKey));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");
}
export async function sealBrowserPayload(pairing: BrowserPairing, payload: unknown,
  options: { sessionKey?: string; sessionId?: string; deliveryId?: string; ttlMs?: number;
    reliable?: boolean } = {}): Promise<BrowserEnvelope> {
  let content = payload;
  if (options.sessionId || options.sessionKey) {
    if (!options.sessionId || !options.sessionKey || record(payload)?.sessionId !== options.sessionId) {
      throw new Error("The encrypted payload must retain its exact session scope");
    }
    const nonce = nacl.randomBytes(24);
    content = { type: "session.sealed", sessionId: options.sessionId, createdAt: Date.now(), nonce: base64(nonce),
      box: base64(nacl.secretbox(encode(payload), nonce, unbase64(options.sessionKey))) };
  }
  const nonce = nacl.randomBytes(24);
  return { v: 1, room: pairing.room, from: "phone", to: "machine", senderId: pairing.senderId,
    recipientKeyId: await recipientId(pairing.peerPublicKey),
    deliveryId: options.reliable === false ? undefined : options.deliveryId ?? crypto.randomUUID(),
    expiresAt: Date.now() + Math.min(options.ttlMs ?? 86_400_000, 30 * 86_400_000),
    nonce: base64(nonce), box: base64(nacl.box(encode(content), nonce,
      unbase64(pairing.peerPublicKey), unbase64(pairing.mySecretKey))) };
}
export async function openBrowserEnvelope(pairing: BrowserPairing, input: unknown,
  sessionKeys: Readonly<Record<string, string>> = {}): Promise<Record<string, unknown> | null> {
  try {
    const value = record(input);
    if (!value || value.v !== 1 || value.room !== pairing.room || value.from !== "machine"
      || !["phone", "all"].includes(String(value.to))
      || typeof value.nonce !== "string" || value.nonce.length > 64
      || typeof value.box !== "string" || value.box.length > 22_010_000
      || value.expiresAt != null && (typeof value.expiresAt !== "number"
        || !Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now())
      || value.recipientKeyId != null && value.recipientKeyId !== await recipientId(pairing.myPublicKey)) return null;
    const body = decode(nacl.box.open(unbase64(value.box), unbase64(value.nonce),
      unbase64(pairing.peerPublicKey), unbase64(pairing.mySecretKey)));
    if (body?.type !== "session.sealed") return body;
    const id = body.sessionId;
    if (typeof id !== "string" || !sessionKeys[id] || typeof body.box !== "string"
      || typeof body.nonce !== "string") return null;
    const inner = decode(nacl.secretbox.open(unbase64(body.box), unbase64(body.nonce), unbase64(sessionKeys[id])));
    return inner?.sessionId === id && !["session.key.grant", "session.sealed"].includes(String(inner.type))
      ? inner : null;
  } catch { return null; }
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}
function encode(value: unknown): Uint8Array {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  if (bytes.length > 16_384_000) throw new Error("Encrypted payload exceeds its size limit");
  return bytes;
}
function decode(bytes: Uint8Array | null): Record<string, unknown> | null {
  if (!bytes) return null;
  const value = record(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
  return typeof value?.type === "string" ? value : null;
}
