"use client";
import { useRef, useState } from "react";
import type { CodingAgent, MeshSnapshot, SessionInfo, UserMessage } from "../ControlProtocol";
import { base64 } from "../Cryptography";

export function ChatComposer({ session, meshes, submit }: { session: SessionInfo; meshes: MeshSnapshot[];
  submit: (message: UserMessage) => Promise<void> }) {
  const [text, setText] = useState(""); const [model, setModel] = useState(""); const [effort, setEffort] = useState("");
  const [files, setFiles] = useState<File[]>([]); const [state, setState] = useState(""); const [saving, setSaving] = useState(false);
  const retry = useRef<{ fingerprint: string; id: string } | null>(null);
  const candidates = meshes.filter(mesh => !session.projectId || mesh.projectId === session.projectId)
    .flatMap(mesh => mesh.modelCatalog ?? []).filter(catalog => !catalog.stale)
    .flatMap(catalog => catalog.models).filter(item => item.provider === session.agent);
  const models = [...new Map(candidates.map(item => [item.modelId, item])).values()];
  const supported = models.find(item => item.modelId === (model || session.model))?.supportedEfforts ?? [];
  const send = async () => {
    if ((!text.trim() && !files.length) || saving) return;
    setSaving(true); setState("Saving on relay…");
    try {
      const attachments = await readAttachments(files);
      const fingerprint = JSON.stringify({ text, attachments, model, effort });
      if (retry.current?.fingerprint !== fingerprint) retry.current = { fingerprint, id: crypto.randomUUID() };
      const message: UserMessage = { type: "user.message", messageId: retry.current.id, text,
        sessionId: session.sessionId, agent: session.agent as CodingAgent, createdAt: Date.now(),
        ...(attachments.length ? { attachments } : {}), ...(model ? { model } : {}),
        ...(effort && supported.includes(effort as NonNullable<UserMessage["effort"]>) ? { effort: effort as UserMessage["effort"] } : {}) };
      await submit(message); setText(""); setFiles([]); retry.current = null;
      setState("Saved on relay · the computer will receive it when available");
    } catch (error) { setState(error instanceof Error ? error.message : "Relay storage was not confirmed."); }
    finally { setSaving(false); }
  };
  return <section className="gt-composer" aria-label="Message this Task">
    <textarea value={text} onChange={event => setText(event.target.value)} placeholder="Message this Task…"
      maxLength={32_000} disabled={saving} aria-label="Message"
      onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") { event.preventDefault(); void send(); } }} />
    {files.length > 0 && <div className="gt-file-chips">{files.map((file, index) => <button key={index} disabled={saving}
      onClick={() => setFiles(old => old.filter((_, at) => at !== index))}>{file.name} ×</button>)}</div>}
    <footer>
      <label className="gt-file-picker" title="Attach files">＋<input type="file" multiple aria-label="Attach files" disabled={saving}
        onChange={event => { const selected = Array.from(event.target.files ?? []);
          setFiles(old => [...old, ...selected].slice(0, 10)); event.target.value = ""; }} /></label>
      <select aria-label="Model" disabled={saving} value={model} onChange={event => { setModel(event.target.value); setEffort(""); }}>
        <option value="">{session.model || "Agent default"}</option>
        {models.map(item => <option key={item.modelId} value={item.modelId}>{item.label || item.modelId}</option>)}
      </select>
      {supported.length > 0 && <label className="gt-effort" data-effort={effort || session.effort || "medium"}>
        <span aria-hidden="true">ϟ</span><select value={effort} aria-label="Effort" disabled={saving} onChange={event => setEffort(event.target.value)}>
          <option value="">{session.effort || "Effort"}</option>{supported.map(value => <option key={value} value={value}>
            {({ low: "Low", medium: "Medium", high: "High", xhigh: "Extra High", max: "Max", ultra: "Ultra" })[value]}</option>)}
        </select></label>}
      <button className="gt-primary gt-send" disabled={saving || !text.trim() && !files.length} onClick={() => void send()}
        aria-label="Send message">{saving ? "…" : "↑"}</button>
    </footer>
    {state && <p role="status" className="gt-delivery">{state}</p>}
  </section>;
}

async function readAttachments(files: File[]): Promise<NonNullable<UserMessage["attachments"]>> {
  if (files.length > 10 || files.reduce((total, file) => total + file.size, 0) > 9_000_000 || files.some(file => file.size > 6_000_000)) {
    throw Error("Attach up to 10 files, 6 MB per file and 9 MB in total.");
  }
  return Promise.all(files.map(async file => ({ name: file.name.slice(0, 180),
    mimeType: (file.type || "application/octet-stream").slice(0, 120), data: base64(new Uint8Array(await file.arrayBuffer())) })));
}
