import { expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { TaskChat } from "..";
import type { ControlRuntime, ControlView } from "../../ControlRuntime";
import { emptyComputer } from "../../ControlState";
import type { SessionInfo } from "../../ControlProtocol";

const session: SessionInfo = { sessionId: "task", agent: "cursor", state: "idle", startedAt: 1,
  lastActivityAt: 1, tokensSession: 0, tokensLastTurn: 0 };
it("opens the newest messages, follows new content only at the bottom, and preserves earlier-message position", () => {
  let height = 900;
  const scrollHeight = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(() => height);
  const clientHeight = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
  const computer = emptyComputer();
  computer.transcript.task = Array.from({ length: 121 }, (_, i) => ({ id: String(i), kind: "message", text: "Synthetic " + i, createdAt: i + 1 }));
  let view: ControlView = { computers: { computer }, connections: {}, deliveries: {} };
  const runtime = { outgoingMessages: () => [] } as unknown as ControlRuntime;
  const props = { runtime, machineId: "computer", session, back: () => {} };
  const rendered = render(<TaskChat {...props} view={view} />);
  const viewport = screen.getByLabelText("Task conversation");
  try {
    expect(viewport.scrollTop).toBe(900);
    viewport.scrollTop = 100; fireEvent.scroll(viewport);
    height = 1_000;
    view = { ...view, computers: { computer: { ...computer, transcript: { task: [...computer.transcript.task,
      { id: "new", kind: "message", text: "Synthetic new message", createdAt: 122 }] } } } };
    rendered.rerender(<TaskChat {...props} view={view} />);
    expect(viewport.scrollTop).toBe(100);
    fireEvent.click(screen.getByRole("button", { name: "Show earlier messages" }));
    expect(screen.getByText("Synthetic 0")).toBeTruthy();
    expect(viewport.scrollTop).toBe(100);
    viewport.scrollTop = 800; fireEvent.scroll(viewport);
    height = 1_100;
    view = { ...view, computers: { computer: { ...view.computers.computer, transcript: { task: [
      ...view.computers.computer.transcript.task, { id: "latest", kind: "message", text: "Synthetic latest message", createdAt: 123 }] } } } };
    rendered.rerender(<TaskChat {...props} view={view} />);
    expect(viewport.scrollTop).toBe(1_100);
  } finally { scrollHeight.mockRestore(); clientHeight.mockRestore(); }
});
