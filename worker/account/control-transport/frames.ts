import { createHash } from "node:crypto";
import { validControlKey } from "../control-access/machine-endpoints";
import { UUID } from "../http";

export const CONTROL_SOCKET_PATH = "/api/account/control/socket";
export const MAX_CONTROL_FRAME = 32 * 1024 * 1024;
export type ControlConnection = { computerId: string; room: string; publicKey: string; credential: string };

export function controlConnection(raw: string): ControlConnection | null {
  if (Buffer.byteLength(raw) > 2_048) return null;
  try {
    const value = JSON.parse(raw);
    return value.type === "control.connect" && Object.keys(value).length === 5
      && UUID.test(value.computerId) && /^[a-f0-9]{16,64}$/.test(value.room)
      && validControlKey(value.publicKey) && /^[a-f0-9]{64}$/.test(value.credential)
      ? value : null;
  } catch { return null; }
}

export function recipientDigest(publicKey: string): string {
  return createHash("sha256").update(Buffer.from(publicKey, "base64")).digest("hex");
}

/** The proxy accepts ciphertext and delivery control only, never plaintext agent requests. */
export function controllerFrame(raw: string, room: string): boolean {
  try {
    const value = JSON.parse(raw);
    if (value.type === "relay.ack") return Object.keys(value).length === 2
      && typeof value.deliveryId === "string" && value.deliveryId.length > 0 && value.deliveryId.length <= 180;
    return Object.keys(value).every(key => ["v", "room", "from", "to", "senderId", "deliveryId",
      "wake", "expiresAt", "nonce", "box", "recipientKeyId"].includes(key))
      && value.v === 1 && value.room === room && value.from === "phone" && ["machine", "all"].includes(value.to)
      && typeof value.senderId === "string" && value.senderId.length > 0 && value.senderId.length <= 180
      && typeof value.nonce === "string" && /^[A-Za-z0-9+/]{32}$/.test(value.nonce)
      && typeof value.box === "string" && value.box.length >= 24 && /^[A-Za-z0-9+/]+={0,2}$/.test(value.box);
  } catch { return false; }
}
