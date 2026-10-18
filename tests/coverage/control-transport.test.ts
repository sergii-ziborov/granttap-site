// @vitest-environment node
import { afterEach, expect, it } from "vitest";
import { once } from "node:events";
import { createServer, type Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { attachControlTransport } from "../../worker/account/control-transport";

const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); });
async function fixture(allowed = true, renewalMs = 10_000) {
  const upstream = new WebSocketServer({ port: 0, host: "127.0.0.1" });
  await once(upstream, "listening");
  const hello = { computerId: "12345678-1234-4123-8123-123456789012", room: "a".repeat(32),
    publicKey: Buffer.alloc(32, 2).toString("base64"), credential: "b".repeat(64) };
  const apiCalls: Request[] = [];
  const access = { admissionStatus: 200, expiresAt: () => Date.now() + 60_000 };
  const api = async (request: Request) => {
    apiCalls.push(request);
    if (!allowed || request.headers.get("cookie") !== "granttap_session=fixture") {
      return Response.json({ error: "Sign in required." }, { status: 401 });
    }
    if (request.url.endsWith("/admission")) {
      const value = await request.clone().json();
      if (value.room !== hello.room) return Response.json({}, { status: 403 });
      return Response.json({ ticket: "opaque-signed-ticket", expiresAt: access.expiresAt() }, { status: access.admissionStatus });
    }
    return Response.json({ accountId: "fixture", access: { expiresAt: Date.now() + 60_000 } });
  };
  const server: Server = createServer();
  const stop = attachControlTransport(server, api,
    { relayUrl: `ws://127.0.0.1:${(upstream.address() as { port: number }).port}`, renewalMs });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const clients: WebSocket[] = [];
  const connect = (origin = "https://granttap.com") => {
    const client = new WebSocket(`ws://127.0.0.1:${(server.address() as { port: number }).port}/api/account/control/socket`,
      { headers: { origin, cookie: "granttap_session=fixture" } });
    clients.push(client); client.on("error", () => {}); return client;
  };
  cleanups.push(async () => { clients.forEach(client => client.terminate());
    upstream.clients.forEach(client => client.terminate()); stop();
    await new Promise<void>(resolve => server.close(() => resolve()));
    await new Promise<void>(resolve => upstream.close(() => resolve())); });
  return { hello, upstream, apiCalls, connect, access };
}

it("checks the account before connecting and forwards only encrypted, room-bound control frames", async () => {
  const f = await fixture(); const upstreamConnection = once(f.upstream, "connection");
  const client = f.connect(); await once(client, "open");
  const ready = once(client, "message"); client.send(JSON.stringify({ type: "control.connect", ...f.hello }));
  const [relay, upgrade] = await upstreamConnection;
  expect(upgrade.headers["authorization"]).toBe(`Bearer ${f.hello.credential}`);
  expect(upgrade.headers["x-granttap-admission"]).toBe("opaque-signed-ticket");
  expect(JSON.parse(String((await ready)[0])).type).toBe("control.ready");
  const frame = { v: 1, from: "phone", to: "machine", room: f.hello.room, senderId: "web-fixture",
    nonce: "a".repeat(32), box: "b".repeat(24), deliveryId: "user-message-web" };
  const forwarded = once(relay, "message"); client.send(JSON.stringify(frame));
  const [forwardedFrame, binary] = await forwarded;
  expect(binary, "the ciphertext protocol uses text frames; relay ignores binary frames").toBe(false);
  expect(JSON.parse(String(forwardedFrame))).toEqual(frame);
  const received = once(client, "message"); relay.send(JSON.stringify({ type: "relay.stored", deliveryId: frame.deliveryId }));
  expect(JSON.parse(String((await received)[0])).type).toBe("relay.stored");
  const closed = once(client, "close"); client.send(JSON.stringify({ ...frame, room: "other" }));
  expect((await closed)[0]).toBe(4403);
  expect(f.apiCalls).toHaveLength(2);
});

it("refuses foreign origins and inactive accounts before the websocket opens", async () => {
  for (const [allowed, origin, status] of [[true, "https://evil.example", 403], [false, "https://granttap.com", 401]] as const) {
    const f = await fixture(allowed); const client = f.connect(origin);
    const response = await once(client, "unexpected-response");
    expect(response[1].statusCode).toBe(status); response[1].resume(); client.terminate();
    expect(f.upstream.clients.size).toBe(0);
  }
});

it("rejects unknown connection fields so private keys and arbitrary relay addresses cannot enter the proxy", async () => {
  const f = await fixture(); const client = f.connect(); await once(client, "open");
  const closed = once(client, "close");
  client.send(JSON.stringify({ type: "control.connect", ...f.hello, mySecretKey: "never-send-this" }));
  expect((await closed)[0]).toBe(4403); expect(f.upstream.clients.size).toBe(0);
});
it("closes an existing control connection when renewed account access is revoked", async () => {
  const f = await fixture(true, 20), client = f.connect(); await once(client, "open");
  const ready = once(client, "message"); client.send(JSON.stringify({ type: "control.connect", ...f.hello })); await ready;
  f.access.admissionStatus = 403;
  const [code, reason] = await once(client, "close");
  expect(code).toBe(4403); expect(String(reason)).toBe("Account access must be renewed");
  expect(f.apiCalls.filter(request => request.url.endsWith("/admission"))).toHaveLength(2);
});
it("refuses expired leases and wrong computer routes before opening the upstream relay", async () => {
  for (const mode of ["expired", "wrong-room"] as const) {
    const f = await fixture(), client = f.connect(); await once(client, "open");
    if (mode === "expired") f.access.expiresAt = () => Date.now() - 1;
    const closed = once(client, "close"); client.send(JSON.stringify({ type: "control.connect", ...f.hello,
      ...(mode === "wrong-room" ? { room: "c".repeat(32) } : {}) }));
    expect((await closed)[0]).toBe(1011); expect(f.upstream.clients.size).toBe(0);
  }
});
it("bounds control sockets per account and releases a slot when a tab closes", async () => {
  const f = await fixture(), opened: WebSocket[] = [];
  for (let index = 0; index < 8; index++) { const client = f.connect(); await once(client, "open"); opened.push(client); }
  const excess = f.connect(), [, response] = await once(excess, "unexpected-response");
  expect(response.statusCode).toBe(429); response.resume(); excess.terminate();
  const closed = once(opened[0], "close"); opened[0].close(); await closed;
  const replacement = f.connect(); await once(replacement, "open"); expect(replacement.readyState).toBe(WebSocket.OPEN);
});
it("never forwards binary identity frames or plaintext agent commands", async () => {
  const f = await fixture(), binary = f.connect(); await once(binary, "open");
  const rejected = once(binary, "close"); binary.send(Buffer.from(JSON.stringify({ type: "control.connect", ...f.hello })));
  expect((await rejected)[0]).toBe(4403); expect(f.upstream.clients.size).toBe(0);
  const client = f.connect(); await once(client, "open");
  const ready = once(client, "message"); client.send(JSON.stringify({ type: "control.connect", ...f.hello })); await ready;
  const closed = once(client, "close"); client.send(JSON.stringify({ type: "user.message", text: "Synthetic plaintext must not be forwarded" }));
  expect((await closed)[0]).toBe(4403);
});
