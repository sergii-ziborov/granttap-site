"use client";
import { memo, useEffect, useState } from "react";
import type { ControlRuntime, ControlView } from "../ControlRuntime";
import type { SessionInfo } from "../ControlProtocol";
import { ApprovalCard } from "../Approvals";
import { ChatComposer } from "./Composer";
import { OutgoingMessages } from "./OutgoingMessages";

export const TaskChat = memo(function TaskChat({ runtime, machineId, session, view, back }: {
  runtime: ControlRuntime; machineId: string; session: SessionInfo; view: ControlView; back: () => void;
}) {
  const [error, setError] = useState(""); const [visible, setVisible] = useState(120);
  const computer = view.computers[machineId]; const connected = view.connections[machineId] === "connected";
  const entries = computer?.transcript[session.sessionId] ?? [];
  useEffect(() => {
    if (!connected) return;
    const subscribe = () => { void runtime.command(machineId, { type: "session.subscribe", sessionId: session.sessionId,
      active: true, createdAt: Date.now() }).catch(() => {}); };
    subscribe(); const timer = setInterval(subscribe, 10_000);
    return () => { clearInterval(timer); if (runtime.snapshot().connections[machineId] === "connected") {
      void runtime.command(machineId, { type: "session.subscribe", sessionId: session.sessionId,
        active: false, createdAt: Date.now() }).catch(() => {}); } };
  }, [runtime, machineId, session.sessionId, connected]);
  const control = async () => {
    setError("");
    try { await runtime.command(machineId, { type: "session.control", sessionId: session.sessionId,
      action: session.paused ? "resume" : "pause", createdAt: Date.now() }, session.sessionId); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Task control could not be sent."); }
  };
  return <section className="gt-chat">
    <header className="gt-chat-header"><button onClick={back} aria-label="Back to Tasks">←</button>
      <div><h2>{session.title || "Untitled Task"}</h2><span className="gt-muted">{session.agent} · {session.model || "Agent default"}</span></div>
      <button onClick={() => void control()}>{session.paused ? "Resume" : "Pause"}</button></header>
    {session.transfer && <p className="gt-notice">This Task has a transfer record. Review its destination before continuing this branch.</p>}
    <div className="gt-transcript" aria-label="Task conversation">
      {entries.length > visible && <button onClick={() => setVisible(value => value + 120)}>Show earlier messages</button>}
      {!entries.length && <div className="gt-empty"><h3>{connected ? "Opening this Task" : "Computer is currently unavailable"}</h3>
        <p>You can send a message now. Relay keeps it until the computer can receive it.</p></div>}
      {entries.slice(-visible).map(entry => <article key={entry.id} className="gt-message" data-kind={entry.kind}>
        <div className="gt-eyebrow">{entry.kind === "user" ? "You" : entry.toolName || session.agent}</div>
        {entry.kind === "tool" ? <details><summary>{entry.summary || entry.toolName || "Tool activity"}</summary>
          <pre>{entry.text}</pre>{entry.diffPreview && <pre>{entry.diffPreview}</pre>}</details> : <div className="gt-message-text">{entry.text}</div>}
        <time dateTime={new Date(entry.createdAt).toISOString()}>{new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
      </article>)}
      <OutgoingMessages commands={runtime.outgoingMessages(machineId, session.sessionId)} retry={id => runtime.retryMessage(id)} />
      {computer?.approvals.filter(request => request.sessionId === session.sessionId).map(request => <ApprovalCard key={request.requestId}
        request={request} delivery={runtime.approvalDelivery(machineId, request)}
        decide={(decision, note) => runtime.decision(machineId, request, decision, note)} />)}
    </div>
    {error && <p role="alert">{error}</p>}
    <ChatComposer key={session.sessionId} session={session} meshes={computer?.meshes ?? []}
      submit={message => runtime.submit(machineId, message, "user-message-" + message.messageId)} />
  </section>;
});
