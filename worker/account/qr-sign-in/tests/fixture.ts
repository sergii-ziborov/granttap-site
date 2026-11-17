import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import nacl from "tweetnacl";
import { handleAccountApi } from "../../api";
import { AccountAuth } from "../../auth";
import { D1AccountStore } from "../../d1-store";
import { AccountMachines } from "../../machines";
import { SqliteD1 } from "../../../../tests/coverage/account-sqlite";

export const STORAGE = new Uint8Array(32).fill(9);
const base = "https://granttap.com/api/account/";
const chrome = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";

export async function accountFixture(storage: Uint8Array | null = STORAGE) {
  const sqlite = new SqliteD1(), db = sqlite as unknown as D1Database;
  const accountId = randomUUID();
  await db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").bind(accountId, Date.now()).run();
  const auth = new AccountAuth(new D1AccountStore(db));
  const phone = (await auth.createSession(accountId, { kind: "app", name: "GrantTap app", signIn: "passkey", delegated: false })).token;
  const call = async (path: string, init: RequestInit = {}) => (await handleAccountApi(new Request(base + path, init), db, undefined, storage ?? undefined))!;
  const native = (path: string, body?: unknown, method = "POST", token = phone, ip = "203.0.113.7") => call(path, { method,
    headers: { authorization: "Bearer " + token, "content-type": "application/json", "x-real-ip": ip },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const browser = (path: string, body?: unknown, method = "POST", cookie = "", ip = "203.0.113.7") => call(path, { method,
    headers: { origin: "https://granttap.com", "sec-fetch-site": "same-origin", "content-type": "application/json",
      "user-agent": chrome, "x-real-ip": ip, ...(cookie ? { cookie: "granttap_session=" + cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { sqlite, db, accountId, auth, phone, call, native, browser };
}

export function browserKeys() {
  const pair = nacl.box.keyPair();
  return { publicKey: Buffer.from(pair.publicKey).toString("base64url"), secretKey: pair.secretKey };
}

export async function computerPairing(db: D1Database, accountId: string, name = "MacBook Pro") {
  const machine = (await new AccountMachines(db).register(accountId, name))!;
  const controller = nacl.box.keyPair();
  return { machineId: machine.id, relayUrl: "wss://relay.granttap.com", room: randomBytes(16).toString("hex"), role: "phone",
    deviceName: "GrantTap Web", senderId: "web-" + machine.id.slice(0, 8),
    myPublicKey: Buffer.from(controller.publicKey).toString("base64"),
    mySecretKey: Buffer.from(controller.secretKey).toString("base64"),
    peerPublicKey: Buffer.from(nacl.box.keyPair().publicKey).toString("base64"), pushAuth: randomBytes(32).toString("hex") };
}

/** Exactly what the phone does: seal the plaintext bundle to the QR's browser key. */
export function sealBundle(bundle: string, browserPublicKey: string) {
  const sender = nacl.box.keyPair(), nonce = nacl.randomBytes(24);
  const box = nacl.box(new TextEncoder().encode(bundle), nonce, Buffer.from(browserPublicKey, "base64url"), sender.secretKey);
  return { sealedKey: { senderPublicKey: Buffer.from(sender.publicKey).toString("base64"),
    nonce: Buffer.from(nonce).toString("base64"), box: Buffer.from(box).toString("base64") },
  keyDigest: createHash("sha256").update(bundle).digest("hex") };
}

export function openSealed(sealed: { senderPublicKey: string; nonce: string; box: string }, secretKey: Uint8Array) {
  const opened = nacl.box.open(Buffer.from(sealed.box, "base64"), Buffer.from(sealed.nonce, "base64"),
    Buffer.from(sealed.senderPublicKey, "base64"), secretKey);
  return opened ? new TextDecoder().decode(opened) : null;
}

export const cookieOf = (response: Response) => response.headers.get("set-cookie")?.match(/granttap_session=([^;]*)/)?.[1] ?? "";
