// Plays the browser side of phone QR sign-in against a local account server, for app testing.
// Usage: node scripts/qa/qr-sign-in-fixture.mjs [http://127.0.0.1:3210] [--key <session cookie value>]
import { createHash } from "node:crypto";
import nacl from "tweetnacl";

const base = (process.argv[2]?.startsWith("http") ? process.argv[2] : "http://127.0.0.1:3210").replace(/\/$/, "");
const keyIndex = process.argv.indexOf("--key");
let cookie = keyIndex > 0 ? process.argv[keyIndex + 1] ?? "" : "";
const headers = () => ({ origin: "https://granttap.com", "sec-fetch-site": "same-origin", "content-type": "application/json",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36",
  ...(cookie ? { cookie: "granttap_session=" + cookie } : {}) });
const call = async (path, body, method = "POST") => {
  const response = await fetch(`${base}/api/account/${path}`, { method, headers: headers(), body: body && JSON.stringify(body) });
  const set = response.headers.get("set-cookie")?.match(/granttap_session=([^;]+)/)?.[1];
  if (set) cookie = set;
  return { status: response.status, body: await response.json().catch(() => null) };
};

const pair = nacl.box.keyPair();
const publicKey = Buffer.from(pair.publicKey).toString("base64url");
const created = await call("qr-sign-in/requests", { publicKey, purpose: cookie ? "key" : "sign-in" });
if (created.status !== 201) { console.error("Could not create a request:", created); process.exit(1); }
const fragment = `qr=${created.body.code}.${publicKey}`;
console.log(`QR text:   https://granttap.com/sign-in#${fragment}`);
console.log(`Simulator: xcrun simctl openurl booted 'granttap://sign-in#${fragment}'`);

let last = "";
while (true) {
  await new Promise(resolve => setTimeout(resolve, 2_000));
  const poll = await call("qr-sign-in/poll", { secret: created.body.secret });
  const status = poll.body?.status ?? `HTTP ${poll.status}`;
  if (status !== last) { console.log("status:", status); last = status; }
  if (poll.status === 410 || poll.status >= 400) process.exit(status === "approved" ? 0 : 2);
  if (status !== "approved") continue;
  console.log("account:", poll.body.accountId, cookie ? "(browser session cookie received)" : "");
  const transfer = poll.body.keyTransfer;
  if (!transfer) { console.log("No key shared."); process.exit(0); }
  const sealed = transfer.sealedKey;
  const opened = nacl.box.open(Buffer.from(sealed.box, "base64"), Buffer.from(sealed.nonce, "base64"),
    Buffer.from(sealed.senderPublicKey, "base64"), pair.secretKey);
  if (!opened) { console.error("The sealed key does not open with this browser key."); process.exit(3); }
  const bundle = new TextDecoder().decode(opened);
  const digest = createHash("sha256").update(bundle).digest("hex");
  console.log("digest", digest === transfer.keyDigest ? "matches" : "DOES NOT MATCH", "·", JSON.parse(bundle).pairings.length, "computer(s)");
  const stored = await call("web-key", { transferId: transfer.id, bundle }, "PUT");
  console.log("deposit:", stored.status, JSON.stringify(stored.body));
  process.exit(stored.status === 200 ? 0 : 4);
}
