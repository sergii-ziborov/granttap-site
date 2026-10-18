import { expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TaskChat } from "..";
import { Payload, type SessionInfo } from "../../ControlProtocol";
import { emptyComputer } from "../../ControlState";
import type { ControlRuntime, ControlView } from "../../ControlRuntime";

const session: SessionInfo = { sessionId: "task", agent: "cursor", state: "idle", startedAt: 1,
  lastActivityAt: 1, tokensSession: 0, tokensLastTurn: 0 };
function fixture() {
  const view: ControlView = { computers: { computer: emptyComputer() }, connections: { computer: "connected" }, deliveries: {} };
  const sent: Payload[] = []; let failControl = true;
  const control = { snapshot: () => view, outgoingMessages: () => [], command: async (_id: string, input: Payload) => {
    const payload = Payload.parse(input); sent.push(payload);
    if (payload.type === "session.control" && failControl) throw Error("Synthetic control refused");
  } } as unknown as ControlRuntime;
  return { view, sent, control, allowControl: () => { failControl = false; } };
}
it("subscribes only while connected, refreshes the subscription and releases it when leaving the Task", async () => {
  vi.useFakeTimers(); const f = fixture();
  const result = render(<TaskChat runtime={f.control} machineId="computer" session={session} view={f.view} back={() => {}} />);
  expect(f.sent.filter(item => item.type === "session.subscribe")).toHaveLength(1);
  await act(() => vi.advanceTimersByTimeAsync(10_000));
  expect(f.sent.filter(item => item.type === "session.subscribe")).toHaveLength(2);
  result.unmount(); expect(f.sent.at(-1)).toMatchObject({ type: "session.subscribe", sessionId: "task", active: false });
  f.view.connections.computer = "closed";
  const offline = render(<TaskChat runtime={f.control} machineId="computer" session={session} view={f.view} back={() => {}} />);
  expect(screen.getByText("Computer is currently unavailable")).toBeTruthy();
  expect(screen.getByText(/You can send a message now/)).toBeTruthy();
  await act(() => vi.advanceTimersByTimeAsync(10_000)); expect(f.sent).toHaveLength(3);
  offline.unmount(); vi.useRealTimers();
});
it("expands earlier bounded history and tool evidence, and clears a stale control error after retry succeeds", async () => {
  const f = fixture(), back = vi.fn();
  f.view.computers.computer.transcript.task = Array.from({ length: 121 }, (_, i) => ({ id: String(i), kind: i === 120 ? "tool" : "message",
    text: "Synthetic entry " + i, createdAt: i + 1, ...(i === 120 ? { toolName: "Synthetic tool", summary: "Synthetic tool activity", diffPreview: "+ synthetic diff" } : {}) }));
  const result = render(<TaskChat runtime={f.control} machineId="computer" session={session} view={f.view} back={back} />);
  expect(screen.queryByText("Synthetic entry 0")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show earlier messages" }));
  expect(screen.getByText("Synthetic entry 0")).toBeTruthy();
  fireEvent.click(screen.getByText("Synthetic tool activity")); expect(screen.getByText("+ synthetic diff")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Synthetic control refused");
  f.allowControl(); fireEvent.click(screen.getByRole("button", { name: "Pause" }));
  await act(async () => {}); expect(screen.queryByRole("alert")).toBeNull();
  result.rerender(<TaskChat runtime={f.control} machineId="computer" session={{ ...session, paused: true }} view={f.view} back={back} />);
  fireEvent.click(screen.getByRole("button", { name: "Resume" }));
  await act(async () => {}); expect(f.sent.at(-1)).toMatchObject({ type: "session.control", action: "resume", sessionId: "task" });
  fireEvent.click(screen.getByRole("button", { name: "Back to Tasks" })); expect(back).toHaveBeenCalledOnce();
});

it("keeps a sent pause pending until the computer confirms it and displays a native refusal", async () => {
  const f = fixture(); f.allowControl();
  const result = render(<TaskChat runtime={f.control} machineId="computer" session={session} view={f.view} back={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: "Pause" })); await act(async () => {});
  const waiting = screen.getByRole("button", { name: "Waiting for computer…" }) as HTMLButtonElement;
  expect(waiting.disabled).toBe(true);
  const refused = { ...f.view, computers: { computer: { ...f.view.computers.computer, controls: {
    task: { action: "pause" as const, ok: false, message: "Synthetic policy refused pause", createdAt: 5 } } } } };
  result.rerender(<TaskChat runtime={f.control} machineId="computer" session={session} view={refused} back={() => {}} />);
  expect(screen.getByRole("alert").textContent).toBe("Synthetic policy refused pause");
  expect((screen.getByRole("button", { name: "Pause" }) as HTMLButtonElement).disabled).toBe(false);
});

it("allows retry when an unavailable computer never acknowledges a live pause command", async () => {
  vi.useFakeTimers(); const f = fixture(); f.allowControl();
  const result = render(<TaskChat runtime={f.control} machineId="computer" session={session} view={f.view} back={() => {}} />);
  try {
    fireEvent.click(screen.getByRole("button", { name: "Pause" })); await act(async () => {});
    expect((screen.getByRole("button", { name: "Waiting for computer…" }) as HTMLButtonElement).disabled).toBe(true);
    await act(() => vi.advanceTimersByTimeAsync(8_000));
    expect(screen.getByRole("alert").textContent).toMatch(/not confirmed/);
    const retry = screen.getByRole("button", { name: "Pause" }) as HTMLButtonElement;
    expect(retry.disabled).toBe(false); fireEvent.click(retry); await act(async () => {});
    expect(screen.queryByRole("alert")).toBeNull();
    expect(f.sent.filter(item => item.type === "session.control")).toHaveLength(2);
  } finally { result.unmount(); vi.useRealTimers(); }
});
