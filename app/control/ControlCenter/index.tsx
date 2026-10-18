"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useControlAccount, type ControlAccount } from "../AccountAccess/use-account";
import { ApprovalCard } from "../Approvals";
import type { SessionInfo } from "../ControlProtocol";
import { TaskChat } from "../Chat";
import { MeshView } from "../Mesh";
import { QueuedTaskCards } from "../TaskQueue";
import { BrowserSafety, ComputerList, UsageView } from "./panels";
import "../control.css";

export function ControlCenter() {
  const access = useControlAccount();
  return <main className="gt-control">
    {access.status !== "ready" || !access.account ? <AccessGate status={access.status} error={access.error} retry={access.retry} />
      : <Workspace key={access.account.accountId} account={access.account} connect={access.connect} forget={access.forget} />}
  </main>;
}

function AccessGate({ status, error, retry }: { status: string; error: string; retry: () => void }) {
  return <section className="gt-access-gate">
    <Link href="/"><Image unoptimized src="/app-icon.png" width={52} height={52} alt="GrantTap" /></Link>
    <p className="gt-eyebrow">GrantTap Web</p><h1>Your agents. Wherever you are.</h1>
    <p>Continue Tasks, answer questions and keep work moving across your computers.</p>
    {status === "loading" ? <p role="status">Verifying your account…</p> : status === "signin"
      ? <><a className="gt-primary" href="/account?returnTo=control">Sign in with a passkey →</a>
        <p className="gt-muted">Use the same account as your GrantTap computers.</p></>
      : status === "subscription" ? <><h2>GrantTap access is required</h2>
        <p>An active subscription, eligible subscription trial or verified TestFlight access unlocks control.</p>
        <div className="gt-actions"><a className="gt-primary" href="/pricing">View plans</a><a href="/account">Manage account</a></div>
        <p className="gt-muted">Eligible subscriptions include a 7-day trial. Official TestFlight testing does not require a purchase or consume this trial.</p>
        <button onClick={retry}>Check again</button></>
      : <><p role="alert">{error || "Account verification is temporarily unavailable."}</p><button onClick={retry}>Retry</button></>}
    <BrowserSafety compact />
  </section>;
}

type WorkspaceProps = { account: ControlAccount; connect: (machineId: string, signal: AbortSignal) => Promise<void>; forget: () => Promise<void> };
function Workspace({ account, connect, forget }: WorkspaceProps) {
  const view = useSyncExternalStore(account.runtime.subscribe, account.runtime.snapshot, account.runtime.snapshot);
  const [section, setSection] = useState("Now"); const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{ machineId: string; sessionId: string }>();
  const [chosenComputer, setComputer] = useState("");
  const computer = account.connected.has(chosenComputer) ? chosenComputer
    : account.machines.find(machine => account.connected.has(machine.id))?.id ?? "";
  const tasks = Object.entries(view.computers).flatMap(([machineId, snapshot]) => snapshot.sessions.map(session => ({ machineId, session })));
  const queued = account.runtime.queuedTasks();
  const pending = Object.entries(view.computers).flatMap(([machineId, snapshot]) => snapshot.approvals.map(request => ({ machineId, request })));
  const current = selected && tasks.find(task => task.machineId === selected.machineId && task.session.sessionId === selected.sessionId);
  const open = (machineId: string, session: SessionInfo) => { setSelected({ machineId, sessionId: session.sessionId }); };
  const choose = (value: string) => { setSection(value); setSelected(undefined); };
  const matched = tasks.filter(task => `${task.session.title ?? ""} ${task.session.agent} ${task.session.summary ?? ""}`
    .toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.session.lastActivityAt - a.session.lastActivityAt);
  return <div className="gt-workspace">
    <aside className="gt-sidebar"><a href="/control" className="gt-brand"><Image unoptimized src="/app-icon.png" width={30} height={30} alt="" />GrantTap</a>
      <span className="gt-eyebrow">Your control center</span>
      <nav aria-label="GrantTap"><>{["Now", "Tasks", "Mesh", "Usage", "Computers"].map((item, index) => <button key={item}
        aria-current={section === item && !current ? "page" : undefined} onClick={() => choose(item)}>
        <span aria-hidden="true">{["ϟ", "▤", "⌘", "▥", "▣"][index]}</span>{item}{item === "Now" && pending.length > 0 && <b>{pending.length}</b>}</button>)}</></nav>
      <div className="gt-sidebar-bottom"><a href="/support">Help & FAQ ↗</a><a href="/account">Account ↗</a>
        <small>{account.source === "beta" ? "TestFlight access included" : "Subscription verified"}</small></div>
    </aside>
    <div className="gt-main"><header className="gt-toolbar"><h1>{current ? "Task" : section}</h1>
      <div className="gt-relay-state" data-connected={Object.values(view.connections).includes("connected")}><i />{Object.values(view.connections).includes("connected") ? "Relay connected" : "Relay not connected"}</div></header>
      {view.error && <p role="status" className="gt-notice">{view.error}</p>}
      {current ? <TaskChat key={current.session.sessionId} runtime={account.runtime} machineId={current.machineId}
        session={current.session} view={view} back={() => setSelected(undefined)} />
        : <div className="gt-content">
          {section === "Computers" ? <ComputerList account={account} view={view} connect={connect} forget={forget} />
            : !account.connected.size ? <><h2>Connect your first computer</h2><p>Authorize this browser once. Afterwards relay can keep messages while the computer is offline.</p>
              <ComputerList account={account} view={view} connect={connect} forget={forget} /></>
            : section === "Mesh" ? <><div className="gt-section-heading"><p className="gt-muted">The workspace for your Tasks</p>
              <select aria-label="Mesh computer" value={computer} onChange={event => setComputer(event.target.value)}>
                {account.machines.filter(machine => account.connected.has(machine.id)).map(machine => <option key={machine.id} value={machine.id}>{machine.name}</option>)}
              </select></div><MeshView key={computer} machineId={computer} meshes={view.computers[computer]?.meshes ?? []}
                sessions={view.computers[computer]?.sessions ?? []} runtime={account.runtime} openTask={session => open(computer, session)} /></>
            : section === "Usage" ? <UsageView view={view} />
            : <><div className="gt-page-intro"><p className="gt-eyebrow">{section === "Now" ? "Keep work moving" : "Your conversations"}</p>
              <h2>{section === "Now" ? pending.length ? "Your agents need a decision." : "A little clarity. More progress." : "Pick up where you left off."}</h2>
              <p className="gt-muted">Tasks stay with you across providers and computers.</p></div>
              {section === "Now" && pending.map(({ machineId, request }) => <ApprovalCard key={machineId + request.requestId} request={request}
                delivery={account.runtime.approvalDelivery(machineId, request)} decide={(decision, note) => account.runtime.decision(machineId, request, decision, note)} />)}
              <input className="gt-task-search" type="search" aria-label="Search Tasks" placeholder="Search your Tasks" value={query} onChange={event => setQuery(event.target.value)} />
              <div className="gt-card-grid"><QueuedTaskCards commands={queued} query={query} />{matched.map(({ machineId, session }) => <button className="gt-task-card" key={machineId + session.sessionId}
                onClick={() => open(machineId, session)}><div className="gt-section-heading"><Image unoptimized src={`/providers/${["claude", "codex", "cursor", "grok"].includes(session.agent) ? session.agent : "codex"}.png`}
                  width={28} height={28} alt={session.agent} /><span className="gt-status" data-state={session.state}>{session.state}</span></div>
                <h3>{session.title || "Untitled Task"}</h3><small>{session.agent} · {account.machines.find(machine => machine.id === machineId)?.name || "Computer"}</small>
                <p>{session.summary || "Open conversation →"}</p>{session.transfer && <span className="gt-transfer-label">↗ Transferred</span>}</button>)}</div>
              {!matched.length && !queued.length && <p className="gt-empty">No Tasks in the latest snapshot. Open Mesh to create one, or wait for your computer to report.</p>}</>}
        </div>}
    </div>
  </div>;
}
