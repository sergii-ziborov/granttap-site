import { createHash } from "node:crypto";
import nacl from "tweetnacl";

export const WEB_KEY_SCHEMA = "granttap.account-web-key.v1";
export const MAX_BUNDLE_BYTES = 40_000;
export type WebKeyPairing = { machineId: string; relayUrl: string; room: string; role: "phone"; deviceName: string;
  senderId: string; myPublicKey: string; mySecretKey: string; peerPublicKey: string; pushAuth: string };
export type WebKeyBundle = { schema: typeof WEB_KEY_SCHEMA; accountId: string; createdAt: number; pairings: WebKeyPairing[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KEY = /^[A-Za-z0-9+/]{43}=$/;
const PAIRING_KEYS = ["deviceName", "machineId", "myPublicKey", "mySecretKey", "peerPublicKey", "pushAuth",
  "relayUrl", "role", "room", "senderId"];

export const digest = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");
export const recipientKeyId = (publicKey: string) =>
  createHash("sha256").update(Buffer.from(publicKey, "base64")).digest("hex");

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).sort().join() === [...keys].sort().join();
}

function validPairing(value: unknown): value is WebKeyPairing {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const pair = value as Record<string, unknown>;
  if (!exactKeys(pair, PAIRING_KEYS) || typeof pair.machineId !== "string" || !UUID.test(pair.machineId)
    || pair.role !== "phone" || typeof pair.room !== "string" || !/^[a-f0-9]{16,64}$/.test(pair.room)
    || typeof pair.pushAuth !== "string" || !/^[a-f0-9]{64}$/.test(pair.pushAuth)
    || typeof pair.senderId !== "string" || pair.senderId.length < 1 || pair.senderId.length > 180
    || typeof pair.deviceName !== "string" || pair.deviceName.length > 180
    || ![pair.myPublicKey, pair.mySecretKey, pair.peerPublicKey].every(key => typeof key === "string" && KEY.test(key))) return false;
  try {
    const url = new URL(String(pair.relayUrl));
    if (url.protocol !== "wss:" || url.host !== "relay.granttap.com" || !["/", "/ws"].includes(url.pathname)
      || url.username || url.password || url.search || url.hash) return false;
  } catch { return false; }
  const derived = nacl.box.keyPair.fromSecretKey(Buffer.from(String(pair.mySecretKey), "base64")).publicKey;
  return Buffer.from(derived).toString("base64") === pair.myPublicKey;
}

/** The exact key bundle a phone seals for the account: controller identities minted by computers. */
export function parseWebKeyBundle(text: string, accountId: string): WebKeyBundle | null {
  if (Buffer.byteLength(text, "utf8") > MAX_BUNDLE_BYTES) return null;
  let value: unknown;
  try { value = JSON.parse(text); } catch { return null; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const bundle = value as Record<string, unknown>;
  if (!exactKeys(bundle, ["accountId", "createdAt", "pairings", "schema"]) || bundle.schema !== WEB_KEY_SCHEMA
    || bundle.accountId !== accountId || !Number.isSafeInteger(bundle.createdAt) || Number(bundle.createdAt) <= 0
    || !Array.isArray(bundle.pairings) || bundle.pairings.length < 1 || bundle.pairings.length > 50
    || !bundle.pairings.every(validPairing)) return null;
  const machines = new Set(bundle.pairings.map(pair => pair.machineId));
  return machines.size === bundle.pairings.length ? bundle as WebKeyBundle : null;
}
