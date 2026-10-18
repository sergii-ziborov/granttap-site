import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OutgoingMessages } from "../OutgoingMessages";
import type { OutgoingCommand } from "../../ControlOutbox";

it("retains a rejected message and attachment, shows Retry failure, and reflects the new attempt without another bubble", async () => {
  const command: OutgoingCommand = { id: "user-message-original", machineId: "computer", delivery: { state: "failed", rejected: true, error: "Synthetic refusal" },
    payload: { type: "user.message", messageId: "original", sessionId: "task", text: "Synthetic pending text", createdAt: 1,
      attachments: [{ name: "synthetic.txt", mimeType: "text/plain", data: "c3ludGhldGlj" }] } };
  const received: string[] = [], user = userEvent.setup();
  const retry = async (id: string) => { received.push(id); throw Error("Synthetic retry failed"); };
  const view = render(<OutgoingMessages commands={[command]} retry={retry} />);
  expect(screen.getByText("synthetic.txt")).toBeTruthy(); expect(screen.getByText("Synthetic refusal")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Retry message" }));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Synthetic retry failed");
  expect(received).toEqual(["user-message-original"]);
  view.rerender(<OutgoingMessages commands={[{ ...command, id: "user-message-new", delivery: { state: "sending" } }]} retry={retry} />);
  expect(screen.getByText("Saving on relay…")).toBeTruthy(); expect(screen.getAllByText("Synthetic pending text")).toHaveLength(1);
  view.rerender(<OutgoingMessages commands={[{ ...command, id: "user-message-new", delivery: { state: "stored" } }]} retry={retry} />);
  expect(screen.getByText("Saved on relay · waiting for computer")).toBeTruthy(); expect(screen.queryByRole("button", { name: "Retry message" })).toBeNull();
});
