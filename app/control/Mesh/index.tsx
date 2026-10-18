"use client";
import { useRef, useState } from "react";
import type { MeshSnapshot, SessionInfo } from "../ControlProtocol";
import type { ControlRuntime } from "../ControlRuntime";
import { ControlDialog } from "../ControlDialog";

export function MeshView({ meshes, machineId, runtime, openTask, sessions }: { meshes: MeshSnapshot[]; machineId: string;
  runtime: ControlRuntime; sessions: SessionInfo[]; openTask: (session: SessionInfo) => void }) {
  const [selected, setSelected] = useState<MeshSnapshot>(); const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  if (!selected) return <div className="gt-card-grid">{meshes.map(mesh => <button className="gt-mesh-card" key={mesh.projectId}
    onClick={() => setSelected(mesh)}><span className="gt-mesh-symbol">⌘</span><h3>{mesh.project.name}</h3>
    <p>{mesh.tasks.length} Tasks · {new Set(mesh.executions.map(item => item.computerId)).size} computers</p>
    <small>{mesh.project.canonicalRepositoryId}</small></button>)}</div>;
  const mesh = meshes.find(item => item.projectId === selected.projectId) ?? selected;
  const refresh = async () => {
    try { await runtime.command(machineId, { type: "sessions.refresh", graphProjectId: mesh.projectId,
      graphAnalysisRequestId: crypto.randomUUID(), createdAt: Date.now() }); setError("Architecture refresh requested. The latest snapshot remains visible below."); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Refresh failed."); }
  };
  return <section>
    <div className="gt-section-heading"><button onClick={() => setSelected(undefined)}>← All Mesh spaces</button>
      <button className="gt-primary" onClick={() => setCreate(true)}>＋ New Task</button></div>
    <h2>{mesh.project.name}</h2><p className="gt-muted">Snapshot {new Date(mesh.generatedAt).toLocaleString()}</p>
    <div className="gt-section-heading"><h3>Health & architecture</h3><button onClick={() => void refresh()}>Refresh architecture</button></div>
    {error && <p role="status" className="gt-notice">{error}</p>}
    {(mesh.repositoryGraphs ?? []).map(graph => <article className="gt-surface" key={graph.repositoryId}>
      <div className="gt-section-heading"><h3>{graph.repositoryId}</h3><span className="gt-status">{graph.analysisStatus ?? "Snapshot"}</span></div>
      {graph.analysisErrorCode ? <p role="status">{graph.analysisErrorCode}</p> : <>
        <p>{graph.totalNodes} components · {graph.totalRelations} connections{graph.truncated ? " · bounded view" : ""}</p>
        <ArchitectureGraph graph={graph} />
      </>}
    </article>)}
    {!mesh.repositoryGraphs?.length && <p className="gt-empty">No architecture snapshot has arrived. Request a refresh from this Mesh’s computer.</p>}
    <h3>Tasks in this Mesh</h3>
    {sessions.filter(session => session.projectId === mesh.projectId).map(session => <button className="gt-task-row" key={session.sessionId}
      onClick={() => openTask(session)}>{session.title || "Untitled Task"}<span>{session.state} →</span></button>)}
    {create && <ControlDialog title="New Task" close={() => setCreate(false)}><NewMeshTask mesh={mesh}
      submit={payload => runtime.submit(machineId, payload, "user-message-" + payload.operationId)} /></ControlDialog>}
  </section>;
}

function ArchitectureGraph({ graph }: { graph: NonNullable<MeshSnapshot["repositoryGraphs"]>[number] }) {
  const [search, setSearch] = useState("");
  const nodes = graph.nodes.filter(node => node.label.toLowerCase().includes(search.toLowerCase())).slice(0, 48);
  const positions = new Map(nodes.map((node, i) => [node.id, { x: 20 + i % 4 * 190, y: 20 + Math.floor(i / 4) * 80 }]));
  return <div className="gt-graph"><input type="search" placeholder="Find a component" aria-label="Find a component" value={search}
    onChange={event => setSearch(event.target.value)} />
    <svg viewBox={`0 0 800 ${Math.max(100, Math.ceil(nodes.length / 4) * 80 + 10)}`} role="img" aria-label="Architecture components and connections">
      {graph.relations.map((edge, i) => { const a = positions.get(edge.source), b = positions.get(edge.target);
        return a && b ? <path key={i} d={`M${a.x + 85} ${a.y + 25} L${b.x + 85} ${b.y + 25}`} className="gt-graph-edge" /> : null; })}
      {nodes.map(node => { const point = positions.get(node.id)!; return <g key={node.id} transform={`translate(${point.x},${point.y})`}>
        <title>{node.label} · {node.kind}</title><rect width="170" height="50" rx="10" />
        <text x="12" y="22">{node.label.length > 22 ? node.label.slice(0, 20) + "…" : node.label}</text>
        <text x="12" y="38" className="gt-node-kind">{node.kind}</text></g>; })}
    </svg><small className="gt-muted">Showing {nodes.length} of {graph.totalNodes} components. Search narrows the view.</small></div>;
}

function NewMeshTask({ mesh, submit }: { mesh: MeshSnapshot;
  submit: (payload: import("../ControlProtocol").TaskCreate) => Promise<void> }) {
  const paths = mesh.bindings?.filter(binding => binding.available && binding.localPathHint
    && (!mesh.publisherEndpointId || binding.endpointId === mesh.publisherEndpointId)) ?? [];
  const [cwd, setCwd] = useState(paths[0]?.localPathHint ?? mesh.project.repositoryRoot ?? "");
  const [agent, setAgent] = useState("codex"); const [text, setText] = useState("");
  const [status, setStatus] = useState(""); const [saving, setSaving] = useState(false);
  const attempt = useRef<{ intent: string; id: string } | null>(null);
  const send = async () => { setSaving(true); setStatus("Saving on relay…");
    const intent = JSON.stringify({ cwd, agent, text });
    if (attempt.current?.intent !== intent) attempt.current = { intent, id: crypto.randomUUID() };
    try { await submit({ type: "project.task.create", operationId: attempt.current.id, projectId: mesh.projectId,
      cwd, agent: agent as "codex" | "claude" | "cursor" | "grok", text, createdAt: Date.now() });
      setStatus("Saved on relay. The new Task appears when the computer accepts it."); setText(""); attempt.current = null; }
    catch (error) { setStatus(error instanceof Error ? error.message : "Relay storage was not confirmed."); }
    finally { setSaving(false); } };
  return <div className="gt-new-task"><p className="gt-muted">{mesh.project.name}</p>
    <label>Agent<select value={agent} disabled={saving} onChange={event => setAgent(event.target.value)}>
      <option value="codex">Codex</option><option value="claude">Claude Code</option><option value="cursor">Cursor · Beta</option><option value="grok">Grok Build</option>
    </select></label>
    <label>Workspace{paths.length ? <select value={cwd} disabled={saving} onChange={event => setCwd(event.target.value)}>
      {paths.map(path => <option key={path.bindingId} value={path.localPathHint}>{path.displayName}</option>)}</select>
      : <input value={cwd} onChange={event => setCwd(event.target.value)} placeholder="Choose the computer's workspace path" disabled={saving} />}</label>
    <label>What should the agent do?<textarea value={text} maxLength={32_000} onChange={event => setText(event.target.value)} disabled={saving} /></label>
    <button className="gt-primary" disabled={saving || !text.trim() || !cwd.trim()} onClick={() => void send()}>Create Task</button>
    {status && <p role="status">{status}</p>}
  </div>;
}
