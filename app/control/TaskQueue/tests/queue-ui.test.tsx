import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueuedTaskCards } from "..";
import type { OutgoingCommand } from "../../ControlOutbox";

it("keeps stored, unsent and failed creation visible while search hides unrelated Tasks", () => {
  const command: OutgoingCommand = { id: "user-message-new", machineId: "machine", delivery: { state: "stored" },
    payload: { type: "project.task.create", operationId: "new", projectId: "mesh", cwd: "/synthetic", agent: "cursor", text: "Synthetic queued Task", createdAt: 1 } };
  const first = render(<QueuedTaskCards commands={[command]} query="CURSOR" />);
  expect(screen.getByText("Synthetic queued Task")).toBeTruthy(); expect(screen.getByText("Saved on relay · waiting for computer")).toBeTruthy();
  first.rerender(<QueuedTaskCards commands={[{ ...command, delivery: { state: "sending" } }]} query="" />);
  expect(screen.getByText("Saving on relay…")).toBeTruthy();
  first.rerender(<QueuedTaskCards commands={[{ ...command, delivery: { state: "failed", error: "Synthetic transport error" } }]} query="" />);
  expect(screen.getByText("Synthetic transport error")).toBeTruthy();
  first.rerender(<QueuedTaskCards commands={[command]} query="unmatched" />);
  expect(screen.queryByText("Synthetic queued Task")).toBeNull();
});
