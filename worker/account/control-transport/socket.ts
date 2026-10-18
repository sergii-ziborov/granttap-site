import { WebSocket } from "ws";
import type { ControlApi, ControlTransportOptions } from "./index";
import { controlConnection, controllerFrame, MAX_CONTROL_FRAME, recipientDigest, type ControlConnection } from "./frames";

export function bridgeControlSocket(client: WebSocket, request: Request, api: ControlApi,
  options: ControlTransportOptions) {
  let relay: WebSocket | undefined;
  let renewal: ReturnType<typeof setTimeout> | undefined;
  let expiry: ReturnType<typeof setTimeout> | undefined;
  let ready = false;
  const close = (code = 1011, reason = "Control connection unavailable") => {
    clearTimeout(renewal); clearTimeout(expiry);
    if (client.readyState < WebSocket.CLOSING) client.close(code, reason);
    relay?.terminate();
  };
  const initial = setTimeout(() => close(4403, "Connection identity required"), 5_000);
  initial.unref();
  client.on("error", () => close());
  client.once("close", () => { clearTimeout(initial); clearTimeout(renewal); clearTimeout(expiry); relay?.terminate(); });
  client.once("message", (raw, binary) => {
    clearTimeout(initial);
    const identity = !binary ? controlConnection(raw.toString()) : null;
    if (!identity) return close(4403, "Invalid connection identity");
    client.on("message", (data, binaryFrame) => {
      if (binaryFrame || !ready || !controllerFrame(data.toString(), identity.room)) return close(4403, "Invalid control frame");
      if (!relay || relay.bufferedAmount > MAX_CONTROL_FRAME) return close(1013, "Relay is busy");
      relay.send(data, { binary: false });
    });
    void connect(identity).catch(() => close());
  });

  async function access(identity: ControlConnection) {
    const response = await api(new Request("https://granttap.com/api/account/control/admission", {
      method: "POST", headers: { ...Object.fromEntries(request.headers), "content-type": "application/json" },
      body: JSON.stringify({ computerId: identity.computerId, room: identity.room, publicKey: identity.publicKey }),
    }));
    if (!response?.ok) throw Error("Account access unavailable");
    const lease = await response.json();
    if (typeof lease.ticket !== "string" || !Number.isFinite(lease.expiresAt) || lease.expiresAt <= Date.now()) {
      throw Error("Account access expired");
    }
    clearTimeout(expiry); expiry = setTimeout(() => close(4403, "Account access expired"), lease.expiresAt - Date.now());
    expiry.unref();
    return lease as { ticket: string; expiresAt: number };
  }

  async function connect(identity: ControlConnection) {
    const lease = await access(identity);
    if (client.readyState !== WebSocket.OPEN) return;
    const url = new URL(options.relayUrl ?? "wss://relay.granttap.com/ws");
    url.searchParams.set("room", identity.room);
    relay = new WebSocket(url, { maxPayload: MAX_CONTROL_FRAME, handshakeTimeout: 8_000, headers: {
      Authorization: `Bearer ${identity.credential}`, "X-GrantTap-Admission": lease.ticket,
      "X-GrantTap-Recipient-Key-Id": recipientDigest(identity.publicKey), "X-GrantTap-Recipient-Routing": "1",
    } });
    relay.on("error", () => close());
    relay.on("close", () => close(1012, "Relay connection ended"));
    relay.on("message", (data, binary) => {
      if (binary || client.readyState !== WebSocket.OPEN) return;
      if (client.bufferedAmount > MAX_CONTROL_FRAME) return close(1013, "Browser is busy");
      client.send(data, { binary: false });
    });
    relay.once("open", () => {
      ready = true; client.send(JSON.stringify({ type: "control.ready" })); schedule(identity, lease.expiresAt);
    });
  }

  function schedule(identity: ControlConnection, expiresAt: number) {
    const delay = Math.min(options.renewalMs ?? 240_000, Math.max(1_000, expiresAt - Date.now() - 15_000));
    renewal = setTimeout(() => {
      void access(identity).then(lease => {
        if (relay?.readyState !== WebSocket.OPEN || client.readyState !== WebSocket.OPEN) return close();
        relay.send(JSON.stringify({ type: "relay.admission", ticket: lease.ticket })); schedule(identity, lease.expiresAt);
      }).catch(() => close(4403, "Account access must be renewed"));
    }, delay);
    renewal.unref();
  }
}
