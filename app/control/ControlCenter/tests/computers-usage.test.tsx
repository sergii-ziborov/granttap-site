import { afterEach, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComputerList, UsageView } from "../panels";
import type { ControlAccount } from "../../AccountAccess/use-account";
import type { ControlView } from "../../ControlRuntime";
import { emptyComputer } from "../../ControlState";
import { MeshSnapshot } from "../../ControlProtocol";

const account = { machines: [{ id: "one", name: "Synthetic computer" }], connected: new Set<string>() } as ControlAccount;
const view: ControlView = { computers: {}, connections: {}, deliveries: {} };
afterEach(() => vi.unstubAllGlobals());
it("requires browser storage consent, supports cancellation and shows a connection failure", async () => {
  const user = userEvent.setup(); let signal: AbortSignal | undefined;
  const connect = (_id: string, received: AbortSignal) => new Promise<void>((_resolve, reject) => {
    signal = received; received.addEventListener("abort", () => reject(Error("Connection canceled")));
  });
  render(<ComputerList account={account} view={view} connect={connect} forget={async () => {}} />);
  expect((screen.getByRole("button", { name: "Connect browser" }) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole("checkbox")); await user.click(screen.getByRole("button", { name: "Connect browser" }));
  expect(screen.getByRole("button", { name: "Waiting for computer…" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Cancel connection" }));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Connection canceled");
  expect(signal?.aborted).toBe(true);
  expect((screen.getByRole("button", { name: "Connect browser" }) as HTMLButtonElement).disabled).toBe(false);
});
it("uses the latest reported limit window across computers instead of adding duplicate subscription limits", () => {
  const mesh = (observedAt: number, usedPercent: number) => MeshSnapshot.parse({ type: "mesh.snapshot", sessionId: "mesh", projectId: "mesh",
    project: { projectId: "mesh", name: "Synthetic Mesh", canonicalRepositoryId: "fixture/repo", createdAt: 1 },
    tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: observedAt,
    modelCatalog: [{ endpointId: "endpoint", models: [], observedAt, accountUsage: [{ provider: "codex", limitId: "subscription",
      observedAt, windows: [{ id: "primary", windowMinutes: 300, usedPercent, resetsAt: 1_900_000_000 }] }] }] });
  render(<UsageView view={{ ...view, computers: {
    newer: { ...emptyComputer(), meshes: [mesh(200, 75)] }, older: { ...emptyComputer(), meshes: [mesh(100, 10)] },
  } }} />);
  expect(screen.getByText("5h · 25% remaining")).toBeTruthy(); expect(screen.queryByText("5h · 90% remaining")).toBeNull();
  expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  expect(screen.getByRole("progressbar")).toHaveProperty("value", 75);
});
it("confirms browser forgetting and reports storage failure without claiming the keys were removed", async () => {
  const user = userEvent.setup(), forget = vi.fn(async () => { throw Error("Storage failed"); });
  const confirm = vi.fn(() => false); vi.stubGlobal("confirm", confirm);
  render(<ComputerList account={{ ...account, connected: new Set(["one"]) }}
    view={{ ...view, connections: { one: "connected" } }} connect={async () => {}} forget={forget} />);
  expect(screen.getByText("Relay connected · computer availability is separate")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Forget this browser" })); expect(forget).not.toHaveBeenCalled();
  confirm.mockReturnValue(true); await user.click(screen.getByRole("button", { name: "Forget this browser" }));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Browser keys could not be removed. Please retry.");
  expect(screen.getByText("Browser authorized")).toBeTruthy();
});
it("offers the connection guide without any computers and keeps missing usage limits unknown", async () => {
  const first = render(<ComputerList account={{ ...account, machines: [] }} view={view} connect={async () => {}} forget={async () => {}} />);
  expect(screen.getByRole("link", { name: "Connection guide →" })).toHaveProperty("href", "http://localhost:3000/support");
  first.unmount(); render(<UsageView view={{ ...view, computers: { one: { ...emptyComputer(), sessions: [{
    sessionId: "task", agent: "cursor", title: "Synthetic Task", state: "idle", startedAt: 1,
    lastActivityAt: 2, tokensSession: 1200, tokensLastTurn: 20 }] } } }} />);
  expect(screen.getByText("1,200 tokens in loaded Tasks")).toBeTruthy();
  await waitFor(() => expect(screen.getAllByText("Subscription limits have not been reported.")).toHaveLength(4));
});
