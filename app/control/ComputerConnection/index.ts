import nacl from "tweetnacl";
import { base64, browserKeyPair, unbase64, type BrowserPairing } from "../Cryptography";

/** Authenticated account recovery; the server receives an ephemeral public key only. */
export async function connectAccountComputer(machineId: string, signal: AbortSignal,
  request: typeof fetch = fetch): Promise<BrowserPairing> {
  const ephemeral = browserKeyPair();
  const opened = await request(`/api/account/machines/${encodeURIComponent(machineId)}/requests`, {
    method: "POST", headers: { "content-type": "application/json" }, signal,
    body: JSON.stringify({ phonePublicKey: ephemeral.publicKey.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") }),
  });
  if (!opened.ok) throw Error("This computer could not accept a browser connection.");
  const { id, expiresAt } = await opened.json();
  if (typeof id !== "string" || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) throw Error("Invalid connection response.");
  while (!signal.aborted && Date.now() < expiresAt) {
    const response = await request(`/api/account/requests/${encodeURIComponent(id)}`, { signal });
    if (response.status === 200) {
      const value = await response.json();
      if (typeof value.encryptedOffer !== "string") throw Error("Invalid encrypted connection offer.");
      return openComputerOffer(value.encryptedOffer, ephemeral.secretKey, id, machineId);
    }
    if (response.status !== 202) throw Error("The connection request expired or was revoked.");
    await pause(signal);
  }
  throw Error(signal.aborted ? "Connection cancelled." : "This computer is offline. Open GrantTap MCP there and retry.");
}

export function openComputerOffer(encrypted: string, secret: string, requestId: string,
  machineId: string): BrowserPairing {
  try {
    if (encrypted.length > 8_192) throw Error();
    const envelope = JSON.parse(encrypted);
    const bytes = nacl.box.open(unbase64(envelope.box), unbase64(envelope.nonce),
      unbase64(envelope.senderPublicKey), unbase64(secret));
    if (!bytes) throw Error();
    const offer = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (offer.schema !== "granttap.account-offer.v1" || offer.requestId !== requestId || offer.machineId !== machineId) throw Error();
    const pair = offer.pairing;
    const url = new URL(pair.relayUrl);
    if (url.protocol !== "wss:" || url.host !== "relay.granttap.com" || !["/", "/ws"].includes(url.pathname)
      || url.username || url.password || url.search || url.hash || pair.role !== "phone"
      || !/^[a-f0-9]{16,64}$/.test(pair.room) || !/^[a-f0-9]{64}$/.test(pair.pushAuth)
      || ![pair.myPublicKey, pair.mySecretKey, pair.peerPublicKey].every(key =>
        typeof key === "string" && /^[A-Za-z0-9+/]{43}=$/.test(key) && unbase64(key).length === 32)
      || base64(nacl.box.keyPair.fromSecretKey(unbase64(pair.mySecretKey)).publicKey) !== pair.myPublicKey
      || typeof pair.senderId !== "string" || pair.senderId.length < 1 || pair.senderId.length > 180
      || typeof pair.deviceName !== "string" || pair.deviceName.length > 180) throw Error();
    return { machineId, relayUrl: pair.relayUrl, role: "phone", room: pair.room, deviceName: pair.deviceName,
      senderId: pair.senderId, myPublicKey: pair.myPublicKey, mySecretKey: pair.mySecretKey,
      peerPublicKey: pair.peerPublicKey, pushAuth: pair.pushAuth };
  } catch { throw Error("The encrypted computer offer is invalid or belongs to another request."); }
}

function pause(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(Error("Connection cancelled.")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 1_500);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
  });
}
