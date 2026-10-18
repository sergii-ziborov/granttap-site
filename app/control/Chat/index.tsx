"use client";
import { memo, useEffect, useState } from "react";
import type { ControlRuntime, ControlView } from "../ControlRuntime";
import type { SessionInfo } from "../ControlProtocol";
import { ApprovalCard } from "../Approvals";
import { ChatComposer } from "./Composer";
import { OutgoingMessages } from "./OutgoingMessages";
import { useTranscriptScrolling } from "./scrolling";

export const TaskChat = memo(function TaskChat({ runtime, machineId, session, view, back }: {
  runtime: ControlRuntime; machineId: string; session: SessionInfo; view: ControlView; back: () => void;
}) {
  const [error, setError] = useState(""); const [visible, setVisible] = useState(120);
  const [pending, setPending] = useState<{ action: "pause" | "resume"; previousResult?: number }>();
  const [timedOut, setTimedOut] = useState(false);
  const computer = view.computers[machineId]; const connected = view.connections[machineId] === "connected";
  const entries = computer?.transcript[session.sessionId] ?? [];
  const outgoing = runtime.outgoingMessages(machineId, session.sessionId);
  const scrolling = useTranscriptScrolling(machineId + ":" + session.sessionId, entries, outgoing.length, visible);
  const result = computer?.controls?.[session.sessionId];
  const acknowledged = pending && result?.action === pending.action && result.createdAt > (pending.previousResult ?? -Infinity);
  const stateConfirmed = pending && session.paused !== undefined && session.paused === (pending.action === "pause");
  const unanswered = !!pending && !acknowledged && !stateConfirmed;
  const waiting = unanswered && !timedOut;
  const controlError = unanswered && timedOut ? "The computer has not confirmed the action. Check its connection and retry."
    : acknowledged && !result.ok ? result.message : error;
  useEffect(() => {
    if (!waiting) return;
    const timer = setTimeout(() => setTimedOut(true), 8_000);
    return () => clearTimeout(timer);
  }, [waiting, pending]);
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
    setError(""); setTimedOut(false);
    const action = session.paused ? "resume" : "pause";
    setPending({ action, previousResult: result?.createdAt });
    try { await runtime.command(machineId, { type: "session.control", sessionId: session.sessionId,
      action, createdAt: Date.now() }, session.sessionId); }
    catch (failure) { setPending(undefined); setError(failure instanceof Error ? failure.message : "Task control could not be sent."); }
  };
  return <section className="gt-chat">
    <header className="gt-chat-header"><button onClick={back} aria-label="Back to Tasks">←</button>
      <div><h2>{session.title || "Untitled Task"}</h2><span className="gt-muted">{session.agent} · {session.model || "Agent default"}</span></div>
      <button disabled={waiting} onClick={() => void control()}>{waiting ? "Waiting for computer…" : session.paused ? "Resume" : "Pause"}</button></header>
    {session.transfer && <p className="gt-notice">This Task has a transfer record. Review its destination before continuing this branch.</p>}
    <div ref={scrolling.viewport} onScroll={scrolling.onScroll} className="gt-transcript" aria-label="Task conversation">
      {entries.length > visible && <button onClick={() => { scrolling.revealEarlier(); setVisible(value => value + 120); }}>Show earlier messages</button>}
      {!entries.length && <div className="gt-empty"><h3>{connected ? "Opening this Task" : "Computer is currently unavailable"}</h3>
        <p>You can send a message now. Relay keeps it until the computer can receive it.</p></div>}
      {entries.slice(-visible).map(entry => <article key={entry.id} className="gt-message" data-kind={entry.kind}>
        <div className="gt-eyebrow">{entry.kind === "user" ? "You" : entry.toolName || session.agent}</div>
        {entry.kind === "tool" ? <details><summary>{entry.summary || entry.toolName || "Tool activity"}</summary>
          <pre>{entry.text}</pre>{entry.diffPreview && <pre>{entry.diffPreview}</pre>}</details> : <div className="gt-message-text">{entry.text}</div>}
        <time dateTime={new Date(entry.createdAt).toISOString()}>{new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
      </article>)}
      <OutgoingMessages commands={outgoing} retry={id => runtime.retryMessage(id)} />
      {computer?.approvals.filter(request => request.sessionId === session.sessionId).map(request => <ApprovalCard key={request.requestId}
        request={request} delivery={runtime.approvalDelivery(machineId, request)}
        decide={(decision, note) => runtime.decision(machineId, request, decision, note)} />)}
    </div>
    {controlError && <p role="alert">{controlError}</p>}
    <ChatComposer key={session.sessionId} session={session} meshes={computer?.meshes ?? []}
      submit={message => runtime.submit(machineId, message, "user-message-" + message.messageId)} />
  </section>;
});
