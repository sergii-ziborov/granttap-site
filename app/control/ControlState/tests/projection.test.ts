import { expect, it } from "vitest";
import { ApprovalRequest, MeshSnapshot, SessionsStatus, type Payload } from "../../ControlProtocol";
import { applyControlPayload, emptyComputer } from "..";

const session = { sessionId: "task", title: "A task", agent: "codex", state: "idle", startedAt: 1,
  lastActivityAt: 2, tokensSession: 3, tokensLastTurn: 1 };
it("keeps the current Task once when it also appears in history and ignores older catalogs", () => {
  const payload = SessionsStatus.parse({ type: "sessions.status", machine: "Fixture", sessions: [session],
    history: [{ ...session, title: "Earlier title" }], generatedAt: 100 });
  const next = applyControlPayload(emptyComputer(), payload);
  expect(next.sessions).toHaveLength(1); expect(next.sessions[0].title).toBe("A task");
  expect(applyControlPayload(next, { ...payload, generatedAt: 50 })).toBe(next);
});
it("replaces only covered approvals and preserves a newer architecture observation for the same publisher", () => {
  const approval = (requestId: string) => ApprovalRequest.parse({ type: "approval.request", kind: "permission", requestId,
    agent: "cursor", title: "Synthetic question", tool: "shell", risk: "medium", createdAt: 1 });
  let state = applyControlPayload(emptyComputer(), approval("retained"));
  state = applyControlPayload(state, { type: "approvals.status", complete: false, pending: [approval("updated")], generatedAt: 2 });
  expect(state.approvals.map(item => item.requestId)).toEqual(["retained", "updated"]);
  state = applyControlPayload(state, { type: "approvals.status", complete: true, pending: [], generatedAt: 3 });
  expect(state.approvals).toEqual([]);
  const mesh = MeshSnapshot.parse({ type: "mesh.snapshot", sessionId: "mesh", projectId: "mesh", publisherEndpointId: "publisher",
    project: { projectId: "mesh", name: "Synthetic Mesh", canonicalRepositoryId: "fixture/repo", createdAt: 1 },
    tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: 100 });
  state = applyControlPayload(state, mesh);
  expect(applyControlPayload(state, { ...mesh, generatedAt: 50 })).toBe(state);
  state = applyControlPayload(state, { ...mesh, publisherEndpointId: "other", generatedAt: 50 });
  expect(state.meshes).toHaveLength(2);
  state = applyControlPayload(state, { type: "agent.event", sessionId: "task", originMessageId: "event", kind: "question", text: "Synthetic question", createdAt: 1 });
  state = applyControlPayload(state, { type: "agent.event", sessionId: "task", originMessageId: "event", kind: "response", text: "Synthetic response", createdAt: 2 });
  expect(state.transcript.task).toMatchObject([{ id: "event", text: "Synthetic response", kind: "message" }]);
});
it("retains unanswered approvals until an authoritative resolution and supports all four agents", () => {
  let state = emptyComputer();
  for (const agent of ["claude", "codex", "cursor", "grok"]) state = applyControlPayload(state, {
    type: "approval.request", kind: "permission", requestId: agent, agent, title: "Fixture", tool: "shell",
    risk: "medium", createdAt: 1,
  });
  state = applyControlPayload(state, { type: "approvals.status", pending: [], complete: false,
    covered: [{ requestId: "cursor" }], generatedAt: 2 });
  expect(state.approvals.map(item => item.agent)).toEqual(["claude", "codex", "grok"]);
  state = applyControlPayload(state, { type: "approval.resolved", requestId: "codex", status: "applied", resolvedAt: 3 });
  expect(state.approvals.map(item => item.agent)).toEqual(["claude", "grok"]);
});
it("bounds retained transcripts for both history pages and streaming agent events", () => {
  let state = emptyComputer();
  for (let i = 0; i < 40; i++) state = applyControlPayload(state, { type: "agent.event", sessionId: "task-" + i,
    text: "Synthetic fixture", createdAt: i });
  expect(Object.keys(state.transcript)).toHaveLength(30);
  state = applyControlPayload(state, { type: "session.activity", sessionId: "task-39", agent: "codex", state: "idle",
    entries: [{ id: "b", kind: "message", text: "B", createdAt: 2 }], generatedAt: 2 });
  state = applyControlPayload(state, { type: "session.activity", sessionId: "task-39", agent: "codex", state: "idle",
    entries: [{ id: "a", kind: "user", text: "A", createdAt: 1 }],
    history: { requestedCursor: "before", hasMore: false }, generatedAt: 3 });
  expect(state.transcript["task-39"].map(item => item.id)).toEqual(["a", "b"]);
  expect(applyControlPayload(state, { type: "hello", role: "machine", deviceName: "Fixture", createdAt: 4 } as Payload)).toBe(state);
});

it("changes pause state only after a successful computer acknowledgement and retains a refusal", () => {
  let state = applyControlPayload(emptyComputer(), SessionsStatus.parse({ type: "sessions.status", machine: "Fixture",
    sessions: [session, { ...session, sessionId: "other", paused: true }], generatedAt: 10 }));
  state = applyControlPayload(state, { type: "session.control.result", sessionId: "task", action: "pause", ok: true,
    message: "Paused", createdAt: 20 });
  expect(state.sessions[0].paused).toBe(true);
  state = applyControlPayload(state, SessionsStatus.parse({ type: "sessions.status", machine: "Fixture",
    sessions: [session], generatedAt: 15 }));
  expect(state.sessions[0].paused).toBe(true);
  state = applyControlPayload(state, { type: "session.control.result", sessionId: "task", action: "resume", ok: false,
    message: "Synthetic resume refused", createdAt: 30 });
  expect(state.sessions[0].paused).toBe(true);
  expect(state.controls?.task.message).toBe("Synthetic resume refused");
  expect(applyControlPayload(state, { type: "session.control.result", sessionId: "task", action: "resume", ok: true,
    message: "Outdated", createdAt: 25 })).toBe(state);
  state = applyControlPayload(state, SessionsStatus.parse({ type: "sessions.status", machine: "Fixture",
    sessions: [{ ...session, paused: true }, { ...session, sessionId: "other", paused: true }], generatedAt: 35 }));
  state = applyControlPayload(state, { type: "session.control.result", sessionId: "task", action: "resume", ok: true,
    message: "Resumed", createdAt: 40 });
  expect(state.sessions.map(item => [item.sessionId, item.paused])).toEqual([["task", false], ["other", true]]);
});
