import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeshView } from "..";
import { MeshSnapshot, type TaskCreate } from "../../ControlProtocol";
import type { ControlRuntime } from "../../ControlRuntime";

function mesh(overrides: Record<string, unknown> = {}) {
  return MeshSnapshot.parse({ type: "mesh.snapshot", sessionId: "mesh", projectId: "mesh",
    project: { projectId: "mesh", name: "Synthetic Mesh", canonicalRepositoryId: "fixture/repo", createdAt: 1 },
    tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: 1, ...overrides });
}
function runtime(submit = vi.fn(), command = vi.fn()) { return { submit, command } as unknown as ControlRuntime; }
async function open(value: MeshSnapshot, control = runtime()) {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function () { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function () { this.open = false; } });
  render(<MeshView meshes={[value]} machineId="computer" runtime={control} sessions={[]} openTask={() => {}} />);
  const user = userEvent.setup(); await user.click(screen.getByRole("button", { name: /Synthetic Mesh/ })); return user;
}
it("keeps an unavailable graph honest and surfaces refresh failure without inventing architecture", async () => {
  const value = mesh({ repositoryGraphs: [{ projectId: "mesh", repositoryId: "fixture/repo", revision: "rev",
    weavatrixVersion: "fixture", analysisStatus: "UNAVAILABLE", analysisErrorCode: "ENGINE_UNAVAILABLE",
    nodes: [], relations: [], totalNodes: 0, totalRelations: 0, truncated: false }] });
  const user = await open(value, runtime(vi.fn(), vi.fn(async () => { throw Error("Synthetic relay disconnected"); })));
  expect(screen.getByText("ENGINE_UNAVAILABLE")).toBeTruthy();
  expect(screen.queryByRole("img")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Refresh architecture" }));
  expect(await screen.findByText("Synthetic relay disconnected")).toBeTruthy();
});
it("bounds large graphs, draws only visible edges and searches full component labels", async () => {
  const label = "A long synthetic architecture component";
  const value = mesh({ repositoryGraphs: [{ projectId: "mesh", repositoryId: "fixture/repo", revision: "rev",
    weavatrixVersion: "fixture", nodes: Array.from({ length: 60 }, (_, i) => ({ id: String(i), kind: "component", label: i ? "Node " + i : label })),
    relations: [{ source: "0", target: "1", relation: "calls" }, { source: "0", target: "59", relation: "calls" }],
    totalNodes: 60, totalRelations: 2, truncated: true }] });
  const user = await open(value); const graph = screen.getByRole("img");
  expect(graph.querySelectorAll("g")).toHaveLength(48); expect(graph.querySelectorAll("path")).toHaveLength(1);
  expect(graph.querySelector("title")?.textContent).toContain(label);
  expect(graph.querySelector("text")?.textContent).toBe(label.slice(0, 20) + "…");
  await user.type(screen.getByRole("searchbox"), "Node 59");
  expect(graph.querySelectorAll("g")).toHaveLength(1); expect(graph.querySelectorAll("path")).toHaveLength(0);
  expect(screen.getByText("Showing 1 of 60 components. Search narrows the view.")).toBeTruthy();
});
it("requires an explicit workspace and preserves failed Task drafts while distinguishing edited intent", async () => {
  const sent: TaskCreate[] = [];
  const submit = vi.fn(async (_machine: string, payload: TaskCreate) => { sent.push(payload); throw Error("Synthetic relay unavailable"); });
  const user = await open(mesh(), runtime(submit));
  expect(screen.getByText(/No architecture snapshot/)).toBeTruthy();
  await user.click(screen.getByRole("button", { name: /New Task/ }));
  await user.type(screen.getByRole("textbox", { name: "What should the agent do?" }), "Synthetic draft");
  expect((screen.getByRole("button", { name: "Create Task" }) as HTMLButtonElement).disabled).toBe(true);
  await user.type(screen.getByRole("textbox", { name: "Workspace" }), "/synthetic");
  await user.selectOptions(screen.getByRole("combobox", { name: "Agent" }), "grok");
  await user.click(screen.getByRole("button", { name: "Create Task" }));
  expect(await screen.findByText("Synthetic relay unavailable")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Create Task" }));
  expect(sent[0].operationId).toBe(sent[1].operationId);
  await user.type(screen.getByRole("textbox", { name: "What should the agent do?" }), " edited");
  await user.click(screen.getByRole("button", { name: "Create Task" }));
  expect(sent[2]).toMatchObject({ cwd: "/synthetic", agent: "grok", text: "Synthetic draft edited" });
  expect(sent[2].operationId).not.toBe(sent[1].operationId);
});
it("offers only available workspaces belonging to the publishing computer", async () => {
  const binding = { bindingId: "local", projectId: "mesh", repositoryId: "fixture/repo", displayName: "Authorized checkout", endpointId: "local",
    localPathHint: "/synthetic/local", available: true };
  const value = mesh({ publisherEndpointId: "local", bindings: [binding,
    { ...binding, bindingId: "remote", endpointId: "remote", displayName: "Other computer" },
    { ...binding, bindingId: "offline", repositoryId: "fixture/offline", available: false, displayName: "Unavailable checkout" },
    { ...binding, bindingId: "redacted", repositoryId: "fixture/redacted", localPathHint: undefined, displayName: "No path" }] });
  const submit = vi.fn(async () => {}), user = await open(value, runtime(submit));
  await user.click(screen.getByRole("button", { name: /New Task/ }));
  expect(screen.getByRole("option", { name: "Authorized checkout" })).toBeTruthy();
  expect(screen.queryByRole("option", { name: "Other computer" })).toBeNull();
  expect(screen.queryByRole("option", { name: "Unavailable checkout" })).toBeNull();
  expect(screen.queryByRole("option", { name: "No path" })).toBeNull();
  await user.type(screen.getByRole("textbox", { name: "What should the agent do?" }), "Synthetic work");
  await user.click(screen.getByRole("button", { name: "Create Task" }));
  expect(await screen.findByText(/Saved on relay/)).toBeTruthy();
  expect(submit.mock.calls[0]).toMatchObject(["computer", { cwd: "/synthetic/local", projectId: "mesh" }, expect.stringMatching(/^user-message-/)]);
});
