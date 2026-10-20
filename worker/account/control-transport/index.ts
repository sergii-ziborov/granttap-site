import type { IncomingMessage, Server } from "node:http";
import type { Duplex } from "node:stream";
import type { Socket } from "node:net";
import { WebSocketServer, type WebSocket } from "ws";
import { CONTROL_SOCKET_PATH, MAX_CONTROL_FRAME } from "./frames";
import { bridgeControlSocket } from "./socket";

export type ControlApi = (request: Request) => Promise<Response | null>;
export type ControlTransportOptions = { relayUrl?: string; renewalMs?: number;
  admitClient?: (request: IncomingMessage) => Promise<{allowed:boolean;reason?:string;category?:string;onConnected?:(client:WebSocket)=>void;cancel?:()=>Promise<unknown>}> };

/** Fixed-origin browser transport. Private encryption keys remain in the browser. */
export function attachControlTransport(server: Server, api: ControlApi, options: ControlTransportOptions = {}) {
  const sockets = new WebSocketServer({ noServer: true, maxPayload: MAX_CONTROL_FRAME });
  const accounts = new Map<string, number>();
  const upgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    (socket as Socket).setTimeout(10_000, () => socket.destroy());
    void authorizeUpgrade(request, socket, head, sockets, api, accounts, options).catch(() => refuse(socket, 503));
  };
  server.on("upgrade", upgrade);
  const stop = () => { server.off("upgrade", upgrade); sockets.clients.forEach(socket => socket.terminate()); sockets.close(); };
  server.once("close", stop);
  return Object.assign(stop, { capacity: () => sockets.clients.size });
}

async function authorizeUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer,
  sockets: WebSocketServer, api: ControlApi, accounts: Map<string, number>, options: ControlTransportOptions) {
  if (request.url !== CONTROL_SOCKET_PATH || request.headers.origin !== "https://granttap.com") return refuse(socket, 403);
  const accountRequest = new Request("https://granttap.com/api/account/control/access", {
    headers: { cookie: request.headers.cookie ?? "", origin: "https://granttap.com" },
  });
  const response = await api(accountRequest);
  if (socket.destroyed) return;
  if (!response?.ok) return refuse(socket, response?.status ?? 503);
  const value = await response.json();
  if (typeof value.accountId !== "string" || !Number.isFinite(value.access?.expiresAt)) return refuse(socket, 503);
  if ((accounts.get(value.accountId) ?? 0) >= 8) return refuse(socket, 429, "account-connections", value.access.source === "subscription" ? "subscriber" : "beta");
  const admission = await options.admitClient?.(request);
  if (admission && !admission.allowed) return refuse(socket, 429, admission.reason, admission.category);
  if (socket.destroyed || (accounts.get(value.accountId) ?? 0) >= 8) {
    await admission?.cancel?.();
    return refuse(socket, 429, "account-connections", admission?.category);
  }
  accounts.set(value.accountId, (accounts.get(value.accountId) ?? 0) + 1);
  (socket as Socket).setTimeout(0);
  sockets.handleUpgrade(request, socket, head, client => {
    admission?.onConnected?.(client);
    client.once("close", () => {
      const count = (accounts.get(value.accountId) ?? 1) - 1;
      if (count > 0) accounts.set(value.accountId, count); else accounts.delete(value.accountId);
    });
    bridgeControlSocket(client, accountRequest, api, options);
  });
}

function refuse(socket: Duplex, status: number, reason?: string, category?: string) {
  if (socket.destroyed) return;
  const names: Record<number, string> = { 401: "Unauthorized", 403: "Forbidden", 429: "Too Many Requests", 503: "Service Unavailable" };
  const evidence = reason && /^[a-z-]+$/.test(reason) && ['subscriber','beta','registered','anonymous'].includes(category ?? '')
    ? `X-Hostwatch-Client-Category: ${category}\r\nX-Hostwatch-Client-Limit: ${reason}\r\nRetry-After: 5\r\n` : '';
  socket.end(`HTTP/1.1 ${status} ${names[status] ?? "Unavailable"}\r\nConnection: close\r\nCache-Control: no-store\r\n${evidence}Content-Length: 0\r\n\r\n`);
}
