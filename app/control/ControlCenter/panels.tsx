"use client";
import { useRef, useState } from "react";
import type { ControlAccount } from "../AccountAccess/use-account";
import type { ControlView } from "../ControlRuntime";

export function BrowserSafety({ compact = false }: { compact?: boolean }) {
  return <aside className="gt-browser-safety"><span aria-hidden="true">◈</span><div><h3>Browser storage is less secure than the native app.</h3>
    <p>This browser stores encryption keys and an encrypted history cache on this device. Website code and extensions with access to this site can use those keys.
      A compromised website or browser can expose your control session. Native apps add operating-system key storage and signed application code.</p>
    {!compact && <p>Use a trusted browser profile. Avoid shared computers. “Forget this browser” removes local keys and history. Relay stores encrypted messages;
      the website transport sees account and routing information, not your private encryption keys.</p>}
    <a href="/privacy#browser-control">Read about browser security ↗</a></div></aside>;
}

export function ComputerList({ account, view, connect, forget }: { account: ControlAccount; view: ControlView;
  connect: (machineId: string, signal: AbortSignal) => Promise<void>; forget: () => Promise<void> }) {
  const [consent, setConsent] = useState(false); const [pending, setPending] = useState(""); const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const start = async (id: string) => {
    controller.current?.abort(); controller.current = new AbortController(); setPending(id); setError("");
    try { await connect(id, controller.current.signal); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Computer connection failed."); }
    finally { setPending(""); }
  };
  const remove = async () => {
    if (!confirm("Forget this browser's encryption keys and cached history? Other devices stay connected.")) return;
    controller.current?.abort(); try { await forget(); } catch { setError("Browser keys could not be removed. Please retry."); }
  };
  return <section><BrowserSafety />
    <label className="gt-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />
      I understand that this browser will store GrantTap encryption keys.</label>
    <div className="gt-computer-list">{account.machines.map(machine => <article className="gt-surface" key={machine.id}>
      <div><h3>{machine.name}</h3><p className="gt-muted">{account.connected.has(machine.id)
        ? view.connections[machine.id] === "connected" ? "Relay connected · computer availability is separate" : "Reconnecting to relay…"
        : "Not connected to this browser"}</p></div>
      {account.connected.has(machine.id) ? <span className="gt-status">Browser authorized</span>
        : <button className="gt-primary" disabled={!consent || Boolean(pending)} onClick={() => void start(machine.id)}>
          {pending === machine.id ? "Waiting for computer…" : "Connect browser"}</button>}
    </article>)}</div>
    {!account.machines.length && <p className="gt-empty">No computers are linked to this account. On your Windows, Mac or Linux computer,
      install GrantTap MCP and sign in with this passkey. <a href="/support">Connection guide →</a></p>}
    {pending && <button onClick={() => controller.current?.abort()}>Cancel connection</button>}
    {error && <p role="alert">{error}</p>}
    {account.connected.size > 0 && <button className="gt-danger" onClick={() => void remove()}>Forget this browser</button>}
  </section>;
}

export function UsageView({ view }: { view: ControlView }) {
  const sessions = Object.values(view.computers).flatMap(snapshot => snapshot.sessions);
  const catalogs = Object.values(view.computers).flatMap(snapshot => snapshot.meshes).flatMap(mesh => mesh.modelCatalog ?? []);
  const usage = [...new Map(catalogs.flatMap(catalog => catalog.accountUsage ?? [])
    .sort((a, b) => a.observedAt - b.observedAt).map(item => [item.provider + ":" + item.limitId, item])).values()];
  return <section><p className="gt-eyebrow">Usage reported by your computers</p><h2>Know where you stand.</h2>
    <div className="gt-card-grid">{["codex", "claude", "cursor", "grok"].map(provider => <article className="gt-surface" key={provider}>
      <h3>{provider}</h3><p>{sessions.filter(session => session.agent === provider).reduce((total, session) => total + session.tokensSession, 0).toLocaleString()} tokens in loaded Tasks</p>
      {usage.filter(item => item.provider === provider).length ? usage.filter(item => item.provider === provider).map(item => <div key={item.limitId}>
        {item.windows.map(window => <div className="gt-usage-window" key={window.id}><label>{window.windowMinutes / 60}h · {Math.max(0, 100 - window.usedPercent)}% remaining</label>
          <progress value={window.usedPercent} max={100} /><small>Resets {new Date(window.resetsAt * 1_000).toLocaleString()}</small></div>)}
        <small className="gt-muted">Reported {new Date(item.observedAt).toLocaleString()}</small></div>)
        : <p className="gt-muted">Subscription limits have not been reported.</p>}
    </article>)}</div><p className="gt-muted">These are confirmed reports for loaded Tasks. Missing provider data stays unknown.</p></section>;
}
