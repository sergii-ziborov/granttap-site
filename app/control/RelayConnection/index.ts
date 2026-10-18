import { Payload } from "../ControlProtocol";
import { openBrowserEnvelope, sealBrowserPayload, type BrowserPairing } from "../Cryptography";

export type RelayEvents = {
  payload: (payload: Payload) => Promise<void>;
  status: (state: "connecting" | "connected" | "reconnecting" | "closed") => void;
  grant: (sessionId: string, key: string) => Promise<void>;
};

/** A submission completes on relay storage acknowledgement, independently of the MCP. */
export class BrowserRelayConnection {
  private socket?: WebSocket;
  private stopped = false;
  private ready = false;
  private retry?: ReturnType<typeof setTimeout>;
  private chain: Promise<unknown> = Promise.resolve();
  private grants: Record<string, string>;
  private pending = new Map<string, { raw: string; resolve: () => void; reject: (error: Error) => void;
    timeout: ReturnType<typeof setTimeout> }>();
  constructor(private readonly pairing: BrowserPairing, grants: Record<string, string>,
    private readonly events: RelayEvents, private readonly makeSocket = (url: string) => new WebSocket(url)) {
    this.grants = { ...grants };
  }

  start() {
    if (this.stopped || this.socket && this.socket.readyState < WebSocket.CLOSING) return;
    this.events.status("connecting");
    const url = new URL("/api/account/control/socket", location.origin);
    url.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const socket = this.makeSocket(url.href); this.socket = socket;
    socket.onopen = () => socket.send(JSON.stringify({ type: "control.connect", computerId: this.pairing.machineId,
      room: this.pairing.room, publicKey: this.pairing.myPublicKey, credential: this.pairing.pushAuth }));
    socket.onmessage = event => {
      this.chain = this.chain.then(() => this.receive(String(event.data))).catch(() => socket.close());
    };
    socket.onerror = () => socket.close();
    socket.onclose = () => {
      this.ready = false;
      if (this.stopped) return;
      this.events.status("reconnecting");
      this.retry = setTimeout(() => this.start(), 2_000);
    };
  }

  async submit(payload: Payload, deliveryId: string): Promise<void> {
    if (this.stopped) throw Error("This browser connection is closed.");
    if (!["user-message-", "approval-decision-", "attachment-"].some(prefix =>
      deliveryId.startsWith(prefix) && deliveryId.length > prefix.length) || deliveryId.length > 180) {
      throw Error("A relay-durable delivery identifier is required.");
    }
    if (this.pending.size >= 100) throw Error("Too many submissions are waiting for the relay.");
    if (this.pending.has(deliveryId)) throw Error("This submission is already waiting for relay storage.");
    const envelope = await sealBrowserPayload(this.pairing, Payload.parse(payload), { deliveryId,
      ttlMs: ["user.message", "project.task.create"].includes(payload.type) ? 30 * 86_400_000 : 15 * 60_000 });
    if (this.stopped) throw Error("This browser connection is closed.");
    if (this.pending.has(deliveryId)) throw Error("This submission is already waiting for relay storage.");
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(deliveryId);
        reject(Error("Relay has not confirmed storage. Retry the same message.")); }, 12_000);
      const value = { raw: JSON.stringify(envelope), resolve, reject, timeout };
      this.pending.set(deliveryId, value);
      if (this.ready && this.socket?.readyState === WebSocket.OPEN) this.socket.send(value.raw);
    });
  }

  async send(payload: Payload, scope?: string): Promise<void> {
    if (!this.ready || this.socket?.readyState !== WebSocket.OPEN) throw Error("Relay is reconnecting or closed. Retry when connected.");
    const options = scope ? { sessionId: scope, sessionKey: this.grants[scope] } : {};
    if (scope && !this.grants[scope]) throw Error("Waiting for this Task's encryption key.");
    this.socket.send(JSON.stringify(await sealBrowserPayload(this.pairing, Payload.parse(payload),
      { ...options, reliable: false, ttlMs: 60_000 })));
  }

  stop() {
    this.stopped = true; this.ready = false; clearTimeout(this.retry); this.socket?.close();
    for (const value of this.pending.values()) { clearTimeout(value.timeout); value.reject(Error("Connection closed before relay confirmation.")); }
    this.pending.clear(); this.events.status("closed");
  }

  private async receive(raw: string) {
    const frame = JSON.parse(raw);
    if (frame.type === "control.ready") {
      this.ready = true; this.events.status("connected");
      await this.send({ type: "hello", role: "phone", deviceName: "GrantTap Web", createdAt: Date.now() });
      await this.send({ type: "sessions.refresh", createdAt: Date.now() });
      for (const value of this.pending.values()) this.socket?.send(value.raw);
      return;
    }
    if (["relay.stored", "relay.dropped"].includes(frame.type)) {
      const value = this.pending.get(frame.deliveryId);
      if (!value) return;
      clearTimeout(value.timeout); this.pending.delete(frame.deliveryId);
      if (frame.type === "relay.stored") value.resolve(); else value.reject(Error("Relay could not store this submission."));
      return;
    }
    const opened = await openBrowserEnvelope(this.pairing, frame, this.grants);
    if (!opened) return;
    const parsed = Payload.safeParse(opened);
    if (!parsed.success) return;
    if (parsed.data.type === "session.key.grant") {
      await this.events.grant(parsed.data.sessionId, parsed.data.key); this.grants[parsed.data.sessionId] = parsed.data.key;
    } else await this.events.payload(parsed.data);
    if (typeof frame.deliveryId === "string") this.socket?.send(JSON.stringify({ type: "relay.ack", deliveryId: frame.deliveryId }));
  }
}
