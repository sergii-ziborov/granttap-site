import type { ActivityEntry, ApprovalRequest, MeshSnapshot, Payload, SessionInfo } from "../ControlProtocol";
export type ComputerSnapshot = {
  sessions: SessionInfo[]; approvals: ApprovalRequest[]; meshes: MeshSnapshot[];
  transcript: Record<string, ActivityEntry[]>; lastSeenAt?: number; generatedAt?: number;
};
export const emptyComputer = (): ComputerSnapshot => ({ sessions: [], approvals: [], meshes: [], transcript: {} });

/** Pure, bounded state projection. A pending decision is not a resolved native approval. */
export function applyControlPayload(previous: ComputerSnapshot, payload: Payload): ComputerSnapshot {
  if (payload.type === "sessions.status") {
    if (payload.generatedAt < (previous.generatedAt ?? 0)) return previous;
    const current = new Set(payload.sessions.map(item => item.sessionId));
    return { ...previous, sessions: [...payload.sessions,
      ...(payload.history ?? []).filter(item => !current.has(item.sessionId))].slice(0, 400),
      generatedAt: payload.generatedAt };
  }
  if (payload.type === "machine.heartbeat") return { ...previous, lastSeenAt: Date.now() };
  if (payload.type === "approval.request") return { ...previous,
    approvals: [...previous.approvals.filter(item => item.requestId !== payload.requestId), payload].slice(-100) };
  if (payload.type === "approval.resolved") return { ...previous,
    approvals: previous.approvals.filter(item => item.requestId !== payload.requestId) };
  if (payload.type === "approvals.status") {
    if (payload.complete) return { ...previous, approvals: payload.pending };
    const covered = new Set(payload.covered?.map(item => item.requestId));
    return { ...previous, approvals: [...previous.approvals.filter(item => !covered.has(item.requestId)
      && !payload.pending.some(next => next.requestId === item.requestId)), ...payload.pending].slice(-100) };
  }
  if (payload.type === "mesh.snapshot") {
    const current = previous.meshes.find(item => item.projectId === payload.projectId
      && item.publisherEndpointId === payload.publisherEndpointId);
    if (current && current.generatedAt > payload.generatedAt) return previous;
    return { ...previous, meshes: [...previous.meshes.filter(item => item !== current), payload].slice(-128) };
  }
  if (payload.type === "session.activity") {
    const existing = previous.transcript[payload.sessionId] ?? [];
    const entries = payload.history?.requestedCursor
      ? [...payload.entries, ...existing] : payload.entries;
    const unique = [...new Map(entries.map(entry => [entry.id, entry])).values()].slice(-5_000);
    const transcript = { ...previous.transcript, [payload.sessionId]: unique };
    const retained = Object.entries(transcript).slice(-30);
    return { ...previous, transcript: Object.fromEntries(retained) };
  }
  if (payload.type === "agent.event" && payload.sessionId) {
    const existing = previous.transcript[payload.sessionId] ?? [];
    const entry: ActivityEntry = { id: payload.originMessageId ?? `event-${payload.createdAt}-${payload.text.length}`,
      kind: payload.kind === "question" ? "status" : "message", text: payload.text, createdAt: payload.createdAt };
    return { ...previous, transcript: Object.fromEntries(Object.entries({ ...previous.transcript,
      [payload.sessionId]: [...existing.filter(item => item.id !== entry.id), entry].slice(-5_000) }).slice(-30)) };
  }
  return previous;
}
