"use client";
import { useState } from "react";
import type { ApprovalRequest } from "../ControlProtocol";
import type { DeliveryState } from "../ControlRuntime";
export type ApprovalCardProps = { request: ApprovalRequest; delivery?: DeliveryState;
  decide: (decision: "allow" | "deny", note?: string) => Promise<void> };

export function ApprovalCard({ request, delivery, decide }: ApprovalCardProps) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  const answers = Object.fromEntries((request.questions ?? []).map(question => [question.question,
    custom[question.question]?.trim() || selected[question.question]?.join(", ") || ""]));
  const question = request.kind === "question";
  const note = question ? request.questions?.length ? JSON.stringify(answers) : custom.answer?.trim() : undefined;
  const complete = !question || (request.questions?.length ? Object.values(answers).every(Boolean) : Boolean(note));
  const locked = sending || delivery?.state === "sending" || delivery?.state === "stored" || delivery?.state === "accepted";
  const choose = async (decision: "allow" | "deny") => {
    setSending(true); setError("");
    try { await decide(decision, decision === "allow" ? note : undefined); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "The relay could not save this decision."); }
    finally { setSending(false); }
  };
  return <article className="gt-approval" data-risk={request.danger ?? request.risk}>
    <div className="gt-eyebrow">{request.agent} · {question ? "Your answer is needed" : "Approval needed"}</div>
    <h3>{request.title}</h3>
    {request.details && <p>{request.details}</p>}
    {request.command && <pre>{request.command}</pre>}
    {request.cwd && <small className="gt-muted">{request.cwd}</small>}
    {request.questions?.map(item => <fieldset key={item.question} disabled={locked}>
      <legend>{item.question}</legend>
      <div className="gt-question-options">{item.options.map(option => <button key={option.label} type="button"
        aria-pressed={selected[item.question]?.includes(option.label) ?? false}
        onClick={() => setSelected(old => {
          const before = old[item.question] ?? [];
          return { ...old, [item.question]: item.multiSelect ? before.includes(option.label)
            ? before.filter(label => label !== option.label) : [...before, option.label] : [option.label] };
        })}><strong>{option.label}</strong>{option.description && <span>{option.description}</span>}</button>)}</div>
      <label>Your own answer<textarea value={custom[item.question] ?? ""} maxLength={4_000}
        onChange={event => setCustom(old => ({ ...old, [item.question]: event.target.value }))} /></label>
    </fieldset>)}
    {question && !request.questions?.length && <label>Answer<textarea value={custom.answer ?? ""} maxLength={4_000}
      disabled={locked} onChange={event => setCustom({ answer: event.target.value })} /></label>}
    <div className="gt-actions">
      <button className="gt-primary" disabled={locked || !complete} onClick={() => void choose("allow")}>{question ? "Send answer" : "Allow"}</button>
      <button disabled={locked} onClick={() => void choose("deny")}>Deny</button>
    </div>
    <p className="gt-delivery" role="status">{locked ? delivery?.state === "stored" ? "Saved on relay · waiting for computer"
      : delivery?.state === "accepted" ? "Applied by computer" : "Saving on relay…" : ""}</p>
    {(error || delivery?.error) && <p role="alert">{error || delivery?.error}</p>}
  </article>;
}
